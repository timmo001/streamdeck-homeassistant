import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Auth,
  HassConfig,
  HassEntities,
  HassEntity,
  HassUser,
} from "home-assistant-js-websocket";

import {
  GenericObjectString,
  GlobalSettings,
  HassConnectionState,
  SettingHaConnection,
  Settings,
} from "../Common/Types";
import {
  DidReceiveEvent,
  EventsReceived,
  StreamDeckPlugin,
  StreamDeckPluginInstance,
} from "../Common/StreamDeck";
import HomeAssistant, {
  handleChange as handleHassChange,
} from "../HomeAssistant/HomeAssistant";

let sdPlugin: StreamDeckPlugin;

export default function Code(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [settings, setSettings] = useState<Settings>();
  const [sdInstance, setSdInstance] = useState<StreamDeckPluginInstance>();
  const [, setLocalization] = useState<GenericObjectString>();
  const [title, setTitle] = useState<string>("");

  const [, setHassAuth] = useState<Auth>();
  const [, setHassConfig] = useState<HassConfig>();
  const [hassConnection, setHassConnection] = useState<SettingHaConnection>();
  const [
    hassConnectionState,
    setHassConnectionState,
  ] = useState<HassConnectionState>(-2);
  const [hassEntities, setHassEntities] = useState<HassEntities>();
  const [, setUser] = useState<HassUser>();

  useEffect(() => {
    if (!sdPlugin) {
      sdPlugin = new StreamDeckPlugin();
      sdPlugin
        .getData(true)
        .then(
          (data: {
            instance: StreamDeckPluginInstance;
            globalSettings: GlobalSettings;
            settings: Settings;
            localization: GenericObjectString;
          }) => {
            console.log("Code - getData result:", data);
            setSdInstance(data.instance);
            setGlobalSettings(data.globalSettings);
            setSettings(data.settings);
            setLocalization(data.localization);
          }
        );
    }
  }, []);

  useEffect(() => {
    if (
      hassConnectionState === -2 &&
      globalSettings &&
      globalSettings.haConnections &&
      settings &&
      settings.haConnection
    ) {
      const connection: SettingHaConnection = globalSettings.haConnections.find(
        (connection: SettingHaConnection) =>
          connection.url === settings.haConnection
      );
      if (connection) {
        setHassConnection(connection);
        setHassConnectionState(-1);
      }
    }
  }, [globalSettings, settings, hassConnectionState]);

  useEffect(() => {
    if (sdInstance && globalSettings && settings && hassEntities) {
      const { attributes }: HassEntity = hassEntities[settings.haEntity];
      if (
        attributes &&
        attributes.friendly_name &&
        title !== attributes.friendly_name
      )
        setTitle(attributes.friendly_name);
    }
  }, [sdInstance, globalSettings, settings, hassEntities, title]);

  useEffect(() => {
    if (sdInstance) {
      sdInstance.setTitle(title);
    }
  }, [sdInstance, title]);

  const handleKeyUp = useCallback(() => {
    console.log("Code - onKeyUp:", {
      globalSettings,
      settings,
      hassEntities,
    });
    if (globalSettings && settings && hassEntities) {
      const { entity_id, state }: HassEntity = hassEntities[settings.haEntity];
      if (entity_id) {
        const domain: string = entity_id.split(".")[0];
        if (
          handleHassChange(
            domain,
            state === "off" || domain === "script" ? "turn_on" : "turn_off",
            {
              entity_id,
            }
          )
        )
          sdInstance.showOk();
        else sdInstance.showAlert();
      }
    }
  }, [sdInstance, globalSettings, settings, hassEntities]);

  useEffect(() => {
    if (sdInstance) {
      sdInstance.clearEventListeners(EventsReceived.KEY_UP);
      sdInstance.on(EventsReceived.KEY_UP, handleKeyUp);
      sdInstance.on(
        EventsReceived.DID_RECEIVE_GLOBAL_SETTINGS,
        (event: DidReceiveEvent<{ settings: GlobalSettings }>) => {
          setGlobalSettings(event.detail.payload.settings);
        }
      );
      sdInstance.on(
        EventsReceived.DID_RECEIVE_SETTINGS,
        (event: DidReceiveEvent<{ settings: Settings }>) => {
          setSettings(event.detail.payload.settings);
        }
      );
    }
  }, [sdInstance, handleKeyUp]);

  return (
    <>
      {hassConnection ? (
        <HomeAssistant
          authToken={hassConnection.authToken}
          connection={hassConnectionState}
          url={hassConnection.url}
          setAuth={setHassAuth}
          setConfig={setHassConfig}
          setConnection={setHassConnectionState}
          setEntities={setHassEntities}
          setUser={setUser}
        />
      ) : (
        ""
      )}
    </>
  );
}
