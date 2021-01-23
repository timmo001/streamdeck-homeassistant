import React, { ReactElement, useCallback, useEffect, useState } from "react";

import {
  GenericObjectString,
  GlobalSettings,
  SettingHaConnection,
  Settings,
} from "../Common/Types";
import {
  StreamDeckInstance,
  StreamDeckPropertyInspector,
} from "../Common/StreamDeck";
import PropertyView from "./PropertyView";

let sdPropertyInspector: StreamDeckPropertyInspector;

export default function PropertyInspector(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [settings, setSettings] = useState<Settings>();
  const [localization, setLocalization] = useState<GenericObjectString>();

  useEffect(() => {
    if (!sdPropertyInspector) {
      console.log("PropertyInspector - useEffect[]");
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
            console.log("PropertyInspector - getData:", data);
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

  console.log("PropertyInspector:", {
    sdPropertyInspector,
    globalSettings,
    settings,
    localization,
  });

  return (
    <>
      {globalSettings && settings ? (
        <PropertyView
          sdPropertyInspector={sdPropertyInspector}
          globalSettings={globalSettings}
          settings={settings}
          localization={localization}
          changeSetting={changeSetting}
        />
      ) : (
        <div className="sdpi-wrapper" id="pi">
          <div className="sdpi-item">Loading Settings..</div>
        </div>
      )}
    </>
  );
}
