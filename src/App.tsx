/* global $SD, lox */
import React, { useEffect, useState, useReducer, useMemo } from "react";
import { createUsePluginSettings, createUseSDAction } from "react-streamdeck";
import { Auth, HassConfig, HassEntities } from "home-assistant-js-websocket";

import { ProgressState } from "./Types";
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

  const [authToken, setAuthToken] = useState<string>("");
  const [hassAuth, setHassAuth] = useState<Auth>();
  const [hassConfig, setHassConfig] = useState<HassConfig>();
  const [hassConnection, setHassConnection] = useState<ProgressState>(-2);
  const [hassEntities, setHassEntities] = useState<HassEntities>();
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
    if (hassConnection === 1 && page === "setup-connection") {
      setSettings({
        ...settings,
        hassConnections: [
          ...settings.hassConnections,
          {
            name: `${hassConfig.location_name} - ${hassConfig.version} - ${hassUrl}`,
            url: hassUrl,
          },
        ],
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
  }, [hassConnection]);

  async function handleHassLogin(url: string): Promise<void> {
    setHassUrl(url);
    setHassConnection(-1);
  }

  return (
    <>
      {page === "property-inspector" ? (
        <PropertyInspector />
      ) : page === "setup-connection" ? (
        <SetupConnection handleHassLogin={handleHassLogin} />
      ) : (
        ""
      )}
      {hassUrl && (
        <HomeAssistant
          connection={hassConnection}
          authToken={authToken}
          url={hassUrl}
          setAuth={setHassAuth}
          setConfig={setHassConfig}
          setConnection={setHassConnection}
          setEntities={setHassEntities}
        />
      )}
    </>
  );
}
