import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-helpdesk-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './helpdesk-dashboard.html',
  styleUrl: './helpdesk-dashboard.scss',
})
export class HelpdeskDashboardComponent {}