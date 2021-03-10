import { ActionReducerMap } from '@ngrx/store';

import * as fromSettings from './../dashboard/settings/store/settings.reducer';
import * as fromSessions from './../shared/sessions/store/sessions.reducer';

export interface AppState {
  settings: fromSettings.State,
  sessions: fromSessions.State
}

export const appReducer: ActionReducerMap<any> = {
  settings: fromSettings.settingsReducer,
  sessions: fromSessions.sessionsReducer
};