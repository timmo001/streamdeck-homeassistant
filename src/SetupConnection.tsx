/* global $SD, lox */
import React, { useState, useEffect, useReducer } from "react";

import {
  createUsePluginSettings,
  createUseSDAction,
  SDTextInput,
} from "react-streamdeck";

import "react-streamdeck/dist/css/sdpi.css";

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

export default function SetupConnection() {
  const connectedResult = useSDAction("connected");
  const sendToPropertyInspectorResult = useSDAction("sendToPropertyInspector");

  const [settings, setSettings] = createUsePluginSettings({
    useState,
    useEffect,
    useReducer,
  })({}, connectedResult);
  const [url, setUrl] = useState("");

  useEffect(() => {
    createGetSettings($SD);
  }, []);

  console.log({
    $SD,
    connectedResult,
  });

  return (
    <div>
      <SDTextInput
        value={url}
        label={lox("haInstance")}
        onChange={(event) => {
          setUrl(event.target.value);
          return {};
        }}
      />
    </div>
  );
}
