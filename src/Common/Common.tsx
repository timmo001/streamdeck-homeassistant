import { StreamDeck } from "./StreamDeck";
import { getProp, readJson } from "./Utils";

// eslint-disable-next-line no-use-before-define, no-var
export let localizedStrings = {},
  REMOTESETTINGS = {},
  DestinationEnum = Object.freeze({
    HARDWARE_AND_SOFTWARE: 0,
    HARDWARE_ONLY: 1,
    SOFTWARE_ONLY: 2,
  }),
  // eslint-disable-next-line no-unused-vars
  isQT = navigator.appVersion.includes("QtWebEngine"),
  debug = false,
  MIMAGECACHE = {},
  streamDeck: { [string: string]: any } = {};

const setDebugOutput = (debug: boolean) =>
  debug === true ? console.log.bind(window.console) : () => {};
export const debugLog = setDebugOutput(debug);

// // Create a wrapper to allow passing JSON to the socket
// WebSocket.prototype.sendJSON = (jsn, log) => {
//   if (log) {
//     console.log("SendJSON", this, jsn);
//   }
//   // if (this.readyState) {
//   this.send(JSON.stringify(jsn));
//   // }
// };

export const lox = (item: string) => {
  try {
    return localizedStrings[item] || "";
  } catch (e) {}
  return "";
};

// /* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
// String.prototype.lox = function() {
//   let a = String(this);
//   return lox(a);
// };

// String.prototype.sprintf = function(inArr) {
//   let i = 0;
//   const args = inArr && Array.isArray(inArr) ? inArr : arguments;
//   return this.replace(/%s/g, function() {
//     return args[i++];
//   });
// };

// // eslint-disable-next-line no-unused-vars
// const sprintf = (s, ...args) => {
//   let i = 0;
//   return s.replace(/%s/g, function() {
//     return args[i++];
//   });
// };

export const loadLocalization = (
  lang: any,
  pathPrefix: string,
  _cb?: () => void
) => {
  readJson(`${pathPrefix}${lang}.json`, (jsn: string) => {
    try {
      const manifest = JSON.parse(jsn);
      localizedStrings =
        manifest && manifest.hasOwnProperty("Localization")
          ? manifest["Localization"]
          : {};
      debugLog(localizedStrings);
    } catch (err) {
      throw err;
    }
  });
};
