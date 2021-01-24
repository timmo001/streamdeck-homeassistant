import React, { useEffect, useState } from "react";
import queryString from "query-string";
import {
  Auth,
  HassConfig,
  HassEntities,
  HassUser,
} from "home-assistant-js-websocket";

import { getLocalization } from "../Common/StreamDeck";
import {
  GenericObjectString,
  HassConnectionState,
  SettingHaConnection,
} from "../Common/Types";
import HomeAssistant from "../HomeAssistant/HomeAssistant";

export default function SetupConnection() {
  const [authToken, setAuthToken] = useState<string>("");
  const [url, setUrl] = useState<string>("http://homeassistant.local:8123");

  const [localization, setLocalization] = useState<GenericObjectString>();

  const [, setHassAuth] = useState<Auth>();
  const [hassAuthToken, setHassAuthToken] = useState<string>();
  const [hassConfig, setHassConfig] = useState<HassConfig>();
  const [
    hassConnectionState,
    setHassConnectionState,
  ] = useState<HassConnectionState>(-2);
  const [, setHassEntities] = useState<HassEntities>();
  const [hassUser, setUser] = useState<HassUser>();
  const [hassUrl, setHassUrl] = useState<string>();

  useEffect(() => {
    const qs = queryString.parse(window.location.search);
    if (qs.haConnectionUrl) setUrl(qs.haConnectionUrl.toString());
    getLocalization(
      qs.language.toString(),
      (success: boolean, message: any) => {
        if (process.env.NODE_ENV === "development")
          console.log("SetupConnection - getLocalization result:", {
            success,
            message,
          });
        if (success) setLocalization(message);
      }
    );
  }, []);

  useEffect(() => {
    if (hassConnectionState === 0 && hassUser && hassConfig) {
      const connection: SettingHaConnection = {
        name: `${hassConfig.location_name} - ${hassUser.name}`,
        authToken: hassAuthToken,
        url: hassUrl,
      };
      const event = new CustomEvent<SettingHaConnection>("saveConnection", {
        detail: connection,
      });
      window.opener.document.dispatchEvent(event);
      window.close();
    }
  }, [hassAuthToken, hassConfig, hassConnectionState, hassUrl, hassUser]);

  async function handleHassLogin(
    url: string,
    authToken: string
  ): Promise<void> {
    setHassUrl(url);
    setHassAuthToken(authToken);
    setHassConnectionState(-1);
  }

  return (
    <>
      <div className="main">
        <div className="center">
          <div className="border">
            <div className="status-bar">
              <div className="status-row">
                <div className="status-cell"></div>
              </div>
            </div>
            <div className="header">
              <h1>{localization?.setupConnection?.["title"]}</h1>
            </div>
            <div id="content">
              <p>{localization?.setupConnection?.["description"]}</p>
              <img
                className="image"
                alt="Home Assistant Logo"
                src="https://brands.home-assistant.io/homeassistant/icon.png"
              />
              <div className="sdpi-wrapper" id="setup">
                <div className="sdpi-item">
                  <label className="sdpi-item-label" htmlFor="ha-access-token">
                    {localization?.url}
                  </label>
                  <input
                    name="ha-url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </div>
                <div className="sdpi-item">
                  <label className="sdpi-item-label" htmlFor="ha-access-token">
                    {localization?.longLivedAccessToken}
                  </label>
                  <input
                    name="ha-access-token"
                    value={authToken}
                    onChange={(event) => setAuthToken(event.target.value)}
                  />
                </div>
                <div
                  className={`button${
                    !url || !url.startsWith("http") || !authToken
                      ? " button-disabled"
                      : ""
                  }`}
                  onClick={(_event: any) =>
                    url?.startsWith("http") && authToken
                      ? handleHassLogin(url, authToken)
                      : null
                  }
                >
                  {localization?.connect}
                </div>
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
      {hassUrl && hassAuthToken ? (
        <HomeAssistant
          authToken={hassAuthToken}
          connection={hassConnectionState}
          url={hassUrl}
          setAuth={setHassAuth}
          setConfig={setHassConfig}
          setConnection={setHassConnectionState}
          setEntities={setHassEntities}
          setUser={setUser}
        />
      ) : (
        ""
      )}
    </>
  );
}
