import React from "react";
import ReactDOM from "react-dom";

import "react-streamdeck/dist/css/sdpi.css";
import "./index.css";

import PropertyInspector from "./PropertyInspector";
import SetupConnection from "./SetupConnection";

const pi = document.getElementById("property-inspector");
const cs = document.getElementById("setup-connection");

const component = pi ? <PropertyInspector /> : cs ? <SetupConnection /> : null;

ReactDOM.render(component, pi || cs);
