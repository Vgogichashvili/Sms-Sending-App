import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import * as XLSX from 'xlsx';

import { ToastrService } from 'ngx-toastr';
import { text } from 'body-parser';
import { first } from 'lodash';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  inputText: any = [];
  excelData!: [][];
  excelHeadData!: [][];
  formData: any = NgForm;
  strArray: any = [];
  finalStr: string = '';
  finalStrText: string = '';
  numbField: any[] = [];
  textField: any[] = [];
  constructor(
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onFormSubmit(form: NgForm) {
    if (form.value.phone != '' && form.value.text != '') {
      setTimeout(() => {
        // for(let i= 0;i<form.value.phone;i++){
        //   form.value.phone[i].toString().replace('+','')
        // }
        let reg = form.value.phone.replace(',', ';');
        this.finalStr = reg;

        this.http.sendMessage(form.value).subscribe((res: any) => {
          // console.log(res.toString());
          // let resultStr = res.toString().split(',')[0];
          var uniq = [...new Set(res)];
          console.log(uniq);
          if (uniq.includes(true) == true && uniq.includes(false) == true) {
            this.toastr.warning('ზოგიერთ ნომერზე sms არ გაიგზავნა');
            // localStorage.setItem("number",form.value.phone)
          } else if (uniq.includes(true) == true) {
            this.toastr.success('წარმატებით გაიგზავნა');
          } else if (uniq.includes(false) == true) {
            this.toastr.error('მოხდა შეცდომა');
          }
          // else{ this.toastr.error('მოხდა შეცდომა');}
        });
      }, 500);
    } else {
      this.toastr.error('შეავსეთ ფორმა');
    }
  }

  keyFunc(event: any) {
    let ev = event?.target.value;
    this.inputText.push(ev);
  }

  readExcel(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.excelData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.excelData[0].forEach((item: any) => {
        item.toString().replace('+', '');
      });

      this.excelHeadData = this.excelData[0];

      this.excelData.shift();

      this.excelData.forEach((item: any) => {
        this.numbField.push(item[0]);
        if (item[1] != undefined) {
          this.textField.push(item[1]);
        }
      });

      var txtarea = document.querySelector('#name');

      for (let i = 0; i < this.numbField.length; i++) {
        this.strArray.push(this.numbField[i].toString());
      }

      var strJoin = this.strArray.join();
      var replaced = strJoin.replace(',', ';');
      strJoin.innerHTML == replaced;

      this.finalStr = replaced;
      this.finalStrText = this.textField[0];
      console.log(this.finalStrText);

      const propertyValues: any[] = Object.values(this.numbField);

      this.numbField = propertyValues;
    };

    reader.readAsBinaryString(target.files[0]);
  }

  onExcelBtnClick(excelInp: any) {
    excelInp.click();
  }

  OnLastMessageBtnClick() {
    this.router.navigate(['/last-messages']);
  }
}
