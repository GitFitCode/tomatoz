import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  controlBtnText: string = 'START';
  constructor() { }

  ngOnInit(): void {
  }

  getControlBtnStyle() {
    return 'control-btn ready'
  }

}
