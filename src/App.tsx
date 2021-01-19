import React, { useMemo, ReactElement } from "react";

// import Code from "./Code/Code";
import PropertyInspector from "./PropertyInspector/PropertyInspector";
import SetupConnection from "./SetupConnection";

export default function App(): ReactElement {
  const page: string = useMemo(
    () =>
      window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1,
        window.location.href.lastIndexOf(".html")
      ),
    []
  );

  return (
    <>
      {page === "property-inspector" ? (
        <PropertyInspector />
      ) : page === "code" ? (
        // <Code />
        <></>
      ) : page === "setup-connection" ? (
        <SetupConnection />
      ) : (
        ""
      )}
    </>
  );
}
