import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TomatozService } from '../shared/services/tomatoz.service';
import { state, Timer } from '../timer';
import { AnimationDefinition, Color, EventData, FlexboxLayout, fromObject, Page } from '@nativescript/core';
import * as enums from 'tns-core-modules/ui/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('dashboardSplash')
  dashboardSplash: ElementRef;
  @ViewChild('timerWrapper')
  timerWrapper: ElementRef;
  @ViewChild('tomatozTimer')
  tomatozTimer: ElementRef;
  tomatozTimerAnimation: Animation;

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

  defineAnimations() {
    const dashboardSplash = this.dashboardSplash.nativeElement;
    const timerWrapper = this.timerWrapper.nativeElement;
    const timerAnimationDefintionsBefore: AnimationDefinition[] = [];
    const commonAnimationProps = {
      duration: 500,
      curve: enums.AnimationCurve.easeInOut
    };
  }

  animateTomatozTimer() {
    const tomatozTimerViewEl = this.tomatozTimer.nativeElement;
    tomatozTimerViewEl.animate({
      rotate: 360,
      duration: 1500000
    });
  }

  onStateChange() {
    // TODO: Use the method to help determine which UI to display
    this.cdRef.detectChanges();
  }

  onStarted() {
    this.workTimer.start();
    this.animateTomatozTimer();
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
