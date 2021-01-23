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
  function handleAddHaConnection() {
    console.log("Add HA connection..");
    window.open(
      `./setup-connection.html?language=${sdPropertyInspector.language}&streamDeckVersion=${sdPropertyInspector.version}&pluginVersion=${sdPropertyInspector.pluginVersion}`
    );
  }

  const haConnections: Option[] = useMemo(
    () =>
      globalSettings && globalSettings.haConnections
        ? [
            {
              label: localization?.connectionSelect,
              value: "",
            },
            ...globalSettings.haConnections.map(({ name, url }) => ({
              label: name,
              value: url,
            })),
            {
              label: localization?.connectionAdd,
              value: "add",
            },
          ]
        : [
            {
              label: localization?.connectionSelect,
              value: "",
            },
            {
              label: localization?.connectionAdd,
              value: "add",
            },
          ],
    [globalSettings, localization]
  );

  const haConnection: Option = useMemo(() => {
    const connection: Option =
      settings &&
      haConnections.find(
        ({ value }: Option) => value === settings.haConnection
      );
    return connection;
  }, [haConnections, settings]);

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
          <select
            className="sdpi-item-value select sdProperty"
            id="ha-connection"
            value={haConnection?.value || ""}
            onChange={(event) =>
              event.target.value === "add"
                ? handleAddHaConnection()
                : changeSetting("haConnection", event.target.value)
            }
          >
            {haConnections.map(({ label, value }: Option) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {haConnection && haConnection.value !== "" ? (
          <>
            <div className="sdpi-item">
              <div className="sdpi-item-label">{localization?.entity}</div>
              <select
                className="sdpi-item-value select sdProperty sdList"
                id="ha-entity"
                value={settings.haEntity || ""}
                onChange={(event) =>
                  event.target.value === "add"
                    ? handleAddHaConnection()
                    : changeSetting("haEntity", event.target.value)
                }
              >
                {haEntitesOptions.map(({ label, value }: Option) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {/* <Autocomplete
              className="sdpi-item-value sdProperty"
              id="ha-entity"
              clearOnEscape
              disableListWrap
              disablePortal
              openOnFocus
              options={haEntitesOptions}
              value={settings.haEntity || null}
              getOptionLabel={(option: Option): string => option.label || ""}
              getOptionSelected={(option: Option): boolean =>
                option.value === settings.haEntity
              }
              // style={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // label={localization?.entity}
                  variant="standard"
                  margin="dense"
                />
              )}
              onChange={(_event: any, value: Option) =>
                changeSetting("haEntity", value.value)
              }
            /> */}
            </div>

            {/* <select
          className="sdpi-item-value select"
          name="ha-entity"
          value={settings.haEntity}
          onChange={(event) =>
            event.target.value === "add"
              ? handleAddHaConnection()
              : changeSetting(
                  "haEntity",
                  event.target.value
                )
          }
        >
          <option value="">Select an entity..</option>
        </select> */}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
