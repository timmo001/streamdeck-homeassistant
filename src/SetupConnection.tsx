/* global $SD, lox */
import React, { useState, useEffect, useReducer } from "react";

import {
  // createUsePluginSettings,
  // createUseSDAction,
  SDButton,
  SDTextInput,
} from "react-streamdeck";

// const createGetSettings = (sd: any) => () => {
//   if (sd.api.getSettings) {
//     sd.api.getSettings(sd.uuid);
//   } else {
//     sd.api.common.getSettings(sd.uuid);
//   }
// };

// const useSDAction = createUseSDAction({
//   useState,
//   useEffect,
// });

export default function SetupConnection() {
  // const connectedResult = useSDAction("connected");
  // const sendToPropertyInspectorResult = useSDAction("sendToPropertyInspector");

  // const [settings, setSettings] = createUsePluginSettings({
  //   useState,
  //   useEffect,
  //   useReducer,
  // })({}, connectedResult);
  const [url, setUrl] = useState("");

  // useEffect(() => {
  //   createGetSettings($SD);
  // }, []);

  console.log({
    $SD,
    lox,
  });

  return (
    <div className="main">
      <div className="center">
        <div className="border">
          <div className="status-bar">
            <div className="status-row">
              <div id="status-intro" className="status-cell"></div>
              <div id="status-connection" className="status-cell"></div>
              <div id="status-save" className="status-cell"></div>
            </div>
          </div>
          <div className="header">
            <h2>Home Assistant Plugin</h2>
            <h1 id="title">{lox("setupConnectionIntro")}</h1>
          </div>
          <div id="content">
            <p>${lox("setupConnectionIntroDescription")}</p>
            <img
              className="image"
              src="https://brands.home-assistant.io/homeassistant/icon.png"
            />

            <SDTextInput
              value={url}
              label={lox("haConnection")}
              onChange={(event) => {
                setUrl(event.target.value);
                return {};
              }}
            />

            <SDButton
              text={lox("setupConnectionIntroStart")}
              onClick={(_event) => {
                console.log("Setup Connection - Connection");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
