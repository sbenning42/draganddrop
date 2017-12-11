import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class DragAndDropService {

  private dropzones: Dropzone[] = [];
  private _dropzones$: BehaviorSubject<Dropzone[]> = new BehaviorSubject(this.dropzones);
  dropzones$: Observable<Dropzone[]> = this._dropzones$.asObservable();

  private draggables: Draggable[] = [];
  private _draggables$: BehaviorSubject<Draggable[]> = new BehaviorSubject(this.draggables);
  draggables$: Observable<Draggable[]> = this._draggables$.asObservable();

  private pendingDraggable: Draggable;
  private _pendingDraggable$: BehaviorSubject<Draggable> = new BehaviorSubject(this.pendingDraggable);

  pendingDraggable$: Observable<Draggable> = this._pendingDraggable$.asObservable();

  drops$: Observable<{$event: any, draggable: Draggable}>;
  dragstarts$: Observable<{$event: any, draggable: Draggable}>;
  drags$: Observable<{$event: any, draggable: Draggable}>;

  dragAndDrop$: Observable<any>;

  serverSubscription: Subscription;

  constructor() {

    this.dragstarts$ = this.draggables$
      .switchMap(draggables => Observable.merge(...draggables.map(draggable => draggable.dragstart$)));
    this.drags$ = this.draggables$
      .switchMap(draggables => Observable.merge(...draggables.map(draggable => draggable.drag$)));
    this.drops$ = this.dropzones$
      .switchMap(dropzones => Observable.merge(...dropzones.map(dropzone => dropzone.drop$)));

    this.dragAndDrop$ = this.dragstarts$
      .do(dragstart => {
        console.log('start');
        this.pendingDraggable = dragstart.draggable;
        this._pendingDraggable$.next(this.pendingDraggable);
      }).switchMap(() => this.drags$)
      .do(drag => {
        console.log('drag');
        this.dropzones.forEach(dropzone => dropzone.stopPreview());
        const futurDropzone = this.dropzones.find(dropzone => dropzone.interesting(drag));
        if (futurDropzone) {
          const blob = futurDropzone.reOrderItemsCalc(drag, true);
          futurDropzone.preview(drag, blob);
        }
      }).switchMap(() => this.drops$)
      .do(drop => {
        console.log('end ' + drop.draggable.dropzone.id);
        this.dropzones.forEach(dropzone => dropzone.stopPreview());
        this.pendingDraggable = undefined;
        this._pendingDraggable$.next(this.pendingDraggable);
      });

      this.serverSubscription = this.dragAndDrop$.subscribe();
  }

  registerDropZone(ref: HTMLElement, datas?: any[]): Dropzone {
    const dropzone = new Dropzone(ref);
    if (datas) {
      datas.forEach(data => {
        const draggable = new Draggable(dropzone, undefined, data);
        dropzone.addItem(draggable);
        this.registerDraggables(draggable);
      });
    }
    this.dropzones.push(dropzone);
    this._dropzones$.next(this.dropzones);
    return dropzone;
  }

  registerDraggables(dropzone: Dropzone|Draggable, ref?: HTMLElement, data?: any): number {
    const draggable = dropzone instanceof Draggable
      ? dropzone
      : new Draggable(dropzone, ref, data);
    this.draggables.push(draggable);
    this._draggables$.next(this.draggables);
    return draggable.id;
  }

  dropzone(id: number): Observable<Dropzone[]> {
    const dropzones$ = this.dropzones$
      .map(dropzones => dropzones.filter(dropzone => dropzone.id === id));
    return dropzones$;
  }

  draggable(id: number): Observable<Draggable[]> {
    const draggables$ = this.draggables$
      .map(draggables => draggables.filter(draggable => draggable.id === id));
    return draggables$;
  }

  viewDragstart(id: number, $event) {
    const viewDraggable = this.draggables.find(draggable => draggable.id === id);
    if (viewDraggable) {
      viewDraggable.viewDragstart($event);
    }
  }

  viewDrag(id: number, $event) {
    const viewDraggable = this.draggables.find(draggable => draggable.id === id);
    if (viewDraggable) {
      viewDraggable.viewDrag($event);
    }
  }

  viewDrop(id: number, $event) {
    if (!this.pendingDraggable) { return ; }
    // const viewDropzone = this.dropzones.find(dropzone => dropzone.id === id);
    const viewDropzone = this.dropzones.find(dropzone => dropzone.interesting({$event, draggable: this.pendingDraggable}));
    if (viewDropzone) {
      // if (viewDropzone !== futurDropzone) { console.log('view: ' + viewDropzone.id + ', futur: ' + futurDropzone.id); }
      viewDropzone.viewDrop($event, this.pendingDraggable);
    }
  }

}

export class Container {
  private static _id = 0;
  private static get id(): number {
    const newId = Container._id;
    Container._id += 1;
    return newId;
  }
  id: number;

  constructor(public ref: HTMLElement) {
    this.id = Container.id;
  }

  clone(container: Container) {
    this.ref = container.ref;
  }

}

export class Dropzone extends Container {

  private _drop$: Subject<{$event: any, draggable: Draggable}> = new Subject();
  drop$: Observable<{$event: any, draggable: Draggable}> = this._drop$.asObservable();

  private items: Draggable[] = [];
  private _items$: BehaviorSubject<Draggable[]> = new BehaviorSubject(this.items);
  items$: Observable<Draggable[]> = this._items$.asObservable();

  previewPos: {
    before: number,
    after: number
  };

  constructor(
    public ref: HTMLElement,
    items$: Observable<Draggable[]> = Observable.of([])
  ) { super(ref); }

  reOrderItems(blob: {from: number, to: number}, draggable: Draggable) {
    if (blob.from !== blob.to) {
      const newItems = this.items.slice();
      newItems.splice(blob.from, 1);
      newItems.splice(blob.to, 0, draggable);
      this.items = newItems;
      this._items$.next(this.items);
    }
  }
  reOrderItemsCalc(blob: {$event: any, draggable: Draggable}, futur?: boolean) {
    const from = this.items.findIndex(item => item.id === blob.draggable.id);
    let to;
    const some = this.items.some((item, index) => {
      to = index;
      return (item.ref.offsetLeft + (item.ref.offsetWidth / 2)) > blob.$event.clientX;
    });
    to = some
      ? (to > from && from !== -1 ? to - 1 : to)
      : this.items.length - (futur ? 0 : 1);
    return {from, to};
  }

  interesting(blob: {$event: any, draggable: Draggable}) {
    return (
      (blob.$event.clientX >= this.ref.offsetLeft)
      && (blob.$event.clientX <= (this.ref.offsetLeft + this.ref.offsetWidth))
    &&
      (blob.$event.clientY >= this.ref.offsetTop)
      && (blob.$event.clientY <= (this.ref.offsetTop + this.ref.offsetHeight))
    );
  }

  preview(blob: {$event: any, draggable: Draggable}, moveBlob: {from: number, to: number}) {
    const index = this.items.findIndex(item => item.id === blob.draggable.id);
    this.previewPos = moveBlob.to < index || index < 0 ? {
      before: moveBlob.to - 1,
      after: moveBlob.to
    } : {
      before: moveBlob.to,
      after: moveBlob.to + 1
    };
  }

  stopPreview() {
    this.previewPos = undefined;
  }

  removeItem(draggable: Draggable) {
    this.items = this.items.filter(item => item.id !== draggable.id);
    this._items$.next(this.items);
  }

  addItem(draggable: Draggable) {
    if (draggable.dropzone !== this) {
      draggable.dropzone.removeItem(draggable);
      draggable.dropzone = this;
    }
    this.items.push(draggable);
    this._items$.next(this.items);
  }

  viewDrop($event, draggable: Draggable) {
    this._drop$.next({$event, draggable});
  }

  drop(blob: {$event: any, draggable: Draggable}) {
    if (blob.draggable.dropzone.id !== this.id) {
      this.addItem(blob.draggable);
    }
    const moveBlolb = this.reOrderItemsCalc(blob);
    this.reOrderItems(moveBlolb, blob.draggable);
  }

}

export class Draggable extends Container {

  private _dragstart$: Subject<{$event: any, draggable: Draggable}> = new Subject();
  dragstart$: Observable<{$event: any, draggable: Draggable}> = this._dragstart$.asObservable();

  private _drag$: Subject<{$event: any, draggable: Draggable}> = new Subject();
  drag$: Observable<{$event: any, draggable: Draggable}> = this._drag$.asObservable().throttleTime(10);

  constructor(
    public dropzone: Dropzone,
    public ref: HTMLElement,
    public data?: any
  ) { super(ref); }

  viewDragstart($event: any) {
    this._dragstart$.next({$event, draggable: this});
  }

  viewDrag($event: any) {
    this._drag$.next({$event, draggable: this});
  }

  dragstart(blob: {$event: any, draggable: Draggable}) {
    const img = new Image();
    img.src = blob.draggable.data;
    img.onload = function() {
      blob.$event.dataTransfer.setDragImage(img, 40, 20);
    };
    img.src = blob.draggable.data;
  }

  drag() {

  }

}
