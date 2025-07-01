#  IINA AB Save Plugin
This plugin allows saving active AB loops as individual files.

Note: this plugin is currently only usable in development mode. Not directly importable via github as of yet.

# How to Use

## Requirements
- `ffmpeg` (tested with version `6.0-tessus`).
- `iina` (tested with version `1.3.5` Build 141). [Download Exact Nightly Build](https://github.com/iina/iina/actions/runs/13537465959/artifacts/2653783517).

## Setup

1. Run `defaults write com.colliderli.iina iinaEnablePluginSystem -bool YES` which enables plugins under IINA -> Settings. [Source](https://github.com/iina/iina/releases/tag/v1.3.4)
2. Run `ln -s /Applications/IINA.app/Contents/MacOS/iina-plugin /usr/local/bin/iina-plugin` to use the executable `iina-plugin`
3. Run `git clone https://github.com/treehog2/iina-absave-plugin` and `cd iina-absave-plugin`
4. Run `iina-plugin link .` (for local development, keeps the plugin installed). You can later run `iina-plugin unlink .` to uninstall.
5. Re/start IINA -> Settings -> Plugins -> Save AB Loop -> Preferences -> Set `FFmpeg Path` to whatever `where ffmpeg` in your terminal returns.

## Plugin Settings

- `ffmpeg_path`: path for the ffmpeg executable.
- `save_dir`: change where loop files are saved. If left blank, they will be stored in an ab_loops folder next to the current media file
- `max_file_name_length`: if set, will truncate the output file name to this value.
- `show_ui_in_loop_players`: if checked, will show the ui when opening loop files.


# Development Tips
- View [Getting Started](https://docs.iina.io/pages/getting-started.html)
- View [API docs](https://docs.iina.io/modules/IINA.API.html)
- Once the plugin is running, you can use the top bar MacOS menu -> Plugins -> Developer Tool -> <Plug In Name> to access the console for the plugins locally accessible variables.
- For the latest builds which may have necessary bug fixes, view IINA Nightly builds [here](https://iina.io/nightly/). [Source](https://github.com/iina/iina/tree/develop)


# TODO
- [x] Send confirmation messages to user in case of errors or success.
- [ ] Support importing plugin directly from github.
- [ ] Figure out why `ffmpeg` executable is not accessible to the plugin.
- [ ] Test and handle case when there are multiple player windows e.g. which window does the plugin run on?
