import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CountdownEvent } from '../types';
import { generateId } from '../utils/timeCalculations';
import { MAX_EVENTS } from '../utils/constants';

interface EventsState {
  events: CountdownEvent[];
  addEvent: (name: string, targetDate: number) => void;
  updateEvent: (id: string, name: string, targetDate: number) => void;
  deleteEvent: (id: string) => void;
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set) => ({
      events: [],

      addEvent: (name, targetDate) =>
        set((state) => {
          if (state.events.length >= MAX_EVENTS) {
            return state;
          }

          if (targetDate <= Date.now()) {
            return state;
          }

          const newEvent: CountdownEvent = {
            id: generateId(),
            name,
            targetDate,
            createdAt: Date.now(),
          };

          return { events: [...state.events, newEvent] };
        }),

      updateEvent: (id, name, targetDate) =>
        set((state) => {
          if (targetDate <= Date.now()) {
            return state;
          }

          return {
            events: state.events.map((event) =>
              event.id === id
                ? { ...event, name, targetDate }
                : event
            ),
          };
        }),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
    }),
    {
      name: 'countdown-events',
    }
  )
);
