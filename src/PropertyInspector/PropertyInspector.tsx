import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Auth,
  HassConfig,
  HassEntities,
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
  StreamDeckInstance,
  StreamDeckPropertyInspector,
} from "../Common/StreamDeck";
import HomeAssistant from "../HomeAssistant/HomeAssistant";
import PropertyView from "./PropertyView";

let sdPropertyInspector: StreamDeckPropertyInspector;

export default function PropertyInspector(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [settings, setSettings] = useState<Settings>();
  const [localization, setLocalization] = useState<GenericObjectString>();

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
    if (!sdPropertyInspector) {
      sdPropertyInspector = new StreamDeckPropertyInspector();
      sdPropertyInspector
        .getData(false)
        .then(
          (data: {
            instance: StreamDeckInstance;
            globalSettings: GlobalSettings;
            settings: Settings;
            localization: GenericObjectString;
          }) => {
            console.log("PropertyInspector - getData result:", data);
            setGlobalSettings(data.globalSettings);
            setSettings(data.settings);
            setLocalization(data.localization);
          }
        );
    }
  }, []);

  const changeGlobalSetting = useCallback(
    (key: keyof GlobalSettings, value: any) => {
      sdPropertyInspector.currentInstance.setGlobalSetting(key, value);
      setGlobalSettings({ ...globalSettings, [key]: value });
    },
    [globalSettings]
  );

  const changeSetting = useCallback(
    (key: keyof Settings, value: unknown) => {
      sdPropertyInspector.currentInstance.setSetting(key, value);
      setSettings({ ...settings, [key]: value });
    },
    [settings]
  );

  const saveConnection = useCallback(
    (inEvent: CustomEvent<SettingHaConnection>) => {
      const connection: SettingHaConnection = inEvent.detail;
      console.log("PropertyInspector Event - saveConnection:", {
        connection,
        sdPropertyInspector,
      });
      const connections: SettingHaConnection[] =
        sdPropertyInspector.globalSettings?.haConnections || [];
      connections.push(connection);
      changeGlobalSetting("haConnections", connections);
      changeSetting("haConnection", connection.url);
    },
    [changeGlobalSetting, changeSetting]
  );

  useEffect(() => {
    document.addEventListener("saveConnection", saveConnection);
  }, [saveConnection]);

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

  return (
    <>
      {globalSettings && settings ? (
        <PropertyView
          sdPropertyInspector={sdPropertyInspector}
          globalSettings={globalSettings}
          settings={settings}
          localization={localization}
          hassEntities={hassEntities}
          changeSetting={changeSetting}
        />
      ) : (
        <div className="sdpi-wrapper" id="pi">
          <div className="sdpi-item">Loading Settings..</div>
        </div>
      )}
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
