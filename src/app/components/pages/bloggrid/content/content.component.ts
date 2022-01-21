import { Component, OnInit } from '@angular/core';
import blogpost from '../../../../data/blog.json';
import blogtags from '../../../../data/blogtags.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  // pagination
  page: number = 1;
  constructor() { }
  public blogbox: { title: string, id: number }[] = blogpost;
  public tags: { title: string, id: number }[] = blogtags;
  public getBlogTags(items: string | any[]) {
    var elems = blogtags.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  }

  ngOnInit(): void {
  }

}
