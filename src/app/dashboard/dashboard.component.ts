import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { TomatozService } from '../shared/services/tomatoz.service';
import { state, Timer } from '../timer';
import { AnimationDefinition, Color, EventData, FlexboxLayout, fromObject, Page, Screen, Enums, Animation } from '@nativescript/core';
import { UIService } from '../shared/services/ui.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dashboardSplash')
  dashboardSplash: ElementRef;
  @ViewChild('timerWrapper')
  timerWrapper: ElementRef;
  @ViewChild('tomatozTimer')
  tomatozTimer: ElementRef;
  tomatozTimerAnimation: Animation = null;
  tomatozTimerAnimationDefinition: AnimationDefinition;
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
  workTimerState;
  workTimerStateSub: Subscription;

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
  activeTimerType: 'work' | 'short' | 'long' = 'work';
  activeTimerType$: Observable<'work' | 'short' | 'long'>;
  activeTimerTypeSub: Subscription;
  constructor(
    private tomatozSrv: TomatozService,
    private cdRef: ChangeDetectorRef,
    private uISrv: UIService
  ) {  }

  ngOnInit(): void {
    this.setActiveTimerType = this.setActiveTimerType.bind(this);
    this.workTimer = this.tomatozSrv.workTimer;
    this.shortBreakTimer = this.tomatozSrv.shortBreakTimer;
    this.longBreakTimer = this.tomatozSrv.longBreakTimer;

    this.workTimerState$ = this.workTimer.getStateObservable();
    this.getWorkTimerStateSub();
    this.getCurrentTimerState();
    this.getTimeRemaining();
    this.tomatozSrv.reloadSettings();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.activeTimerTypeSub = this.uISrv.activeTimerType
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((type) => {
        this.activeTimerType = type;
        console.log('After init type', type)
    });
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

  getWorkTimerStateSub() {
    this.workTimerStateSub = this.workTimerState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((workTimerState) => {
        this.workTimerState = workTimerState;
      });
  }

  setActiveTimerType(state: 'work' | 'short' | 'long') {
        console.log(`State: ${state}, activeBtn ${this.activeTimerType}`)
    switch(state) {
      case 'work':
        this.activeTimerType = 'work';
      case 'short':
        this.activeTimerType = 'short';
      case 'long':
        this.activeTimerType = 'long';
    }
    this.cdRef.detectChanges();
  }

  animateTomatozTimer() {
    this.tomatozTimerViewEl = this.tomatozTimer.nativeElement;
    const continueAnimation = (
      this.workTimerState === 'running' ||
      this.workTimerState === 'ready'
    ) ? true : false;
    this.tomatozTimerAnimationDefinition = {
      rotate: this.rotationFromStart,
      duration: 60,
      target:  this.tomatozTimerViewEl
    };
    this.tomatozTimerAnimation = new Animation([
      this.tomatozTimerAnimationDefinition
    ]);
    if (continueAnimation) {
      this.tomatozTimerAnimation.play()
        .then(() => {
          setTimeout(() => {
            this.animateTomatozTimer();
          }, 0);
          // console.log(`rotationValue:: ${this.rotationValue}, remainingTime:: ${this.remainingTime}, rotationFromStart:: ${this.rotationFromStart}`);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
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
    this.animateTomatozTimer();

  }

  getStoppedControlBtnStyle() {
    return 'reset';
  }

  getTimerBtnStyle(type?, state?) {
    // console.log(`TYPE: ${type}, state: ${state}, timerType:: ${this.activeTimerType}` )
    console.log(`TIMETYPE ${this.activeTimerType}`)
    if (type === 'work' && this.activeTimerType === 'work') {
      if (state === 'ready') {
        return 'timer-type-work-ready';
      } else {
        return 'timer-type-disabled';
      }
    } else if (type === 'short' && this.activeTimerType === 'short') {
      if (state === 'ready') {
        return 'timer-type-short-ready';
      } else {
        return 'timer-type-disabled';
      }
    }  else if (type === 'long' && this.activeTimerType === 'long') {
      if (state === 'ready') {
        return 'timer-type-long-ready';
      } else {
        return 'timer-type-disabled';
      }
    } else {
      return 'timer-type-selector-btn-unselected';
    }
  }

  tapWorkTimeSelectionBtn(type: 'work' | 'long' | 'short') {
    this.uISrv.setActiveTimerType(type);
    console.log('Clicked! inside work time selection');
  }

  tapShortTimerTimeSelectionBtn(type: 'work' | 'long' | 'short') {
    this.uISrv.setActiveTimerType(type);
    console.log('Clicked! inside short time selection');
  }

  tapLongTimerTimeSelectionBtn(type: 'work' | 'long' | 'short') {
    this.uISrv.setActiveTimerType(type);
    console.log('Clicked! inside long time selection');
  }

  getDashboardBackgroundStyle(status: string) {
    if (status !== 'running') {
      if (this.activeTimerType === 'work') {
        return '#43FFE2';
      } else if (this.activeTimerType === 'short') {
        return '#3366FF'
      } else if (this.activeTimerType === 'long') {
        return '#3366FF'
      }
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
