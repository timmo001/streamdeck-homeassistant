/** ELGEvents
 * Publish/Subscribe pattern to quickly signal events to
 * the plugin, property inspector and data.
 */
const ELGEvents = {
  eventEmitter: () => {
    const eventList = new Map();

    const on = (name: any, fn: any) => {
      if (!eventList.has(name)) eventList.set(name, ELGEvents.pubSub());

      return eventList.get(name).sub(fn);
    };

    const has = (name: any) => eventList.has(name);

    const emit = (name: any, data: any) =>
      eventList.has(name) && eventList.get(name).pub(data);

    return Object.freeze({ on, has, emit, eventList });
  },

  pubSub: () => {
    const subscribers = new Set();

    const sub = (fn: unknown) => {
      subscribers.add(fn);
      return () => {
        subscribers.delete(fn);
      };
    };

    const pub = (data: any) =>
      subscribers.forEach((fn: (data: any) => any) => fn(data));
    return Object.freeze({ pub, sub });
  },
};

export default ELGEvents;
