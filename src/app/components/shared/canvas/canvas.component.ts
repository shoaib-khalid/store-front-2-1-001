import { Component, OnInit } from '@angular/core';
import categoryPost from '../../../data/category.json';
import blogtags from '../../../data/blogtags.json';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  storeID: string;
  categories: any;

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute) {
    this.storeID = "McD";
  }
  public category: { icon: string }[] = categoryPost;
  public tags: { title: string }[] = blogtags;

  //Categories
  getCategory() {
    this.apiService.getCategoryByStoreID(this.storeID).subscribe((res: any) => {
      if (res.message) {
        if (res.data.content.length > 1) {
          this.categories = res.data.content;
        } else {
          this.categories = res.data.content;
        }
        //console.log('newCategories getCategory: ', this.categories);
      } else {
      }
    }, error => {
      console.log(error)
    })
  }
  goToCategory(catId) {
    // alert(catId)
    // return false;
    this.route.navigate(['catalogue/'+ catId] );// + catId
  }

  ngOnInit(): void {
    this.getCategory();
  }

}
