import React from "react";
import ReactDOM from "react-dom";
import queryString from "query-string";

import "react-streamdeck/dist/css/sdpi.css";
import "./index.css";

import PropertyInspector from "./PropertyInspector";
import SetupConnection from "./SetupConnection";

const { fragment } = queryString.parse(window.location.search);

ReactDOM.render(
  fragment === "propertyInspector" ? (
    <PropertyInspector />
  ) : fragment === "setupConnection" ? (
    <SetupConnection />
  ) : (
    <div>Invalid Fragment!</div>
  ),
  document.getElementById("root")
);
