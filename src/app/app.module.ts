import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/**
 * rxjs import // Old style < 5.5
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/throttleTime';

import { DragAndDropService } from './services/drag-and-drop.service';

import { AppComponent } from './app.component';
import { DropZoneComponent } from './components/drop-zone/drop-zone.component';
import { DraggableComponent } from './components/draggable/draggable.component';
import { ItemManagerComponent } from './components/item-manager/item-manager.component';


@NgModule({
  declarations: [
    AppComponent,
    DropZoneComponent,
    DraggableComponent,
    ItemManagerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    DragAndDropService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
