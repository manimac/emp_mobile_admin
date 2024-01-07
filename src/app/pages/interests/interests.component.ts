import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css']
})
export class InterestsComponent implements OnInit {

  dataLists: any = [];
  categoryLists: any = [];
  showDetails: boolean = false;
  selectedProduct: any = {};
  selectedUser: any = {};
  extrasLists: any = [];
  searchKey: any = '';
  selectedOrder: any = {};
  userDetails: any = {};
  selectedInterest: any = 'Pending';
  assignmentStatus: any = '';
  constructor(private http: HttpRequestService, private router: Router, private storage: StorageService) {
    this.userDetails = this.storage.getUserDetails();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.cancel();
    let params: any = {
      // status: 1
    }
    let url = 'staff-transport-request/statusFilter';
    if(this.selectedInterest == 'Pending'){
      params.status = 1;
    }
    else if(this.selectedInterest == 'Inprogress'){
      params.status = 2;
    }
    else if(this.selectedInterest == 'Completed'){
      params.status = 3;
    }
    else {
      params.status = 0;
    }
    this.http.post(url, params).subscribe(
      (response: any) => {
        this.dataLists = response;
        if (Array.isArray(this.dataLists) && this.dataLists.length > 0) {
          this.dataLists.forEach((element) => {
              element?.staffOrTransportRequest?.staffOrTransportWorkingHistories?.sort((a: any, b: any) => a.id - b.id);
          });
      }
      
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  viewDetails(data: any) {
    this.selectedOrder = data;
    this.showDetails = true;
    if(this.selectedOrder){
      this.assignmentStatus = this.selectedOrder.status
    }
  }

  cancel() {
    this.selectedOrder = {};
    this.showDetails = false;
  }

  getImage(img: any) {
    if (img) {
      return "https://jezsel.nl/jezsel/uploads/product/" + img;
    }
    return '';
  }

  submitOrder() {
    let params = {
      interestId: this.selectedOrder.id,
      requestId: this.selectedOrder.staffOrTransportRequest.id,
      status: this.assignmentStatus,
      employee_id: this.selectedOrder.Employee.id,
      order: this.selectedOrder.staffOrTransportRequest
    }
    this.http.post('staff-transport-request/assignmentUpdate', params).subscribe(
      (response: any) => {
        if (response) {
          this.http.successMessage('Assignment Updated');
          this.loadData();
          this.selectedOrder = {};
          this.showDetails = false;
        }
      }, error => {
        console.log(error);
        this.http.exceptionHandling(error);
        // Handle the error
      });
  }

  delete(id: any) {
    // this.http.delete('order/staff-transport-request/delete/', id).subscribe(
    //   (response: any)=>{
    //     this.http.successMessage('Deleted');      
    //     this.showDetails = false;
    //     this.orderFormGroup.reset();
    //     this.selectedOrder = {};
    //     this.loadData();
    //   },
    //   (error: any)=>{
    //     this.http.exceptionHandling(error);
    //   }
    // )
  }

  getStatus(data: any){
    let status = '';
    if(data.status == 0){
      status = 'Rejected';
    }
    else if(data.status == 1){
      status = 'Pending';
    }
    else if(data.status == 2){
      status = 'Inprogress';
    }
    else if(data.status == 3){
      status = 'Completed';
    }
    return status;
  }

}