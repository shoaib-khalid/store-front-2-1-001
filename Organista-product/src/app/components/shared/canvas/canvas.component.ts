import { Component, OnInit } from '@angular/core';
import categoryPost from '../../../data/category.json';
import blogtags from '../../../data/blogtags.json';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  constructor() { }
  public category: { icon: string }[] = categoryPost;
  public tags: { title: string }[] = blogtags;

  ngOnInit(): void {
  }

}
