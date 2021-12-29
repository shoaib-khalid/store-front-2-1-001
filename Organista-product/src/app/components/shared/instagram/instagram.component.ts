import { Component, OnInit, Input } from '@angular/core';
import instagramPost from '../../../data/instagram.json'

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.css']
})
export class InstagramComponent implements OnInit {

  constructor() { }
  @Input()  layout: number | string;
  public instagram: { img: string }[] = instagramPost;

  ngOnInit(): void {
  }

}
