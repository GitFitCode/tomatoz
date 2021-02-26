import { BehaviorSubject, EMPTY, interval, Observable, Subject } from 'rxjs';
import { endWith, finalize, map, scan, switchMap, takeUntil, takeWhile, timeInterval } from 'rxjs/operators';

export type state = 'running' | 'paused' | 'reset' | 'ready';

export class Timer {

  currentDuration: number;
  private currentInterval$: Observable<number>;
  private run$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private timer$: Observable<number>;
  private resetSubj = new Subject<void>();
  private stateSubj = new BehaviorSubject<state>('paused');
  private completedSubj = new Subject<void>();
  private interrupedSubj = new Subject<void>();
  private timeRemainingSubject: BehaviorSubject<number>;
  private ngUnsubscribe = new Subject<void>();

  constructor(currentDuration: number) {
    this.currentDuration = currentDuration;
    this.timeRemainingSubject = new BehaviorSubject(
      this.currentDuration
    );
    this.currentInterval$ = interval(100).pipe(
      timeInterval(),
      map(val => -val.interval)
    );
    this.timer$ = this.resetSubj.pipe(switchMap(() => this.generateTimer()));

    this.timer$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(timeRemaining => this.timeRemainingSubject.next(timeRemaining));
    this.reset();
  }

  start() {
    if (
      this.stateSubj.value === 'ready' ||
      this.stateSubj.value === 'paused'
    ) {
      this.run$.next(true);
      this.stateSubj.next('running');
    }
  }

  paused() {
    if (this.stateSubj.value === 'running') {
      this.run$.next(false);
      this.stateSubj.next('paused');
    }
  }

  /** NOTE: This can be thought of as the same as STOP. If its confusing
   * we can update the name so there is a single name
   */
  reset(): void {
    const timeState = this.stateSubj.value;
    if (
      timeState !== 'reset'
      //timeState !== 'ready'
    ) {
      this.stateSubj.next('reset');
      this.run$.next(false);
      this.resetSubj.next();
      this.stateSubj.next('ready');
    }
  }

  setCurrentDuration(currentDuration: number): void {
    this.currentDuration = currentDuration;
    if (this.stateSubj.value === 'ready') {
      this.timeRemainingSubject.next(this.currentDuration);
    }
  }

  getCompletedObservable(): Observable<void> {
    return this.completedSubj.asObservable();
  }

  getInterruptedObservable(): Observable<void> {
    return this.interrupedSubj.asObservable();
  }

  getTimeRemainingObservable(): Observable<number> {
    return this.timeRemainingSubject.asObservable();
  }

  getStateObservable(): Observable<state> {
    return this.stateSubj.asObservable();
  }

  cleanup() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private generateTimer() {
    return this.run$.asObservable().pipe(
      switchMap(run => run ? this.currentInterval$ : EMPTY),
      scan((acc, curr) => (curr ? curr + acc : acc), this.currentDuration),
      takeWhile(timeRemaining => timeRemaining >= 0, true),
      endWith(0),
      finalize(() => {
        if (this.stateSubj.value === 'running') {
          this.completedSubj.next();
        } else {
          this.interrupedSubj.next();
        }
        this.timeRemainingSubject.next(this.currentDuration);
      })
    );
  }
}