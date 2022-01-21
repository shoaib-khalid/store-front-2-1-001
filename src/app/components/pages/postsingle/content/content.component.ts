import { Component, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import blogpost from '../../../../data/blog.json';
import blogtags from '../../../../data/blogtags.json';
import blogcategory from '../../../../data/blogcategory.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements AfterContentInit {

  constructor(private router: ActivatedRoute) { }
  public blogdetails: { title: string, id: number }[] = blogpost;
  public tags: { title: string, id: number }[] = blogtags;
  public category: { title: string, id: number }[] = blogcategory;
  public getBlogTags(items: string | any[]) {
    var elems = blogtags.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  }
  public getBlogCategory(items: string | any[]) {
    var elems = blogcategory.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  }

  public setPost(id: any) {
    this.blogdetails = blogpost.filter((item: { id: any; }) => { return item.id == id });
  }

  ngAfterContentInit(): void {
    this.setPost(this.router.snapshot.params.id);
  }

}
