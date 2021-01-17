// sleep: function(milliseconds) {
//   return new Promise((resolve) => setTimeout(resolve, milliseconds));
// },
// isUndefined: function(value) {
//   return typeof value === "undefined";
// },
// isObject: function(o) {
//   return (
//     typeof o === "object" &&
//     o !== null &&
//     o.constructor &&
//     o.constructor === Object
//   );
// },
// isPlainObject: function(o) {
//   return (
//     typeof o === "object" &&
//     o !== null &&
//     o.constructor &&
//     o.constructor === Object
//   );
// },
// isArray: function(value) {
//   return Array.isArray(value);
// },
// isNumber: function(value) {
//   return typeof value === "number" && value !== null;
// },
// isInteger(value) {
//   return typeof value === "number" && value === Number(value);
// },
// isString(value) {
//   return typeof value === "string";
// },
// isImage(value) {
//   return value instanceof HTMLImageElement;
// },
// isCanvas(value) {
//   return value instanceof HTMLCanvasElement;
// },
// isValue: function(value) {
//   return !this.isObject(value) && !this.isArray(value);
// },
// isNull: function(value) {
//   return value === null;
// },
// toInteger: function(value) {
//   const INFINITY = 1 / 0,
//     MAX_INTEGER = 1.7976931348623157e308;
//   if (!value) {
//     return value === 0 ? value : 0;
//   }
//   value = Number(value);
//   if (value === INFINITY || value === -INFINITY) {
//     const sign = value < 0 ? -1 : 1;
//     return sign * MAX_INTEGER;
//   }
//   return value === value ? value : 0;
// },
// minmax = function(v, min = 0, max = 100) {
//   return Math.min(max, Math.max(min, v));
// },
//   rangeToPercent = function(value, min, max) {
//     return (value - min) / (max - min);
//   },
//   percentToRange = function(percent, min, max) {
//     return (max - min) * percent + min;
//   },
//   setDebugOutput = (debug) => {
//     return debug === true ? console.log.bind(window.console) : function() {};
//   },
//   randomComponentName = function(len = 6) {
//     return `${Utils.randomLowerString(len)}-${Utils.randomLowerString(len)}`;
//   },
//   randomString = function(len = 8) {
//     return Array.apply(0, Array(len))
//       .map(function() {
//         return (function(charset) {
//           return charset.charAt(Math.floor(Math.random() * charset.length));
//         })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
//       })
//       .join("");
//   },
//   rs = function(len = 8) {
//     return [...Array(len)]
//       .map((i) => (~~(Math.random() * 36)).toString(36))
//       .join("");
//   },
//   randomLowerString = function(len = 8) {
//     return Array.apply(0, Array(len))
//       .map(function() {
//         return (function(charset) {
//           return charset.charAt(Math.floor(Math.random() * charset.length));
//         })("abcdefghijklmnopqrstuvwxyz");
//       })
//       .join("");
//   },
//   capitalize = function(str) {
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   },
//   measureText = (text, font) => {
//     const canvas =
//       Utils.measureText.canvas ||
//       (Utils.measureText.canvas = document.createElement("canvas"));
//     const ctx = canvas.getContext("2d");
//     ctx.font = font || "bold 10pt system-ui";
//     return ctx.measureText(text).width;
//   },
//   fixName = (d, dName) => {
//     let i = 1;
//     const base = dName;
//     while (d[dName]) {
//       dName = `${base} (${i})`;
//       i++;
//     }
//     return dName;
//   },
//   isEmptyString = (str) => {
//     return !str || str.length === 0;
//   },
//   isBlankString = (str) => {
//     return !str || /^\s*$/.test(str);
//   },
//   log = function() {},
//   count = 0,
//   counter = function() {
//     return (this.count += 1);
//   },
//   getPrefix = function() {
//     return this.prefix + this.counter();
//   },
//   prefix = Utils.randomString() + "_",
//   getUrlParameter = function(name) {
//     const nameA = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//     const regex = new RegExp("[\\?&]" + nameA + "=([^&#]*)");
//     const results = regex.exec(location.search.replace(/\/$/, ""));
//     return results === null
//       ? null
//       : decodeURIComponent(results[1].replace(/\+/g, " "));
//   },
//   debounce = function(func, wait = 100) {
//     let timeout;
//     return function(...args) {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         func.apply(this, args);
//       }, wait);
//     };
//   },
//   getRandomColor = function() {
//     return "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, 0); // just a random color padded to 6 characters
//   },
//   /*
//     Quick utility to lighten or darken a color (doesn't take color-drifting, etc. into account)
//     Usage:
//     fadeColor('#061261', 100); // will lighten the color
//     fadeColor('#200867'), -100); // will darken the color
// */
//   fadeColor = function(col, amt) {
//     const min = Math.min,
//       max = Math.max;
//     const num = parseInt(col.replace(/#/g, ""), 16);
//     const r = min(255, max((num >> 16) + amt, 0));
//     const g = min(255, max((num & 0x0000ff) + amt, 0));
//     const b = min(255, max(((num >> 8) & 0x00ff) + amt, 0));
//     return "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, 0);
//   },
//   lerpColor = function(startColor, targetColor, amount) {
//     const ah = parseInt(startColor.replace(/#/g, ""), 16);
//     const ar = ah >> 16;
//     const ag = (ah >> 8) & 0xff;
//     const ab = ah & 0xff;
//     const bh = parseInt(targetColor.replace(/#/g, ""), 16);
//     const br = bh >> 16;
//     let bg = (bh >> 8) & 0xff;
//     let bb = bh & 0xff;
//     const rr = ar + amount * (br - ar);
//     const rg = ag + amount * (bg - ag);
//     const rb = ab + amount * (bb - ab);
//     return (
//       "#" +
//       (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0)
//         .toString(16)
//         .slice(1)
//         .toUpperCase()
//     );
//   },
//   hexToRgb = function(hex) {
//     const match = hex.replace(/#/, "").match(/.{1,2}/g);
//     return {
//       r: parseInt(match[0], 16),
//       g: parseInt(match[1], 16),
//       b: parseInt(match[2], 16),
//     };
//   },
//   rgbToHex = (r, g, b) =>
//     "#" +
//     [r, g, b]
//       .map((x) => {
//         return x.toString(16).padStart(2, 0);
//       })
//       .join(""),
//   nscolorToRgb = function(rP, gP, bP) {
//     return {
//       r: Math.round(rP * 255),
//       g: Math.round(gP * 255),
//       b: Math.round(bP * 255),
//     };
//   },
//   nsColorToHex = function(rP, gP, bP) {
//     const c = Utils.nscolorToRgb(rP, gP, bP);
//     return Utils.rgbToHex(c.r, c.g, c.b);
//   },
//   miredToKelvin = function(mired) {
//     return Math.round(1e6 / mired);
//   },
//   kelvinToMired = function(kelvin, roundTo) {
//     return roundTo
//       ? Utils.roundBy(Math.round(1e6 / kelvin), roundTo)
//       : Math.round(1e6 / kelvin);
//   },
//   roundBy = function(num, x) {
//     return Math.round((num - 10) / x) * x;
//   },
//   getBrightness = function(hexColor) {
//     // http://www.w3.org/TR/AERT#color-contrast
//     if (typeof hexColor === "string" && hexColor.charAt(0) === "#") {
//       let rgb = Utils.hexToRgb(hexColor);
//       return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
//     }
//     return 0;
//   },
export const readJson = (file: string, callback: (arg0: string) => void) => {
  let req = new XMLHttpRequest();
  req.onerror = (e) => {
    // Utils.log(`[Utils][readJson] Error while trying to read  ${file}`, e);
  };
  req.overrideMimeType("application/json");
  req.open("GET", file, true);
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      // && req.status == "200") {
      if (callback) callback(req.responseText);
    }
  };
  req.send(null);
};
//   loadScript = function(url, callback) {
//     const el = document.createElement("script");
//     el.src = url;
//     el.onload = function() {
//       callback(url, true);
//     };
//     el.onerror = function() {
//       console.error("Failed to load file: " + url);
//       callback(url, false);
//     };
//     document.body.appendChild(el);
//   },
// parseJson: (jsonString) => {
//   if (typeof jsonString === "object") return jsonString;
//   try {
//     const o = JSON.parse(jsonString);
//     // Handle non-exception-throwing cases:
//     // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
//     // but... JSON.parse(null) returns null, and typeof null === "object",
//     // so we must check for that, too. Thankfully, null is falsey, so this suffices:
//     if (o && typeof o === "object") {
//       return o;
//     }
//   } catch (e) {}
//   return false;
// },
//   parseJSONPromise = function(jsonString) {
//     // fetch('/my-json-doc-as-string')
//     // .then(Utils.parseJSONPromise)
//     // .then(heresYourValidJSON)
//     // .catch(error - or return default JSON)
//     return new Promise((resolve, reject) => {
//       try {
//         resolve(JSON.parse(jsonString));
//       } catch (e) {
//         reject(e);
//       }
//     });
//   },
//   /* eslint-disable import/prefer-default-export */
//   getProperty = function(obj, dotSeparatedKeys, defaultValue) {
//     if (arguments.length > 1 && typeof dotSeparatedKeys !== "string")
//       return undefined;
//     if (typeof obj !== "undefined" && typeof dotSeparatedKeys === "string") {
//       const pathArr = dotSeparatedKeys.split(".");
//       pathArr.forEach((key, idx, arr) => {
//         if (typeof key === "string" && key.includes("[")) {
//           try {
//             // extract the array index as string
//             const pos = /\[([^)]+)\]/.exec(key)[1];
//             // get the index string length (i.e. '21'.length === 2)
//             const posLen = pos.length;
//             arr.splice(idx + 1, 0, Number(pos));
//             // keep the key (array name) without the index comprehension:
//             // (i.e. key without [] (string of length 2)
//             // and the length of the index (posLen))
//             arr[idx] = key.slice(0, -2 - posLen); // eslint-disable-line no-param-reassign
//           } catch (e) {
//             // do nothing
//           }
//         }
//       });
//       // eslint-disable-next-line no-param-reassign, no-confusing-arrow
//       obj = pathArr.reduce(
//         (o, key) => (o && o[key] !== "undefined" ? o[key] : undefined),
//         obj
//       );
//     }
//     return obj === undefined ? defaultValue : obj;
//   },
export const getProp = (
  jsn: any,
  str: string,
  defaultValue = {},
  sep = "."
) => {
  const arr = str.split(sep);
  return arr.reduce(
    (
      obj: { [x: string]: any; hasOwnProperty: (arg0: any) => any },
      key: string | number
    ) => (obj && obj.hasOwnProperty(key) ? obj[key] : defaultValue),
    jsn
  );
};
//   setProp = function(jsonObj, path, value) {
//     const names = path.split(".");
//     let jsn = jsonObj;
//     // createNestedObject(jsn, names, values);
//     // If a value is given, remove the last name and keep it for later:
//     let targetProperty = arguments.length === 3 ? names.pop() : false;
//     // Walk the hierarchy, creating new objects where needed.
//     // If the lastName was removed, then the last object is not set yet:
//     for (let i = 0; i < names.length; i++) {
//       jsn = jsn[names[i]] = jsn[names[i]] || {};
//     }
//     // If a value was given, set it to the target property (the last one):
//     if (targetProperty) jsn = jsn[targetProperty] = value;
//     // Return the last object in the hierarchy:
//     return jsn;
//   },
//   getDataUri = function(url, callback, inCanvas, inFillcolor) {
//     let image = new Image();
//     image.onload = function() {
//       const canvas =
//         inCanvas && Utils.isCanvas(inCanvas)
//           ? inCanvas
//           : document.createElement("canvas");
//       canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
//       canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
//       const ctx = canvas.getContext("2d");
//       if (inFillcolor) {
//         ctx.fillStyle = inFillcolor;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//       }
//       ctx.drawImage(this, 0, 0);
//       // Get raw image data
//       // callback && callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
//       // ... or get as Data URI
//       callback(canvas.toDataURL("image/png"));
//     };
//     image.src = url;
//   },
//   /** Quick utility to inject a style to the DOM
//    * e.g. injectStyle('.localbody { background-color: green;}')
//    */
//   injectStyle = function(styles, styleId) {
//     const node = document.createElement("style");
//     const tempID = styleId || Utils.randomString(8);
//     node.setAttribute("id", tempID);
//     node.innerHTML = styles;
//     document.body.appendChild(node);
//     return node;
//   },
//   loadImage = function(inUrl, callback, inCanvas, inFillcolor) {
//     /** Convert to array, so we may load multiple images at once */
//     const aUrl = !Array.isArray(inUrl) ? [inUrl] : inUrl;
//     const canvas =
//       inCanvas && inCanvas instanceof HTMLCanvasElement
//         ? inCanvas
//         : document.createElement("canvas");
//     let imgCount = aUrl.length - 1;
//     const imgCache = {};
//     let ctx = canvas.getContext("2d");
//     ctx.globalCompositeOperation = "source-over";
//     for (let url of aUrl) {
//       let image = new Image();
//       let cnt = imgCount;
//       let w = 144,
//         h = 144;
//       image.onload = function() {
//         imgCache[url] = this;
//         // look at the size of the first image
//         if (url === aUrl[0]) {
//           canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
//           canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
//         }
//         // if (Object.keys(imgCache).length == aUrl.length) {
//         if (cnt < 1) {
//           if (inFillcolor) {
//             ctx.fillStyle = inFillcolor;
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
//           }
//           // draw in the proper sequence FIFO
//           aUrl.forEach((e) => {
//             if (!imgCache[e]) {
//               console.warn(imgCache[e], imgCache);
//             }
//             if (imgCache[e]) {
//               ctx.drawImage(imgCache[e], 0, 0);
//               ctx.save();
//             }
//           });
//           callback(canvas.toDataURL("image/png"));
//           // or to get raw image data
//           // callback && callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
//         }
//       };
//       imgCount--;
//       image.src = url;
//     }
//   },
//   getData = function(url) {
//     // Return a new promise.
//     return new Promise(function(resolve, reject) {
//       // Do the usual XHR stuff
//       let req = new XMLHttpRequest();
//       // Make sure to call .open asynchronously
//       req.open("GET", url, true);
//       req.onload = function() {
//         // This is called even on 404 etc
//         // so check the status
//         if (req.status === 200) {
//           // Resolve the promise with the response text
//           resolve(req.response);
//         } else {
//           // Otherwise reject with the status text
//           // which will hopefully be a meaningful error
//           reject(Error(req.statusText));
//         }
//       };
//       // Handle network errors
//       req.onerror = function() {
//         reject(Error("Network Error"));
//       };
//       // Make the request
//       req.send();
//     });
//   },
//   negArray = function(arr) {
//     /** http://h3manth.com/new/blog/2013/negative-array-index-in-javascript/ */
//     return Proxy.create({
//       set: function(proxy, index, value) {
//         index = parseInt(index);
//         return index < 0
//           ? (arr[arr.length + index] = value)
//           : (arr[index] = value);
//       },
//       get: function(proxy, index) {
//         index = parseInt(index);
//         return index < 0 ? arr[arr.length + index] : arr[index];
//       },
//     });
//   },
//   onChange = function(object, callback) {
//     /** https://github.com/sindresorhus/on-change */
//     "use strict";
//     const handler = {
//       get(target, property, receiver) {
//         try {
//           console.log("get via Proxy: ", property, target, receiver);
//           return new Proxy(target[property], handler);
//         } catch (err) {
//           console.log("get via Reflect: ", err, property, target, receiver);
//           return Reflect.get(target, property, receiver);
//         }
//       },
//       set(target, property, value, receiver) {
//         console.log("Utils.onChange:set1:", target, property, value, receiver);
//         // target[property] = value;
//         const b = Reflect.set(target, property, value);
//         console.log("Utils.onChange:set2:", target, property, value, receiver);
//         return b;
//       },
//       defineProperty(target, property, descriptor) {
//         console.log(
//           "Utils.onChange:defineProperty:",
//           target,
//           property,
//           descriptor
//         );
//         callback(target, property, descriptor);
//         return Reflect.defineProperty(target, property, descriptor);
//       },
//       deleteProperty(target, property) {
//         console.log("Utils.onChange:deleteProperty:", target, property);
//         callback(target, property);
//         return Reflect.deleteProperty(target, property);
//       },
//     };
//     return new Proxy(object, handler);
//   },
//   haerveArray = function(object, callback) {
//     "use strict";
//     const array = [];
//     const handler = {
//       get(target, property, receiver) {
//         try {
//           return new Proxy(target[property], handler);
//         } catch (err) {
//           return Reflect.get(target, property, receiver);
//         }
//       },
//       set(target, property, value, receiver) {
//         console.log(
//           "XXXUtils.haerveArray:set1:",
//           target,
//           property,
//           value,
//           array
//         );
//         target[property] = value;
//         console.log(
//           "XXXUtils.haerveArray:set2:",
//           target,
//           property,
//           value,
//           array
//         );
//       },
//       defineProperty(target, property, descriptor) {
//         callback(target, property, descriptor);
//         return Reflect.defineProperty(target, property, descriptor);
//       },
//       deleteProperty(target, property) {
//         callback(target, property, descriptor);
//         return Reflect.deleteProperty(target, property);
//       },
//     };
//     return new Proxy(object, handler);
//   },
