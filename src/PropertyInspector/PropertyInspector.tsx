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
  StreamDeckItem,
  StreamDeckPropertyInspector,
} from "../Common/StreamDeck";
import HomeAssistant from "../HomeAssistant/HomeAssistant";
import PropertyView from "./PropertyView";

let sdPropertyInspector: StreamDeckPropertyInspector;

export default function PropertyInspector(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [localization, setLocalization] = useState<GenericObjectString>();
  const [sdItem, setSdItem] = useState<StreamDeckItem>();

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
            globalSettings: GlobalSettings;
            localization: GenericObjectString;
            items: StreamDeckItem[];
          }) => {
            console.log("PropertyInspector - getData result:", data);
            setGlobalSettings(data.globalSettings);
            setLocalization(data.localization);
            setSdItem(data.items[0]);
          }
        );
    }
  }, []);

  const changeGlobalSetting = useCallback(
    (key: keyof GlobalSettings, value: any) => {
      sdItem.instance.setGlobalSetting(key, value);
      setGlobalSettings({ ...globalSettings, [key]: value });
    },
    [sdItem, globalSettings]
  );

  const changeSetting = useCallback(
    (key: keyof Settings, value: unknown) => {
      sdItem.instance.setSetting(key, value);
      setSdItem({ ...sdItem, settings: { ...sdItem.settings, [key]: value } });
    },
    [sdItem]
  );

  const saveConnection = useCallback(
    (inEvent: CustomEvent<SettingHaConnection>) => {
      const connection: SettingHaConnection = inEvent.detail;
      console.log("PropertyInspector Event - saveConnection:", {
        connection,
        sdPropertyInspector,
      });
      changeGlobalSetting("haConnection", connection);
    },
    [changeGlobalSetting]
  );

  useEffect(() => {
    document.addEventListener("saveConnection", saveConnection);
  }, [saveConnection]);

  useEffect(() => {
    if (hassConnectionState === -2 && globalSettings?.haConnection) {
      setHassConnection(globalSettings.haConnection);
      setHassConnectionState(-1);
    }
  }, [globalSettings, sdItem, hassConnectionState]);

  return (
    <>
      {globalSettings && localization && sdItem?.settings ? (
        <PropertyView
          sdPropertyInspector={sdPropertyInspector}
          globalSettings={globalSettings}
          settings={sdItem.settings}
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
