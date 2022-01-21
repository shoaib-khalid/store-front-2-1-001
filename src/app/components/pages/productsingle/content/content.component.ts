import { Component, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import shoppost from '../../../../data/shop.json';
import blogcategory from '../../../../data/blogcategory.json';
import blogtags from '../../../../data/blogtags.json';
import { Product } from 'src/app/components/models/product';
import { PlatformLocation } from '@angular/common';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements AfterContentInit {

  constructor(private router: ActivatedRoute) { }
  public shopbox: { title: string, id: number }[] = shoppost;
  public tags: { title: string, id: number }[] = blogtags;
  public category: { title: string, id: number }[] = blogcategory;

  public setProduct(id: any) {
    this.shopbox = shoppost.filter((item: { id: any; }) => { return item.id == id });
  }
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
  // Increment decrement
  public counter: number = 1
  increment() {
    this.counter += 1;
  }
  decrement() {
    this.counter -= 1;
  }

  ngAfterContentInit(): void {
    this.setProduct(this.router.snapshot.params.id);
  }

}
