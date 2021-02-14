import { Directive, ElementRef, HostListener } from '@angular/core';
import { TouchGestureEventData } from '@nativescript/core';
import { AnimationCurve } from '@nativescript/core/ui/enums';

@Directive({
  selector: '[appTouchScale]'
})
export class TouchScaleDirective {
  private element: ElementRef;
  private currentAnimation;
  constructor(
    el: ElementRef
  ) {
    this.element = el;
  }

  @HostListener('touch', ['$event'])
    onTouch(
      args: TouchGestureEventData
    ): void {
      if (args.action === 'down') {
        // finger first touches the screen
        this.animatePressed();
      } else if (args.action === 'up') {
        // finger is lifted off the screen
        this.animateReleased();
      }
    }

  private animatePressed(): void{
    if (this.currentAnimation) {
      this.currentAnimation.cancel();
    }
    this.currentAnimation = this.element.nativeElement.animate({
      scale: {
        x: 0.95,
        y: 0.95
      },
      opacity: 0.6,
      curve: AnimationCurve.easeIn,
      duration: 150
    })
      .then(res => console.log(`RES :: ${res}`))
      .catch(e => {console.log(`Error has occured with touch animation [animatePressed] ${e}`)})
  }

  private animateReleased(): void {
    if (this.currentAnimation) {
      this.currentAnimation.cancel();
    }
    this.currentAnimation = this.element.nativeElement.animate({
      scale: {
        x: 1,
        y: 1
      },
      opacity: 1,
      curve: AnimationCurve.easeIn,
      duration: 150
    }).catch(e => {console.log(`Error has occured with touch animation [animateReleased] ${e}`)})
  }

}
