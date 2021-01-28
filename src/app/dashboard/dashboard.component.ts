import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { TomatozService } from '../shared/services/tomatoz.service';
import { state, Timer } from '../timer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  workTimer: Timer;
  private ngUnsubscribe = new Subject<void>();

  // TODO: Handle this via an observable instead
  // TODO: Use an enum instead
  timerState: string;

  constructor(
    private tomatozSrv: TomatozService,
    private cdRef: ChangeDetectorRef
  ) {  }

  ngOnInit(): void {
    this.workTimer = this.tomatozSrv.workTimer;
    this.tomatozSrv.reloadSettings();
    this.tomatozSrv
      .getState()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currentState) => {
        this.timerState = currentState;
        this.onStateChange();
        // TODO: Use this value to determine which timer is being used
      });
  }

  onStateChange() {
    // TODO: Use the method to help determine which UI to display
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onStarted() {
    this.workTimer.start();
  }

}
