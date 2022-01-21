import { Component, OnInit } from '@angular/core';
import shoppost from '../../../data/shop.json'

@Component({
  selector: 'app-dealslider',
  templateUrl: './dealslider.component.html',
  styleUrls: ['./dealslider.component.css']
})
export class DealsliderComponent implements OnInit {

  constructor() { }
  public shopbox: { img: string }[] = shoppost;
  dealsConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    dotsClass: "slick-dots d-flex",
    autoplay: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }

  ngOnInit(): void {
  }

}
