import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { TomatozService } from '../shared/services/tomatoz.service';
import { Timer } from '../timer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  workTimer: Timer;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private tomatozSrv: TomatozService,
    private cdRef: ChangeDetectorRef
  ) {
    this.workTimer = this.tomatozSrv.workTimer;
  }

  ngOnInit(): void {
    this.tomatozSrv.reloadSettings();
    this.tomatozSrv
      .getState()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        console.log(`VALUE: ${val}`);
        this.cdRef.detectChanges();
        // TODO: Use this value to determine which timer is being used
      });
    this.workTimer.start();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
