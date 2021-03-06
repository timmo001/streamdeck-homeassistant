const os = require("os");
const child_process = require("child_process");
const fs = require("fs-extra");

const platforms = {
  win32: {
    pluginsFolderPath: `${os.homedir()}\\AppData\\Roaming\\Elgato\\StreamDeck\\Plugins\\`,
  },
  darwin: {
    pluginsFolderPath: `${os.homedir()}/Library/Application\\ Support/com.elgato.StreamDeck/Plugins/`,
  },
};

const currentPlatform = platforms[os.platform()];

if (!currentPlatform) {
  console.error(
    "Current Platform not supported. Supported platforms are: 'win32', 'darwin'"
  );
  process.exit(-1);
}
switch (os.platform()) {
  case "darwin":
    // child_process.execSync(
    //   "mv build/static/js/main*.js build/static/js/main.min.js"
    // );
    // child_process.execSync(
    //   "mv build/static/css/main*.css build/static/css/main.css"
    // );
    child_process.execSync(`cp -R build ${currentPlatform.pluginsFolderPath}/`);
    break;
  case "win32":
    // fs.moveSync("build/static/js/main*.js", "build/static/js/main.min.js");
    // fs.moveSync("build/static/css/main*.css", "build/static/css/main.css");
    fs.copySync(
      "build",
      `${currentPlatform.pluginsFolderPath}\\dev.timmo.homeassistant.sdPlugin`
    );
    break;

  default:
    console.error(
      "Current Platform not supported. Supported platforms are: 'win32', 'darwin'"
    );
    process.exit(-1);
}
