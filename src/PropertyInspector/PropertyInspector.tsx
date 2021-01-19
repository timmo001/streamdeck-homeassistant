import React, { ReactElement, useCallback, useEffect, useState } from "react";

import { GlobalSettings, SettingHaConnection, Settings } from "../Common/Types";
import {
  DidReceiveGlobalSettingsEvent,
  DidReceiveSettingsEvent,
  EventsReceived,
  InitEvent,
  StreamDeckInstance,
  StreamDeckPropertyInspector,
} from "../Common/StreamDeck";
import PropertyView from "./PropertyView";

const sdPropertyInspector = new StreamDeckPropertyInspector();

export default function PropertyInspector(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [settings, setSettings] = useState<Settings>();
  // const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // sdPropertyInspector.on(EventsReceived.INIT, async (event: InitEvent) => {
    //   // Each init gives one instance (instance = 1 button on the Stream Deck)
    //   // Instances having an `action` which you can check when you have multiple actions!
    //   // i.e. if (instance.action === 'org.examle.firstaction') { }
    //   const instance: StreamDeckInstance = event.detail.instance;
    //   console.log("PI INIT:", instance);

    //   const gs: GlobalSettings = await instance.getGlobalSettings();
    //   console.log("PI GS:", gs);
    //   const s: Settings = await instance.getSettings();
    //   console.log("PI S:", s);

    //   setGlobalSettings(gs);
    //   setSettings(s);

    //   // // We want also to listen for changed settings from the property inspector
    //   // instance.on(
    //   //   EventsReceived.DID_RECEIVE_GLOBAL_SETTINGS,
    //   //   (data: DidReceiveGlobalSettingsEvent) =>
    //   //     setGlobalSettings(data.payload.settings)
    //   // );
    //   // instance.on(
    //   //   EventsReceived.DID_RECEIVE_SETTINGS,
    //   //   (data: DidReceiveSettingsEvent) => setSettings(data.payload.settings)
    //   // );

    //   // getLocalization(
    //   //   sdPropertyInspector.language,
    //   //   (success: boolean, message: any) => {
    //   //     if (process.env.NODE_ENV === "development")
    //   //       console.log("PropertyInspector - getLocalization result:", {
    //   //         success,
    //   //         message,
    //   //       });
    //   //     if (success) setLocalization(message);
    //   //   }
    //   // );
    // });
    const waitForSettings = setInterval(() => {
      console.log("PropertyInspector - waitForSettings:", {
        globalSettings: sdPropertyInspector.globalSettings,
        settings: sdPropertyInspector.settings,
      });
      if (sdPropertyInspector.globalSettings && sdPropertyInspector.settings) {
        clearInterval(waitForSettings);
        setGlobalSettings(sdPropertyInspector.globalSettings);
        setSettings(sdPropertyInspector.settings);
      }
    }, 500);
    return () => {
      waitForSettings && clearInterval(waitForSettings);
    };
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
          <div className="sdpi-item">
            {sdPropertyInspector.localization?.loadingSettings ||
              "Loading Settings.."}
          </div>
        </div>
      )}
    </>
  );
}
