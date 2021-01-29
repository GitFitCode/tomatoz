import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  startControlBtnText: string = 'START';
  pauseControlBtnText: string = 'PAUSE';

  @Input() showStart = false;
  @Input() showPause = false;

  @Output() started = new EventEmitter();
  @Output() paused = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * NOTE: Maybe this should be one method?
   * Just separting it to keep btns separated
   */

  getStartedControlBtnStyle() {
    return 'control-btn ready';
  }

  getPausedControlBtnStyle() {
    return 'control-btn paused';
  }

  onStartedClicked() {
    this.started.emit();
  }

  onPausedClicked() {
    this.paused.emit();
  }
}
