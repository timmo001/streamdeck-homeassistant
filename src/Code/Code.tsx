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
  KeyUpEvent,
  StreamDeckPluginItem,
  StreamDeckPlugin,
} from "../Common/StreamDeck";
import HomeAssistant, {
  handleChange as handleHassChange,
} from "../HomeAssistant/HomeAssistant";

let sdPlugin: StreamDeckPlugin;

export default function Code(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [, setLocalization] = useState<GenericObjectString>();
  const [sdItems, setSdItems] = useState<StreamDeckPluginItem[]>();

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
      console.log("Code - sdPlugin:", sdPlugin);
      sdPlugin
        .getData(true)
        .then(
          (data: {
            globalSettings: GlobalSettings;
            localization: GenericObjectString;
            items: StreamDeckPluginItem[];
          }) => {
            console.log("Code - getData result:", data);
            setGlobalSettings(data.globalSettings);
            setLocalization(data.localization);
            setSdItems(data.items);
          }
        );
    }
  }, []);

  useEffect(() => {
    if (globalSettings?.haConnection && hassConnectionState === -2) {
      setHassConnection(globalSettings?.haConnection);
      setHassConnectionState(-1);
    }
  }, [globalSettings, hassConnectionState]);

  useEffect(() => {
    if (globalSettings && sdItems && hassEntities) {
      const items = sdItems;
      items.forEach((sdItem: StreamDeckPluginItem, index: number): void => {
        const entity: HassEntity = hassEntities[sdItem.settings.haEntity];
        if (
          entity?.attributes?.friendly_name &&
          sdItem.title !== entity?.attributes.friendly_name
        ) {
          sdItem.title = entity.attributes.friendly_name;
          items[index] = sdItem;
          setSdItems(items);
          sdItem.instance.setTitle(sdItem.title);
        }
      });
    }
  }, [globalSettings, sdItems, hassEntities]);

  const handleKeyUp = useCallback(
    (event: CustomEvent<KeyUpEvent>) => {
      console.log("Code - onKeyUp:", {
        globalSettings,
        sdItems,
        hassEntities,
        event,
      });
      if (globalSettings && sdItems && hassEntities) {
        const sdItem: StreamDeckPluginItem = sdItems.find(
          (sdItem: StreamDeckPluginItem) =>
            sdItem.instance.context === event.detail.context
        );
        console.log("Code - onKeyUp sdItem:", sdItem);
        if (sdItem?.settings && sdItem?.instance) {
          const { entity_id, state }: HassEntity = hassEntities[
            sdItem.settings.haEntity
          ];
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
              sdItem.instance.showOk();
            else sdItem.instance.showAlert();
          }
        }
      }
    },
    [globalSettings, sdItems, hassEntities]
  );

  useEffect(() => {
    if (sdItems) {
      const items: StreamDeckPluginItem[] = sdItems;
      items.forEach((sdItem: StreamDeckPluginItem, index: number) => {
        sdItem.instance.clearEventListeners(EventsReceived.KEY_UP);
        sdItem.instance.on(EventsReceived.KEY_UP, handleKeyUp);
        sdItem.instance.on(
          EventsReceived.DID_RECEIVE_GLOBAL_SETTINGS,
          (event: DidReceiveEvent<{ settings: GlobalSettings }>) => {
            setGlobalSettings(event.detail.payload.settings);
          }
        );
        sdItem.instance.on(
          EventsReceived.DID_RECEIVE_SETTINGS,
          (event: DidReceiveEvent<{ settings: Settings }>) => {
            sdItem.settings = event.detail.payload.settings;
            items[index] = sdItem;
            setSdItems(items);
          }
        );
      });
    }
  }, [sdItems, handleKeyUp]);

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
