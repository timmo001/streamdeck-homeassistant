import { GlobalSettings, Settings } from "../../Types";
import createSDAction from "./action";
import createUseBaseSettings from "./baseSettings";

function createUseSettings(settingsEvent: string) {
  return (hooks: {
    useReducer: Function;
    useEffect: Function;
    useState: Function;
  }) => {
    const { useReducer, useEffect, useState } = hooks;
    const useSettings = createUseBaseSettings(useReducer, useEffect);
    const useSDAction = createSDAction({
      useState,
      useEffect,
    });
    return (initialSettings: any, streamDeck: any, connectedResult: any) => {
      const settingsResult = useSDAction(streamDeck, settingsEvent);

      const [settings, setSettings] = useSettings(
        initialSettings,
        connectedResult,
        settingsResult
      );

      return [
        settings,
        (streamDeck, newSettings: GlobalSettings | Settings) => {
          streamDeck.api.setSettings(streamDeck.uuid, newSettings);
          setSettings(newSettings);
        },
      ];
    };
  };
}

export const createUsePluginSettings = createUseSettings("didReceiveSettings");

export const createUseGlobalSettings = createUseSettings(
  "didReceiveGlobalSettings"
);
