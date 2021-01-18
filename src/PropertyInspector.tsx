import React, { useCallback, useEffect, useMemo } from "react";
import { SDSelectInput } from "react-streamdeck";

import { Option, SettingHaConnection } from "./Common/Types";
import { StreamDeckPropertyInspector } from "./Common/StreamDeck";

const sdPropertyInspector = new StreamDeckPropertyInspector();

export default function PropertyInspector() {
  const saveConnection = useCallback(
    (inEvent: CustomEvent<SettingHaConnection>) => {
      const connection: SettingHaConnection = inEvent.detail;
      console.log("PropertyInspector Event - saveConnection:", {
        connection,
        sdPropertyInspector,
      });
      const connections: SettingHaConnection[] =
        sdPropertyInspector.globalSettings?.haConnections || [];
      connections.push(connection);
      sdPropertyInspector.currentInstance.setGlobalSetting(
        "haConnections",
        connections
      );
      sdPropertyInspector.currentInstance.setSetting(
        "haConnection",
        connection.url
      );
      sdPropertyInspector.globalSettings.haConnections = connections;
      sdPropertyInspector.settings.haConnection = connection.url;
    },
    []
  );

  useEffect(() => {
    document.addEventListener("saveConnection", saveConnection);
  }, [saveConnection]);

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
            ...sdPropertyInspector.globalSettings.haConnections.map(
              ({ name, url }) => ({
                label: name,
                value: url,
              })
            ),
            { label: `lox("haConnectionAdd")`, value: "add" },
          ]
        : [{ label: `lox("haConnectionAdd")`, value: "add" }],
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
  }, [haConnections]);

  console.log("PropertyInspector:", {
    NODE_ENV: process.env.NODE_ENV,
    sdPropertyInspector,
  });

  return (
    <div>
      <SDSelectInput
        label={`lox("haConnection")`}
        selectedOption={selectedHaConnection}
        options={haConnections}
        onChange={(value) => {
          if (value === "add") handleAddHaConnection();
          // else sdPropertyInspector.setSetting("haConnection", value);
          return {};
        }}
      />
    </div>
  );
}
