import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SubmissionResponse, AnalystSubmissionResponse, DocumentType, SubmissionStatus } from '../models/kyc.models';

@Injectable({
  providedIn: 'root'
})
export class KycService {
  private http = inject(HttpClient);
  private baseUrl = environment.kycApiUrl;

  submitDocument(file: File, documentType: DocumentType): Observable<SubmissionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    return this.http.post<SubmissionResponse>(`${this.baseUrl}/kyc/submissions`, formData);
  }

  getMySubmissions(): Observable<SubmissionResponse[]> {
    return this.http.get<SubmissionResponse[]>(`${this.baseUrl}/kyc/submissions`);
  }

  getAnalystSubmissions(status?: SubmissionStatus): Observable<any> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<any>(`${this.baseUrl}/kyc/analyst/submissions`, { params });
  }

  getDocumentUrl(id: string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/kyc/analyst/submissions/${id}/document-url`);
  }

  decideSubmission(id: string, decision: { action: string; status: string; reason?: string }): Observable<AnalystSubmissionResponse> {
    return this.http.post<AnalystSubmissionResponse>(`${this.baseUrl}/kyc/analyst/submissions/${id}/decision`, decision);
  }
}