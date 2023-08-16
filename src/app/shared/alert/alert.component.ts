import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input()
  public message = '';

  @Output()
  public close = new EventEmitter<void>();

  public onClose() {
    this.close.emit();
  }
}
