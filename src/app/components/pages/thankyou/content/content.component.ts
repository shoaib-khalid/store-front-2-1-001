import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  storeID: string;
  banner: any;

  constructor(private apiService: ApiService,
    private httpClient: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute) { this.storeID = "McD" }

     //Banner
  getAssets(storeID){
    return new Promise(resolve => {
        // check count Item in Cart 
        this.apiService.getStoreAssets(storeID).subscribe((res: any) => {
            resolve(res.data)
            let data = res.data;
            this.banner = data.bannerUrl;
            // this.assetsData = res.data;
        }, error => {
            // Swals.fire("Oops...", "Error : <small style='color: red; font-style: italic;'>" + error.error.message + "</small>", "error")
        }) 
        
    });

}
  ngOnInit(): void {
    this.getAssets(this.storeID)
  }

}
