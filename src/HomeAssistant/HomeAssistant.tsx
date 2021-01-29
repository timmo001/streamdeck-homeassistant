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
  HassServices,
  HassUser,
  subscribeConfig,
  subscribeEntities,
  subscribeServices,
} from "home-assistant-js-websocket";

import { GenericObject, HassConnectionState } from "../Common/Types";

interface HomeAssistantProps {
  authToken: string;
  connection: HassConnectionState;
  url: string;
  setAuth: (auth: Auth) => void;
  setConfig: (config: HassConfig) => void;
  setConnection: (connected: HassConnectionState) => void;
  setEntities: (entities: HassEntities) => void;
  setServices: (services: HassServices) => void;
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
    data?: GenericObject,
    entities?: HassEntities
  ) => void;
}

let connection: Connection;

export async function handleChange(
  domain: string,
  state: string,
  data?: object
): Promise<boolean> {
  console.log("HomeAssistant - Call service:", domain, state, data);
  await callService(connection, domain, state, data).catch((err) => {
    console.error(
      "HomeAssistant - Error calling service:",
      domain,
      state,
      data,
      err
    );
  });
  console.log("HomeAssistant - Called service:", domain, state, data);
  return true;
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

  const updateServices = useCallback(
    (services: HassServices) => {
      props.setServices(services);
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
        subscribeServices(connection, updateServices);
        getUser(connection).then((user: HassUser) => {
          console.log(
            "HomeAssistant - Logged into Home Assistant as",
            user.name
          );
          props.setUser(user);
        });
        props.setConnection(0);
      })();
  }, [props, updateConfig, updateEntites, updateServices]);

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
