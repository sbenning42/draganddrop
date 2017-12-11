import { Input, style } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Loggable } from './loggable';
import { Style } from '../models/style';

export abstract class Stylable extends Loggable {

  reactive: boolean;
  reactiveStyleSubscription: Subscription;

  style: Style = new Style();

  @Input() customStyle: Observable<Style>|Style;

  private initStyle() {
    this.reactive
      ? this.initReactiveStyle()
      : this.initStaticStyle();
  }
  private initStaticStyle() {
    this.style = new Style(<Style>this.customStyle);
  }
  private initReactiveStyle() {
    this.reactiveStyleSubscription = (<Observable<Style>>this.customStyle)
      .subscribe(nextCustomStyle => {
        this.style = new Style(nextCustomStyle);
      });
  }

  getStyle() {
    const source = new Style(this.style);
    source.proto = undefined;
    return source;
  }

  onInitStyle() {
    this.reactive = this.style instanceof Observable;
    this.initStyle();
  }

  onDestroyStyle() {
    if (this.reactive) {
      this.reactiveStyleSubscription.unsubscribe();
    }
  }

}
