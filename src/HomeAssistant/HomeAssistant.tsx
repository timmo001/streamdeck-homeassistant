import { useEffect, useCallback } from "react";
import {
  Auth,
  callService,
  Connection,
  createConnection,
  createLongLivedTokenAuth,
  getUser,
  HassConfig,
  HassEntities,
  HassUser,
  subscribeConfig,
  subscribeEntities,
} from "home-assistant-js-websocket";

import { HassConnectionState } from "../Common/Types";

interface HomeAssistantProps {
  authToken: string;
  connection: HassConnectionState;
  url: string;
  setAuth: (auth: Auth) => void;
  setConfig: (config: HassConfig) => void;
  setConnection: (connected: HassConnectionState) => void;
  setEntities: (entities: HassEntities) => void;
  setUser: (user: HassUser) => void;
}

export interface HomeAssistantEntityProps {
  hassAuth: Auth;
  hassConfig: HassConfig;
  hassEntities: HassEntities;
}

export interface HomeAssistantChangeProps {
  hassAuth?: Auth;
  hassConfig?: HassConfig;
  hassConnection?: HassConnectionState;
  hassEntities?: HassEntities;
  handleHassChange?: (
    domain: string,
    state: string | boolean,
    data?: { [key: string]: any },
    entities?: HassEntities
  ) => void;
}

let connection: Connection;

export function handleChange(
  domain: string,
  state: string,
  data?: { [key: string]: any },
  entities?: HassEntities
): void {
  if (domain === "group" && entities && data) {
    entities[data.entity_id].attributes.entity_id.map((entity: string) =>
      callService(
        connection,
        entity.split(".")[0],
        state ? "turn_on" : "turn_off",
        { entity_id: entity }
      ).then(
        () => {
          console.log(
            "HomeAssistant - Group called service:",
            domain,
            state,
            data
          );
        },
        (err) => {
          console.error(
            "HomeAssistant - Error calling group service:",
            domain,
            state,
            data,
            err
          );
        }
      )
    );
  } else
    callService(connection, domain, state, data).then(
      () => {
        console.log("HomeAssistant - Called service:", domain, state, data);
      },
      (err) => {
        console.error(
          "HomeAssistant - Error calling service:",
          domain,
          state,
          data,
          err
        );
      }
    );
}

function HomeAssistant(props: HomeAssistantProps): any {
  async function eventHandler(): Promise<void> {
    console.log(
      "HomeAssistant - Home Assistant connection has been established again."
    );
  }

  const updateConfig = useCallback(
    (config: HassConfig) => {
      props.setConfig(config);
    },
    [props]
  );

  const updateEntites = useCallback(
    (entities: HassEntities) => {
      props.setEntities(entities);
    },
    [props]
  );

  const connectToHASS = useCallback(() => {
    if (!connection)
      (async (): Promise<void> => {
        const auth = createLongLivedTokenAuth(props.url, props.authToken);
        try {
          connection = await createConnection({ auth });
        } catch (err) {
          console.error(
            "HomeAssistant - Connection error:",
            err,
            err === 1
              ? "Connection Error"
              : err === 2
              ? "Invalid Authentication"
              : err === 3
              ? "Connection Lost"
              : err === 4
              ? "Host Required"
              : err === 5
              ? "Invalid HTTPS to HTTP (HTTPS URL Required)"
              : "Unknown Error"
          );
          props.setConnection(err);
          return;
        }
        connection.removeEventListener("ready", eventHandler);
        connection.addEventListener("ready", eventHandler);
        props.setAuth(auth);
        subscribeConfig(connection, updateConfig);
        subscribeEntities(connection, updateEntites);
        getUser(connection).then((user: HassUser) => {
          console.log(
            "HomeAssistant - Logged into Home Assistant as",
            user.name
          );
          props.setUser(user);
        });
        props.setConnection(0);
      })();
  }, [props, updateConfig, updateEntites]);

  useEffect(() => {
    if (
      connection ||
      !props.url ||
      !props.authToken ||
      props.connection === -2 ||
      props.connection > 0
    )
      return;
    connectToHASS();
  }, [connectToHASS, props.authToken, props.connection, props.url]);

  return null;
}

export default HomeAssistant;
