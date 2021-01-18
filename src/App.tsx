import React, { useEffect, useState, useReducer, useMemo } from "react";
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
import { loadLocalization, localizedStrings } from "./Common/Common";
import streamDeck from "./Common/StreamDeck";
import createUseSDAction from "./Common/Hooks/action";
import {
  createUseGlobalSettings,
  createUsePluginSettings,
} from "./Common/Hooks/settings";

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
  const connectedResult = useSDAction(streamDeck, "connected");

  const [globalSettings, setGlobalSettings] = usePluginGlobalSettings(
    streamDeck,
    {
      haConnections: [],
    },
    connectedResult
  );

  const [settings, setSettings] = usePluginSettings(
    streamDeck,
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
        window.location.href.lastIndexOf(".html")
      ),
    []
  );

  useEffect(() => {
    if (!localizedStrings || !localizedStrings["setupConnectionTitle"]) {
      var url = new URL(window.location.href);
      var language = url.searchParams.get("language");
      if (language) loadLocalization(language, "./");
    }
  }, []);

  useEffect(() => {
    if (
      page === "setup-connection" &&
      hassConnectionState === 0 &&
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
    streamDeck,
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
          streamDeck={streamDeck}
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
