/* global $SD, lox */
import React, { useEffect, useState } from "react";

import { createUseSDAction, SDButton, SDTextInput } from "react-streamdeck";

const useSDAction = createUseSDAction({
  useState,
  useEffect,
});

export default function SetupConnection() {
  const connectedResult = useSDAction("connected");

  const [url, setUrl] = useState("");

  useEffect(() => {}, []);

  console.log({
    connectedResult,
    // @ts-ignore
    $SD,
    // @ts-ignore
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
            {/* @ts-ignore */}
            <h1>{lox("setupConnectionTitle")}</h1>
          </div>
          <div id="content">
            {/* @ts-ignore */}
            <p>{lox("setupConnectionDescription")}</p>
            <img
              className="image"
              src="https://brands.home-assistant.io/homeassistant/icon.png"
            />

            <SDTextInput
              value={url}
              // @ts-ignore
              label={lox("haConnection")}
              onChange={(event) => {
                setUrl(event.target.value);
                return {};
              }}
            />

            <SDButton
              // @ts-ignore
              text={lox("setupConnectionStart")}
              // @ts-ignore
              onClick={(_event: any) => {
                console.log("Setup Connection - Connection");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
