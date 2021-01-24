import React, { ReactElement, useMemo } from "react";
import { HassEntities, HassEntity } from "home-assistant-js-websocket";

import {
  GenericObjectString,
  GlobalSettings,
  Option,
  Settings,
} from "../Common/Types";
import { StreamDeckPropertyInspector } from "../Common/StreamDeck";

interface PropertyViewProps {
  sdPropertyInspector: StreamDeckPropertyInspector;
  globalSettings: GlobalSettings;
  settings: Settings;
  localization: GenericObjectString;
  hassEntities: HassEntities;
  changeSetting: (key: keyof Settings, value: any) => void;
}

export default function PropertyView({
  sdPropertyInspector,
  globalSettings,
  settings,
  localization,
  hassEntities,
  changeSetting,
}: PropertyViewProps): ReactElement {
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
            <div className="sdpi-item">
              <div className="sdpi-item-label">{localization?.entity}</div>
              <select
                className="sdpi-item-value select sdProperty sdList"
                id="ha-entity"
                value={settings.haEntity || ""}
                onChange={(event) =>
                  event.target.value === "add"
                    ? handleSetupHaConnection()
                    : changeSetting("haEntity", event.target.value)
                }
              >
                {haEntitesOptions.map(({ label, value }: Option) => (
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
      </div>
    </div>
  );
}
