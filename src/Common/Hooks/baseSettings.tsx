export default function(useReducer: Function, useEffect: Function) {
  return function(initialState: any, connectedResult: any, settings: any) {
    const reducerResult = useReducer(
      (currentState: any, newState: any) => {
        return { ...currentState, ...newState };
      },
      initialState,
      (initialState: any) => {
        return { ...initialState };
      }
    );

    const [state, setState] = reducerResult;
    console.info("Reducer State", state);

    useEffect(() => {
      setState(settings);
    }, [setState, settings]);

    useEffect(() => {
      if (connectedResult && connectedResult.actionInfo) {
        setState(connectedResult.actionInfo.payload.settings);
      }
    }, [setState, connectedResult]);

    return reducerResult;
  };
}
