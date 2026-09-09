import { Component, inject, signal, OnInit } from '@angular/core';
import { KycService } from '../../services/kyc.service';
import { DocumentType, SubmissionResponse } from '../../models/kyc.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kyc-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc-client.html',
  styleUrls: ['./kyc-client.scss']
})
export class KycClientComponent implements OnInit {
  kycService = inject(KycService);

  documentTypes = Object.values(DocumentType);
  selectedType: DocumentType = DocumentType.IDENTITY_CARD;
  selectedFile: File | null = null;
  mySubmissions = signal<SubmissionResponse[]>([]);

  ngOnInit() {
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.kycService.getMySubmissions().subscribe({
      next: (data) => this.mySubmissions.set(data)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.selectedFile && this.selectedType) {
      this.kycService.submitDocument(this.selectedFile, this.selectedType).subscribe({
        next: () => {
          this.selectedFile = null;
          this.loadSubmissions();
        }
      });
    }
  }
}