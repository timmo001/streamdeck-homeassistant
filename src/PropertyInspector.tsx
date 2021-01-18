import React, { useCallback, useEffect, useMemo } from "react";
import { SDSelectInput, SDTextInput } from "react-streamdeck";

import {
  Option,
  SettingHaConnection,
  Settings,
  GlobalSettings,
} from "./Common/Types";
import { StreamDeckPropertyInspector } from "./Common/StreamDeck";

const sdPropertyInspector = new StreamDeckPropertyInspector();
// sdPropertyInspector.enableSettingManager();

export default function PropertyInspector() {
  const saveConnection = useCallback(
    (inEvent: CustomEvent<SettingHaConnection>) => {
      console.log("saveConnection Event:", inEvent);
      const connection: SettingHaConnection = inEvent.detail;
      const connections: SettingHaConnection[] =
        sdPropertyInspector.globalSettings.haConnections || [];
      connections.push(connection);
      // sdPropertyInspector.setGlobalSetting("haConnections", connections);
      // sdPropertyInspector.setSetting("haConnection", connection.url);
      // setGlobalSettings({
      //   ...globalSettings,
      //   haConnections: connections,
      // });
      // setSettings({
      //   ...settings,
      //   haConnection: connection.url,
      // });
    },
    []
  );

  useEffect(() => {
    document.addEventListener("saveConnection", saveConnection);
  }, [saveConnection]);

  function handleAddHaConnection() {
    console.log("Add HA connection..");
    // window.open(
    //   `./setup-connection.html?language=${streamDeck.applicationInfo.application.language}&streamDeckVersion=${streamDeck.applicationInfo.application.version}&pluginVersion=${streamDeck.applicationInfo.plugin.version}`
    // );
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
    []
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
    haConnections,
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
