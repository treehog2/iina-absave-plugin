# Development Setup

## IINA

0. `defaults write com.colliderli.iina iinaEnablePluginSystem -bool YES` enables plugins under IINA -> Settings. [Source](https://github.com/iina/iina/releases/tag/v1.3.4)
1. `ln -s /Applications/IINA.app/Contents/MacOS/iina-plugin /usr/local/bin/iina-plugin`
2. `iina-plugin pack .`
3. ...
4. `iina-plugin link .` (for local development, keeps the plugin installed)



## Local Git Development

`git config user.name <name>`
`git config user.email <email>`
`git remote set-url origin https://<username>@gPAT@github.com/treehog2/iina-absave-plugin.git`
