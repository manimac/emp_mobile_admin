import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-order-histories',
  templateUrl: './order-histories.component.html',
  styleUrls: ['./order-histories.component.css']
})
export class OrderHistoriesComponent implements OnInit {

  dataLists: any = [];
  showDetails: boolean = false;
  selectedProduct: any = {};
  selectedUser: any = {};
  extrasLists: any = [];
  searchKey: any = '';
  selectedOrder: any = {};
  constructor(private http: HttpRequestService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
    this.loadExtras();
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

  loadData() {
    let params = {
      status: 1
    }
    this.http.post('orders', params).subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data) && (response.data.length > 0)) {
          response.data = response.data.filter((el: any) => (el.type != 'maintenance'));
          response.data.forEach((element: any) => {
            let services: any = [];
            element.Orderhistories.forEach((element2: any) => {
              if (!element2.extra_id) {
                services.push(element2.type);
              }
            });
            element.services = services.join(',');
          });
          this.dataLists = response.data;
        }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  viewDetails(data: any) {
    this.selectedOrder = data;
    this.http.post('order/update-read', { id: data.id, isreaded: 1 }).subscribe(
      (response: any) => {
        this.http.updateOrder.emit();
        this.dataLists.forEach((el: any)=>{
          if(el.id == data.id){
            el.isreaded = 1;
          }
        })
        this.showDetails = true;
        this.selectedUser = data.User;
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
          element.extras = [];
        })
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
                element2.extras.push(element);
              }
            });
          }
          else {
            histories.push(element);
          }
        });
        this.selectedProduct = histories;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )

  }

  cancel() {
    this.showDetails = false;
  }

  cancelOrder(order: any) {
    this.http.post('order/cancel-order', { id: order.id, status: 0 }).subscribe(
      (response: any) => {
        this.http.successMessage("Canceled Successfully");
        this.showDetails = false;
        this.loadData();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  getImage(img: any){
    if(img){
      return "https://jezsel.nl/jezsel/uploads/product/" + img;
    }
    return '';    
  }

}
