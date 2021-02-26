import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducer';
import * as fromSettings from './settings.reducer';

export const featureKey = 'settings';

export const selectSettings = createFeatureSelector<fromApp.AppState, fromSettings.State>(featureKey);

export const selectWorkTimerDuration = createSelector(
  selectSettings,
  (settingsState: fromSettings.State) => settingsState.workTimer.duration
);

export const selectShortBreakTimerDuration = createSelector(
  selectSettings,
  (settingsState: fromSettings.State) => settingsState.shortBreakTimer.duration
);

export const selectLongBreakTimerDuration = createSelector(
  selectSettings,
  (settingsState: fromSettings.State) => settingsState.longBreakTimer.duration
);