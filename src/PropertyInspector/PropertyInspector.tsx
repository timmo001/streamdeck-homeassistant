import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Auth,
  HassConfig,
  HassEntities,
  HassServices,
  HassUser,
} from "home-assistant-js-websocket";

import {
  GenericObject,
  GlobalSettings,
  HassConnectionState,
  SettingHaConnection,
  Settings,
} from "../Common/Types";
import {
  EventsReceived,
  PluginInitEvent,
  StreamDeckInstance,
  StreamDeckPluginItem,
  StreamDeckPropertyInspector,
} from "../Common/StreamDeck";
import HomeAssistant from "../HomeAssistant/HomeAssistant";
import PropertyView from "./PropertyView";

let sdPropertyInspector: StreamDeckPropertyInspector;

export default function PropertyInspector(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [localization, setLocalization] = useState<GenericObject>();
  const [sdItem, setSdItem] = useState<StreamDeckPluginItem>();

  const [, setHassAuth] = useState<Auth>();
  const [, setHassConfig] = useState<HassConfig>();
  const [hassConnection, setHassConnection] = useState<SettingHaConnection>();
  const [
    hassConnectionState,
    setHassConnectionState,
  ] = useState<HassConnectionState>(-2);
  const [hassEntities, setHassEntities] = useState<HassEntities>();
  const [hassServices, setHassServices] = useState<HassServices>();
  const [, setUser] = useState<HassUser>();

  const handleGetDataResult = useCallback((data: StreamDeckPluginItem) => {
    console.log("PropertyInspector - getData result:", data);
    console.log("PropertyInspector - getData result - item:", data.context);
    setSdItem(data);
  }, []);

  useEffect(() => {
    if (!sdPropertyInspector) {
      sdPropertyInspector = new StreamDeckPropertyInspector();
      sdPropertyInspector
        .getGlobalData()
        .then(
          (data: {
            globalSettings: GlobalSettings;
            localization: GenericObject;
          }) => {
            console.log("PropertyInspector - getGlobalData result:", data);
            setGlobalSettings(data.globalSettings);
            setLocalization(data.localization);
          }
        );

      sdPropertyInspector.on(EventsReceived.INIT, (event: PluginInitEvent) => {
        const instance: StreamDeckInstance = event.detail.instance;
        console.log(
          "PropertyInspector - getData instance init:",
          event.detail.instance.context
        );
        sdPropertyInspector.getPIData(instance).then(handleGetDataResult);
      });
    }
  }, [handleGetDataResult]);

  const changeGlobalSetting = useCallback(
    (key: keyof GlobalSettings, value: any) => {
      sdItem.setGlobalSetting(key, value);
      setGlobalSettings({ ...globalSettings, [key]: value });
    },
    [sdItem, globalSettings]
  );

  const handleChangeSetting = useCallback(
    (key: keyof Settings, value: unknown) => {
      sdItem.setSetting(key, value);
      setSdItem({ ...sdItem, settings: { ...sdItem.settings, [key]: value } });
    },
    [sdItem]
  );

  function handleSetupHaConnection() {
    console.log("Setup HA connection..");
    window.open(
      `./setup-connection.html?language=${
        sdPropertyInspector.language
      }&streamDeckVersion=${sdPropertyInspector.version}&pluginVersion=${
        sdPropertyInspector.pluginVersion
      }${
        globalSettings?.haConnection
          ? `&haConnectionUrl=${encodeURIComponent(
              globalSettings?.haConnection.url
            )}`
          : ""
      }`
    );
  }

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
      {globalSettings && localization && sdItem?.action && sdItem?.settings ? (
        <PropertyView
          action={sdItem.action}
          globalSettings={globalSettings}
          settings={sdItem.settings}
          localization={localization}
          hassEntities={hassEntities}
          hassServices={hassServices}
          handleChangeSetting={handleChangeSetting}
          handleSetupHaConnection={handleSetupHaConnection}
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
          setServices={setHassServices}
          setUser={setUser}
        />
      ) : (
        ""
      )}
    </>
  );
}
