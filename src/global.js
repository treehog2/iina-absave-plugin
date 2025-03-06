const {console, global} = iina

// Function to open a new IINA player window with the specified URL
function openNewPlayerWithUrl(url) {
  // Create a new player instance with the provided URL
  const playerID = global.createPlayerInstance({
      url: url,
      disableWindowAnimation: true, // Optional: Disable window resizing animation
      disableUI: true,              // Optional: Hide the titlebar and on-screen control
      enablePlugins: false          // Optional: Disable plugins for this instance
  });

  // You can store the player instance if you need to manage it later
  // For example, to send messages or control playback
  return playerID;
}

// Handle messages from player instances
global.onMessage("open-new-player", (data, playerID) => {
  // Extract the URL from the data sent by the player instance
  const videoUrl = data.url;

  if (!videoUrl) {
      console.error("No video URL provided!");
      return;
  }

  // Open a new player window with the provided URL
  const newPlayerID = openNewPlayerWithUrl(videoUrl);
  global.postMessage(newPlayerID, "loop-file", {})
});

const msg = "Ready to open new players with URLs!"
console.log(msg);
