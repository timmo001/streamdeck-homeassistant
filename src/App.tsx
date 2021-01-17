/* global $SD, lox */
import React, { useEffect, useState, useReducer, useMemo } from "react";
import {
  createUseGlobalSettings,
  createUsePluginSettings,
  createUseSDAction,
} from "react-streamdeck";
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

const usePluginGlobalSettings = createUseGlobalSettings({
  useState,
  useEffect,
  useReducer,
});
const usePluginSettings = createUsePluginSettings({
  useState,
  useEffect,
  useReducer,
});

export default function App() {
  const connectedResult = useSDAction("connected");

  const [globalSettings, setGlobalSettings] = usePluginGlobalSettings(
    {
      haConnections: [],
    },
    connectedResult
  );

  const [settings, setSettings] = usePluginSettings(
    {
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
    if (
      hassConnectionState === 0 &&
      page === "setup-connection" &&
      hassUser &&
      hassUser &&
      hassConfig
    ) {
      const connection: SettingHaConnection = {
        name: `${hassConfig.location_name} - ${hassUser.name}`,
        authToken: hassAuthToken,
        url: hassUrl,
      };
      const event = new CustomEvent<SettingHaConnection>("saveConnection", {
        detail: connection,
      });
      window.opener.document.dispatchEvent(event);
      setTimeout(() => {
        window.close();
      }, 2000);
    }
    // if (hassConnection === -2) {
    //   const haUrl = localStorage.getItem("hass_url");
    //   if (haUrl) {
    //     setHassUrl(haUrl);
    //     setHassConnection(-1);
    //   }
    // }
  }, [hassAuthToken, hassConfig, hassConnectionState, hassUrl, hassUser, page]);

  async function handleHassLogin(
    url: string,
    authToken: string
  ): Promise<void> {
    setHassUrl(url);
    setHassAuthToken(authToken);
    setHassConnectionState(-1);
  }

  console.log("App:", {
    // @ts-ignore
    $SD,
    connectedResult,
    globalSettings,
    settings,
  });

  return (
    <>
      {page === "property-inspector" ? (
        <PropertyInspector
          globalSettings={globalSettings}
          settings={settings}
          setGlobalSettings={setGlobalSettings}
          setSettings={setSettings}
        />
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
