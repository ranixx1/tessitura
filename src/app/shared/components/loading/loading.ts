import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class LoadingComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Input() message = '';
}
