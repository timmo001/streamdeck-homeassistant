/* globals $SD */
import { debugLog, DestinationEnum, loadLocalization } from "./Common";
import ELGEvents from "./ELGEvents";
import { getProp } from "./Utils";

export function WEBSOCKETERROR(evt: { code: number; reason: string }) {
  // Websocket is closed
  let reason = "";
  if (evt.code === 1000) {
    reason =
      "Normal Closure. The purpose for which the connection was established has been fulfilled.";
  } else if (evt.code === 1001) {
    reason =
      'Going Away. An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
  } else if (evt.code === 1002) {
    reason =
      "Protocol error. An endpoint is terminating the connection due to a protocol error";
  } else if (evt.code === 1003) {
    reason =
      "Unsupported Data. An endpoint received a type of data it doesn't support.";
  } else if (evt.code === 1004) {
    reason =
      "--Reserved--. The specific meaning might be defined in the future.";
  } else if (evt.code === 1005) {
    reason = "No Status. No status code was actually present.";
  } else if (evt.code === 1006) {
    reason =
      "Abnormal Closure. The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
  } else if (evt.code === 1007) {
    reason =
      "Invalid frame payload data. The connection was closed, because the received data was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629]).";
  } else if (evt.code === 1008) {
    reason =
      'Policy Violation. The connection was closed, because current message data "violates its policy". This reason is given either if there is no other suitable reason, or if there is a need to hide specific details about the policy.';
  } else if (evt.code === 1009) {
    reason =
      "Message Too Big. Connection closed because the message is too big for it to process.";
  } else if (evt.code === 1010) {
    // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
    reason =
      "Mandatory Ext. Connection is terminated the connection because the server didn't negotiate one or more extensions in the WebSocket handshake. <br /> Mandatory extensions were: " +
      evt.reason;
  } else if (evt.code === 1011) {
    reason =
      "Internl Server Error. Connection closed because it encountered an unexpected condition that prevented it from fulfilling the request.";
  } else if (evt.code === 1015) {
    reason =
      "TLS Handshake. The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
  } else {
    reason = "Unknown reason";
  }
  return reason;
}

export const SOCKETERRORS = {
  0: "The connection has not yet been established",
  1: "The connection is established and communication is possible",
  2: "The connection is going through the closing handshake",
  3: "The connection has been closed or could not be opened",
};

/** SDDebug
 * Utility to log the JSON structure of an incoming object
 */
const SDDebug = {
  logger: () => {
    const logEvent = (jsn: { [x: string]: any }) => {
      console.log("____SDDebug.logger.logEvent");
      console.log(jsn);
      debugLog("-->> Received Obj:", jsn);
      debugLog("jsonObj", jsn);
      debugLog("event", jsn["event"]);
      debugLog("actionType", jsn["actionType"]);
      debugLog("settings", jsn["settings"]);
      debugLog("coordinates", jsn["coordinates"]);
      debugLog("---");
    };

    const logSomething = () => console.log("____SDDebug.logger.logSomething");

    return { logEvent, logSomething };
  },
};

/*
 * connectElgatoStreamDeckSocket
 * This is the first function StreamDeck Software calls, when
 * establishing the connection to the plugin or the Property Inspector
 * @param {string} inPort - The socket's port to communicate with StreamDeck software.
 * @param {string} inUUID - A unique identifier, which StreamDeck uses to communicate with the plugin
 * @param {string} inMessageType - Identifies, if the event is meant for the property inspector or the plugin.
 * @param {string} inApplicationInfo - Information about the host (StreamDeck) application
 * @param {string} inActionInfo - Context is an internal identifier used to communicate to the host application.
 */
export function connectElgatoStreamDeckSocket(
  streamDeck: any,
  inPort: any,
  inUUID: any,
  inMessageType: string | number,
  inApplicationInfo: any,
  inActionInfo: any
) {
  console.log("connectElgatoStreamDeckSocket", {
    inPort,
    inUUID,
    inMessageType,
    inApplicationInfo,
    inActionInfo,
  });
  StreamDeck.getInstance().sd.connect(arguments);
  streamDeck.api = Object.assign(
    { send: SDApi.send },
    SDApi.common,
    SDApi[inMessageType]
  );
  return streamDeck;
}

// /* legacy support */
// function connectSocket(
//   streamDeck: any,
//   inPort: any,
//   inUUID: any,
//   inMessageType: any,
//   inApplicationInfo: any,
//   inActionInfo: any
// ) {
//   connectElgatoStreamDeckSocket(
//     streamDeck,
//     inPort,
//     inUUID,
//     inMessageType,
//     inApplicationInfo,
//     inActionInfo
//   );
// }

// eslint-disable-next-line no-unused-vars
// function initializeControlCenterClient() {
//   const settings = Object.assign(REMOTESETTINGS || {}, { debug: false });
//   let $CC = new ControlCenterClient(settings);
//   window["$CC"] = $CC;
//   return $CC;
// }

/**
 * StreamDeck object containing all required code to establish
 * communication with SD-Software and the Property Inspector
 */
export const StreamDeck = ((debug?: boolean) => {
  let instance: {
    sd: {
      emit: any;
      connection: any;
      uuid?: any;
      on?: (name: any, fn: any) => any;
      connect?: (args: any) => void;
      api?: any;
      logger?: { logEvent: (jsn: any) => void; logSomething: () => void };
      actionInfo?: any;
      applicationInfo?: any;
      messageType?: string;
    };
  };
  /**
   * Populate and initialize internally used properties
   */
  function init() {
    // @ts-ignore
    let sd = $SD;

    // *** PRIVATE ***
    let inPort: string,
      inUUID: any,
      inMessageType: string,
      inApplicationInfo: any,
      inActionInfo: any,
      websocket = null;

    let events = ELGEvents.eventEmitter();
    let logger = SDDebug.logger();

    function showVars() {
      debugLog("---- showVars");
      debugLog("- port", inPort);
      debugLog("- uuid", inUUID);
      debugLog("- messagetype", inMessageType);
      debugLog("- info", inApplicationInfo);
      debugLog("- inActionInfo", inActionInfo);
      debugLog("----< showVars");
    }

    function connect(args: any[]) {
      inPort = args[0];
      inUUID = args[1];
      inMessageType = args[2];
      try {
        inApplicationInfo = JSON.parse(args[3]);
        inActionInfo = args[4] !== undefined ? JSON.parse(args[4]) : args[4];
      } catch (err) {
        throw err;
      }

      /** Debug variables */
      if (debug) {
        showVars();
      }

      const lang = getProp(inApplicationInfo, "application.language", false);
      if (lang) {
        loadLocalization(
          lang,
          inMessageType === "registerPropertyInspector" ? "./" : "./",
          () => {
            events.emit("localizationLoaded", { language: lang });
          }
        );
      }

      /** restrict the API to what's possible
       * within Plugin or Property Inspector
       * <unused for now>
       */
      // streamDeck.api = SDApi[inMessageType];
      if (websocket) {
        websocket.close();
        websocket = null;
      }

      websocket = new WebSocket("ws://localhost:" + inPort);

      websocket.onopen = () => {
        let json = {
          event: inMessageType,
          uuid: inUUID,
        };

        // console.log('***************', inMessageType + "  websocket:onopen", inUUID, json);
        websocket.sendJSON(json);
        sd.uuid = inUUID;
        sd.actionInfo = inActionInfo;
        sd.applicationInfo = inApplicationInfo;
        sd.messageType = inMessageType;
        sd.connection = websocket;

        instance.sd.emit("connected", {
          connection: websocket,
          port: inPort,
          uuid: inUUID,
          actionInfo: inActionInfo,
          applicationInfo: inApplicationInfo,
          messageType: inMessageType,
        });
      };

      websocket.onerror = (evt: { data: any }) => {
        console.warn("WEBOCKET ERROR", evt, evt.data);
      };

      websocket.onclose = (evt: any) => {
        // Websocket is closed
        let reason = WEBSOCKETERROR(evt);
        console.warn("[STREAMDECK]***** WEBOCKET CLOSED **** reason:", reason);
      };

      websocket.onmessage = (evt: { data: string }) => {
        let jsonObj = JSON.parse(evt.data),
          m: string;

        // console.log('[STREAMDECK] websocket.onmessage ... ', jsonObj.event, jsonObj);
        if (!jsonObj.hasOwnProperty("action")) {
          m = jsonObj.event;
          // console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[common.js]onmessage:', m);
        } else {
          switch (inMessageType) {
            case "registerPlugin":
              m = jsonObj["action"] + "." + jsonObj["event"];
              break;
            case "registerPropertyInspector":
              m = "sendToPropertyInspector";
              break;
            default:
              console.log(
                "%c%s",
                "color: white; background: red; font-size: 12px;",
                "[STREAMDECK] websocket.onmessage +++++++++  PROBLEM ++++++++"
              );
              console.warn("UNREGISTERED MESSAGETYPE:", inMessageType);
          }
        }

        if (m && m !== "") events.emit(m, jsonObj);
      };

      instance.sd.connection = websocket;
    }

    return {
      // *** PUBLIC ***
      sd: {
        uuid: inUUID,
        on: events.on,
        emit: events.emit,
        connection: websocket,
        connect: connect,
        api: null,
        logger: logger,
      },
    };
  }

  return {
    getInstance: () => {
      if (!instance) instance = init();
      return instance;
    },
  };
})();

/** SDApi
 * This ist the main API to communicate between plugin, property inspector and
 * application host.
 * Internal functions:
 * - setContext: sets the context of the current plugin
 * - exec: prepare the correct JSON structure and send
 *
 * Methods exposed in the streamDeck.api alias
 * Messages send from the plugin
 * -----------------------------
 * - showAlert
 * - showOK
 * - setSettings
 * - setTitle
 * - setImage
 * - sendToPropertyInspector
 *
 * Messages send from Property Inspector
 * -------------------------------------
 * - sendToPlugin
 *
 * Messages received in the plugin
 * -------------------------------
 * willAppear
 * willDisappear
 * keyDown
 * keyUp
 */

export const SDApi = {
  send: (
    streamDeck: any,
    context: any,
    fn: string,
    payload: { [key: string]: any },
    debug?: any
  ) => {
    /** Combine the passed JSON with the name of the event and it's context
     * If the payload contains 'event' or 'context' keys, it will overwrite existing 'event' or 'context'.
     * This function is non-mutating and thereby creates a new object containing
     * all keys of the original JSON objects.
     */
    const pl = Object.assign({}, { event: fn, context: context }, payload);
    /** Check, if we have a connection, and if, send the JSON payload */
    if (debug) {
      console.log("-----SDApi.send-----");
      console.log("context", context);
      console.log(pl);
      console.log(payload.payload);
      console.log(JSON.stringify(payload.payload));
      console.log("-------");
    }
    streamDeck.connection && streamDeck.connection.sendJSON(pl);
    /**
     * DEBUG-Utility to quickly show the current payload in the Property Inspector.
     */
    if (
      streamDeck.connection &&
      ["sendToPropertyInspector", "showOK", "showAlert", "setSettings"].indexOf(
        fn
      ) === -1
    ) {
      // console.log("send.sendToPropertyInspector", payload);
      // this.sendToPropertyInspector(context, typeof payload.payload==='object' ? JSON.stringify(payload.payload) : JSON.stringify({'payload':payload.payload}), pl['action']);
    }
  },
  registerPlugin: {
    /** Messages send from the plugin */
    showAlert: (streamDeck: any, context: any) => {
      SDApi.send(streamDeck, context, "showAlert", {});
    },
    showOk: (streamDeck: any, context: any) => {
      SDApi.send(streamDeck, context, "showOk", {});
    },
    setState: (streamDeck: any, context: any, payload: number) => {
      SDApi.send(streamDeck, context, "setState", {
        payload: {
          state: 1 - Number(payload === 0),
        },
      });
    },
    setTitle: (streamDeck: any, context: any, title: string, target: any) => {
      SDApi.send(streamDeck, context, "setTitle", {
        payload: {
          title: "" + title || "",
          target: target || DestinationEnum.HARDWARE_AND_SOFTWARE,
        },
      });
    },
    setImage: (streamDeck: any, context: any, img: any, target: any) => {
      SDApi.send(streamDeck, context, "setImage", {
        payload: {
          image: img || "",
          target: target || DestinationEnum.HARDWARE_AND_SOFTWARE,
        },
      });
    },
    sendToPropertyInspector: (
      streamDeck: any,
      context: any,
      payload: any,
      action: any
    ) => {
      SDApi.send(streamDeck, context, "sendToPropertyInspector", {
        action: action,
        payload: payload,
      });
    },
    showUrl2: (streamDeck: any, context: any, urlToOpen: any) => {
      SDApi.send(streamDeck, context, "openUrl", {
        payload: {
          url: urlToOpen,
        },
      });
    },
  },
  /** Messages send from Property Inspector */
  registerPropertyInspector: {
    sendToPlugin: (streamDeck: any, piUUID: any, action: any, payload: any) => {
      SDApi.send(
        streamDeck,
        piUUID,
        "sendToPlugin",
        {
          action: action,
          payload: payload || {},
        },
        false
      );
    },
  },
  /** COMMON */
  common: {
    getSettings: (streamDeck: any, context: any, payload: any) => {
      SDApi.send(streamDeck, context, "getSettings", {});
    },
    setSettings: (streamDeck: any, context: any, payload: any) => {
      SDApi.send(streamDeck, context, "setSettings", {
        payload: payload,
      });
    },
    getGlobalSettings: (streamDeck: any, context: any, payload: any) => {
      SDApi.send(streamDeck, context, "getGlobalSettings", {});
    },
    setGlobalSettings: (streamDeck: any, context: any, payload: any) => {
      SDApi.send(streamDeck, context, "setGlobalSettings", {
        payload: payload,
      });
    },
    logMessage: function(streamDeck: any) {
      /**
       * for logMessage we don't need a context, so we allow both
       * logMessage(unneededContext, 'message')
       * and
       * logMessage('message')
       */
      let payload = arguments.length > 1 ? arguments[1] : arguments[0];
      SDApi.send(streamDeck, null, "logMessage", {
        payload: {
          message: payload,
        },
      });
    },
    openUrl: (streamDeck: any, context: any, urlToOpen: any) => {
      SDApi.send(streamDeck, context, "openUrl", {
        payload: {
          url: urlToOpen,
        },
      });
    },
    test: () => {
      console.log(this);
      console.log(SDApi);
    },

    debugPrint: function(streamDeck: any, context: any) {
      // console.log("------------ DEBUGPRINT");
      // console.log([].slice.apply(arguments).join());
      // console.log("------------ DEBUGPRINT");
      SDApi.send(streamDeck, context, "debugPrint", {
        payload: [].slice.apply(arguments).join(".") || "",
      });
    },

    dbgSend: function(streamDeck: any, fn: string | number, context: any) {
      /** lookup if an appropriate function exists */
      if (streamDeck.connection && this[fn] && typeof this[fn] === "function") {
        /** verify if type of payload is an object/json */
        const payload = this[fn]();
        if (typeof payload === "object") {
          Object.assign({ event: fn, context: context }, payload);
          streamDeck.connection && streamDeck.connection.sendJSON(payload);
        }
      }
      console.log(this, fn, typeof this[fn], this[fn]());
    },
  },
};

export async function SDConnected(streamDeck: any) {
  /** subscribe to the willAppear and other events */
  streamDeck.on("dev.timmo.homeassistant.action.willAppear", (jsonObj) =>
    action.onWillAppear(jsonObj)
  );
  streamDeck.on("dev.timmo.homeassistant.action.keyUp", (jsonObj) =>
    action.onKeyUp(jsonObj)
  );
  streamDeck.on("dev.timmo.homeassistant.action.sendToPlugin", (jsonObj) =>
    action.onSendToPlugin(jsonObj)
  );
  streamDeck.on(
    "dev.timmo.homeassistant.action.didReceiveSettings",
    (jsonObj) => action.onDidReceiveSettings(jsonObj)
  );
}

/** ACTIONS */
export const action = {
  settings: {},
  onDidReceiveSettings: function(jsn) {
    console.log(
      "%c%s",
      "color: white; background: red; font-size: 15px;",
      "[app.js]onDidReceiveSettings:"
    );
    this.settings[jsn.context] = getProp(jsn, "payload.settings", {});
    this.doSomeThing(this.settings, "onDidReceiveSettings", "orange");
  },

  /**
   * The 'willAppear' event is the first event a key will receive, right before it gets
   * showed on your Stream Deck and/or in Stream Deck software.
   * This event is a good place to setup your plugin and look at current settings (if any),
   * which are embedded in the events payload.
   */

  onWillAppear: function(jsn) {
    console.log(
      "You can cache your settings in 'onWillAppear'",
      jsn.payload.settings
    );

    /**
     * "The willAppear event carries your saved settings (if any). You can use these settings
     * to setup your plugin or save the settings for later use.
     * If you want to request settings at a later time, you can do so using the
     * 'getSettings' event, which will tell Stream Deck to send your data
     * (in the 'didReceiveSettings above)
     *
     * streamDeck.api.getSettings(jsn.context);
     */
    this.settings[jsn.context] = jsn.payload.settings;
  },

  onKeyUp: async (jsn) => {
    console.log("onKeyUp", jsn);
  },

  onSendToPlugin: function(jsn) {
    /**
     * this is a message sent directly from the Property Inspector
     * (e.g. some value, which is not saved to settings)
     * You can send this event from Property Inspector (see there for an example)
     */
    const sdpi_collection = getProp(jsn, "payload.sdpi_collection", {});
    if (sdpi_collection.value && sdpi_collection.value !== undefined) {
      this.doSomeThing(
        { [sdpi_collection.key]: sdpi_collection.value },
        "onSendToPlugin",
        "fuchsia"
      );
    }
  },

  /**
   * Here's a quick demo-wrapper to show how you could change a key's title based on what you
   * stored in settings.
   * If you enter something into Property Inspector's name field (in this demo),
   * it will get the title of your key.
   *
   * @param {JSON} jsn // the JSON object passed from Stream Deck to the plugin, which contains the plugin's context
   *
   */
  setTitle: function(streamDeck, jsn) {
    if (
      this.settings[jsn.context] &&
      this.settings[jsn.context].hasOwnProperty("mynameinput")
    ) {
      console.log(
        "watch the key on your StreamDeck - it got a new title...",
        this.settings[jsn.context].mynameinput
      );
      streamDeck.api.setTitle(
        jsn.context,
        this.settings[jsn.context].mynameinput
      );
    }
  },

  /**
   * Finally here's a method which gets called from various events above.
   * This is just an idea how you can act on receiving some interesting message
   * from Stream Deck.
   */
  doSomeThing: (inJsonData, caller, tagColor) => {
    console.log(
      "%c%s",
      `color: white; background: ${tagColor || "grey"}; font-size: 15px;`,
      `[app.js]doSomeThing from: ${caller}`
    );
    console.log({ inJsonData });
  },
};

/**
 * This is the instance of the StreamDeck object.
 * There's only one StreamDeck object, which carries
 * connection parameters and handles communication
 * to/from the software's PluginManager.
 */
const streamDeck = StreamDeck.getInstance().sd;
streamDeck.api = SDApi;

streamDeck.on("connected", (jsonObj) => SDConnected(jsonObj));
streamDeck.on("deviceDidConnect", (jsonObj) =>
  console.log("deviceDidConnect", jsonObj)
);

export default streamDeck;
