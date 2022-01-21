import { Component, OnInit } from '@angular/core';
import blogpost from '../../../data/blog.json';
import blogtags from '../../../data/blogtags.json';
import blogcategory from '../../../data/blogcategory.json';

@Component({
  selector: 'app-blogsidebar',
  templateUrl: './blogsidebar.component.html',
  styleUrls: ['./blogsidebar.component.css']
})
export class BlogsidebarComponent implements OnInit {

  constructor() { }
  public blogbox: { title: string, id: number }[] = blogpost;
  public tags: { title: string, id: number }[] = blogtags;
  public category: { title: string, id: number }[] = blogcategory;

  ngOnInit(): void {
  }

}
