import { Component, inject, signal, OnInit } from '@angular/core';
import { KycService } from '../../services/kyc.service';
import { AnalystSubmissionResponse, SubmissionStatus } from '../../models/kyc.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kyc-analyst',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc-analyst.html',
  styleUrls: ['./kyc-analyst.scss']
})
export class KycAnalystComponent implements OnInit {
  kycService = inject(KycService);

  SubmissionStatus = SubmissionStatus;

  pendingReviews = signal<AnalystSubmissionResponse[]>([]);
  selectedSubmission = signal<AnalystSubmissionResponse | null>(null);
  documentUrl = signal<string | null>(null);
  rejectionReason = signal<string>('');

  ngOnInit() {
    this.loadPendingReviews();
  }

  loadPendingReviews() {
    this.kycService.getAnalystSubmissions(SubmissionStatus.MANUAL).subscribe({
      next: (page) => this.pendingReviews.set(page.content)
    });
  }

  viewDetails(sub: AnalystSubmissionResponse) {
    this.selectedSubmission.set(sub);
    this.kycService.getDocumentUrl(sub.id).subscribe({
      next: (res) => this.documentUrl.set(res.url)
    });
  }

  decide(decision: 'APPROVE' | 'REJECT') {
    const sub = this.selectedSubmission();
    if (sub) {
      const isApproved = decision === 'APPROVE';
      const payload = {
        action: decision, // Envia 'APPROVE' ou 'REJECT'
        status: isApproved ? SubmissionStatus.APPROVED : SubmissionStatus.REJECTED,
        reason: !isApproved ? this.rejectionReason() : undefined,
        note: !isApproved ? this.rejectionReason() : 'Aprovado pelo analista'
      };
      
      this.kycService.decideSubmission(sub.id, payload).subscribe({
        next: () => {
          this.selectedSubmission.set(null);
          this.documentUrl.set(null);
          this.rejectionReason.set('');
          this.loadPendingReviews();
        }
      });
    }
  }
}