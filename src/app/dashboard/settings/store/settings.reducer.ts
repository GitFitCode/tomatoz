import { Action, createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.actions';


export interface State {
  workTimer: {
    enabled: boolean,
    duration: number,
  },
  shortBreakTimer: {
    enabled: boolean,
    duration: number,
  },
  longBreakTimer: {
    enabled: boolean,
    duration: number,
  },
}

const initialState: State = {
  workTimer: {
    enabled: true,
    duration: 25
  },
  shortBreakTimer: {
    enabled: true,
    duration: 5
  },
  longBreakTimer: {
    enabled: true,
    duration: 30,
  }
};


const _settingsReducer = createReducer(
  initialState,
  on(SettingsActions.setAllTimersDefaultDuration, (state) => {
    return{
      ...initialState,
    }
  }),
  on(SettingsActions.setWorkTimerDuration, (state, { duration }) => {
    return {
      ...state,
      workTimer: {
        ...state.workTimer,
        duration
      }
    }
  }),
  on(SettingsActions.setShortTimerDuration, (state, { duration }) => {
    return {
      ...state,
      shortBreakTimer: {
        ...state.shortBreakTimer,
        duration
      }
    }
  }),
  on(SettingsActions.setLongTimerDuration, (state, { duration }) => {
    return {
      ...state,
      longBreakTimer: {
        ...state.longBreakTimer,
        duration
      }
    }
  })
);

export function settingsReducer(
  state = initialState,
  action: Action
) {
  return _settingsReducer(state, action);
}

