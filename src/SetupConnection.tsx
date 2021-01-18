import React, { useState } from "react";

import { HassConnectionState } from "./common/types";

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
            <h1>
              {`lox["setupConnectionTitle"]` || "Connect to Home Assistant"}
            </h1>
          </div>
          <div id="content">
            <p>
              {`lox["setupConnectionDescription"]` ||
                "Connect a Home Assistant instance to access and control your home."}
            </p>
            <img
              className="image"
              alt="Home Assistant Logo"
              src="https://brands.home-assistant.io/homeassistant/icon.png"
            />
            <div className="sdpi-wrapper" id="pi">
              <div className="sdpi-item">
                <label className="sdpi-item-label" htmlFor="ha-access-token">
                  {`lox["haUrl"]` || "URL"}
                </label>
                <input
                  name="ha-url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
              </div>
              <div className="sdpi-item">
                <label className="sdpi-item-label" htmlFor="ha-access-token">
                  Long-Lived Access Token
                </label>
                <input
                  name="ha-access-token"
                  value={authToken}
                  onChange={(event) => setAuthToken(event.target.value)}
                />
              </div>
              <div className="sdpi-item">
                <button
                  disabled={!url || !url.startsWith("http") || !authToken}
                  onClick={(_event: any) => handleHassLogin(url, authToken)}
                >
                  Connect
                </button>
              </div>
              <div className="sdpi-item">
                <h4
                  style={{
                    color:
                      hassConnectionState === -1
                        ? "white"
                        : hassConnectionState === 0
                        ? "green"
                        : "red",
                  }}
                >
                  {hassConnectionState === -2
                    ? !url || !url.startsWith("http")
                      ? "Invalid URL"
                      : !authToken
                      ? "Enter Long-Lived Access Token"
                      : ""
                    : hassConnectionState === -1
                    ? "Connecting.."
                    : hassConnectionState === 0
                    ? "Connected!"
                    : hassConnectionState === 1
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
      </div>
    </div>
  );
}
