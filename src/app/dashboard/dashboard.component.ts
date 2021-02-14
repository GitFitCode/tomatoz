import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { TomatozService } from '../shared/services/tomatoz.service';
import { state, Timer } from '../timer';
import { AnimationDefinition, Color, EventData, FlexboxLayout, fromObject, Page, Screen, Enums, Animation } from '@nativescript/core';

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
  tomatozTimerAnimation: Animation = null;
  tomatozTimerViewEl;
  remainingTime$: Observable<number>;
  remainingTimeSub: Subscription;
  remainingTime;
  rotationValue;
  rotationFromStart;

  stopControlBtnText: string = 'Reset';
  workTimer: Timer;
  private ngUnsubscribe = new Subject<void>();
  // TODO: Handle this via an observable instead
  // TODO: Use an enum instead
  timerState: string;
  timerState$: Observable<state>;

  showMenuOptions: boolean = false;
  menuOptions: any[] = [
    {
      label: 'TODAY'
    },
    {
      label: 'ACTIVITY'
    },
    {
      label: 'RANK'
    },
    {
      label: 'PROJECTS'
    },
    {
      label: 'SETTINGS'
    },
  ]
  constructor(
    private tomatozSrv: TomatozService,
    private cdRef: ChangeDetectorRef
  ) {  }

  ngOnInit(): void {
    this.workTimer = this.tomatozSrv.workTimer;
    this.timerState$ = this.workTimer.getStateObservable();
    this.getCurrentTimerState();
    this.getTimeRemaining();
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

  getTimeRemaining() {
    this.remainingTimeSub = this.workTimer
      .getTimeRemainingObservable()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((remainingTime: any) => {
        this.remainingTime = remainingTime;
        this.rotationValue = this.remainingTime / 1500000 * 360;
        this.rotationFromStart = (360 - this.rotationValue);
        console.log(`rotationValue:: ${this.rotationValue}, remainingTime:: ${remainingTime}, rotationFromStart:: ${this.rotationFromStart}`);
      });
  }

  animateTomatozTimer() {
    const timerRef = this.tomatozTimer.nativeElement.animate({
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

  getMenuListItemStyle(status: string) {
    if (status !== 'running') {
      return '#101426';
    } else {
      return '#FFFFFF';
    }
  }

  getSettingsBackdropStyle(status: string, height?: number) {
    if (status !== 'running') {
      return 'timer-ready settings-controls showing-menu-list';
    } else {
      return 'timer-running settings-controls showing-menu-list';
    }
  }

  calcDashboardSplashHeight(): any {
    let calcVal = 76;
    if (this.showMenuOptions) {
      calcVal = Screen.mainScreen.heightDIPs - 166;
    }
    return calcVal;
  }

  calcTimerWrapper() {
    if (this.showMenuOptions) {
      return '117';
    } else {
      return '100%'
    }
  }

  onClickMenuIcon() {
    this.showMenuOptions = !this.showMenuOptions;
  }
}
