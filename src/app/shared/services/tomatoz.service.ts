import { UtilityService } from './util.service';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject, Observable, merge } from 'rxjs';
import { Timer } from './../../timer';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TomatozService implements OnDestroy {
  //TODO: Move this to a settings service
  pomodoros;
  workTimer: Timer;
  shortBreakTimer: Timer;
  longBreakTimer: Timer;
  stateSubject = new BehaviorSubject<'work' | 'long' | 'short'>('work');
  // This allows us to clean up our observables a lot better
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private utilSrv: UtilityService
  ) {
    // Can this just be done via ngOnit?
    this.onWorkTimerComplete = this.onWorkTimerComplete.bind(this);
    this.onShortBreakTimerComplete = this.onShortBreakTimerComplete.bind(this);
    this.onLongBreakTimerComplete = this.onLongBreakTimerComplete.bind(this);
    // TODO: Get timer value from settings storage
    this.workTimer = new Timer(
      this.utilSrv.convertToMilliseconds({
        mins: 25
      })
    );
    this.shortBreakTimer = new Timer(
      this.utilSrv.convertToMilliseconds({
        mins: 5
      })
    );
    this.longBreakTimer = new Timer(
      this.utilSrv.convertToMilliseconds({
        mins: 30
      })
    );
    // Combine our timer observables
    const combindTimerObs$ = [
      this.workTimer,
      this.shortBreakTimer,
      this.longBreakTimer
    ]
      .map((timer) => {
        return merge(
          timer.getCompletedObservable(),
          timer.getInterruptedObservable()
        ).pipe(takeUntil(this.ngUnsubscribe))
      });
    // Subscribe to all the timers
    combindTimerObs$[0].subscribe(this.onWorkTimerComplete);
    combindTimerObs$[1].subscribe(this.onShortBreakTimerComplete);
    combindTimerObs$[2].subscribe(this.onLongBreakTimerComplete);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onWorkTimerComplete(): void {
    this.workTimer.reset();
    /**
     * Increment Tomatoz count overall
     * NOTE: We should have a concept of a session
     */
    this.incrementPomodoroCount();
    // if (this.pomodoros % 4 === 0) {
    //   // Session of 4 is done, lets do a long break
    //   this.stateSubject.next('long');
    // } else {
    //   this.stateSubject.next('short');
    // }
    // TODO: Notify the user about the work session completion
    // TODO: Determine if there should be a long or short break
  }

  onShortBreakTimerComplete(): void {
    // TODO: Notify user that the break is over
    this.shortBreakTimer.reset();
    this.stateSubject.next('work');
  }

  onLongBreakTimerComplete(): void {
    // TODO: Notify user that the break is over
    this.longBreakTimer.reset();
    this.stateSubject.next('work');
  }

  getState(): Observable<'work' | 'long' | 'short'> {
    return this.stateSubject.asObservable();
  }

  incrementPomodoroCount(): void {
    const pomodorosCount = this.pomodoros + 1;
    // TODO: Store the count
  }
  reloadSettings(): void {
    // TODO: Move this into a settings service with defaults
    this.workTimer.setCurrentDuration(
      this.utilSrv.convertToMilliseconds({ mins: 25 })
    );
    this.shortBreakTimer.setCurrentDuration(
      this.utilSrv.convertToMilliseconds({ mins: 5 })
    );
    this.longBreakTimer.setCurrentDuration(
      this.utilSrv.convertToMilliseconds({ mins: 30 })
    );
  }

}