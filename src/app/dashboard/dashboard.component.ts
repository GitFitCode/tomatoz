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
  shortBreakTimer: Timer;
  longBreakTimer: Timer;

  private ngUnsubscribe = new Subject<void>();
  // TODO: Handle this via an observable instead
  // TODO: Use an enum instead
  timerState: string;
  workTimerState$: Observable<state>;

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
  ];
  activeTimerType: 'work' | 'short' | 'long';
  constructor(
    private tomatozSrv: TomatozService,
    private cdRef: ChangeDetectorRef
  ) {  }

  ngOnInit(): void {
    this.setActiveTimerType = this.setActiveTimerType.bind(this);
    this.workTimer = this.tomatozSrv.workTimer;
    this.shortBreakTimer = this.tomatozSrv.shortBreakTimer;
    this.longBreakTimer = this.tomatozSrv.longBreakTimer;

    this.workTimerState$ = this.workTimer.getStateObservable();
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
        this.onStateChange(currentState);
        this.timerState = currentState;
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
        // console.log(`rotationValue:: ${this.rotationValue}, remainingTime:: ${remainingTime}, rotationFromStart:: ${this.rotationFromStart}`);
      });
  }

  setActiveTimerType(state: 'work' | 'short' | 'long') {
    switch(state) {
      case 'work':
        this.activeTimerType = 'work';
      case 'short':
        this.activeTimerType = 'short';
      case 'long':
        this.activeTimerType = 'long';
    }
    console.log(`State: ${state}, activeBtn ${this.activeTimerType}`)
    this.cdRef.detectChanges();
  }

  animateTomatozTimer() {
    const timerRef = this.tomatozTimer.nativeElement.animate({
      rotate: 360,
      duration: 1500000
    });
  }

  onStateChange(currentState: 'work' | 'short' | 'long' ) {
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

  getTimerBtnStyle(type?, state?) {
    // console.log(`TYPE: ${type}, state: ${state}`)
    if (type === 'work') {
      if (state === 'ready') {
        return 'timer-type-work-ready';
      } else {
        return 'timer-type-disabled';
      }
    } else {
      return 'timer-type-selector-btn-unselected';
    }
  }

  tapWorkTimeSelectionBtn() {
    this.setActiveTimerType('work');
    console.log('Clicked! inside work time selection');
  }

  tapShortTimerTimeSelectionBtn() {
    this.setActiveTimerType('short');
    console.log('Clicked! inside short time selection');
  }

  tapLongTimerTimeSelectionBtn() {
    this.setActiveTimerType('long');
    console.log('Clicked! inside long time selection');
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
