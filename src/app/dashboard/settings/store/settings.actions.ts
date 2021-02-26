import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './settings.types';

export const setAllTimersDefaultDuration = createAction(
  ActionTypes.SET_ALL_TIMERS_DEFAULT_DURATION
);

export const setWorkTimerDuration = createAction(
  ActionTypes.SET_WORK_TIMER_DURATION,
  props<{
    duration: number
  }>()
);

export const setShortTimerDuration = createAction(
  ActionTypes.SET_SHORT_TIMER_DURATION,
  props<{
    duration: number
  }>()
);

export const setLongTimerDuration = createAction(
  ActionTypes.SET_LONG_TIMER_DURATION,
  props<{
    duration: number
  }>()
);