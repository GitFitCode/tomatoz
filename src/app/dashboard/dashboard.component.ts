import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { TomatozService } from '../shared/services/tomatoz.service';
import { state, Timer } from '../timer';
import { Color, EventData, FlexboxLayout, fromObject, Page, Screen, Enums, SwipeGestureEventData, GestureEventData, GestureTypes, ListPicker, TouchGestureEventData } from '@nativescript/core';
import {
  Animation,
  AnimationDefinition,
  Pair // Pair: Defines a pair of values (horizontal and vertical) for translate and scale animations.
} from "@nativescript/core/ui/animation";
import { Store } from '@ngrx/store';

import { UIService } from '../shared/services/ui.service';
import { UtilityService } from '../shared/services/util.service';
import * as fromApp from './../store/app.reducer';
import * as fromSettingsActions from './settings/store/settings.actions';
import * as fromSettingsSelectors from './settings/store/settings.selectors';
import { AnimationCurve } from '@nativescript/core/ui/enums';


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

  @ViewChild('workTimerSelectionBtnWapper')
  workTimerSelectionBtnWapper: ElementRef;

  workTimerSelectionBtnWapperViewEl;

  @ViewChild('workTimerSelectionBtn')
  workTimerSelectionBtn: ElementRef;

  @ViewChild('workTimerPicker')
  workTimerPicker: ElementRef;

  tomatozTimerAnimation: Animation = null;
  tomatozTimerAnimationDefinition: AnimationDefinition;
  tomatozTimerViewEl;

  remainingTime$: Observable<number>;
  remainingTimeSub: Subscription;
  shortBreakRemainingTimeSub: Subscription;
  longBreakRemainingTimeSub: Subscription;

  remainingTime;
  shortBreakRemainingTime;
  longBreakRemainingTime;

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

  shortBreakTimerState$: Observable<state>;
  shortBreakTimerState;
  shortBreakTimerStateSub: Subscription;

  longBreakTimerState$: Observable<state>;
  longBreakTimerState;
  longBreakTimerStateSub: Subscription;

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

  public workTimeOptions: Array<number> = Array.from(
    { length: 60 }, (_, i) => i + 1
  );

  public shortTimeOptions: Array<number> = Array.from(
    { length: 60 }, (_, i) => i + 1
  );

  public longTimeOptions: Array<number> = Array.from(
    { length: 60 }, (_, i) => i + 1
  );


  selectedWorkTimeDuration: number = 25;
  selectedWorkTimeDurationIndex: number = 24;
  isShowingWorkTimerSelectionPicker: boolean = false;


  selectedShortTimeDuration: number = 5;
  selectedShortTimeDurationIndex: number = 4;
  isShowingShortTimerSelectionPicker: boolean = false;

  selectedLongTimeDuration: number = 30;
  selectedLongTimeDurationIndex: number = 29;
  isShowingLongTimerSelectionPicker: boolean = false;

  private workTimerDurationSub: Subscription;

  private shortBreakTimerDurationSub: Subscription;

  private longBreakTimerDurationSub:  Subscription;

  constructor(
    private tomatozSrv: TomatozService,
    private cdRef: ChangeDetectorRef,
    private uISrv: UIService,
    private utilSrv: UtilityService,
    private store: Store<fromApp.AppState>,
  ) {  }

  ngOnInit(): void {
    this.setActiveTimerType = this.setActiveTimerType.bind(this);
    this.workTimer = this.tomatozSrv.workTimer;
    this.shortBreakTimer = this.tomatozSrv.shortBreakTimer;
    this.longBreakTimer = this.tomatozSrv.longBreakTimer;

    this.workTimerState$ = this.workTimer.getStateObservable();
    this.shortBreakTimerState$ = this.shortBreakTimer.getStateObservable();
    this.longBreakTimerState$ = this.longBreakTimer.getStateObservable();
    this.setWorkTimerDurationSub();
    this.setShortBreakTimerDurationSub();
    this.setLongBreakTimerDurationSub();
    this.getWorkTimerStateSub();
    this.getShortBreakTimerStateSub();
    this.getLongBreakTimerStateSub();
    this.getCurrentTimerState();
    this.getTimeRemaining();
    this.getLongBreakRemainingTime();
    this.getShortBreakRemainingTime();
    this.tomatozSrv.reloadSettings();

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    this.activeTimerTypeSub = this.uISrv.activeTimerType
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((type) => {
        this.activeTimerType = type;
        this.cdRef.detectChanges();
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
        if (this.activeTimerType === 'work') {
          this.remainingTime = remainingTime;
          this.rotationValue = this.remainingTime / this.utilSrv.convertToMilliseconds({ mins: this.selectedWorkTimeDuration }) * 360;
          this.rotationFromStart = (360 - this.rotationValue);
        }
        // console.log(`rotationValue:: ${this.rotationValue}, remainingTime:: ${remainingTime}, rotationFromStart:: ${this.rotationFromStart}`);
      });
  }

  setWorkTimerDurationSub() {
    this.workTimerDurationSub = this.store.select(fromSettingsSelectors.selectWorkTimerDuration)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(wDuration => {
        this.selectedWorkTimeDuration = wDuration;
      });
  }

  setShortBreakTimerDurationSub() {
    this.shortBreakTimerDurationSub = this.store.select(fromSettingsSelectors.selectShortBreakTimerDuration)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(sDuration => {
        this.selectedShortTimeDuration = sDuration;
      });
  }

  setLongBreakTimerDurationSub() {
    this.longBreakTimerDurationSub = this.store.select(fromSettingsSelectors.selectLongBreakTimerDuration)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(lDuration => {
        this.selectedLongTimeDuration = lDuration;
      });
  }

  getShortBreakRemainingTime() {
    this.shortBreakRemainingTimeSub = this.shortBreakTimer
      .getTimeRemainingObservable()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((shortBreakRemainingTime) => {
        if (this.activeTimerType === 'short') {
          this.shortBreakRemainingTime = shortBreakRemainingTime;
          // console.log(`short remaining ${shortBreakRemainingTime}`)
          this.rotationValue = (this.shortBreakRemainingTime / this.utilSrv.convertToMilliseconds({ mins: this.selectedShortTimeDuration }) )* 360;
          this.rotationFromStart = (360 - this.rotationValue)
          console.log(`rotationFromStart ${this.rotationFromStart}`)
        }
      });
  }

  getLongBreakRemainingTime() {
    this.longBreakRemainingTimeSub = this.longBreakTimer
    .getTimeRemainingObservable()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((longBreakRemainingTime) => {
      if (this.activeTimerType === 'long') {
        this.longBreakRemainingTime = longBreakRemainingTime;
        this.rotationValue = this.longBreakRemainingTime / this.utilSrv.convertToMilliseconds({ mins: this.selectedLongTimeDuration })  * 360;
        this.rotationFromStart = (360 - this.rotationValue);
      }
    });
  }

  getWorkTimerStateSub() {
    this.workTimerStateSub = this.workTimerState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((workTimerState) => {
        this.workTimerState = workTimerState;
      });
  }

  getShortBreakTimerStateSub() {
    this.shortBreakTimerStateSub = this.shortBreakTimerState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(shortTimerState => {
        this.shortBreakTimerState = shortTimerState;
      });
  }

  getLongBreakTimerStateSub() {
    this.longBreakTimerStateSub = this.longBreakTimerState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(longTimerState => {
        this.longBreakTimerState = longTimerState;
      });
  }

  setActiveTimerType(state: 'work' | 'short' | 'long') {
    // console.log(`State: ${state}, activeBtn ${this.activeTimerType}`)
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

    this.tomatozTimerAnimationDefinition = {
      rotate: {
        x: 0,
        y: 0,
        z: this.rotationFromStart
      },
      duration: 1,
      target:  this.tomatozTimer.nativeElement,
      iterations: Number.POSITIVE_INFINITY,
      curve: AnimationCurve.linear
    };
    this.tomatozTimerAnimation = this.getTomatozSvgAnimation([
      this.tomatozTimerAnimationDefinition
    ]);
    if (this.shouldContinueAnimation()) {
      this.tomatozTimer.nativeElement.animate({
        ...this.tomatozTimerAnimationDefinition
      }).then(() => {
        setTimeout(() => {
          this.animateTomatozTimer();
        }, 0);
      });
    }
  }

  shouldContinueAnimation() {
    const continueWorkAnimation = (
      this.activeTimerType === 'work' &&
      (
        this.workTimerState === 'running' ||
        this.workTimerState === 'ready'
      )
    ) ? true : false;
    const continueShortTimerAnimation = (
      this.activeTimerType === 'short' &&
      (
        this.shortBreakTimerState === 'running' ||
        this.shortBreakTimerState === 'ready'
      )
    ) ? true : false;
    const continueLongTimerAnimation = (
      this.activeTimerType === 'long' &&
      (
        this.longBreakTimerState === 'running' ||
        this.longBreakTimerState === 'ready'
      )
    ) ? true : false;
      return (
        continueWorkAnimation ||
        continueShortTimerAnimation ||
        continueLongTimerAnimation
      );
  }

  getTomatozSvgAnimation(definitions: AnimationDefinition[]) {
    return new Animation([
      ...definitions
    ]);
  }

  onStateChange(currentState: 'work' | 'short' | 'long' ) {
    this.cdRef.detectChanges();
  }

  onStarted() {
    if (this.activeTimerType === 'work') {
      this.workTimer.start();
    } else if (this.activeTimerType === 'short') {
      this.shortBreakTimer.start();
    } else if (this.activeTimerType === 'long') {
      this.longBreakTimer.start();
    }
    this.animateTomatozTimer();
  }

  onPaused() {
    if (this.activeTimerType === 'work') {
      this.workTimer.paused();
    } else if (this.activeTimerType === 'short') {
      this.shortBreakTimer.paused();
    } else if (this.activeTimerType === 'long') {
      this.longBreakTimer.paused();
    }
  }

  onStopped() {
    if (this.activeTimerType === 'work') {
      this.workTimer.reset();
    } else if (this.activeTimerType === 'short') {
      this.shortBreakTimer.reset();
    } else if (this.activeTimerType === 'long') {
      this.longBreakTimer.reset();
    }
    this.animateTomatozTimer();
  }

  isPauseShown() {
    let isShown = false;
    if (this.activeTimerType === 'work') {
      if (this.workTimerState === 'running') {
        isShown = true;
      }
    } else if (this.activeTimerType === 'short') {
      if (this.shortBreakTimerState === 'running') {
        isShown = true;
      }
    } else if (this.activeTimerType === 'long') {
      if (this.longBreakTimerState === 'running') {
        isShown = true;
      }
    }
    return isShown;
  }

  isStartShown() {
    let isShown = false;
    if (this.activeTimerType === 'work') {
      if (this.workTimerState !== 'running') {
        isShown = true;
      }
    } else if (this.activeTimerType === 'short') {
      if (this.shortBreakTimerState !== 'running') {
        isShown = true;
      }
    } else if (this.activeTimerType === 'long') {
      if (this.longBreakTimerState !== 'running') {
        isShown = true;
      }
    }
    return isShown;
  }

  isControlBtnEnabled() {
    let isShown = false;
    if (this.activeTimerType === 'work') {
      if (this.workTimerState === 'ready') {
        isShown = true;
      }
    } else if (this.activeTimerType === 'short') {
      if (this.shortBreakTimerState === 'ready') {
        isShown = true;
      }
    } else if (this.activeTimerType === 'long') {
      if (this.longBreakTimerState === 'ready') {
        isShown = true;
      }
    }
    return isShown;
  }

  getStoppedControlBtnStyle() {
    return 'reset';
  }

  getTimerBtnStyle(type?, state?) {
    // console.log(`TYPE: ${type}, state: ${state}, timerType:: ${this.activeTimerType}` )
    // console.log(`TIMETYPE ${this.activeTimerType}`)
    if (type === 'work' && this.activeTimerType === 'work') {
      if (state === 'ready') {
        if (this.isShowingWorkTimerSelectionPicker) {
          return 'hidden';
        } else {
          return 'timer-type-work-ready';
        }
      } else {
        return 'timer-type-disabled';
      }
    } else if (type === 'short' && this.activeTimerType === 'short') {
      if (state === 'ready') {
        if (this.isShowingShortTimerSelectionPicker) {
          return 'hidden';
        } else {
          return 'timer-type-short-ready';
        }
      } else {
        return 'timer-type-disabled';
      }
    }  else if (type === 'long' && this.activeTimerType === 'long') {
      if (state === 'ready') {
        if (this.isShowingLongTimerSelectionPicker) {
          return 'hidden';
        } else {
          return 'timer-type-long-ready';
        }
      } else {
        return 'timer-type-disabled';
      }
    } else {
      return 'timer-type-selector-btn-unselected';
    }
  }

  tapWorkTimeSelectionBtn(type: 'work' | 'long' | 'short') {
    this.uISrv.setActiveTimerType(type);
  }

  tapShortTimerTimeSelectionBtn(type: 'work' | 'long' | 'short') {
    this.uISrv.setActiveTimerType(type);
  }

  tapLongTimerTimeSelectionBtn(type: 'work' | 'long' | 'short') {
    this.uISrv.setActiveTimerType(type);
  }

  onLongPressWorkTimerSelectionBtn(args: GestureEventData, item) {
    this.isShowingWorkTimerSelectionPicker = true;
    setTimeout(() => {
      this.isShowingWorkTimerSelectionPicker = false;
    }, 3000);
  }

  onLongPressShortTimerSelectionBtn(args: GestureEventData, item) {
    this.isShowingShortTimerSelectionPicker = true;
    setTimeout(() => {
      this.isShowingShortTimerSelectionPicker = false;
    }, 3000);
  }

  onLongPressLongTimerSelectionBtn(args: GestureEventData, item) {
    this.isShowingLongTimerSelectionPicker = true;
    setTimeout(() => {
      this.isShowingLongTimerSelectionPicker = false;
    }, 3000);
  }

  public onSelectedWorkTimeIndexChanged(args: EventData) {
    const picker = <ListPicker>args.object;
    //this.selectedWorkTimeDuration = this.workTimeOptions[picker.selectedIndex];
    this.selectedWorkTimeDurationIndex = picker.selectedIndex;
    this.store.dispatch(fromSettingsActions.setWorkTimerDuration({
      duration: this.workTimeOptions[picker.selectedIndex]
    }));

    this.tomatozSrv.workTimer.setCurrentDuration(
      this.utilSrv.convertToMilliseconds({ mins: this.workTimeOptions[picker.selectedIndex] })
    );
    this.tomatozSrv.workTimer.reset();
  }

  public onSelectedShortTimeIndexChanged(args: EventData) {
    const picker = <ListPicker>args.object;
    //this.selectedShortTimeDuration = this.shortTimeOptions[picker.selectedIndex];
    this.selectedShortTimeDurationIndex = picker.selectedIndex;
    this.store.dispatch(fromSettingsActions.setShortTimerDuration({
      duration: this.shortTimeOptions[picker.selectedIndex]
    }));
    this.tomatozSrv.shortBreakTimer.setCurrentDuration(
      this.utilSrv.convertToMilliseconds({ mins: this.shortTimeOptions[picker.selectedIndex] })
    );
    this.tomatozSrv.shortBreakTimer.reset();
  }

  public onSelectedLongTimeIndexChanged(args: EventData) {
    const picker = <ListPicker>args.object;
    //this.selectedLongTimeDuration = this.longTimeOptions[picker.selectedIndex];
    this.selectedLongTimeDurationIndex = picker.selectedIndex;
    this.store.dispatch(fromSettingsActions.setLongTimerDuration({
      duration: this.longTimeOptions[picker.selectedIndex]
    }));
    this.tomatozSrv.longBreakTimer.setCurrentDuration(
      this.utilSrv.convertToMilliseconds({ mins: this.longTimeOptions[picker.selectedIndex] })
    );
    this.tomatozSrv.longBreakTimer.reset();
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
      return '100%';
    }
  }

  onSwipeMainCard(args: SwipeGestureEventData) {
    const swipeDirection = args.direction;
    if (swipeDirection === 8 && !this.isShowingTimeDurationPickers()) {
      this.showMenuOptions = true;
    } else if (swipeDirection === 4) {
      this.showMenuOptions = false;
    }
  }

  isShowingTimeDurationPickers() {
    return (
      this.isShowingWorkTimerSelectionPicker ||
      this.isShowingLongTimerSelectionPicker ||
      this.isShowingShortTimerSelectionPicker
    )
  }

  onClickMenuIcon() {
    this.showMenuOptions = !this.showMenuOptions;
  }
}
