import { UtilityService } from './util.service';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject, Observable, merge } from 'rxjs';
import { Timer } from './../../timer';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TomatozService implements OnDestroy {
  workTimer: Timer;
  stateSubject = new BehaviorSubject<'work'>('work');
  // This allows us to clean up our observables a lot better
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private utilSrv: UtilityService
  ) {
    // Can this just be done via ngOnit?
    this.onWorkTimerComplete = this.onWorkTimerComplete.bind(this);
    // TODO: Get timer value from settings
    this.workTimer = new Timer(
      this.utilSrv.convertToMilliseconds({
        mins: 25
      })
    );
    // Combine our timer observables
    const combindTimerObs$ = [this.workTimer]
      .map((timer) => {
        return merge(
          timer.getCompletedObservable(),
          timer.getInterruptedObservable()
        ).pipe(takeUntil(this.ngUnsubscribe))
      });
    // Subscribe to the work timer
    combindTimerObs$[0].subscribe(this.onWorkTimerComplete);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onWorkTimerComplete(): void {
    this.workTimer.reset();
    // TODO: Increment Tomatoz count
    // TODO: Determine if there should be a long or short break
  }

  getState(): Observable<'work'> {
    return this.stateSubject.asObservable();
  }

  reloadSettings(): void {
    // TODO: Move this into a settings service with defaults
    this.workTimer.setCurrentDuration(
      this.utilSrv.convertToMilliseconds({ mins: 25 })
    );
  }

}