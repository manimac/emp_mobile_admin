import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { types } from 'src/app/models/vehicleTypes';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  vehicleTypes: any = [];
  thumbImage: any;
  showForm: boolean = false;
  dataLists: any = [];
  productLists: any = [];
  vehicleFilers: any = [];
  staffFilers: any = [];
  transportFilers: any = [];
  locations: any = [];
  public selectedRow: any = {};
  userDetails: any = {};
  isAdmin: boolean = false;
  userRole: any = '';
  productId: any = '';
  checkinDate: any = '';
  checkintime: any = '';
  checkoutDate: any = '';
  checkouttime: any = '';
  minDate: any = '';
  slots = ['0:00', '0:15', '0:30', '0:45', '1:00', '1:15', '1:30', '1:45', '2:00', '2:15', '2:30', '2:45', '3:00', '3:15', '3:30', '3:45', '4:00', '4:15', '4:30', '4:45', '5:00', '5:15', '5:30', '5:45', '6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45']
  constructor(private http: HttpRequestService, private storage: StorageService) {
    this.userDetails = this.storage.getUserDetails();
    this.isAdmin = this.storage.isAdmin();
    this.userRole = this.storage.getRole();
    var today: any = new Date();
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    this.minDate = yyyy + '-' + mm + '-' + dd;
    console.log(this.minDate)
    today = yyyy + '-' + mm + '-' + dd;
    this.checkinDate = today;
    this.checkoutDate = today;
    this.loadTypes();
  }

  loadTypes() {
    if (this.isAdmin || (this.userRole == 'All')) {
      this.vehicleTypes = types;
    }
    else if (this.userRole == 'Rent & Staffing') {
      this.vehicleTypes = ['Rent', 'Staffing'];
    }
    else if (this.userRole == 'Rent & Transport') {
      this.vehicleTypes = ['Rent', 'Transport'];
    }
    else if (this.userRole == 'Staffing & Transport') {
      this.vehicleTypes = ['Staffing', 'Transport'];
    }
    else if (this.userRole == 'Rent') {
      this.vehicleTypes = ['Rent'];
    }
    else if (this.userRole == 'Staffing') {
      this.vehicleTypes = ['Staffing'];
    }
    else if (this.userRole == 'Transport') {
      this.vehicleTypes = ['Transport'];
    }
  }

  ngOnInit(): void {
    this.loadData();
    this.loadLocations();
  }

  loadData() {
    this.http.post('products', {}).subscribe(
      (response: any) => {
        this.productLists = response && response.data;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
    let params = {
      status: 1
    }
    this.http.post('orders', params).subscribe(
      (response: any)=>{
        if(response && response.data && Array.isArray(response.data) && (response.data.length>0)){
          response.data.forEach((element: any) => {
            let services: any = [];
            element.Orderhistories.forEach((element2: any) => {
              if(!element2.extra_id){
                services.push(element2.type);
              }              
            });
            element.services = services.join(',');
          });
          this.dataLists = response.data;
          this.dataLists = this.dataLists.filter((el: any)=>(el.type == 'maintenance'))
          console.log(this.dataLists)
        }
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  loadFilters(type: string) {
    this.http.get('filters/' + type).subscribe(
      (response: any) => {
        if (type == 'Rent')
          this.vehicleFilers = response
        if (type == 'Staffing')
          this.staffFilers = response
        if (type == 'Transport')
          this.transportFilers = response
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadLocations() {
    this.http.get('filter/locations').subscribe(
      (response: any) => {
        this.locations = response;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  setCheckoutDate() {
    this.checkoutDate = this.checkinDate;
  }

  create(element: HTMLElement) {
    element.scrollIntoView()
    this.showForm = true;
  }

  viewElement(params: any, element: HTMLElement) {
    this.showForm = true;
    this.loadFilters(params.type);
    this.selectedRow = params;
    element.scrollIntoView()
  }

  deleteElement(id: number) {
    this.showForm = false;
    // this.dataLists.splice(index, 1)
    this.http.delete('order/deleteOrder/', id).subscribe(
      (response: any) => {
        this.http.successMessage('Deleted');
        this.showForm = false;
        this.loadData();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  changeCheckin() {
    this.checkouttime = '';
  }

  checkoutDisabled(slot: any) {
    let result = false;
    let checkintimeIndex = this.slots.indexOf(this.checkintime);
    let checkouttimeIndex = this.slots.indexOf(slot);
    if ((this.checkinDate == this.checkoutDate) && (checkintimeIndex >= checkouttimeIndex)) {
      result = true;
    }
    if (this.checkoutDate) {
      let date = new Date();
      let currentHours = date.getHours();
      let currentMinutes = date.getMinutes();
      let splitSlot = slot.split(":");
      let slotHours = splitSlot[0];
      let slotMinutes = splitSlot[1];
      let todayDate = new Date().toISOString().split('T')[0];
      // let updatedCurrentDate: any = todayDate.split("-");
      // updatedCurrentDate = updatedCurrentDate.reverse().join('-');
      if ((this.checkoutDate == todayDate) && (currentHours >= slotHours) && (currentMinutes >= slotMinutes)) {
        result = true;
      }
    }
    return result;
  }

  checkinDisabled(slot: any) {
    let result = false;
    if (this.checkinDate) {
      let date = new Date();
      let currentHours = date.getHours();
      let currentMinutes = date.getMinutes();
      let splitSlot = slot.split(":");
      let slotHours = splitSlot[0];
      let slotMinutes = splitSlot[1];
      let todayDate = new Date().toISOString().split('T')[0];
      // let updatedCurrentDate: any = todayDate.split("-");
      // updatedCurrentDate = updatedCurrentDate.reverse().join('-');
      if ((this.checkinDate == todayDate) && (currentHours > slotHours)) {
        result = true;
      }
      else if ((this.checkinDate == todayDate) && (currentHours == slotHours) && (currentMinutes >= slotMinutes)) {
        result = true;
      }
    }

    return result;
  }

  save() {
    let filterProduct = this.productLists.filter((el: any) => (el.id == this.productId));
    if (filterProduct && (filterProduct.length > 0)) {
      let checkinDate = this.checkinDate.split('-').reverse().join('-');
      let checkoutDate = this.checkoutDate.split('-').reverse().join('-');
      filterProduct[0]['search'] = {
        "locationid": filterProduct[0].location_id,
        "checkindate": checkinDate,
        "checkoutdate": checkoutDate,
        "checkintime": this.checkintime,
        "checkouttime": this.checkouttime
      }
    }
    filterProduct[0]["type"] = 'maintenance'
    let params: any = {}
    params.total = 0
    params.products = filterProduct;
    params['amountpaid'] = 0;
    params['fromwallet'] = 0
    params.status = 1;
    params.type = 'maintenance';
    params['maxcheckoutdate'] = this.checkoutDate;
    this.http.post('order/make-order', params).subscribe(
      (order: any) => {
        this.http.successMessage("Updated Successfully.");
        this.showForm = false;
        this.loadData();
      });
  }

  cancel() {
    this.showForm = false;
  }

  splitDate(date: any){
    let result = '';
    if(date){
      let splitDate = date.split('T');
      if(splitDate && Array.isArray(splitDate) && splitDate.length>0){
        let newDate = splitDate[0];
        let splitReverse = newDate.split('-');
        if(splitReverse && Array.isArray(splitReverse) && splitReverse.length>0){
          result = splitReverse.reverse().join('-');
        }
      }
      else{
        result = splitDate;
      }
    }    
    return result;
  }

}
