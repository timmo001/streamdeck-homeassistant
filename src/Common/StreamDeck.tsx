/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define */
// Originally Sourced from https://github.com/patrickbussmann/streamdeck-sdk/blob/51c1bd168c8aa23a714c51681f68f2fd62926933/StreamDeckSDK.ts
import { GenericObject, GlobalSettings, Settings } from "./Types";

// @ts-ignore
declare var global: any;

interface Application {
  language: string;
  platform: string;
  version: string;
}

interface Plugin {
  version: string;
}

interface Size {
  columns: number;
  rows: number;
}

interface Device {
  id: string;
  name: string;
  size: Size;
  type: number;
}

interface Info {
  application: Application;
  plugin: Plugin;
  devicePixelRatio: number;
  devices: Device[];
}

interface Coordinates {
  column: number;
  row: number;
}

interface Payload {
  settings: Settings;
  coordinates: Coordinates;

  [key: string]: any;
}

interface ActionInfo {
  action: string;
  context: string;
  device: string;
  payload: Payload;
}

interface HttpOptions {
  body?: any;
  headers?: {
    [header: string]: string | string[];
  };
  params?: {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  withCredentials?: boolean;
  responseType?: "arraybuffer" | "blob" | "formdata" | "json" | "text";
  /**
   * Specials
   */
  credentials?: "include" | "same-origin" | "omit";
  cache?: "default" | "no-cache" | "reload" | "force-cache" | "only-if-cached";
  redirect?: "manual" | "follow" | "error";
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
}

interface TitleParameters {
  /**
   * The font family for the title.
   */
  fontFamily: string;

  /**
   * The font size for the title.
   */
  fontSize: number;

  /**
   * The font style for the title.
   */
  fontStyle: string;

  /**
   * Boolean indicating an underline under the title.
   */
  fontUnderline: boolean;

  /**
   * Boolean indicating if the title is visible.
   */
  showTitle: boolean;

  /**
   * Vertical alignment of the title. Possible values are "top", "bottom" and "middle".
   */
  titleAlignment: string;

  /**
   * Title color.
   */
  titleColor: string;
}

interface Event {
  event: EventsReceived | EventsSent;
}

export interface InitEvent extends Event {
  detail: {
    instance: StreamDeckInstance;
  };
}

export interface PluginInitEvent extends Event {
  detail: {
    instance: StreamDeckPluginInstance;
  };
}

export interface DidReceiveEvent<T> extends Event {
  detail: {
    payload: T;
  };
}

/**
 * Receivable events
 */
export interface DidReceiveSettingsEvent extends Event {
  /**
   * The action unique identifier.
   */
  action: string;

  /**
   * An opaque value identifying the instance's action.
   */
  context: string;

  /**
   * An opaque value identifying the device.
   */
  device: string;

  /**
   * A json object
   */
  payload: {
    /**
     * This json object contains persistently stored data.
     */
    settings: Settings;

    /**
     * The coordinates of the action triggered.
     */
    coordinates: Coordinates;

    /**
     * This is a parameter that is only set when the action has multiple states defined in its manifest.json. The 0-based value contains the current state of the action.
     */
    state?: number;

    /**
     * Boolean indicating if the action is inside a Multi Action.
     */
    isInMultiAction: boolean;
  };
}

export interface DidReceiveGlobalSettingsEvent extends Event {
  /**
   * A json object
   */
  payload: {
    /**
     * This json object contains persistently stored data.
     */
    settings: GlobalSettings;
  };
}

export interface KeyDownEvent extends Event {
  /**
   * The action's unique identifier. If your plugin supports multiple actions, you should use this value to see which action was triggered.
   */
  action: string;

  /**
   * An opaque value identifying the instance's action. You will need to pass this opaque value to several APIs like the setTitle API.
   */
  context: string;

  /**
   * An opaque value identifying the device.
   */
  device: string;

  /**
   * A json object
   */
  payload: {
    /**
     * This json object contains persistently stored data.
     */
    globalSettings: GlobalSettings;

    /**
     * This json object contains persistently stored data.
     */
    settings: Settings;

    /**
     * The coordinates of the action triggered.
     */
    coordinates: Coordinates;

    /**
     * This is a parameter that is only set when the action has multiple states defined in its manifest.json.
     * The 0-based value contains the current state of the action.
     */
    state?: number;

    /**
     * This is a parameter that is only set when the action is triggered with a specific value from a Multi Action.
     * For example if the user sets the Game Capture Record action to be disabled in a Multi Action, you would see the value 1.
     * Only the value 0 and 1 are valid.
     */
    userDesiredState?: 1 | 0;

    /**
     * Boolean indicating if the action is inside a Multi Action.
     */
    isInMultiAction: boolean;
  };
}

export interface KeyUpEvent extends KeyDownEvent {}

interface WillAppearEvent extends Event {
  /**
   * The action's unique identifier. If your plugin supports multiple actions, you should use this value to see which action was triggered.
   */
  action: string;

  /**
   * An opaque value identifying the instance's action. You will need to pass this opaque value to several APIs like the setTitle API.
   */
  context: string;

  /**
   * An opaque value identifying the device.
   */
  device: string;

  /**
   * A json object
   */
  payload: {
    /**
     * This json object contains persistently stored data.
     */
    globalSettings: GlobalSettings;

    /**
     * This json object contains persistently stored data.
     */
    settings: Settings;

    /**
     * The coordinates of the action triggered.
     */
    coordinates: Coordinates;

    /**
     * This is a parameter that is only set when the action has multiple states defined in its manifest.json.
     * The 0-based value contains the current state of the action.
     */
    state?: number;

    /**
     * Boolean indicating if the action is inside a Multi Action.
     */
    isInMultiAction: boolean;
  };
}

interface WillDisappearEvent extends WillAppearEvent {}

interface TitleParametersDidChangeEvent extends Event {
  /**
   * The action's unique identifier. If your plugin supports multiple actions, you should use this value to see which action was triggered.
   */
  action: string;

  /**
   * An opaque value identifying the instance's action. You will need to pass this opaque value to several APIs like the setTitle API.
   */
  context: string;

  /**
   * An opaque value identifying the device.
   */
  device: string;

  /**
   * A json object
   */
  payload: {
    /**
     * This json object contains persistently stored data.
     */
    globalSettings: GlobalSettings;

    /**
     * This json object contains persistently stored data.
     */
    settings: Settings;

    /**
     * The coordinates of the action triggered.
     */
    coordinates: Coordinates;

    /**
     * This is a parameter that is only set when the action has multiple states defined in its manifest.json.
     * The 0-based value contains the current state of the action.
     */
    state?: number;

    /**
     * The new title.
     */
    title: string;

    /**
     * A json object describing the new title parameters.
     */
    titleParameters: TitleParameters;
  };
}

interface DeviceDidConnectEvent extends Event {
  /**
   * An opaque value identifying the device.
   */
  device: string;

  /**
   * A json object containing information about the device.
   */
  deviceInfo: {
    /**
     * Type of device. Possible values are kESDSDKDeviceType_StreamDeck (0),
     * kESDSDKDeviceType_StreamDeckMini (1), kESDSDKDeviceType_StreamDeckXL (2),
     * kESDSDKDeviceType_StreamDeckMobile (3) and kESDSDKDeviceType_CorsairGKeys (4).
     */
    type: DeviceType;

    /**
     * The number of columns and rows of keys that the device owns.
     */
    size: Size;

    /**
     * The name of the device set by the user.
     */
    name: string;
  };
}

interface DeviceDidDisconnectEvent extends Event {
  /**
   * An opaque value identifying the device.
   */
  device: string;
}

interface ApplicationDidLaunchEvent extends Event {
  /**
   * A json object
   */
  payload: {
    /**
     * The identifier of the application that has been launched.
     */
    application: string;
  };
}

interface ApplicationDidTerminateEvent extends ApplicationDidLaunchEvent {}

interface SystemDidWakeUpEvent extends Event {}

interface PropertyInspectorDidAppearEvent extends Event {
  /**
   * The action's unique identifier. If your plugin supports multiple actions, you should use this value to see which action was triggered.
   */
  action: string;

  /**
   * An opaque value identifying the instance's action.
   */
  context: string;

  /**
   * An opaque value identifying the device.
   */
  device: string;
}

interface PropertyInspectorDidDisappearEvent
  extends PropertyInspectorDidAppearEvent {}

interface SendToPluginEvent extends Event {
  /**
   * The action's unique identifier. If your plugin supports multiple actions, you should use this value to see which action was triggered.
   */
  action: string;

  /**
   * An opaque value identifying the instance's action.
   */
  context: string;

  /**
   * An opaque value identifying the device.
   */
  payload: any;
}

interface SendToPropertyInspectorEvent extends SendToPluginEvent {}

export interface StreamDeckItem {
  instance: StreamDeckInstance;
  settings: Settings;
  title?: string;
}

export interface StreamDeckPluginItem {
  instance: StreamDeckPluginInstance;
  settings: Settings;
  title?: string;
}

enum DeviceType {
  KESDSDKDeviceType_StreamDeck,
  KESDSDKDeviceType_StreamDeckMini,
  KESDSDKDeviceType_StreamDeckXL,
  KESDSDKDeviceType_StreamDeckMobile,
  KESDSDKDeviceType_CorsairGKeys,
}

enum Destination {
  HARDWARE_AND_SOFTWARE,
  HARDWARE_ONLY,
  SOFTWARE_ONLY,
}

export enum EventsReceived {
  /**
   * Whenever a instance is initialized
   */
  INIT = "init",
  DESTROY = "destroy",

  /** Plugin and Property Inspector */
  DID_RECEIVE_SETTINGS = "didReceiveSettings",
  DID_RECEIVE_GLOBAL_SETTINGS = "didReceiveGlobalSettings",
  DID_INIT = "didInitialize",
  /** Plugin only */
  KEY_DOWN = "keyDown",
  KEY_UP = "keyUp",
  WILL_APPEAR = "willAppear",
  WILL_DISAPPEAR = "willDisappear",
  TITLE_PARAMETERS_DID_CHANGE = "titleParametersDidChange",
  DEVICE_DID_CONNECT = "deviceDidConnect",
  DEVICE_DID_DISCONNECT = "deviceDidDisconnect",
  APPLICATION_DID_LAUNCH = "applicationDidLaunch",
  APPLICATION_DID_TERMINATE = "applicationDidTerminate",
  SYSTEM_DID_WAKE_UP = "systemDidWakeUp",
  PROPERTY_INSPECTOR_DID_APPEAR = "propertyInspectorDidAppear",
  PROPERTY_INSPECTOR_DID_DISAPPEAR = "propertyInspectorDidDisappear",
  SEND_TO_PLUGIN = "sendToPlugin",
  /** Property Inspector only */
  SEND_TO_PROPERTY_INSPECTOR = "sendToPropertyInspector",
}

enum EventsSent {
  /** Plugin and Property Inspector */
  SET_SETTINGS = "setSettings",
  GET_SETTINGS = "getSettings",
  SET_GLOBAL_SETTINGS = "setGlobalSettings",
  GET_GLOBAL_SETTINGS = "getGlobalSettings",
  OPEN_URL = "openUrl",
  LOG_MESSAGE = "logMessage",
  /** Plugin only */
  SET_TITLE = "setTitle",
  SET_IMAGE = "setImage",
  SHOW_ALERT = "showAlert",
  SHOW_OK = "showOk",
  SET_STATE = "setState",
  SWITCH_TO_PROFILE = "switchToProfile",
  SEND_TO_PROPERTY_INSPECTOR = "sendToPropertyInspector",
  /** Property Inspector only */
  SEND_TO_PLUGIN = "sendToPlugin",
}

export function getLocalization(
  inLanguage: string,
  inCallback: (success: boolean, message: string) => void
) {
  var url = inLanguage + ".json";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      try {
        const data = JSON.parse(xhr.responseText);
        inCallback(true, data["Localization"]);
      } catch (e) {
        inCallback(false, "Localizations is not a valid json.");
      }
    } else {
      inCallback(false, "Could not load the localizations.");
    }
  };

  xhr.onerror = () => {
    inCallback(false, "An error occurred while loading the localizations.");
  };

  xhr.ontimeout = () => {
    inCallback(false, "Localization timed out.");
  };

  xhr.send();
}

abstract class StreamDeck {
  private instances: StreamDeckInstance[] = [];
  static initialized = false;
  actionInfo: any;
  globalSettings: GlobalSettings;
  info: any;
  language: string;
  localization: GenericObject;
  platform: string;
  pluginVersion: string;
  settings: Settings;
  uuid: string;
  version: string;
  websocket: WebSocket;

  static async fileToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  constructor() {
    if (!StreamDeck.initialized) {
      StreamDeck.initialized = true;
      const _global = (window || global) as any;
      // @ts-ignore
      _global.connectElgatoStreamDeckSocket = (...args: any[]) =>
        this.init(...args);
    }
  }

  async init(
    inPort?: number,
    inUUID?: string,
    inRegisterEvent?: string,
    inInfo?: string,
    inActionInfo?: string
  ) {
    const info: Info = inInfo ? JSON.parse(inInfo) : inInfo;
    const actionInfo: ActionInfo = inActionInfo
      ? JSON.parse(inActionInfo)
      : inActionInfo;

    this.uuid = inUUID;

    this.websocket = new WebSocket(`ws://127.0.0.1:${inPort}`);

    // Wait for websocket.onopen to complete
    await new Promise<void>((resolve) => {
      this.websocket.onopen = async () => {
        this.send({
          event: inRegisterEvent,
          uuid: this.uuid,
        });

        if (info) {
          this.language = info.application.language;
          this.platform = info.application.platform;
          this.version = info.application.version;
          if (info.plugin) this.pluginVersion = info.plugin.version;
          if (this.language)
            getLocalization(this.language, (success: boolean, message: any) => {
              if (process.env.NODE_ENV === "development")
                console.log("StreamDeck - getLocalization result:", {
                  success,
                  message,
                });
              if (success) this.localization = message;
            });
        }
        if (actionInfo) {
          this.globalSettings = actionInfo.payload.globalSettings;
          this.settings = actionInfo.payload.settings;
          this.willAppear({
            action: actionInfo.action,
            context: actionInfo.context,
            device: actionInfo.device,
            payload: {
              globalSettings: this.globalSettings,
              settings: this.settings,
            },
          } as any);
        }

        console.log("StreamDeck - init complete:", this);

        resolve();
      };
    });

    this.websocket.onmessage = (message) => {
      const jsonObj: any = JSON.parse(message.data);
      const event = jsonObj["event"];
      const payload = jsonObj["payload"] || {};

      if (process.env.NODE_ENV === "development")
        console.log("StreamDeck - WS Message Received:", {
          jsonObj,
          event,
          payload,
        });

      if (typeof this[event] === "function") {
        this[event](jsonObj);
      }

      if (
        jsonObj.hasOwnProperty("action") ||
        jsonObj.hasOwnProperty("context") ||
        jsonObj.hasOwnProperty("device")
      ) {
        this.instances.forEach((i) => {
          if (jsonObj.hasOwnProperty("action") && i.action !== jsonObj.action) {
            return;
          }
          if (
            jsonObj.hasOwnProperty("context") &&
            i.context !== jsonObj.context
          ) {
            return;
          }
          if (jsonObj.hasOwnProperty("device") && i.device !== jsonObj.device) {
            return;
          }

          if (typeof i[event] === "function") {
            i[event](jsonObj);
          }

          i.emit(event, jsonObj);
        });
      }

      this.emit(event, jsonObj);
    };

    this.websocket.onclose = () => {};
  }

  async getGlobalData(
    plugin: boolean
  ): Promise<{
    globalSettings: GlobalSettings;
    localization: GenericObject;
  }> {
    // Wait for an instance
    await new Promise<StreamDeckInstance>((resolve) =>
      this.on(EventsReceived.INIT, (event: InitEvent) => {
        resolve(event.detail.instance);
      })
    );

    if (plugin)
      this.instances[0].sendEvent(
        EventsSent.GET_GLOBAL_SETTINGS,
        undefined,
        this.uuid
      );
    else this.instances[0].sendEvent(EventsSent.GET_GLOBAL_SETTINGS);
    await new Promise<void>((resolve) =>
      this.on(
        EventsReceived.DID_RECEIVE_GLOBAL_SETTINGS,
        (event: DidReceiveEvent<{ settings: GlobalSettings }>) => {
          this.globalSettings = event.detail.payload.settings;
          resolve();
        }
      )
    );

    return {
      globalSettings: this.globalSettings,
      localization: this.localization,
    };
  }

  async getData(
    instance: StreamDeckInstance | StreamDeckPluginInstance
  ): Promise<StreamDeckItem | StreamDeckPluginItem> {
    instance.sendEvent(EventsSent.GET_SETTINGS);
    return {
      instance,
      settings: await new Promise<Settings>((res) => {
        this.on(
          EventsReceived.DID_RECEIVE_SETTINGS,
          (event: DidReceiveEvent<{ settings: Settings }>) => {
            res(event.detail.payload.settings);
          }
        );
      }),
    };
  }

  willAppear(data: WillAppearEvent) {
    const className =
      data.payload && data.payload.coordinates
        ? StreamDeckPluginInstance
        : StreamDeckPropertyInspectorInstance;
    const instance = new className(
      this.websocket,
      data.action,
      data.context,
      data.device,
      data.payload.globalSettings,
      data.payload.settings,
      this.uuid
    );
    this.instances.push(instance);
    this.emit(EventsReceived.INIT, {
      instance,
    });
  }

  willDisappear(data: WillDisappearEvent) {
    const instance = this.instances.find(
      (i) =>
        i.action === data.action &&
        i.context === data.context &&
        i.device === data.device
    );
    if (instance) {
      instance.emit(EventsReceived.DESTROY, {
        instance,
      });
      this.emit(EventsReceived.DESTROY, {
        instance,
      });
      const index = this.instances.indexOf(instance);
      if (index > -1) {
        this.instances.slice(index, 0);
      }
    }
  }

  // didReceiveGlobalSettings(data: DidReceiveGlobalSettingsEvent) {
  //   if (process.env.NODE_ENV === "development")
  //     console.log(
  //       "StreamDeck Event - didReceiveGlobalSettings:",
  //       data.payload.settings
  //     );
  //   this.globalSettings = data.payload.settings;
  // }

  // didReceiveSettings(data: DidReceiveSettingsEvent) {
  //   if (process.env.NODE_ENV === "development")
  //     console.log(
  //       "StreamDeck Event - didReceiveSettings:",
  //       data.payload.settings
  //     );
  //   this.settings = data.payload.settings;
  // }

  send(data: { event: string; uuid: string }) {
    this.websocket.send(JSON.stringify(data));
  }

  /**
   * Drawing utils
   */
  createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 144;
    canvas.height = 144;
    return canvas;
  }

  async drawPicture(
    canvas: HTMLCanvasElement = this.createCanvas(),
    pictureSrc: string,
    dx: number = 0,
    dy: number = 0,
    dw: number = 144,
    dh?: number,
    proportional?: boolean
  ): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          dx,
          dy,
          dw,
          proportional ? image.height * (dw / image.width) : dh || dw
        );
        resolve(canvas);
      };
      image.onabort = reject;
      image.onerror = reject;
      image.src =
        pictureSrc + (pictureSrc.match(/\?/) ? "&" : "?") + performance.now();
    });
  }

  /**
   * HTTP Utils
   */
  get http() {
    return new (class HttpClient {
      request<K>(
        method: string,
        url: string,
        options: HttpOptions = {}
      ): Promise<K | Response> {
        if (
          typeof options.body === "object" ||
          (options.body && typeof options.body.length !== "undefined")
        ) {
          options.body = JSON.stringify(options.body);
        }
        if (options.withCredentials) {
          options.credentials = "include";
        }
        options.responseType = options.responseType || "json";
        options.headers = options.headers || {
          Accept: "application/json",
        };
        return fetch(url, {
          ...options,
          method,
        } as any).then((response): any => {
          if (options.responseType !== undefined) {
            if (options.responseType === "arraybuffer") {
              return response.arrayBuffer();
            }
            if (options.responseType === "blob") {
              return response.blob();
            }
            if (options.responseType === "formdata") {
              return response.formData();
            }
            if (options.responseType === "json") {
              return response.json();
            }
            if (options.responseType === "text") {
              return response.text();
            }
          }
          return response;
        });
      }

      get<K>(url: string, options: HttpOptions): Promise<K | Response> {
        return this.request("GET", url, options);
      }

      post<K>(
        url: string,
        body?: any,
        options?: HttpOptions
      ): Promise<K | Response> {
        return this.request("POST", url, {
          ...options,
          body,
        });
      }

      patch<K>(
        url: string,
        body?: any,
        options?: HttpOptions
      ): Promise<K | Response> {
        return this.request("PATCH", url, {
          ...options,
          body,
        });
      }

      put<K>(
        url: string,
        body?: any,
        options?: HttpOptions
      ): Promise<K | Response> {
        return this.request("PUT", url, {
          ...options,
          body,
        });
      }

      delete<K>(url: string, options?: HttpOptions): Promise<K | Response> {
        return this.request("DELETE", url, options);
      }
    })();
  }

  /**
   * Custom event handling
   */
  private eventListeners: {
    [key: string]: ((...args: any) => any)[];
  } = {};

  on(type: EventsReceived, listener: (...args: any) => any) {
    return this.addEventListener(type, listener);
  }

  emit(type: EventsReceived, obj?: any) {
    return this.dispatchEvent(new CustomEvent(type, { detail: obj }));
  }

  clearEventListeners(type: EventsReceived) {
    this.eventListeners[type] = [];
  }

  addEventListener(type: EventsReceived, listener: (...args: any) => any) {
    if (!this.eventListeners.hasOwnProperty(type)) {
      this.eventListeners[type] = [];
    }
    this.eventListeners[type].push(listener);
    return true;
  }

  removeEventListener(type: EventsReceived, listener: (...args: any) => any) {
    console.log();
    if (!this.eventListeners.hasOwnProperty(type)) {
      return false;
    }
    const index = this.eventListeners[type].indexOf(listener);
    console.log("removeEventListener:", type, index);
    if (index > -1) {
      this.eventListeners[type].splice(index, 1);
      return true;
    }
    return false;
  }

  dispatchEvent(event: CustomEvent) {
    const type = event.type;
    if (!this.eventListeners.hasOwnProperty(type)) {
      return false;
    }
    for (let listener of this.eventListeners[type]) {
      try {
        listener(event);
      } catch (e) {
        console.error(
          "Error when dispatching event on listener",
          event,
          e,
          listener
        );
      }
    }
    return true;
  }
}

export class StreamDeckSDK extends StreamDeck {}

export class StreamDeckPropertyInspector extends StreamDeck {}

export class StreamDeckPlugin extends StreamDeck {}

export abstract class StreamDeckInstance extends StreamDeck {
  action: string;
  context: string;
  device: string;

  constructor(
    websocket: WebSocket,
    action: string,
    context: string,
    device: string,
    globalSettings: GlobalSettings,
    settings: Settings,
    uuid?: string
  ) {
    super();
    this.websocket = websocket;
    this.action = action;
    this.context = context;
    this.device = device;
    this.globalSettings = globalSettings;
    this.settings = settings;
    this.uuid = uuid;
  }

  setGlobalSetting(key: keyof GlobalSettings, value: any) {
    if (!this.globalSettings) this.globalSettings = {};
    this.globalSettings[key] = value;
    this.sendEvent(
      EventsSent.SET_GLOBAL_SETTINGS,
      this.globalSettings,
      this.uuid
    );
  }

  setGlobalSettings(settings: GlobalSettings) {
    this.sendEvent(EventsSent.SET_GLOBAL_SETTINGS, settings, this.uuid);
  }

  setSetting(key: keyof Settings, value: unknown) {
    if (!this.settings) this.settings = {};
    this.sendEvent(EventsSent.SET_SETTINGS, { ...this.settings, [key]: value });
  }

  setSettings(settings: Settings) {
    this.settings = settings;
    this.sendEvent(EventsSent.SET_SETTINGS, settings);
  }

  openUrl(url: string) {
    this.sendEvent(EventsSent.OPEN_URL, { url });
  }

  logMessage(message: string) {
    this.sendEvent(EventsSent.LOG_MESSAGE, { message });
  }

  sendEvent(
    eventName: EventsSent,
    payload: any = undefined,
    context = this.context,
    action?: string
  ) {
    const data: any = {
      event: eventName,
      context,
    };
    if (payload !== undefined) {
      data.payload = payload;
    }
    if (action !== undefined) {
      data.action = action;
    }
    if (process.env.NODE_ENV === "development")
      console.log("StreamDeck - sendEvent:", data);
    this.send(data);
  }
}

export class StreamDeckPluginInstance extends StreamDeckInstance {
  sendToPlugin(event: SendToPluginEvent) {
    if (event.payload.hasOwnProperty("_internal")) {
      if (event.payload.action === EventsSent.SET_SETTINGS) {
        this.setSettings(event.payload.settings);
      }
    }
  }

  /**
   * Set title
   *
   * @param title The title to display. If there is no title parameter, the title is reset to the title set by the user.
   * @param target Specify if you want to display the title on the hardware and software (0), only on the hardware (1) or only on the software (2). Default is 0.
   * @param state A 0-based integer value representing the state of an action with multiple states. This is an optional parameter. If not specified, the title is set to all states.
   */
  setTitle(
    title: string | number | boolean,
    target: Destination = Destination.HARDWARE_AND_SOFTWARE,
    state?: number
  ) {
    const data: any = {
      title: title.toString(),
      target,
    };
    if (state) {
      data.state = state;
    }
    this.sendEvent(EventsSent.SET_TITLE, data);
  }

  /**
   * Set image
   *
   * @param image The image to display encoded in base64 with the image format declared in the mime type (PNG, JPEG, BMP, ...). svg is also supported. If no image is passed, the image is reset to the default image from the manifest.
   * @param target Specify if you want to display the title on the hardware and software (0), only on the hardware (1) or only on the software (2). Default is 0.
   * @param state A 0-based integer value representing the state of an action with multiple states. This is an optional parameter. If not specified, the image is set to all states.
   */
  setImage(
    image: string | HTMLCanvasElement = null,
    target: Destination = Destination.HARDWARE_AND_SOFTWARE,
    state?: number
  ) {
    const data: any = { target };
    if (image) {
      data.image =
        image instanceof HTMLCanvasElement ? image.toDataURL() : image;
    }
    if (state) {
      data.state = state;
    }
    this.sendEvent(EventsSent.SET_IMAGE, data);
  }

  async setImageURL(
    url: string,
    proportional?: boolean,
    target: Destination = Destination.HARDWARE_AND_SOFTWARE
  ) {
    const canvas: HTMLCanvasElement = await this.drawPicture(
      undefined,
      url,
      undefined,
      undefined,
      undefined,
      undefined,
      proportional
    );
    this.setImage(canvas, target);
  }

  showAlert() {
    this.sendEvent(EventsSent.SHOW_ALERT);
  }

  showOk() {
    this.sendEvent(EventsSent.SHOW_OK);
  }

  setState(state: number) {
    this.sendEvent(EventsSent.SET_STATE, { state });
  }

  switchToProfile(profile: string) {
    this.sendEvent(EventsSent.SWITCH_TO_PROFILE, { profile });
  }

  sendToPropertyInspector(payload: any) {
    this.sendEvent(
      EventsSent.SEND_TO_PROPERTY_INSPECTOR,
      payload,
      undefined,
      this.action
    );
  }
}

class StreamDeckPropertyInspectorInstance extends StreamDeckInstance {
  sendToPlugin(payload: any) {
    this.sendEvent(EventsSent.SEND_TO_PLUGIN, payload, undefined, this.action);
  }

  sendEvent(
    eventName: EventsSent,
    payload: any = undefined,
    context: string = this.uuid,
    action?: string
  ) {
    super.sendEvent(eventName, payload, context, action);
  }
}
