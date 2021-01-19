import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Auth,
  HassConfig,
  HassEntities,
  HassUser,
} from "home-assistant-js-websocket";

import {
  GlobalSettings,
  HassConnectionState,
  SettingHaConnection,
  Settings,
} from "../Common/Types";
import {
  EventsReceived,
  StreamDeckPlugin,
  StreamDeckPluginInstance,
} from "../Common/StreamDeck";
import HomeAssistant, {
  handleChange as handleHassChange,
} from "../HomeAssistant/HomeAssistant";

const sdPlugin = new StreamDeckPlugin();

export default function Code(): ReactElement {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>();
  const [settings, setSettings] = useState<Settings>();
  const [sdInstance, setSdInstance] = useState<StreamDeckPluginInstance>();

  const [, setHassAuth] = useState<Auth>();
  const [hassConfig, setHassConfig] = useState<HassConfig>();
  const [hassConnection, setHassConnection] = useState<SettingHaConnection>();
  const [
    hassConnectionState,
    setHassConnectionState,
  ] = useState<HassConnectionState>(-2);
  const [hassEntities, setHassEntities] = useState<HassEntities>();
  const [hassUser, setUser] = useState<HassUser>();

  useEffect(() => {
    sdPlugin.on(EventsReceived.INIT, (event) => {
      // Each init gives one instance (instance = 1 button on the Stream Deck)
      // Instances having an `action` which you can check when you have multiple actions!
      // i.e. if (instance.action === 'org.examle.firstaction') { }
      const instance = event.detail.instance;
      setSdInstance(instance);
      // We want also to listen for changed settings from the property inspector
      instance.on(EventsReceived.DID_RECEIVE_GLOBAL_SETTINGS, () =>
        setGlobalSettings(instance.globalSettings)
      );
      instance.on(EventsReceived.DID_RECEIVE_SETTINGS, () =>
        setSettings(instance.settings)
      );
    });
  }, []);

  useEffect(() => {
    console.log({ hassConnectionState, globalSettings, settings });
    if (
      hassConnectionState === -2 &&
      globalSettings &&
      globalSettings.haConnections &&
      settings &&
      settings.haConnection
    ) {
      const connection: SettingHaConnection = globalSettings.haConnections.find(
        (connection: SettingHaConnection) =>
          connection.url === settings.haConnection
      );
      if (connection) {
        setHassConnection(connection);
        setHassConnectionState(-1);
      }
    }
  }, [globalSettings, settings, hassConnectionState]);

  useEffect(() => {
    if (sdInstance) {
      // // Then we setting the title of the instance to the counter - else 1
      // instance.setTitle(+instance.settings.counter || 1);
      // Now we're going to listen for keyUp, so whenever we press the button and release this is called
      sdInstance.on(EventsReceived.KEY_UP, () => {
        console.log({ globalSettings, settings, hassEntities });
        if (globalSettings && settings && hassEntities) {
          // // Lets get the current value and count + 1
          // var count = (+instance.settings.counter || 1) + 1;
          // // Now lets set the title of our instance to the number
          // instance.setTitle(count);
          // // And then lets save the new number
          // instance.setSetting("counter", count);
          console.log(hassEntities[sdInstance.settings.haEntity]);
          // So when property inspector changes the counter value set the title to it
          // instance.setTitle(hassEntities[instance.settings.haEntity].state);
        }
      });
    }
  }, [globalSettings, settings, sdInstance, hassEntities]);

  console.log({ sdPlugin });

  return (
    <>
      {hassConnection ? (
        <HomeAssistant
          authToken={hassConnection.authToken}
          connection={hassConnectionState}
          url={hassConnection.url}
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
