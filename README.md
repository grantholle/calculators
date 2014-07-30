# Cordova Boilerplate
This boilerplate was created for Cordova v3.2.

Note: This repository itself is still under construction to meet the needs of 40Digits.

## Installation

1. Fork this repository to create your own Cordova project
2. Rename the project: `cd <project root> && git mv boilerplate <project name>`
3. In the `.cordova/config.json` file, edit the code to match your new project:

    `{"id":"com.40Digits.<project name lowercase>","name":"<project name capitalize>"}`

5. Edit `www/config.xml` accordingly to match the new project name.

`.gitignore` files were intentially added and left blank in the `platforms`, `plugins`, `www`, and `merges` folders. It is recomended that as the project grows, that these files should be populated to ignore specific things when necessary. (Except the merges directory--that should always be available.)

## Documentation
* See [Cordova Website](http://cordova.apache.org/) for downloading and any additional information.
* See [Corodva Docs](http://cordova.apache.org/docs/en/3.2.0/index.html) for full documentation.
* See [Cordova CLI](http://cordova.apache.org/docs/en/3.2.0/guide_cli_index.md.html#The%20Command-Line%20Interface) for getting started with cordova.
* See [Cordova Index](http://cordova.apache.org/docs/en/3.2.0/_index.html) for documentation index.
* See [Fast WebView Applications](http://maxogden.com/fast-webview-applications.html) for useful tips/tricks to making your apps work nicely with CSS and HTML5

## Things to Come
* A sub-tree of Besim's CSS framework
* Submit ideas to project's Issue Tracker