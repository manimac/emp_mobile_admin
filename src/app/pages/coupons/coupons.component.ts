import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    description: new FormControl(''),
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required)
  })
  showForm: boolean = false;
  dataLists: any = [];
  today: any;
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
    let today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    this.today = yyyy + '-' + mm + '-' + dd;
    let obj = {
      start: this.today,
      end: this.today,
    }
    this.formGroup.patchValue(obj);
  }

  get formControls() {
    return this.formGroup.controls;
  }

  getEnd(){
    return this.formGroup.value.start;
  }

  updateEnd(){
    let obj = {
      end: this.formGroup.value.start
    }
    this.formGroup.patchValue(obj);
  }

  loadData() {
    this.http.post('coupons', {status: 1}).subscribe(
      (response: any) => {
        if (response.data && Array.isArray(response.data) && (response.data.length > 0)) {
          response.data.forEach((element: any) => {
            element.start = element.start.split("T")[0];
            element.end = element.end.split("T")[0];
          });
        }
        this.dataLists = response.data;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  create(element: HTMLElement) {
    element.scrollIntoView()
    this.showForm = true;
  }

  viewElement(params: any, element: HTMLElement) {
    this.showForm = true;
    this.formGroup.patchValue(params);
    element.scrollIntoView()
  }

  deleteElement(id: number) {
    this.http.post('coupon/update/', {id: id, status: 0}).subscribe(
      (response: any) => {
        this.http.successMessage('Deleted');
        this.showForm = false;
        this.formGroup.reset();
        this.loadData();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  save() {
    let url = (this.formGroup.value.id) ? 'coupon/update' : 'coupon/create'
    this.http.post(url, this.formGroup.value).subscribe(
      (response: any) => {
        if (this.formGroup.value.id) {
          this.http.successMessage('Updated');
        }
        else {
          this.http.successMessage('Created');
        }
        this.showForm = false;
        this.formGroup.reset();
        this.loadData();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  cancel() {
    this.showForm = false;
    this.formGroup.reset();
  }

}
