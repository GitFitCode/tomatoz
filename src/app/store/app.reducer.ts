import { ActionReducerMap } from '@ngrx/store';

import * as fromSettings from './../dashboard/settings/store/settings.reducer';

export interface AppState {
  settings: fromSettings.State
}

export const appReducer: ActionReducerMap<any> = {
  settings: fromSettings.settingsReducer,
};