import React, { useCallback, useEffect, useMemo } from "react";

import { SettingHaConnection } from "../Common/Types";
import { StreamDeckPropertyInspector } from "../Common/StreamDeck";
import PropertyView from "./PropertyView";

const sdPropertyInspector = new StreamDeckPropertyInspector();

export default function PropertyInspector() {
  const saveConnection = useCallback(
    (inEvent: CustomEvent<SettingHaConnection>) => {
      const connection: SettingHaConnection = inEvent.detail;
      console.log("PropertyInspector Event - saveConnection:", {
        connection,
        sdPropertyInspector,
      });
      const connections: SettingHaConnection[] =
        sdPropertyInspector.globalSettings?.haConnections || [];
      connections.push(connection);
      sdPropertyInspector.currentInstance.setGlobalSetting(
        "haConnections",
        connections
      );
      sdPropertyInspector.currentInstance.setSetting(
        "haConnection",
        connection.url
      );
      sdPropertyInspector.globalSettings.haConnections = connections;
      sdPropertyInspector.settings.haConnection = connection.url;
    },
    []
  );

  useEffect(() => {
    document.addEventListener("saveConnection", saveConnection);
  }, [saveConnection]);

  return <PropertyView sdPropertyInspector={sdPropertyInspector} />;
}
