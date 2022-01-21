import { Component, OnInit } from '@angular/core';
import blogpost from '../../../data/blog.json';
import blogtags from '../../../data/blogtags.json';

@Component({
  selector: 'app-relatedpost',
  templateUrl: './relatedpost.component.html',
  styleUrls: ['./relatedpost.component.css']
})
export class RelatedpostComponent implements OnInit {

  constructor() { }
  public blogbox: { title: string, id: number }[] = blogpost;
  public tags: { title: string, id: number }[] = blogtags;
  public getBlogTags(items: string | any[]) {
    var elems = blogtags.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  }
  // 
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
