import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import shoppost from '../../../../data/shop.json'
import categorypost from '../../../../data/category.json'
import blogcategory from '../../../../data/blogcategory.json';
import blogpost from '../../../../data/blog.json';
import blogtags from '../../../../data/blogtags.json';
import testimonialpost from '../../../../data/testimonial.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

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
  public featuredpost: { img: string }[] = shoppost;
  public category: { icon: string }[] = categorypost;
  public blogcategory: { title: string }[] = blogcategory;
  public testimonial: { photo: string }[] = testimonialpost;
  public blogbox: { title: string, id: number }[] = blogpost;
  public tags: { title: string, id: number }[] = blogtags;
  public getBlogTags(items: string | any[]) {
    var elems = blogtags.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  };
  // Banner
  bannerslides = [
    {
      photo: "assets/img/banner/1.jpg",
      proimg: "assets/img/products/8.png",
      ctaimg: "assets/img/cta/3.jpg",
      couponcode: "ORGANIC991",
      title: "Organic Vegetables",
      para: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula.",
    },
    {
      photo: "assets/img/banner/2.jpg",
      proimg: "assets/img/products/14.png",
      ctaimg: "assets/img/cta/2.jpg",
      couponcode: "ORGANIC991",
      title: "Organic Exotic Fruits",
      para: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula.",
    },
  ];
  bannerConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true,
  }
  // Cta
  shopcta = [
    {
      photo: "assets/img/cta/1.jpg",
      title: "Freshly Picked",
      titlespan: "Vegetables",
      para: "Cras ultricies ligula sed magna dictum porta. Proin eget tortor risus."
    },
    {
      photo: "assets/img/cta/2.jpg",
      title: "Freshly Picked",
      titlespan: "Fruits",
      para: "Cras ultricies ligula sed magna dictum porta. Proin eget tortor risus."
    }
  ];
  // Icons
  iconspost = [
    {
      icon: "flaticon-diet",
      title: "Guaranteed Organic",
      para: "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: "flaticon-harvest",
      title: "Daily Harvesting",
      para: "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: "flaticon-tag",
      title: "Cheap & Healthy",
      para: "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];
  // Fresharrivals
  freshConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: false,
    prevArrow: '.andro_fresh-arrivals .slider-prev',
    nextArrow: '.andro_fresh-arrivals .slider-next',
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
  // Testimonial
  testiConfig = {
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
  // Client post
  clientpost = [
    {
      icon: "assets/img/clients/1.png",
      companyname: "Green Co.",
    },
    {
      icon: "assets/img/clients/2.png",
      companyname: "Green Co.",
    },
    {
      icon: "assets/img/clients/3.png",
      companyname: "Green Co.",
    },
    {
      icon: "assets/img/clients/4.png",
      companyname: "Green Co.",
    },
    {
      icon: "assets/img/clients/5.png",
      companyname: "Green Co.",
    },
    {
      icon: "assets/img/clients/6.png",
      companyname: "Green Co.",
    },
  ]

  ngOnInit(): void {
  }

}
