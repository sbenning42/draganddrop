import { Component, OnInit } from '@angular/core';
import { Style } from '../../models/style';

@Component({
  selector: 'app-item-manager',
  templateUrl: './item-manager.component.html',
  styleUrls: ['./item-manager.component.css']
})
export class ItemManagerComponent implements OnInit {

  preniumStyle: Style = new Style([
    {key: 'maxWidth', value: '100%'},
    {key: 'height', value: '100%'},
    {key: 'display', value: 'flex'},
    {key: 'justify-content', value: 'flex-start'},
    {key: 'padding-left', value: '50px'},
    {key: 'padding-right', value: '50px'},
  ]);
  preniumItemStyle: Style = new Style([
    {key: 'maxWidth', value: '200px'},
    {key: 'maxHeight', value: 'calc(100% - 4px)'},
    {key: 'display', value: 'flex'},
    {key: 'alignItems', value: 'center'},
    {key: 'padding', value: '2px'},
  ]);

  standardStyle: Style = new Style([
    {key: 'maxWidth', value: '100%'},
    {key: 'height', value: '100%'},
    {key: 'display', value: 'flex'},
    {key: 'justify-content', value: 'flex-start'},
    {key: 'padding-left', value: '50px'},
    {key: 'padding-right', value: '50px'},
  ]);
  standardItemStyle: Style = new Style([
    {key: 'maxWidth', value: '200px'},
    {key: 'maxHeight', value: 'calc(100% - 4px)'},
    {key: 'display', value: 'flex'},
    {key: 'alignItems', value: 'center'},
    {key: 'padding', value: '2px'},
  ]);

  trashStyle: Style = new Style([
    {key: 'maxWidth', value: '100%'},
    {key: 'height', value: '100%'},
    {key: 'display', value: 'flex'},
    {key: 'justify-content', value: 'flex-start'},
    {key: 'padding-left', value: '50px'},
    {key: 'padding-right', value: '50px'},
  ]);
  trashItemStyle: Style = new Style([
    {key: 'maxWidth', value: '200px'},
    {key: 'maxHeight', value: 'calc(100% - 4px)'},
    {key: 'display', value: 'flex'},
    {key: 'alignItems', value: 'center'},
    {key: 'filter', value: 'grayscale(100%)'},
    {key: 'padding', value: '2px'},
  ]);

  items = [
    'assets/avatar7.jpg',
    'assets/avatar3.jpg',
    'assets/avatar1.jpg',
    'assets/avatar15.jpg',
    'assets/avatar11.jpg',
    'assets/avatar8.jpg',
    'assets/avatar7.jpg',
    'assets/avatar2.jpg',
    'assets/avatar19.jpg',
    'assets/avatar6.jpg',
    'assets/avatar5.jpg',
    'assets/avatar16.jpg',
    'assets/avatar12.jpg',
  ];

  constructor() { }

  ngOnInit() {
  }

}
