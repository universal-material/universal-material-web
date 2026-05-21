import { createContext } from '@lit/context';

export const scrollContainerContext =
  createContext<HTMLElement | undefined>(Symbol('scrollContainerContext'));
