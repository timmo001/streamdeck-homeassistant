/* global $SD, lox */
import React, { useState } from "react";
import { SDButton, SDTextInput } from "react-streamdeck";

import { HassConnectionState } from "./Types";

interface SetupConnectionProps {
  hassConnectionState: HassConnectionState;
  handleHassLogin: (url: string, authToken: string) => Promise<void>;
}

export default function SetupConnection({
  hassConnectionState,
  handleHassLogin,
}: SetupConnectionProps) {
  const [authToken, setAuthToken] = useState<string>("");
  const [url, setUrl] = useState<string>("http://homeassistant.local:8123");

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
            <SDTextInput
              value={authToken}
              // @ts-ignore
              label={lox("haAuthToken")}
              onChange={(event) => {
                setAuthToken(event.target.value);
                return {};
              }}
            />
            <SDButton
              disabled={!url || !url.startsWith("http") || !authToken}
              // @ts-ignore
              text={lox("setupConnectionStart")}
              // @ts-ignore
              onClick={(_event: any) => {
                console.log("Setup Connection - Connection");
                handleHassLogin(url, authToken);
              }}
            />
            <h4 style={{ color: "red" }}>
              {hassConnectionState === 1
                ? "Connection Error"
                : hassConnectionState === 2
                ? "Invalid Authentication"
                : hassConnectionState === 3
                ? "Connection Lost"
                : hassConnectionState === 4
                ? "Host Required"
                : hassConnectionState === 5
                ? "Invalid HTTPS to HTTP (HTTPS URL Required)"
                : hassConnectionState === 6
                ? "Unknown Error"
                : ""}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
