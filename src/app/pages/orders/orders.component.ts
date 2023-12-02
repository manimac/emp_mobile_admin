import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DateRange, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  dataLists: any = [];
  categoryLists: any = [];
  showDetails: boolean = false;
  selectedProduct: any = {};
  selectedUser: any = {};
  extrasLists: any = [];
  searchKey: any = '';
  selectedOrder: any = {};
  userDetails: any = {};
  range: any;
  transportrange: any;
  orderFormGroup: FormGroup = new FormGroup({
    type: new FormControl('staffing', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    industry: new FormControl(''),
    function: new FormControl(''),
    cancelperiod: new FormControl(''),
    workstartdate: new FormControl(''),
    workenddate: new FormControl(''),
    worktime: new FormControl(''),
    rate: new FormControl(''),
    worktype: new FormControl(''),
    location: new FormControl(''),
    contact: new FormControl(''),
    employer_id: new FormControl(''),
    from: new FormControl(''),
    fromtime: new FormControl(''),
    to: new FormControl(''),
    totime: new FormControl(''),
    loadingdate: new FormControl(''),
    unloadingdate: new FormControl(''),
    typeofgoods: new FormControl(''),
    weight: new FormControl(''),
    length: new FormControl(''),
    vechicletype: new FormControl(''),
    packaging: new FormControl(''),
    certificate: new FormControl(''),
    equipment: new FormControl(''),
    staffneeded: new FormControl(''),
    timecontroller: new FormControl(''),
    category_id: new FormControl(''),
    image: new FormControl(''),
    status: new FormControl('1'),
    id: new FormControl('', Validators.required),
  });
  constructor(private http: HttpRequestService, private router: Router, private storage: StorageService) {
    this.userDetails = this.storage.getUserDetails();
  }

  refreshDR() {
    let startdate = this.selectedOrder.workstartdate.split("-").reverse().join("-");
    let enddate = this.selectedOrder.workenddate.split("-").reverse().join("-");
    this.range = new DateRange(new Date(startdate), new Date(enddate));
    let loadingdate = this.selectedOrder.loadingdate && this.selectedOrder.loadingdate.split("-").reverse().join("-");
    let unloadingdate = this.selectedOrder.unloadingdate && this.selectedOrder.unloadingdate.split("-").reverse().join("-");
    if(loadingdate && unloadingdate) 
      this.transportrange = new DateRange(new Date(loadingdate), new Date(unloadingdate));
    else 
      this.transportrange = new DateRange(new Date(), new Date());
  }

  ngOnInit(): void {
    this.loadData();
    this.loadCategoryData();
  }

  onChange(event: any) {
    const selectedDate: Date = event;

    if (!this.range.start) {
      // If start date is not set, set it
      this.range.start = selectedDate;
    } else if (!this.range.end) {
      // If end date is not set, set it
      this.range.end = selectedDate;
    } else {
      // Both start and end dates are set, reset the range
      this.range = { start: selectedDate, end: null };
    }
    this.range = new DateRange(this.range.start, this.range.end);
    let obj = {
      workstartdate: this.range.start ? this.formatWorkDate(this.range.start) : null,
      workenddate: this.range.end ? this.formatWorkDate(this.range.end) : null
    }
    this.orderFormGroup.patchValue(obj);
  }

  onTransportRangeChange(event: any) {
    const selectedDate: Date = event;

    if (!this.transportrange.start) {
      // If start date is not set, set it
      this.transportrange.start = selectedDate;
    } else if (!this.transportrange.end) {
      // If end date is not set, set it
      this.transportrange.end = selectedDate;
    } else {
      // Both start and end dates are set, reset the range
      this.transportrange = { start: selectedDate, end: null };
    }
    this.transportrange = new DateRange(this.transportrange.start, this.transportrange.end);
    let obj = {
      loadingdate: this.transportrange.start ? this.formatWorkDate(this.transportrange.start) : null,
      unloadingdate: this.transportrange.end ? this.formatWorkDate(this.transportrange.end) : null
    }
    this.orderFormGroup.patchValue(obj);
  }

  formatWorkDate(today: any) {
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '-' + mm + '-' + yyyy;

  }

  loadCategoryData() {
    this.http.post('category/get', {}).subscribe(
      (response: any) => {
        this.categoryLists = response;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadData() {
    let params = {
      // status: 1
    }
    this.http.post('order/staff-transport-requests', params).subscribe(
      (response: any) => {
        this.dataLists = response
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  viewDetails(data: any) {
    this.selectedOrder = data;
    this.orderFormGroup.patchValue(data);
    this.showDetails = true;
    this.refreshDR();
  }

  cancel() {
    this.selectedOrder = {};
    this.showDetails = false;
    this.orderFormGroup.reset();
  }

  getImage(img: any) {
    if (img) {
      return "https://jezsel.nl/jezsel/uploads/product/" + img;
    }
    return '';
  }

  onFileChange(event: any) {
    const file = event.target.files;
    this.orderFormGroup.patchValue({
      image: file[0]
    });
  }

  submitOrder() {
    let product = this.orderFormGroup.value;
    product.search = {}
    product.search.checkoutdate = this.orderFormGroup.value.workdate;
    product.search.checkouttime = this.orderFormGroup.value.worktime;
    let obj = { employer_id: this.userDetails.id };
    this.orderFormGroup.patchValue(obj);
    const formData = new FormData();
    let keys = Object.keys(this.orderFormGroup.value);
    keys.forEach((key) => {
      formData.append(key, this.orderFormGroup.controls[key].value);
    });
    this.http.post('order/staff-transport-request/update', formData).subscribe(
      (response: any) => {
        if (response) {
          this.http.successMessage('Order Updated');
          this.loadData();
          this.orderFormGroup.reset();
          this.selectedOrder = {};
          this.showDetails = false;
        }
      }, error => {
        console.log(error);
        this.http.errorMessage('Error submitting form');
        // Handle the error
      });
  }

  delete(id: any) {
    this.http.delete('order/staff-transport-request/delete/', id).subscribe(
      (response: any) => {
        this.http.successMessage('Deleted');
        this.showDetails = false;
        this.orderFormGroup.reset();
        this.selectedOrder = {};
        this.loadData();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  getStatus(data: any) {
    let status = '';
    if (data.status == 1) {
      status = 'Not Started';
    }
    else if (data.status == 2) {
      status = 'Inprogress';
    }
    else if (data.status == 3) {
      status = 'Completed';
    }
    return status;
  }

}
