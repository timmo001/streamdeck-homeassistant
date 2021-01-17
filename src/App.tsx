/* global $SD, lox */
import React, { useEffect, useState, useReducer, useMemo } from "react";
import { createUsePluginSettings, createUseSDAction } from "react-streamdeck";
import {
  Auth,
  HassConfig,
  HassEntities,
  HassUser,
} from "home-assistant-js-websocket";

import { HassConnectionState, SettingHassConnection } from "./Types";
import PropertyInspector from "./PropertyInspector";
import SetupConnection from "./SetupConnection";
import HomeAssistant, {
  handleChange as handleHassChange,
} from "./HomeAssistant/HomeAssistant";

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

export default function App() {
  const connectedResult = useSDAction("connected");

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
    // @ts-ignore
    createGetSettings($SD);
  }, []);

  useEffect(() => {
    if (hassConnectionState === 0 && hassUser && page === "setup-connection") {
      const connections: SettingHassConnection[] = settings.haConnections || [];
      connections.push({
        name: `${hassConfig.location_name} - ${hassUser.name}`,
        authToken: hassAuthToken,
        url: hassUrl,
      });
      setSettings({
        ...settings,
        hassConnections: connections,
        hassConnection: hassUrl,
      });
      setTimeout(() => {
        window.close();
      }, 1000);
    }
    // if (hassConnection === -2) {
    //   const haUrl = localStorage.getItem("hass_url");
    //   if (haUrl) {
    //     setHassUrl(haUrl);
    //     setHassConnection(-1);
    //   }
    // }
  }, [hassConnectionState, hassUser]);

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
      {page === "property-inspector" ? (
        <PropertyInspector />
      ) : page === "setup-connection" ? (
        <SetupConnection
          hassConnectionState={hassConnectionState}
          handleHassLogin={handleHassLogin}
        />
      ) : (
        ""
      )}
      {hassUrl && (
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
      )}
    </>
  );
}
