import { Component, OnInit } from '@angular/core';
import testimonialpost from '../../../../data/testimonial.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }
  public testimonial: { photo: string }[] = testimonialpost;

  ngOnInit(): void {
  }

}
