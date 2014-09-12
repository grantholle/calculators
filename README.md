# PERC Cordova Apps
There are 3 separate applications. They all share the same CSS and JavaScript assets. They were developed using Cordova 3.5.

## Configuration
On line `31` of `www/assets/js/app/app.js`, change the `emailEndpoint` to the appropriate address for the email sending script.

## Building

1. Install [Cordova CLI](http://cordova.apache.org/docs/en/3.5.0/guide_cli_index.md.html#The%20Command-Line%20Interface)
2. In each project directory there should be a www, plugins, and platforms directory
3. In the root of the project, add the Android and iOS platform
  `cordova add platform ios`
  `cordova add platform android`
4. There should already be plugins in the repo, but if you want to add them clean, delete their contents and run the following commands:
  `cordova plugin add org.apache.cordova.device`
  `cordova plugin add org.apache.cordova.network-information`
5. Build the applications
  `cordova build ios`
  `cordova build android`
6. Deploy built apps