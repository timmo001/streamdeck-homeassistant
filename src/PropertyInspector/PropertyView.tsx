import React, { ReactElement, useMemo } from "react";

import { GlobalSettings, Option, Settings } from "../Common/Types";
import { StreamDeckPropertyInspector } from "../Common/StreamDeck";

interface PropertyViewProps {
  sdPropertyInspector: StreamDeckPropertyInspector;
  globalSettings: GlobalSettings;
  settings: Settings;
  changeSetting: (key: keyof Settings, value: any) => void;
}

export default function PropertyView({
  sdPropertyInspector,
  globalSettings,
  settings,
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
            { label: "Select a connection..", value: "" },
            ...globalSettings.haConnections.map(({ name, url }) => ({
              label: name,
              value: url,
            })),
            {
              label: sdPropertyInspector.localization?.connectionAdd,
              value: "add",
            },
          ]
        : [
            { label: "Select a connection..", value: "" },
            {
              label: sdPropertyInspector.localization?.connectionAdd,
              value: "add",
            },
          ],
    [globalSettings, sdPropertyInspector.localization]
  );

  const selectedHaConnection: string = useMemo(() => {
    const connection: Option =
      settings &&
      haConnections.find(
        ({ value }: Option) => value === settings.haConnection
      );
    return connection ? connection.value : "";
  }, [haConnections, settings]);

  return (
    <div className="sdpi-wrapper" id="pi">
      <div className="sdpi-item">
        <label className="sdpi-item-label" htmlFor="ha-connection">
          {sdPropertyInspector.localization?.connection}
        </label>
        <select
          className="sdpi-item-value select"
          name="ha-connection"
          value={selectedHaConnection}
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
      {selectedHaConnection && selectedHaConnection !== "" ? (
        <>
          <div className="sdpi-item">
            <label className="sdpi-item-label" htmlFor="ha-entity">
              {sdPropertyInspector.localization?.entity}
            </label>
            <input
              className="sdpi-item-value"
              name="ha-entity"
              value={settings.haEntity}
              onChange={(event) =>
                changeSetting("haEntity", event.target.value)
              }
            />
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
  );
}
