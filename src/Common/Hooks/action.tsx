function createUseSDAction(hooks: any) {
  const { useState, useEffect } = hooks;

  return function(streamDeck: any, actionName: string): any {
    // const [state, setState] = useState({});

    // useEffect(() => {
    //   const handler = (jsn: any) => {
    //     setState(jsn);
    //   };

    //   streamDeck.on(`${actionName}`, handler);

    //   return () => {
    //     streamDeck.off(`${actionName}`, handler);
    //   };
    // }, [actionName]);
    // return state;
  };
}

export default createUseSDAction;
