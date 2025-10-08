export const redispatchEvent = (element: Element, event: Event, newType: string | null = null) => {
  // For bubbling events in SSR light DOM (or composed), stop their propagation
  // and dispatch the copy.
  if (event.bubbles && (!element.shadowRoot || event.composed)) {
    event.stopPropagation();
  }

  const copy: Event = Reflect.construct(event.constructor, [newType ?? event.type, event]);
  const dispatched = element.dispatchEvent(copy);

  if (!dispatched) {
    event.preventDefault();
  }

  return dispatched;
};
