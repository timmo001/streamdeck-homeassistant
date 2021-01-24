import React, { ReactElement, useMemo } from "react";
import { HassEntities, HassEntity } from "home-assistant-js-websocket";

import {
  GenericObjectString,
  GlobalSettings,
  Option,
  Settings,
} from "../Common/Types";
import FeatureClassNames from "../HomeAssistant/Utils/FeatureClassNames";

interface PropertyViewProps {
  action: string;
  globalSettings: GlobalSettings;
  settings: Settings;
  localization: GenericObjectString;
  hassEntities: HassEntities;
  handleChangeSetting: (key: keyof Settings, value: any) => void;
  handleSetupHaConnection: () => void;
}

const LIGHT_FEATURE_CLASS_NAMES = {
  1: "has-brightness",
  2: "has-color_temp",
  4: "has-effect_list",
  16: "has-color",
  128: "has-white_value",
};

export default function PropertyView({
  action,
  globalSettings,
  settings,
  localization,
  hassEntities,
  handleChangeSetting,
  handleSetupHaConnection,
}: PropertyViewProps): ReactElement {
  const haEntitesOptions: Option[] = useMemo(() => {
    if (hassEntities) {
      const options: Option[] = Object.values(hassEntities)
        .filter((entity: HassEntity) =>
          action === "dev.timmo.homeassistant.automationtrigger"
            ? entity.entity_id.startsWith("device_tracker")
            : action === "dev.timmo.homeassistant.binarysensor"
            ? entity.entity_id.startsWith("binary_sensor")
            : action.startsWith("dev.timmo.homeassistant.climate")
            ? entity.entity_id.startsWith("climate")
            : action.startsWith("dev.timmo.homeassistant.light")
            ? entity.entity_id.startsWith("light")
            : action.startsWith("dev.timmo.homeassistant.mediaplayer")
            ? entity.entity_id.startsWith("media_player")
            : action === "dev.timmo.homeassistant.scripttrigger"
            ? entity.entity_id.startsWith("script")
            : action === "dev.timmo.homeassistant.sensor"
            ? entity.entity_id.startsWith("sensor") ||
              entity.entity_id.startsWith("sun")
            : action === "dev.timmo.homeassistant.switch"
            ? entity.entity_id.startsWith("switch")
            : action === "dev.timmo.homeassistant.weather"
            ? entity.entity_id.startsWith("weather")
            : false
        )
        .sort((a: HassEntity, b: HassEntity) =>
          a.attributes?.friendly_name && b.attributes?.friendly_name
            ? a.attributes.friendly_name > b.attributes.friendly_name
              ? 1
              : a.attributes.friendly_name < b.attributes.friendly_name
              ? -1
              : 0
            : a.entity_id > b.entity_id
            ? 1
            : a.entity_id < b.entity_id
            ? -1
            : 0
        )
        .map((entity: HassEntity) => ({
          label: entity.attributes?.friendly_name
            ? `${entity.attributes?.friendly_name} - ${entity.entity_id}`
            : entity.entity_id,
          value: entity.entity_id,
        }));
      options.unshift({
        label: localization?.entitiesSelect,
        value: "",
      });
      return options;
    } else
      return [
        {
          label: localization?.entitiesSelect,
          value: "",
        },
      ];
  }, [action, hassEntities, localization?.entitiesSelect]);

  const haEffects: Option[] = useMemo(() => {
    if (!settings?.haEntity || !hassEntities) return [];
    const entity: HassEntity = hassEntities[settings.haEntity];
    if (!entity) return [];
    const attrClasses = FeatureClassNames(entity, LIGHT_FEATURE_CLASS_NAMES);
    if (
      !attrClasses.includes("has-effect_list") ||
      !entity.attributes.effect_list
    )
      return [];
    const effects: Option[] = entity.attributes.effect_list.map(
      (effect: string) => ({
        label: effect,
        value: effect,
      })
    );
    if (!settings.value) handleChangeSetting("value", effects[0].value);
    return effects;
  }, [settings?.haEntity, settings?.value, handleChangeSetting, hassEntities]);
  return (
    <div className="spdi-wrapper">
      <div id="sdWrapper">
        <div className="sdpi-item">
          <div className="sdpi-item-label">{localization?.connection}</div>
          <button className="sdpi-item-value" onClick={handleSetupHaConnection}>
            {globalSettings?.haConnection
              ? localization?.connectionEdit
              : localization?.connectionSetup}
          </button>
        </div>

        {globalSettings?.haConnection ? (
          <>
            <hr />
            <div className="sdpi-item">
              <div className="sdpi-item-label">{localization?.entity}</div>
              <select
                className="sdpi-item-value select sdProperty sdList"
                id="ha-entity"
                value={settings.haEntity || ""}
                onChange={(event) =>
                  event.target.value === "add"
                    ? handleSetupHaConnection()
                    : handleChangeSetting("haEntity", event.target.value)
                }
              >
                {haEntitesOptions.map(({ label, value }: Option) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {action === "dev.timmo.homeassistant.automationtrigger" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.binarysensor" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.climateset" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.climatedecrease" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.climateincrease" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.lighttoggle" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.lightcolor" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">{localization?.color}</div>
                  <input className="sdpi-item-value sdProperty" type="color" />
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.lightbrightnessset" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">
                    {localization?.brightness}
                  </div>
                  <input
                    className="sdpi-item-value sdProperty"
                    type="number"
                    min="0"
                    max="255"
                    value={settings.value}
                    onChange={(e) => {
                      const value: number = Number(e.target.value);
                      if (value >= 0 && value <= 255)
                        handleChangeSetting("value", value);
                    }}
                  />
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.lightbrightnessdecrease" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">{localization?.amount}</div>
                  <input
                    className="sdpi-item-value sdProperty"
                    type="number"
                    min="0"
                    max="255"
                    value={settings.value}
                    onChange={(e) => {
                      const value: number = Number(e.target.value);
                      if (value >= 0 && value <= 255)
                        handleChangeSetting("value", value);
                    }}
                  />
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.lightbrightnessincrease" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">{localization?.amount}</div>
                  <input
                    className="sdpi-item-value sdProperty"
                    type="number"
                    min="0"
                    max="255"
                    value={settings.value}
                    onChange={(e) => {
                      const value: number = Number(e.target.value);
                      if (value >= 0 && value <= 255)
                        handleChangeSetting("value", value);
                    }}
                  />
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.lighteffect" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">{localization?.effect}</div>
                  <select
                    className="sdpi-item-value select sdProperty sdList"
                    id="ha-entity"
                    value={settings.value || ""}
                    onChange={(event) =>
                      handleChangeSetting("value", event.target.value)
                    }
                  >
                    {haEffects?.map(({ label, value }: Option) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.mediaplayertoggle" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.mediaplayerplaypause" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.mediaplayerstop" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.mediaplayernext" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.mediaplayerprevious" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.scripttrigger" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.sensor" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.switch" ? (
              <></>
            ) : action === "dev.timmo.homeassistant.weather" ? (
              <></>
            ) : (
              ""
            )}
            <div className="sdpi-item">
              <div className="sdpi-item-label">{localization?.wrapText}</div>
              <input
                className="sdpi-item-value sdProperty sdCheckbox"
                type="checkbox"
                checked={settings.wrap}
                onChange={(e) => {
                  handleChangeSetting("wrap", e.target.checked);
                }}
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
