import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Style } from './models/style';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  style = new Style([
    {key: 'minWidth', value: '500px'},
    {key: 'minHeight', value: '200px'},
    {key: 'border', value: 'solid 1px red'},
    {key: 'display', value: 'flex'},
  ]);

  itemStyle = new Style([
    {key: 'margin', value: '5px'},
    {key: 'maxWidth', value: '100px'},
    {key: 'border', value: 'solid 1px blue'},
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

  items$ = Observable.of(this.items);

}
