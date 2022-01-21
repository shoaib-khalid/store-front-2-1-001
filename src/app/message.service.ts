import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  successMessage: string;
  errorMessage: string;

  successMessageChange: Subject<string> = new Subject<string>();
  errorMessageChange: Subject<string> = new Subject<string>();

  constructor() { }

  success(message: string) {
    this.successMessage = message;
    this.successMessageChange.next(this.successMessage);
  }

  error(message: string) {
    this.errorMessage = message;
    this.errorMessageChange.next(this.errorMessage);
  }

  clearSuccessMessage() {
    this.successMessage = null;
    this.successMessageChange.next(this.successMessage);
  }

  clearErrorMessage() {
    this.errorMessage = null;
    this.errorMessageChange.next(this.errorMessage);
  }

  clearAllMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
