import React, { ReactElement, useMemo } from "react";
import { HassEntities, HassEntity } from "home-assistant-js-websocket";

import {
  GenericObjectString,
  GlobalSettings,
  Option,
  Settings,
} from "../Common/Types";

interface PropertyViewProps {
  action: string;
  globalSettings: GlobalSettings;
  settings: Settings;
  localization: GenericObjectString;
  hassEntities: HassEntities;
  handleChangeSetting: (key: keyof Settings, value: any) => void;
  handleSetupHaConnection: () => void;
}

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
        .filter(
          (entity: HassEntity) => !entity.entity_id.startsWith("device_tracker")
        )
        .sort((a: HassEntity, b: HassEntity) =>
          a.entity_id > b.entity_id ? 1 : a.entity_id < b.entity_id ? -1 : 0
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
  }, [hassEntities, localization?.entitiesSelect]);

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
              <></>
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
