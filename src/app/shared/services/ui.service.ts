import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private _activeTimerType = new BehaviorSubject<'work' | 'short' | 'long'>('work');

  get activeTimerType() {
    return this._activeTimerType.asObservable();
  }

  setActiveTimerType(type: 'work' | 'short' | 'long') {
    this._activeTimerType.next(type);
  }


}