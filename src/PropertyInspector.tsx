/* global $SD, lox */
import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";

import { SDSelectInput, SDTextInput } from "react-streamdeck";

import { Option, Settings } from "./Types";

interface PropertyInspectorProps {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

export default function PropertyInspector({
  settings,
  setSettings,
}: PropertyInspectorProps) {
  function handleAddHaConnection() {
    console.log("Add HA connection..");
    window.open("./setup-connection.html");
  }

  const haConnections: Option[] = useMemo(
    () => [
      ...settings.haConnections.map(({ name, url }) => ({
        label: `${name} - ${url}`,
        value: url,
      })),
      // @ts-ignore
      { label: lox("haConnectionAdd"), value: "add" },
    ],
    // @ts-ignore
    [lox, settings.haConnections]
  );

  const selectedHaConnection: string = useMemo(() => {
    const connection: Option = haConnections.find(
      ({ value }: Option) => value === settings.haConnection
    );
    return connection ? connection.value : "";
  }, [haConnections, settings]);

  console.log("PropertyInspector:", {
    // @ts-ignore
    $SD,
    settings,
    haConnections,
  });

  return (
    <div>
      <SDSelectInput
        // @ts-ignore
        label={lox("haConnection")}
        selectedOption={selectedHaConnection}
        options={haConnections}
        onChange={(value) => {
          value === "add"
            ? handleAddHaConnection()
            : setSettings({
                ...settings,
                haConnection: value,
              });
          return {};
        }}
      />
      <SDTextInput
        value={settings.textState}
        label="Testing"
        onChange={(event) => {
          const newState = {
            ...settings,
            textState: event.target.value,
          };
          setSettings(newState);
          return {};
        }}
      />
    </div>
  );
}
