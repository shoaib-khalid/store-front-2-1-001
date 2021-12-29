import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  closeResult: string;
  @ViewChild('content') content: any;
  constructor(private modalService: NgbModal) { }

  ngAfterViewInit() {
    this.openModal();
  }
  openModal() {
    this.modalService.open(this.content, { centered: true, windowClass: 'andro_newsletter-popup-modal' });
  }

  ngOnInit(): void {
  }

}
