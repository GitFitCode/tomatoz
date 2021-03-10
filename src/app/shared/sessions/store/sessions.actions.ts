import { createAction, props } from '@ngrx/store';
import { TimerConfig } from './sessions.reducer';
import { ActionTypes } from './sessions.types';

export const setCurrentTimer = createAction(
  ActionTypes.SET_CURRENT_TIMER,
  props<{
    currentTimer: TimerConfig
  }>()
);
