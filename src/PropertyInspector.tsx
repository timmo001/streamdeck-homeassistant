/* global $SD, lox */
import React, { useState, useEffect, useReducer, useMemo } from "react";

import {
  createUsePluginSettings,
  createUseSDAction,
  SDSelectInput,
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
      haConnections: [],
      haConnection: "",
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

  const haInstances: Option[] = useMemo(
    () => [
      ...settings.haConnections.map(({ name, url }) => ({
        label: `${name} - ${url}`,
        value: url,
      })),
      // @ts-ignore
      { label: lox("haConnectionAdd"), value: "add" },
    ],
    [settings.haConnections]
  );

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
                haConnection: value,
              })
        }
      />
    </div>
  );
}
