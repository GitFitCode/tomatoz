import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TomatozService } from '../shared/services/tomatoz.service';
import { state, Timer } from '../timer';
import { Color, EventData, FlexboxLayout, fromObject, Page } from '@nativescript/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stopControlBtnText: string = 'Reset';
  workTimer: Timer;
  private ngUnsubscribe = new Subject<void>();
  // TODO: Handle this via an observable instead
  // TODO: Use an enum instead
  timerState: string;
  timerState$: Observable<state>;

  constructor(
    private tomatozSrv: TomatozService,
    private cdRef: ChangeDetectorRef
  ) {  }

  ngOnInit(): void {
    this.workTimer = this.tomatozSrv.workTimer;
    this.timerState$ = this.workTimer.getStateObservable();
    this.getCurrentTimerState();
    this.tomatozSrv.reloadSettings();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getCurrentTimerState() {
    this.tomatozSrv
      .getState()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currentState) => {
        console.log(`State: ${currentState}`)
        this.timerState = currentState;
        this.onStateChange();
        // TODO: Use this value to determine which timer is being used
      });
  }

  onStateChange() {
    // TODO: Use the method to help determine which UI to display
    this.cdRef.detectChanges();
  }

  onStarted() {
    this.workTimer.start();
  }

  onPaused() {
    this.workTimer.paused();
  }

  onStopped() {
    this.workTimer.reset();
  }

  getStoppedControlBtnStyle() {
    return 'reset';
  }

  getDashboardBackgroundStyle(status: string) {
    if (status !== 'running') {
      return '#43FFE2';
    } else {
      return '#FF4866';
    }
  }

  getSettingsBackdropStyle(status: string) {
    if (status !== 'running') {
      return 'timer-ready settings-controls';
    } else {
      return 'timer-running settings-controls';
    }
  }
}
