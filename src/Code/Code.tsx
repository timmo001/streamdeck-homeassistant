import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Auth,
  HassConfig,
  HassEntities,
  HassEntity,
  HassServices,
  HassUser,
} from "home-assistant-js-websocket";
import { cloneDeep } from "lodash";

import {
  GenericObject,
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
  StreamDeckPluginInstance,
  PluginInitEvent,
} from "../Common/StreamDeck";
import HomeAssistant, {
  handleChange as handleHassChange,
} from "../HomeAssistant/HomeAssistant";

let sdPlugin: StreamDeckPlugin;

export default function Code(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [, setLocalization] = useState<GenericObject>();
  const [sdItems, setSdItems] = useState<StreamDeckPluginItem[]>([]);

  const [, setHassAuth] = useState<Auth>();
  const [, setHassConfig] = useState<HassConfig>();
  const [hassConnection, setHassConnection] = useState<SettingHaConnection>();
  const [
    hassConnectionState,
    setHassConnectionState,
  ] = useState<HassConnectionState>(-2);
  const [hassEntities, setHassEntities] = useState<HassEntities>();
  const [, setHassServices] = useState<HassServices>();
  const [, setUser] = useState<HassUser>();

  useEffect(() => {
    if (globalSettings?.haConnection && hassConnectionState === -2) {
      setHassConnection(globalSettings?.haConnection);
      setHassConnectionState(-1);
    }
  }, [globalSettings, hassConnectionState]);

  const handleUpdateTitle = useCallback(
    (sdItem: StreamDeckPluginItem, index: number) => {
      if (globalSettings && hassEntities) {
        const items = cloneDeep(sdItems);
        let title: string = "";
        let entity: HassEntity;
        switch (sdItem.instance.action) {
          case "dev.timmo.homeassistant.customservice":
            if (typeof sdItem.settings.haValue === "string")
              title = sdItem.settings.haValue;
            break;
          default:
            entity = hassEntities[sdItem.settings.haEntity];
            if (entity?.entity_id) {
              // Set title
              const domain: string = entity.entity_id.split(".")[0];
              if (
                domain === "air_quality" ||
                domain === "binary_sensor" ||
                domain === "device_tracker" ||
                domain === "geo_location" ||
                domain === "person" ||
                domain === "sensor" ||
                domain === "sun" ||
                domain === "weather"
              )
                // Show state
                title = `${
                  entity.attributes?.friendly_name
                    ? `${
                        sdItem.settings.wrap
                          ? entity.attributes.friendly_name?.replace(/ /g, "\n")
                          : entity.attributes.friendly_name
                      }\n`
                    : ""
                }${entity.state}`;
              else if (
                domain === "automation" ||
                domain === "climate" ||
                domain === "cover" ||
                domain === "fan" ||
                domain === "group" ||
                domain === "input_boolean" ||
                domain === "light" ||
                domain === "lock" ||
                domain === "media_player" ||
                domain === "remote" ||
                domain === "scene" ||
                domain === "script" ||
                domain === "switch"
              )
                title = entity.attributes?.friendly_name
                  ? `${
                      sdItem.settings.wrap
                        ? entity.attributes.friendly_name?.replace(/ /g, "\n")
                        : entity.attributes.friendly_name
                    }`
                  : "";
            }
            break;
        }
        if (sdItem.title !== title) {
          sdItem.title = title;
          items[index] = sdItem;
          setSdItems(items);
          sdItem.instance.setTitle(title);
        }
      }
    },
    [globalSettings, sdItems, hassEntities]
  );

  const handleGetDataResult = useCallback(
    (sdItem: StreamDeckPluginItem) => {
      console.log("Code - getData result:", sdItem);
      const items: StreamDeckPluginItem[] = sdItems;
      if (
        !items.find(
          (item: StreamDeckPluginItem) =>
            item.instance.context === sdItem.instance.context
        )
      ) {
        console.log(
          "Code - getData result - new item:",
          sdItem.instance.context
        );
        items.push(sdItem);
        setSdItems(items);
      }
    },
    [sdItems]
  );

  useEffect(() => {
    if (!sdPlugin) {
      sdPlugin = new StreamDeckPlugin();
      sdPlugin
        .getGlobalData(true)
        .then(
          (data: {
            globalSettings: GlobalSettings;
            localization: GenericObject;
          }) => {
            console.log("Code - getGlobalData result:", data);
            setGlobalSettings(data.globalSettings);
            setLocalization(data.localization);
          }
        );

      sdPlugin.on(EventsReceived.INIT, (event: PluginInitEvent) => {
        const instance: StreamDeckPluginInstance = event.detail.instance;
        console.log(
          "Code - getData instance init:",
          event.detail.instance.context
        );
        sdPlugin.getData(instance).then(handleGetDataResult);
      });
    }
  }, [handleGetDataResult]);

  useEffect(() => {
    if (sdItems && hassEntities) cloneDeep(sdItems).forEach(handleUpdateTitle);
  }, [sdItems, hassEntities, handleUpdateTitle]);

  const handleKeyUp = useCallback(
    (event: CustomEvent<KeyUpEvent>) => {
      console.log("Code - onKeyUp:", {
        globalSettings,
        sdItems,
        hassEntities,
        event,
      });
      if (globalSettings && sdItems && hassEntities) {
        const sdItem: StreamDeckPluginItem = sdItems?.find(
          (sdItem: StreamDeckPluginItem) =>
            sdItem.instance.context === event.detail.context
        );
        console.log("Code - onKeyUp sdItem:", sdItem);
        if (sdItem?.settings && sdItem?.instance) {
          if (
            sdItem?.instance?.action ===
              "dev.timmo.homeassistant.customservice" &&
            sdItem.settings?.haValue &&
            typeof sdItem.settings?.haValue === "string"
          ) {
            const service: string[] = sdItem.settings?.haValue.split(".");
            console.log(service);
            if (
              handleHassChange(
                service[0],
                service[1],
                sdItem.settings?.haValue2 &&
                  typeof sdItem.settings?.haValue2 === "object"
                  ? sdItem.settings.haValue2
                  : {}
              )
            )
              sdItem.instance.showOk();
            else sdItem.instance.showAlert();
          } else {
            const entity: HassEntity = hassEntities[sdItem.settings.haEntity];
            if (entity?.entity_id) {
              const domain: string = entity.entity_id.split(".")[0];
              switch (sdItem?.instance?.action) {
                case "dev.timmo.homeassistant.automationtrigger":
                  if (
                    handleHassChange(domain, "trigger", {
                      entity_id: entity.entity_id,
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.climateset":
                  if (
                    handleHassChange(domain, "set_temperature", {
                      entity_id: entity.entity_id,
                      temperature: Number(sdItem.settings.haValue),
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.climatedecrease":
                  if (
                    handleHassChange(domain, "set_temperature", {
                      entity_id: entity.entity_id,
                      temperature:
                        Number(entity.attributes.temperature) -
                        Number(sdItem.settings.haValue),
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.climateincrease":
                  if (
                    handleHassChange(domain, "set_temperature", {
                      entity_id: entity.entity_id,
                      temperature:
                        Number(entity.attributes.temperature) +
                        Number(sdItem.settings.haValue),
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.lighttoggle":
                case "dev.timmo.homeassistant.switch":
                  if (
                    handleHassChange(
                      domain,
                      entity.state === "off" ? "turn_on" : "turn_off",
                      {
                        entity_id: entity.entity_id,
                      }
                    )
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.lightcolor":
                  if (
                    handleHassChange(domain, "turn_on", {
                      entity_id: entity.entity_id,
                      rgb_color: sdItem.settings.haValue,
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.lightbrightnessset":
                  if (
                    handleHassChange(domain, "turn_on", {
                      entity_id: entity.entity_id,
                      brightness: Number(sdItem.settings.haValue),
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.lightbrightnessdecrease":
                  if (
                    handleHassChange(domain, "turn_on", {
                      entity_id: entity.entity_id,
                      brightness_step: -Number(sdItem.settings.haValue),
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.lightbrightnessincrease":
                  if (
                    handleHassChange(domain, "turn_on", {
                      entity_id: entity.entity_id,
                      brightness_step: Number(sdItem.settings.haValue),
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.lighteffect":
                  if (
                    handleHassChange(domain, "turn_on", {
                      entity_id: entity.entity_id,
                      effect: sdItem.settings.haValue,
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.mediaplayertoggle":
                  if (
                    handleHassChange(
                      domain,
                      entity.state === "off" ? "turn_on" : "turn_off",
                      {
                        entity_id: entity.entity_id,
                      }
                    )
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.mediaplayerplaypause":
                  if (
                    handleHassChange(domain, "media_play_pause", {
                      entity_id: entity.entity_id,
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.mediaplayerstop":
                  if (
                    handleHassChange(domain, "media_stop", {
                      entity_id: entity.entity_id,
                    })
                  )
                    sdItem.instance.showOk();
                  break;
                case "dev.timmo.homeassistant.mediaplayerprevious":
                  if (
                    handleHassChange(domain, "media_previous_track", {
                      entity_id: entity.entity_id,
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.mediaplayernext":
                  if (
                    handleHassChange(domain, "media_next_track", {
                      entity_id: entity.entity_id,
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                case "dev.timmo.homeassistant.scripttrigger":
                  if (
                    handleHassChange(domain, "turn_on", {
                      entity_id: entity.entity_id,
                    })
                  )
                    sdItem.instance.showOk();
                  else sdItem.instance.showAlert();
                  break;
                default:
                  break;
              }
            }
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
          setServices={setHassServices}
          setUser={setUser}
        />
      ) : (
        ""
      )}
    </>
  );
}
