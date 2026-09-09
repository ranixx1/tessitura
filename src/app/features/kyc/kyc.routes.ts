import { Routes } from '@angular/router';
import { KycClientComponent } from './pages/kyc-client/kyc-client';
import { KycAnalystComponent } from './pages/kyc-analyst/kyc-analyst';

export const KYC_ROUTES: Routes = [
  { path: 'client', component: KycClientComponent },
  { path: 'analyst', component: KycAnalystComponent }
];