import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from '../services/http.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-msg-status',
  templateUrl: './msg-status.component.html',
  styleUrls: ['./msg-status.component.css'],
})
export class MsgStatusComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  numberData!: any;
  progress = 0;
  displayedColumns?: string[] = ['phone', 'status', 'sendDate'];
  dataSource!: MatTableDataSource<any>;
  id!: any;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.getSms().subscribe((res: any) => {});

    this.http.inspectSms().subscribe((res: any) => {});

    this.http.getLastSms().subscribe((res: any) => {
      this.numberData = res;
      // for (let i = 0; i < this.numberData.length; i++) {
      //   if (this.numberData[i].status == 'delivered') {
      //     this.numberData[i].status = 'მიუვიდა';
      //   } else if (this.numberData[i].status == 'processing') {
      //     this.numberData[i].status = 'გაიგზავნა';
      //   } else if (this.numberData[i].status == 'not delivered') {
      //     this.numberData[i].status = 'არ გაიგზავნა';
      //   } else {
      //     this.numberData[i].status = 'გაიგზავნა';
      //   }
      // }
      this.dataSource = new MatTableDataSource(this.numberData.reverse());
      this.dataSource.paginator = this.paginator;
    });
  }

  dateForm = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  ondateClick($event: any) {
    let startPipe = `${new DatePipe('en').transform(
      this.dateForm.value.start,
      'MM/dd/yyyy'
    )}`;
    let endPipe = `${new DatePipe('en').transform(
      $event.target.value,
      'MM/dd/yyyy'
    )}`;

    let selectedMembers = this.numberData.filter(
      (m: any) =>
        new Date(m.sendDate) >= new Date(startPipe) &&
        new Date(m.sendDate) <= new Date(endPipe)
    );

    this.dataSource = new MatTableDataSource(selectedMembers);
  }

  filterData($event: any) {
    this.dataSource.filter = $event.target.value;
  }
}
