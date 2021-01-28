import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  startControlBtnText: string = 'START';


  @Input() showResume = true;
  @Input() showPaused = true;
  @Input() showStop = true;

  @Output() started = new EventEmitter();
  @Output() paused = new EventEmitter();
  @Output() stopped = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  getControlBtnStyle() {
    return 'control-btn ready'
  }

  onStartedClicked() {
    this.started.emit()
  }
}
