# PERC Cordova Apps
There are 3 separate applications for both web and native Android and iOS, as well as php scripts for sending email and generating pdfs.

## Installation

Install Cordova

```
$ npm i -g cordova
```

Install development depencencies

```
$ npm i
```

## Development

This project contains 3 web-instances and 3 Cordova projects. The web instances are in `./www` and the Cordova projects are in `./autogas`, `./irrigation`, and `./mowers`.

Assets for images, fonts, css, and js are kept in `./_src`. Edit the asset files in that location while running `gulp watch` and the assets will be copied/compiled to both the Cordova projects and the web instances. The `./assets` directory contains all the necessary images (icons and splashes) for the native apps.

There's also `gulp production` that minifies the js assets.

## App Development

Each app is a Cordova project. Inside each directory (`./autogas`, `./irrigation`, and `./mowers`) run the following commands:

```
$ cordova platform add ios
$ cordova platform add android
$ cordova build
```
