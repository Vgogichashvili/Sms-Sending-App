import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sms } from '../models/sms.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  selectedSms!: Sms;

  constructor(private http: HttpClient) {}

  getSms(): any {
    return this.http.get(`http://localhost:3000/`);
  }

  inspectSms(): any {
    return this.http.get(`http://localhost:3000/inspect`);
  }
  getLastSms(): any {
    return this.http.get(`http://localhost:3000/lastRes`);
  }

  sendMessage(emp: Sms) {
    return this.http.post(`http://localhost:3000/`, emp);
  }
}
