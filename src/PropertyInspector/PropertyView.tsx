import React, { useMemo } from "react";

import { Option } from "../common/types";
import { StreamDeckPropertyInspector } from "../common/StreamDeck";

interface PropertyViewProps {
  sdPropertyInspector: StreamDeckPropertyInspector;
}

export default function PropertyView({
  sdPropertyInspector,
}: PropertyViewProps) {
  function handleAddHaConnection() {
    console.log("Add HA connection..");
    window.open(
      `./setup-connection.html?language=${sdPropertyInspector.language}&streamDeckVersion=${sdPropertyInspector.version}&pluginVersion=${sdPropertyInspector.pluginVersion}`
    );
  }

  const haConnections: Option[] = useMemo(
    () =>
      sdPropertyInspector.globalSettings &&
      sdPropertyInspector.globalSettings.haConnections
        ? [
            { label: "Select a connection..", value: "" },
            ...sdPropertyInspector.globalSettings.haConnections.map(
              ({ name, url }) => ({
                label: name,
                value: url,
              })
            ),
            { label: `lox("haConnectionAdd")`, value: "add" },
          ]
        : [
            { label: "Select a connection..", value: "" },
            { label: `lox("haConnectionAdd")`, value: "add" },
          ],
    [sdPropertyInspector.globalSettings]
  );

  const selectedHaConnection: string = useMemo(() => {
    const connection: Option =
      sdPropertyInspector.settings &&
      haConnections.find(
        ({ value }: Option) =>
          value === sdPropertyInspector.settings.haConnection
      );
    return connection ? connection.value : "";
  }, [haConnections, sdPropertyInspector.settings]);

  console.log("PropertyInspector:", {
    NODE_ENV: process.env.NODE_ENV,
    sdPropertyInspector,
  });

  return (
    <div className="sdpi-wrapper" id="pi">
      <div className="sdpi-item">
        <label className="sdpi-item-label" htmlFor="ha-connection">
          Connection
        </label>
        <select
          className="sdpi-item-value select"
          name="ha-connection"
          value={selectedHaConnection}
          onChange={(event) =>
            event.target.value === "add"
              ? handleAddHaConnection()
              : sdPropertyInspector.currentInstance.setSetting(
                  "haConnection",
                  event.target.value
                )
          }
        >
          {haConnections.map(({ label, value }: Option) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
