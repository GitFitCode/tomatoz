import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromSessions from './sessions.reducer';
import * as fromApp from './../../../store/app.reducer';

export const featureKey = 'sessions';

export const selectSessions = createFeatureSelector<fromApp.AppState, fromSessions.State>(featureKey);