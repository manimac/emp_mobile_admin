import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DateRange, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  dataLists: any = [];
  categoryLists: any = [];
  functionsLists: any = [];
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
    function_id: new FormControl('', Validators.required),
    cancelperiod: new FormControl(''),
    workstartdate: new FormControl('', Validators.required),
    workenddate: new FormControl('', Validators.required),
    worktime: new FormControl('', Validators.required),
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
    staffaccepted: new FormControl(''),
    timecontroller: new FormControl(''),
    category_id: new FormControl('', Validators.required),
    image: new FormControl(''),
    locationaddress: new FormControl(''),
    lat: new FormControl('', Validators.required),
    lng: new FormControl('', Validators.required),
    status: new FormControl('1'),
    id: new FormControl('', Validators.required),
  });
  public locations: any = [];
  showSelectLocation: boolean = false;
  constructor(private http: HttpRequestService, private router: Router, private storage: StorageService) {
    this.userDetails = this.storage.getUserDetails();
    this.searchLocation();
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
    this.http.post('functions/get', {}).subscribe(
      (response: any) => {
        this.functionsLists = response;
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
    this.http.post('staff-transport-request/get', params).subscribe(
      (response: any) => {
        this.dataLists = response
        this.dataLists.forEach((element: any)=>{
          element.staffaccepted = parseInt(element.staffaccepted);
          element.staffneeded = parseInt(element.staffneeded);
        })
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
    if(parseInt(this.orderFormGroup.value.staffneeded) < parseInt(this.orderFormGroup.value.staffaccepted)){
      this.http.errorMessage('Already ' + this.orderFormGroup.value.staffaccepted + ' staff accepted');
    }
    else{
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
      this.http.post('staff-transport-request/update', formData).subscribe(
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
    
  }

  delete(id: any) {
    this.http.delete('staff-transport-request/delete/', id).subscribe(
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

  changeCategory(){
    this.orderFormGroup.patchValue({function_id: ''})
  }

}
