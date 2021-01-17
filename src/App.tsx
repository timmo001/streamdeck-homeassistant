/* global $SD, lox */
import React, { useEffect, useState, useReducer, useMemo } from "react";
import { createUsePluginSettings, createUseSDAction } from "react-streamdeck";
import {
  Auth,
  HassConfig,
  HassEntities,
  HassUser,
} from "home-assistant-js-websocket";

import { HassConnectionState, SettingHaConnection } from "./Types";
import PropertyInspector from "./PropertyInspector";
import SetupConnection from "./SetupConnection";
import HomeAssistant, {
  handleChange as handleHassChange,
} from "./HomeAssistant/HomeAssistant";

const useSDAction = createUseSDAction({
  useState,
  useEffect,
});

const usePluginSettings = createUsePluginSettings({
  useState,
  useEffect,
  useReducer,
});

export default function App() {
  const connectedResult = useSDAction("connected");

  const [settings, setSettings] = usePluginSettings(
    {
      haConnections: [],
      haConnection: "",
      textState: "",
    },
    connectedResult
  );

  const [hassAuth, setHassAuth] = useState<Auth>();
  const [hassAuthToken, setHassAuthToken] = useState<string>();
  const [hassConfig, setHassConfig] = useState<HassConfig>();
  const [hassConnectionState, setHassConnectionState] = useState<
    HassConnectionState
  >(-2);
  const [hassEntities, setHassEntities] = useState<HassEntities>();
  const [hassUser, setUser] = useState<HassUser>();
  const [hassUrl, setHassUrl] = useState<string>();

  const page: string = useMemo(
    () =>
      window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1,
        window.location.href.lastIndexOf(".")
      ),
    []
  );

  useEffect(() => {
    if (hassConnectionState === 0 && hassUser && page === "setup-connection") {
      const connections: SettingHaConnection[] = settings.haConnections || [];
      connections.push({
        name: `${hassConfig.location_name} - ${hassUser.name}`,
        authToken: hassAuthToken,
        url: hassUrl,
      });
      // $SD.api.common.setSettings({
      setSettings({
        ...settings,
        haConnections: connections,
        haConnection: hassUrl,
      });
    }
    // if (hassConnection === -2) {
    //   const haUrl = localStorage.getItem("hass_url");
    //   if (haUrl) {
    //     setHassUrl(haUrl);
    //     setHassConnection(-1);
    //   }
    // }
  }, [hassConnectionState, hassUser]);

  useEffect(() => {
    if (hassConnectionState === 0 && settings.haConnection === hassUrl)
      setTimeout(() => {
        window.close();
      }, 2000);
  }, [hassConnectionState, settings]);

  async function handleHassLogin(
    url: string,
    authToken: string
  ): Promise<void> {
    setHassUrl(url);
    setHassAuthToken(authToken);
    setHassConnectionState(-1);
  }

  // @ts-ignore
  console.log("App:", { connectedResult, $SD, settings });

  return (
    <>
      {page === "property-inspector" ? (
        <PropertyInspector settings={settings} setSettings={setSettings} />
      ) : page === "setup-connection" ? (
        <SetupConnection
          hassConnectionState={hassConnectionState}
          handleHassLogin={handleHassLogin}
        />
      ) : (
        ""
      )}
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
