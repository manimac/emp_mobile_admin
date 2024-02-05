import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { types } from 'src/app/models/vehicleTypes';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DateRange, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-place-orders',
  templateUrl: './place-orders.component.html',
  styleUrls: ['./place-orders.component.css'],
})
export class PlaceOrdersComponent implements OnInit {

  selected: any = '';
  startDate: Date | undefined;
  endDate: Date | undefined;
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
    staffaccepted: new FormControl('0'),
    timecontroller: new FormControl(''),
    category_id: new FormControl(''),
    image: new FormControl(''),
    locationaddress: new FormControl(''),
    lat: new FormControl(''),
    lng: new FormControl(''),
    status: new FormControl('1'),
  });
  userDetails: any = {};
  categoryLists: any = [];
  public locations: any = [];
  showSelectLocation: boolean = false;
  constructor(private http: HttpRequestService, private storage: StorageService, private router: Router) {
    this.userDetails = this.storage.getUserDetails();
    this.loadData();
    this.refreshDR();
    this.searchLocation();
  }

  refreshDR() {
    this.range = new DateRange(new Date(), new Date());
    this.transportrange = new DateRange(new Date(), new Date());
  }

  ngOnInit(): void {
  }

  formatWorkDate(today: any) {
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '-' + mm + '-' + yyyy;

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

  loadData() {
    this.http.post('category/get', {}).subscribe(
      (response: any) => {
        this.categoryLists = response;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  get formControls() {
    return this.orderFormGroup.controls;
  }

  onFileChange(event: any) {
    const file = event.target.files;
    this.orderFormGroup.patchValue({
      image: file[0]
    });
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  submitOrder() {
    let obj1 = { workstartdate: this.formatDate(this.selected) };
    console.log(obj1)
    let product = this.orderFormGroup.value;
    product.search = {}
    product.search.checkoutdate = this.orderFormGroup.value.workstartdate;
    product.search.checkouttime = this.orderFormGroup.value.worktime;
    let obj = { employer_id: this.userDetails.id };
    this.orderFormGroup.patchValue(obj);
    const formData = new FormData();
    let keys = Object.keys(this.orderFormGroup.value);
    keys.forEach((key) => {
      formData.append(key, this.orderFormGroup.controls[key].value);
    });
    this.http.post('staff-transport-request/create', formData).subscribe(
      (response: any) => {
        if (response) {
          this.http.successMessage('Order Placed');
          this.orderFormGroup.reset();
          this.router.navigateByUrl('/assignments');
        }
      }, error => {
        console.log(error);
        this.http.errorMessage('Error submitting form');
        // Handle the error
      });
  }

  cancel() {
    this.orderFormGroup.reset();
  }

  searchLocation() {
    if (this.orderFormGroup.value.locationaddress.length > 2) {
      this.showSelectLocation = true;
      this.http.post('mapautocomplete', { input: this.orderFormGroup.value.locationaddress })
        .subscribe((response: any) => {
          if (response.body) {
            response.body = JSON.parse(response.body);
            this.locations = response.body.predictions;
          }

        });
    }
    else {
      this.showSelectLocation = false;
    }
  }

  selectedLocation(loc: any) {
    this.showSelectLocation = false;
    let obj = {
      locationaddress: loc?.description
    }
    this.orderFormGroup.patchValue(obj);
    this.http.post('getPlaceById', { input: loc.place_id })
      .subscribe((response: any) => {
        if (response.body) {
          response.body = JSON.parse(response.body);
          if (response.body.result && response.body.result.geometry) {
            let location = response.body.result.geometry.location;
            if (location) {
              let lat = location.lat;
              let lng = location.lng;
              // let distance = this.haversineDistance(lat, lng, '51.583008', '4.745676');
              let obj = {
                lat: lat,
                lng: lng,
              };
              console.log(obj)
              this.orderFormGroup.patchValue(obj);
            }
          }
        }
      });
  }

}
