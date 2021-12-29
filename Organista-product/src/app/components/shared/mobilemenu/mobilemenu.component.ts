import { Component, OnInit } from '@angular/core';
import $ from 'jquery'

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.css']
})
export class MobilemenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    function mobilemenu() {
      ($(".andro_aside .menu-item-has-children > a") as any).on('click', function (e) {
        var submenu = $(this).next(".sub-menu");
        e.preventDefault();

        submenu.slideToggle(200);
      });
    }
    mobilemenu()
  }

}
