import React, { ReactElement, useCallback, useEffect, useState } from "react";

import { GlobalSettings, SettingHaConnection, Settings } from "../Common/Types";
import { StreamDeckPropertyInspector } from "../Common/StreamDeck";
import PropertyView from "./PropertyView";

const sdPropertyInspector = new StreamDeckPropertyInspector();

export default function PropertyInspector(): ReactElement {
  const [globalSettings, setLocalGlobalSettings] = useState<GlobalSettings>();
  const [settings, setLocalSettings] = useState<Settings>();
  // const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // sdPropertyInspector.currentInstance.addEventListener(
    //   EventsReceived.DID_RECEIVE_GLOBAL_SETTINGS,
    //   (data: DidReceiveGlobalSettingsEvent) => {
    //     setLocalGlobalSettings(data.payload.settings);
    //   }
    // );
    // sdPropertyInspector.currentInstance.addEventListener(
    //   EventsReceived.DID_RECEIVE_SETTINGS,
    //   (data: DidReceiveSettingsEvent) => {
    //     setLocalSettings(data.payload.settings);
    //   }
    // );
    const waitForSettings = setInterval(() => {
      console.log("PropertyInspector - waitForSettings:", {
        globalSettings: sdPropertyInspector.globalSettings,
        settings: sdPropertyInspector.settings,
      });
      if (sdPropertyInspector.globalSettings && sdPropertyInspector.settings) {
        setLocalGlobalSettings(sdPropertyInspector.globalSettings);
        setLocalSettings(sdPropertyInspector.settings);
        clearInterval(waitForSettings);
      }
    }, 500);
    return () => {
      waitForSettings && clearInterval(waitForSettings);
    };
  }, []);

  const changeGlobalSetting = useCallback(
    (key: keyof GlobalSettings, value: any) => {
      sdPropertyInspector.currentInstance.setGlobalSetting(key, value);
      setLocalGlobalSettings({ ...globalSettings, [key]: value });
    },
    [globalSettings]
  );

  const changeSetting = useCallback(
    (key: keyof Settings, value: unknown) => {
      sdPropertyInspector.currentInstance.setSetting(key, value);
      setLocalSettings({ ...settings, [key]: value });
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

  return (
    <>
      {globalSettings && settings ? (
        <PropertyView
          sdPropertyInspector={sdPropertyInspector}
          globalSettings={globalSettings}
          settings={settings}
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
