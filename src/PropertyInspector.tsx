import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";

import { SDSelectInput, SDTextInput } from "react-streamdeck";

import { Option, SettingHaConnection, Settings, GlobalSettings } from "./Types";

interface PropertyInspectorProps {
  globalSettings: GlobalSettings;
  settings: Settings;
  setGlobalSettings: Dispatch<SetStateAction<GlobalSettings>>;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

export default function PropertyInspector({
  settings,
  setSettings,
  globalSettings,
  setGlobalSettings,
}: PropertyInspectorProps) {
  const saveConnection = useCallback(
    (inEvent: CustomEvent<SettingHaConnection>) => {
      console.log("saveConnection Event:", inEvent);
      const connection: SettingHaConnection = inEvent.detail;
      const connections: SettingHaConnection[] =
        globalSettings.haConnections || [];
      connections.push(connection);
      setGlobalSettings({
        ...globalSettings,
        haConnections: connections,
      });
      setSettings({
        ...settings,
        haConnection: connection.url,
      });
    },
    [globalSettings, setGlobalSettings, setSettings, settings]
  );

  useEffect(() => {
    document.addEventListener("saveConnection", saveConnection);
  }, [saveConnection]);

  function handleAddHaConnection() {
    console.log("Add HA connection..");
    window.open(
      // @ts-ignore
      `./setup-connection.html?language=${streamDeck.applicationInfo.application.language}&streamDeckVersion=${streamDeck.applicationInfo.application.version}&pluginVersion=${streamDeck.applicationInfo.plugin.version}`
    );
  }

  const haConnections: Option[] = useMemo(
    () => [
      ...globalSettings.haConnections.map(({ name, url }) => ({
        label: name,
        value: url,
      })),
      // @ts-ignore
      { label: lox("haConnectionAdd"), value: "add" },
    ],
    [globalSettings.haConnections]
  );

  const selectedHaConnection: string = useMemo(() => {
    const connection: Option = haConnections.find(
      ({ value }: Option) => value === settings.haConnection
    );
    return connection ? connection.value : "";
  }, [haConnections, settings]);

  // console.log("PropertyInspector:", {
  //   // @ts-ignore
  //   streamDeck,
  //   globalSettings,
  //   settings,
  //   haConnections,
  // });

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
