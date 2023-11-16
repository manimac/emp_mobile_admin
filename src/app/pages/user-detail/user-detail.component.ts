import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {


  dataLists: any = [];
  ordersdataLists: any = [];
  depositdataLists: any = [];
  withdrawdataLists: any = [];
  extrasLists: any = [];
  searchName: any = '';
  searchEmail: any = '';
  searchPhone: any = '';
  currentWallet: any = 0;
  currentInterest: any = 0;
  showDeposit1: boolean = true;
  showWithdraw1: boolean = false;
  selectedProduct: any;
  selectedUser: any;
  @ViewChild('template') template: any;
  constructor(private http: HttpRequestService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params) => {
          if (params.id) {
            this.loadData(params.id);
            this.loadUser(params.id);
          }

        }
      );
    this.loadExtras();
  }

  loadData(id: any) {
    this.http.get('userorders/' + id).subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data) && (response.data.length > 0)) {
          response.data.forEach((element: any) => {
            if (element.type == 'wallet')
              this.depositdataLists.push(element);
            else
              this.ordersdataLists.push(element);
            let services: any = [];
            element.Orderhistories.forEach((element2: any) => {
              services.push(element2.type);
            });
            element.services = services.join(',');
          });
        }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
    this.http.get('userwallet/' + id).subscribe(
      (response: any) => {
        // if (response.wallet) {
          this.currentWallet = response.wallet;
          this.currentInterest = response.interest;
          if (response.interest) {
            let interest = Number(response.interest);
            let wallet = Number(response.wallet);
            if ((interest + wallet) == 0) {
              this.currentWallet = 0;
              this.currentInterest = 0;
            }
          }
        // }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
    this.http.get('userwithdraws/' + id).subscribe(
      (response: any) => {
        if (response && Array.isArray(response) && (response.length > 0)) {
          this.withdrawdataLists = response;
        }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadExtras() {
    this.http.get('product/extras').subscribe(
      (response: any) => {
        if (response) {
          this.extrasLists = response;
        }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadUser(id: any) {
    this.http.get('user/get/' + id).subscribe(
      (response: any) => {
        if (response) {
          this.selectedUser = response;
        }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  updateStatus(id: number, user: any, event: any) {
    user['status'] = event.target.checked ? 1 : 0;
    user['username'] = user.firstname;
    this.http.post('user/update', user).subscribe(
      (response: any) => {
        // this.loadData();       
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  getTotal() {
    return (Number(this.currentWallet) + Number(this.currentInterest)).toFixed(2);
  }

  viewDetails(data: any) {
    this.selectedProduct = [];
    let histories: any = []
    data.Orderhistories.sort(function (a: any, b: any) {
      var keyA = new Date(a.extra_id),
        keyB = new Date(b.extra_id);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    data.Orderhistories.forEach((element: any) => {
      let findOrder = histories.find((element2: any) => (element2.product_id == element.product_id));
      if (findOrder && element.extra_id) {
        histories.forEach((element2: any) => {
          if (element.product_id == element2.product_id) {
            if (!element2.extras) {
              element2.extras = [];
            }
            let findExtra = this.extrasLists.find((element3: any) => (element3.id == element.extra_id));
            let extraName = '';
            if (findExtra) {
              extraName = findExtra.description
            }
            element['extraName'] = extraName;
            let isExist = element2.extras.find((element3: any)=>((element.product_id == element3.product_id)&&(element.extra_id == element3.extra_id)))
            if(!isExist){
              element2.extras.push(element);
            }            
          }
        });
      }
      else {
        histories.push(element);
      }
    });
    this.selectedProduct = histories;
    // this.modalRef = this.modalService.show(this.template, {
    //   backdrop: 'static',
    //   keyboard: false,
    //   class: 'modal-xl'
    // });
  }



  getType(type: any) {
    let result = '';
    if (type == 'Rent') {
      result = 'Verhuur';
    }
    else if (type == 'Staffing') {
      result = 'Uitzend';
    }
    else if (type == 'Transport') {
      result = 'Transport';
    }
    return result;
  }

}
