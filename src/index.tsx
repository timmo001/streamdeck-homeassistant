import React from "react";
import ReactDOM from "react-dom";

import "react-streamdeck/dist/css/sdpi.css";
import "./index.css";

import PropertyInspector from "./PropertyInspector";
import SetupConnection from "./SetupConnection";

const page: string = window.location.href.substring(
  window.location.href.lastIndexOf("/") + 1,
  window.location.href.lastIndexOf(".")
);

ReactDOM.render(
  page === "property-inspector" ? <PropertyInspector /> : <SetupConnection />,
  document.getElementById("root")
);
