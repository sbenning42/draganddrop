import { Component, OnInit, AfterContentInit, OnDestroy, Input, ViewChild, style } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Stylable } from '../../interfaces/stylable';
import {
  DragAndDropService,
  Dropzone, Draggable
} from '../../services/drag-and-drop.service';
import { Style } from '../../models/style';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.css']
})
export class DropZoneComponent extends Stylable implements OnInit, AfterContentInit, OnDestroy {

  @Input() customItemStyle: Style;
  @Input() initialItems: string[];

  @ViewChild('viewDropzone') viewDropzone: any;
  dropzone: Dropzone;

  Style: any = {};
  in = 1;

  constructor(
    private dragAndDropService: DragAndDropService
  ) {
    super();
  }

  ngOnInit() {
    this.onInitStyle();
    this.Style = this.getStyle();
  }

  ngOnDestroy() {
    this.onDestroyStyle();
  }

  ngAfterContentInit() {
    this.dropzone = this.dragAndDropService.registerDropZone(this.viewDropzone.nativeElement, this.initialItems);
    this.dropzone.drop$.subscribe((drop: {$event: any, draggable: Draggable}) => this.dropzone.drop(drop));
  }

  viewDrop($event) {
    this.dragAndDropService.viewDrop(this.dropzone.id, $event);
  }

  viewDragenter() {


  }

  viewDragleave() {

  }

}


