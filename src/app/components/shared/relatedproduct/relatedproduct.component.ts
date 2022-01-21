import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import shoppost from '../../../data/shop.json'

@Component({
  selector: 'app-relatedproduct',
  templateUrl: './relatedproduct.component.html',
  styleUrls: ['./relatedproduct.component.css']
})
export class RelatedproductComponent implements OnInit {

  closeResult: string;
  modalContent: any;
  constructor(private modalService: NgbModal) { }
  open(content: any, item: any) {
    this.modalContent = item
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'andro_quick-view-modal p-0' });
  }
  // Increment decrement
  public counter: number = 1
  increment() {
    this.counter += 1;
  }
  decrement() {
    this.counter -= 1;
  }
  public shopbox: { img: string }[] = shoppost;
  relatedConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: true,
    prevArrow: '.andro_related-posts .slider-prev',
    nextArrow: '.andro_related-posts .slider-next',
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
