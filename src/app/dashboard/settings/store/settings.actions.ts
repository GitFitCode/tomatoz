import { createAction } from '@ngrx/store';
import { SettingsActions } from './../../../shared/types/setting.enum';
export const setWithDefaults = createAction(SettingsActions)