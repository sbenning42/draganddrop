import { Component, OnInit, OnDestroy, Input, ViewChild, AfterContentInit, style } from '@angular/core';

import {
  DragAndDropService, Draggable
} from '../../services/drag-and-drop.service';
import { Stylable } from '../../interfaces/stylable';

@Component({
  selector: 'app-draggable',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.css']
})
export class DraggableComponent extends Stylable implements OnInit, AfterContentInit, OnDestroy {

  @Input() item: Draggable;

  @ViewChild('viewDraggable') viewDraggable: any;
  draggableId: number;

  Style: any = {};

  constructor(
    private dragAndDropService: DragAndDropService
  ) {
    super();
  }

  ngOnInit() {
    this.onInitStyle();
    this.Style = this.getStyle();
  }

  ngAfterContentInit() {
    this.item.ref = this.viewDraggable.nativeElement;
    this.item.dragstart$.subscribe(drag => this.item.dragstart(drag));
  }

  ngOnDestroy() {
    this.onDestroyStyle();
  }

  viewDragend($event) {
    this.Style = this.getStyle();
  }

  viewDragstart($event) {
    this.dragAndDropService.viewDragstart(this.item.id, $event);
    setTimeout(() => {
      this.Style.opacity = '0';
      this.Style.position = 'absolute';
    }, 10);
  }

  viewDrag($event) {
    this.dragAndDropService.viewDrag(this.item.id, $event);
  }

}
