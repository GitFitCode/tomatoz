import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Timer } from '@src/app/timer';

@Component({
  selector: 'app-digital-clock',
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.scss']
})
export class DigitalClockComponent implements OnInit {
  @Input() timer: Timer;
  time$: Observable<number>;

  constructor() { }

  ngOnInit(): void {
    this.time$ = this.timer.getTimeRemainingObservable();
  }

}
