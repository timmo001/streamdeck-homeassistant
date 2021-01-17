/* global $SD, lox */
import React, { useEffect, useState } from "react";
import { Auth, HassConfig, HassEntities } from "home-assistant-js-websocket";

import { ProgressState } from "./Types";
import { parseTokens } from "./HomeAssistant/Utils/Auth";
import PropertyInspector from "./PropertyInspector";
import SetupConnection from "./SetupConnection";
import HomeAssistant, {
  handleChange as handleHassChange,
} from "./HomeAssistant/HomeAssistant";

export default function App() {
  const [hassAuth, setHassAuth] = useState<Auth>();
  const [hassConfig, setHassConfig] = useState<HassConfig>();
  const [hassConnection, setHassConnection] = useState<ProgressState>(-2);
  const [hassEntities, setHassEntities] = useState<HassEntities>();
  const [hassUrl, setHassUrl] = useState<string>();

  useEffect(() => {
    if (window.location.search) parseTokens();
  }, []);

  useEffect(() => {
    if (hassConnection === -2) {
      const haUrl = localStorage.getItem("hass_url");
      if (haUrl) {
        setHassUrl(haUrl);
        setHassConnection(-1);
      }
    }
  }, [hassConnection]);

  async function handleHassLogin(url: string): Promise<void> {
    setHassUrl(url);
    setHassConnection(-1);
  }

  console.log({ hassAuth, hassConfig, hassConnection, hassEntities, hassUrl });

  const page: string = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1,
    window.location.href.lastIndexOf(".")
  );

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
