import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SwipeGestureEventData } from '@nativescript/core';

@Component({
  selector: 'hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.tns.scss']
})

export class HamburgerMenuComponent implements OnInit{

  @Input('status') status;
  @Input('showMenuOptions') showMenuOptions: boolean;

  @Output('swipedCard') swipedCard: EventEmitter<any> = new EventEmitter();
  @Output('onMenuIconTap') onMenuIconTap: EventEmitter<any> = new EventEmitter();

  ngOnInit() {

  }

  getSettingsBackdropStyle(height?: number) {
    if (this.status !== 'running') {
      return 'timer-ready settings-controls';
    } else {
      return 'settings-controls';
    }
  }

  onSwipeMainCard(args: SwipeGestureEventData) {
    this.swipedCard.emit(args);
  }

  onClickMenuIcon() {
    this.onMenuIconTap.emit();
  }
}