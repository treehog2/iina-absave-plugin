const { menu, mpv, utils, core, console, global, file, input, preferences } = iina;

const DEFAULT_DIR_NAME = 'ab_loops';

// Function to convert file URL to a standard path
function fileURLToPath(url) {
    return decodeURIComponent(url.replace('file://', ''));
  }

function logAndAlert(msg, isError = false) {
  if (isError) {
    console.error(msg);
  } else {
    console.log(msg);
  }
  return utils.ask(msg);
}


async function createOutputPath(inputPath, start, end) {
  // Split the path into components
  const parts = inputPath.split('/');
  const fileName = parts[parts.length - 1];
  start = Math.round(start, 2);
  end = Math.round(end, 2);

  // Get the directory from preferences or build a default one
  const directory = preferences.get("save_dir") || parts.slice(0, -1).join('/') + DEFAULT_DIR_NAME;

  try {
    const { status, stderr } = await utils.exec("/bin/mkdir", ["-p", directory]);
    if (status !== 0) throw new Error(`mkdir failed: ${stderr}`);
  } catch (e) {
    logAndAlert(`Failed to create directory: ${directory}. Error: ${e}`, true);
  }
  console.log(`directory: ${directory}`);
  // Split the filename into name and extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
  const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : '';

  // Create the new filename
  const maxNameLength = preferences.get("max_file_name_length");
  const truncated_name = maxNameLength && maxNameLength > 0 && name.length > maxNameLength
    ? name.substring(0, Math.floor(maxNameLength / 2) - 1) + '..' + name.substring(name.length - Math.floor(maxNameLength / 2) + 1)
    : name;
  const newFileName = `${truncated_name}_${start}_${end}${extension}`;

  // Combine everything
  return `${directory}/${newFileName}`;
}

function openFile(filePath) {
  console.log(`Opening file: ${filePath}`);
  global.postMessage("open-new-player", { url: filePath });
}

// Define the action to save the A-B loop
async function saveABLoop() {
  const ffmpegPath = preferences.get("ffmpeg_path");
  // Get the current A and B loop points
  let loopStart = mpv.getNumber('ab-loop-a');
  let loopEnd = mpv.getNumber('ab-loop-b');
  console.log(`core.status.url: ${core.status.url}`);
  console.log(`A-B loop points: ${loopStart} - ${loopEnd}`);

  if (!utils.fileInPath(ffmpegPath)) {
    const msg = `ffmpeg not found at path: ${ffmpegPath}`;
    logAndAlert(msg, true);
    return;
  }


  // Check if both loop points are set
  if (loopStart === 0 || loopEnd === 0) {
    const msg = 'Both A-B loop points are not properly set.';
    logAndAlert(msg, true);
    return;
  }

  if (loopStart >= loopEnd) {
    const temp = loopStart;
    loopStart = loopEnd;
    loopEnd = temp;
  }

  const fileURL = core.status.url;
  if (!fileURL) {
    const msg = 'No file is currently playing.';
    logAndAlert(msg, true);
    return;
  }

  const inputPath = fileURLToPath(fileURL);

  // Define the output file path
  const outputPath = await createOutputPath(inputPath, loopStart, loopEnd);
  console.log(`Output path: ${outputPath}`);

  const ffmpegArgs = [
    '-i', inputPath,
    '-ss', String(Math.round(loopStart, 2)),
    '-to', String(Math.round(loopEnd, 2)),
    '-c', 'copy',
    outputPath,
    '-y'
  ];

  console.log(`ffmpegCommand: ${ffmpegPath} ${ffmpegArgs.join(' ')}`);

  // Execute the ffmpeg command
  // if debugging ffmpeg, you can run this instead: const { status, stdout, stderr } = await utils.exec(ffmpegPath, ["-i", inputPath]);

  try {
    const { status, stdout, stderr } = await utils.exec(ffmpegPath, ffmpegArgs);
    if (status === 0) {
      const msg = `A-B loop saved successfully to\n\n${outputPath}\n\nOpen file in new window?`;
      const shouldOpen = logAndAlert(msg, false);
      if (shouldOpen) {
        openFile(outputPath);
      }
      // Does not work for some reason but good intention
      // Source: https://docs.iina.io/interfaces/IINA.API.File.html#revealInFinder
      // file.revealInFinder(outputPath);
    } else {
      const msg = `ffmpeg failed with status=${status}. err=${stderr}. out=${stdout}`;
      logAndAlert(msg, true);
    }
  } catch (error) {
    const msg = `Error executing ffmpeg: ${error}`;
    logAndAlert(msg, true);
  }
}

// Create the menu item
const saveLoopMenuItem = menu.item('Save A-B Loop', saveABLoop);

// Add the menu item to IINA's Plugin menu
menu.addItem(saveLoopMenuItem);


// https://docs.iina.io/interfaces/IINA.API.Input.html
input.onKeyDown('Alt+k', async () => {
  console.log('Alt+k key pressed');
  saveABLoop();
  return true;
});

global.onMessage("loop-file", () => {
  console.log(`set-file-loop message received`);
  mpv.set("loop-file", true);
});
