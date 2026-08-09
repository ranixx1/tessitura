import { Component, Input } from '@angular/core';

export type AlertType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class AlertComponent {

  @Input() type: AlertType = 'info';

  @Input() message = '';
}