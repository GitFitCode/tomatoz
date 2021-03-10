import { Action, createReducer, on } from "@ngrx/store";
import * as SessionsActions from './sessions.actions';

export interface TimerConfig {
  type: string,
  selected: boolean,
  projectId: number,
  status: string,
  remainingTime: number,
  duration: number,
  completed: boolean,
  interrupted: boolean,
  startDate: string,
  endDate: string,
};

export interface State {
  timers: TimerConfig[],
  history: TimerConfig[]
};

const initialState: State = {
  timers: [
    {
      type: 'work',
      selected: true,
      projectId: 1,
      status: 'ready',
      remainingTime: 15000000,
      duration: 15000000,
      completed: false,
      interrupted: false,
      startDate: '11/2/2021, 9:00',
      endDate: '11/2/2021, 9:00', // This isn't added until its part of the history array
    },
    {
      type: 'short',
      selected: false,
      projectId: 1,
      status: 'ready',
      remainingTime: 15000000,
      duration: 15000000,
      completed: false,
      interrupted: false,
      startDate: '11/2/2021, 9:00',
      endDate: '11/2/2021, 9:00', // This isn't added until its part of the history array
    },
    {
      type: 'long',
      selected: false,
      projectId: 1,
      status: 'ready',
      remainingTime: 15000000,
      duration: 15000000,
      completed: false,
      interrupted: false,
      startDate: '11/2/2021, 9:00',
      endDate: '11/2/2021, 9:00', // This isn't added until its part of the history array
    }
  ],
  history: []
};

const _sessionsReducer = createReducer(
  initialState,
  on(SessionsActions.setCurrentTimer, (state, { currentTimer }) => {
      // Look for existing config with same timer type
    const timerConfigs = [...state.timers];
    let updatedTimerConfigs = [...timerConfigs];

    if (timerConfigs?.length) {
      const matchedTimerIndex = findItemIndexByFilter(
        timerConfigs,
        { type: currentTimer.type }
      );
      if (matchedTimerIndex > -1) {
        updatedTimerConfigs = updateCurrentTimer(
          timerConfigs,
          matchedTimerIndex
        );
        // Update the selected prop
        updatedTimerConfigs[matchedTimerIndex] = {
          ...currentTimer,
          selected: true
        };
        return {
          ...state,
          timers: updatedTimerConfigs
        };
      } else {
        /**
         * TODO: Handle case when we couldnt find a timer
         * This should never be able to happen
         */
        console.error('Woah we had an issue finding a timer to select!')
      }
    } else {
      console.error('Woah we had an issue finding all of our timers!')

      return {
        ...state
      }
    }
  })
);

export function sessionsReducer(
  state = initialState,
  action: Action
) {
  return _sessionsReducer(state, action);
}

// Helper functions
export function updateCurrentTimer(
  timers: TimerConfig[],
  indexToSelect: number
) {
  const updatedTimerConfigs: any[] = [];
  timers.forEach((timer: TimerConfig, tIndex: number) => {
    if (tIndex !== indexToSelect) {
      timer.selected = false;
      updatedTimerConfigs.push(timer);
    } else {
      timer.selected = true;
      updatedTimerConfigs.push(timer);
    }
  });
  return updatedTimerConfigs;
}

export function findItemIndexByFilter(items: any[], filter: any) {
  return items.findIndex(item => {
    for (let [prop, value] of Object.entries(filter)) {
      if (item[prop] !== value) return false;
    }
    return true;
  });
}