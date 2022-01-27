import { Component, OnInit } from '@angular/core';
import categoryPost from '../../../data/category.json';
import blogtags from '../../../data/blogtags.json';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/api.service';
import { StoreService } from 'src/app/store.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  categories: Category[];

  constructor(
    private route: Router,
    private storeService: StoreService
  ) {
  }
  public category: { icon: string }[] = categoryPost;
  public tags: { title: string }[] = blogtags;

  //Categories
  async getCategories() {
    this.categories = await this.storeService.getCategories();
  }
  goToCategory(catId) {
    // alert(catId)
    // return false;
    this.route.navigate(['catalogue/' + catId]);// + catId
  }

  ngOnInit(): void {
    this.getCategories();
  }
}
