import React, { ReactElement, useMemo } from "react";
import {
  HassEntities,
  HassEntity,
  HassServices,
} from "home-assistant-js-websocket";

import {
  GenericObject,
  GlobalSettings,
  Option,
  Settings,
} from "../Common/Types";
import FeatureClassNames from "../HomeAssistant/Utils/FeatureClassNames";
import { hexToRgb, rgbToHex } from "../Common/Utils";

interface PropertyViewProps {
  action: string;
  globalSettings: GlobalSettings;
  settings: Settings;
  localization: GenericObject;
  hassEntities: HassEntities;
  hassServices: HassServices;
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
  hassServices,
  handleChangeSetting,
  handleSetupHaConnection,
}: PropertyViewProps): ReactElement {
  const haEntitesOptions: Option[] = useMemo(() => {
    if (hassEntities) {
      const options: Option[] = Object.values(hassEntities)
        .filter((entity: HassEntity) =>
          action === "dev.timmo.homeassistant.automationtrigger"
            ? entity.entity_id.startsWith("automation")
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

  const haServices: Option[] = useMemo(() => {
    if (!hassServices) return [];
    const options: Option[] = [];
    Object.keys(hassServices).forEach((domainKey: string) =>
      Object.keys(hassServices[domainKey]).forEach((serviceKey: string) => {
        options.push({
          label: `${domainKey}.${serviceKey}`,
          value: `${domainKey}.${serviceKey}`,
        });
      })
    );
    options.sort((a: Option, b: Option) => (a.label > b.label ? 1 : -1));
    options.unshift({
      label: localization?.servicesSelect,
      value: "",
    });
    return options;
  }, [hassServices, localization?.servicesSelect]);

  const haValue: string | number = useMemo(() => {
    if (action === "dev.timmo.homeassistant.lightcolor") {
      try {
        if (!Array.isArray(settings.haValue)) return "#ffffff";
        const values: number[] = settings.haValue;
        return rgbToHex(values);
      } catch {
        return "#ffffff";
      }
    }
    if (typeof settings.haValue === "number") return settings.haValue;
    if (!settings.haValue) return undefined;
    return String(settings.haValue);
  }, [action, settings?.haValue]);

  const haValue2: string | number = useMemo(() => {
    if (!settings.haValue2) return undefined;
    if (typeof settings.haValue2 === "number") return settings.haValue2;
    if (typeof settings.haValue2 === "string") return settings.haValue2;
    if (typeof settings.haValue2 === "object")
      try {
        return JSON.stringify(settings.haValue2, null, 2);
      } catch (e) {
        console.log("Error stringifying haValue2:", e.message);
      }
    return String(settings.haValue2);
  }, [settings?.haValue2]);

  const haEntity: HassEntity = useMemo(
    () => (hassEntities ? hassEntities[settings?.haEntity] : undefined),
    [hassEntities, settings?.haEntity]
  );

  const haEffects: Option[] = useMemo(() => {
    if (!hassEntities || !haEntity) return [];
    const attrClasses = FeatureClassNames(haEntity, LIGHT_FEATURE_CLASS_NAMES);
    if (
      !attrClasses.includes("has-effect_list") ||
      !haEntity.attributes.effect_list
    )
      return [];
    const options: Option[] = haEntity.attributes.effect_list.map(
      (effect: string) => ({
        label: effect,
        value: effect,
      })
    );
    if (!haValue) handleChangeSetting("haValue", options[0].value);
    options.unshift({
      label: localization?.effectsSelect,
      value: "",
    });
    return options;
  }, [
    hassEntities,
    haEntity,
    haValue,
    handleChangeSetting,
    localization?.effectsSelect,
  ]);

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
            {action !== "dev.timmo.homeassistant.customservice" ? (
              <div className="sdpi-item">
                <div className="sdpi-item-label">{localization?.entity}</div>
                <select
                  className="sdpi-item-value select sdProperty sdList"
                  id="ha-entity"
                  required
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
            ) : (
              ""
            )}
            {action === "dev.timmo.homeassistant.climateset" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">
                    {localization?.temperature}
                  </div>
                  {haEntity && haEntity.attributes ? (
                    <input
                      className="sdpi-item-value sdProperty"
                      type="number"
                      min={haEntity.attributes.min_temperature || 15}
                      max={haEntity.attributes.max_temperature || 30}
                      step={0.5}
                      required
                      value={haValue || haEntity.attributes.temperature}
                      onChange={(e) => {
                        const value: number = Number(e.target.value);
                        handleChangeSetting("haValue", value);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.climatedecrease" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">
                    {localization?.temperature}
                  </div>
                  {haEntity && haEntity.attributes ? (
                    <input
                      className="sdpi-item-value sdProperty"
                      type="number"
                      min={0.5}
                      max={haEntity.attributes.max_temperature || 30}
                      step={0.5}
                      required
                      value={haValue || 0.5}
                      onChange={(e) => {
                        const value: number = Number(e.target.value);
                        handleChangeSetting("haValue", value);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.climateincrease" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">
                    {localization?.temperature}
                  </div>
                  {haEntity && haEntity.attributes ? (
                    <input
                      className="sdpi-item-value sdProperty"
                      type="number"
                      min={0.5}
                      max={haEntity.attributes.max_temperature || 30}
                      step={0.5}
                      required
                      value={haValue || 0.5}
                      onChange={(e) => {
                        const value: number = Number(e.target.value);
                        handleChangeSetting("haValue", value);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.customservice" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">{localization?.service}</div>
                  <select
                    className="sdpi-item-value select sdProperty sdList"
                    id="ha-entity"
                    required
                    value={typeof haValue === "string" ? haValue : ""}
                    onChange={(event) =>
                      handleChangeSetting("haValue", event.target.value)
                    }
                  >
                    {haServices.map(({ label, value }: Option) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">{localization?.data}</div>
                  <textarea
                    className="sdpi-item-value sdProperty"
                    value={haValue2}
                    onChange={(event) => {
                      try {
                        handleChangeSetting(
                          "haValue2",
                          JSON.parse(event.target.value)
                        );
                      } catch (e) {
                        console.log(
                          "Error parsing haValue:",
                          e.message,
                          "setting anyway"
                        );
                        handleChangeSetting("haValue2", event.target.value);
                      }
                    }}
                  />
                </div>
              </>
            ) : action === "dev.timmo.homeassistant.lightcolor" ? (
              <>
                <div className="sdpi-item">
                  <div className="sdpi-item-label">{localization?.color}</div>
                  <input
                    className="sdpi-item-value sdProperty"
                    type="color"
                    required
                    value={haValue}
                    onChange={(e) =>
                      handleChangeSetting("haValue", hexToRgb(e.target.value))
                    }
                  />
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
                    required
                    value={haValue}
                    onChange={(e) => {
                      const value: number = Number(e.target.value);
                      if (value >= 0 && value <= 255)
                        handleChangeSetting("haValue", value);
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
                    required
                    value={haValue}
                    onChange={(e) => {
                      const value: number = Number(e.target.value);
                      if (value >= 0 && value <= 255)
                        handleChangeSetting("haValue", value);
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
                    required
                    value={haValue}
                    onChange={(e) => {
                      const value: number = Number(e.target.value);
                      if (value >= 0 && value <= 255)
                        handleChangeSetting("haValue", value);
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
                    required
                    value={haValue}
                    onChange={(event) =>
                      handleChangeSetting("haValue", event.target.value)
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
            ) : (
              ""
            )}
            <div className="sdpi-item">
              <div className="sdpi-item-label">{localization?.wrapText}</div>
              <input
                className="sdpi-item-value sdProperty sdCheckbox"
                type="checkbox"
                required
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
