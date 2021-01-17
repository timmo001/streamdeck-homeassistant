/* global $SD, lox */
import React, { useState, useEffect, useReducer } from "react";

import {
  createUsePluginSettings,
  createUseSDAction,
  SDNumberInput,
  SDSelectInput,
  SDTextInput,
} from "react-streamdeck";

import { Option } from "./Types";

const createGetSettings = (sd: any) => () => {
  if (sd.api.getSettings) {
    sd.api.getSettings(sd.uuid);
  } else {
    sd.api.common.getSettings(sd.uuid);
  }
};

const useSDAction = createUseSDAction({
  useState,
  useEffect,
});

export default function PropertyInspector() {
  const connectedResult = useSDAction("connected");
  const sendToPropertyInspectorResult = useSDAction("sendToPropertyInspector");

  const [settings, setSettings] = createUsePluginSettings({
    useState,
    useEffect,
    useReducer,
  })(
    {
      numberState: 0,
      selectState: "",
      textState: "",
    },
    connectedResult
  );

  useEffect(() => {
    // @ts-ignore
    createGetSettings($SD);
  }, []);

  function handleAddHaConnection() {
    console.log("Add HA connection..");
    window.open("./setup-connection.html");
  }

  const haInstances: Option[] = [
    // @ts-ignore
    { label: lox("haConnectionAdd"), value: "add" },
  ];

  console.log({
    // @ts-ignore
    $SD,
    connectedResult,
    sendToPropertyInspectorResult,
    settings,
    haInstances,
  });

  return (
    <div>
      <SDSelectInput
        // @ts-ignore
        label={lox("haConnection")}
        selectedOption={settings.selectState}
        options={haInstances}
        onChange={(value) =>
          value === "add"
            ? handleAddHaConnection()
            : setSettings({
                ...settings,
                selectState: value,
              })
        }
      />

      <SDTextInput
        value={settings.textState}
        label="Testing"
        onChange={(event) =>
          setSettings({
            ...settings,
            textState: event.target.value,
          })
        }
      />

      <SDNumberInput
        value={settings.numberState}
        label="Testing"
        onChange={(event) =>
          setSettings({
            ...settings,
            numberState: event.target.value,
          })
        }
      />
    </div>
  );
}
