import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  navigations: any = [];
  userDetails: any = {};
  userunread: any = 0;
  orderunread: any = 0;
  withdrawunread: any = 0;
  constructor(private storage: StorageService, private http: HttpRequestService) { 
    this.userDetails = this.storage.getUserDetails();
    this.loadNavigations();
  }

  ngOnInit(): void {
  }

  loadNavigations(){
    this.navigations = [      
      {
        label: 'Place an Order',
        route: '/place-order',
        icon: 'mdi-cart'
      },
      {
        label: 'Assignments',
        route: '/assignments',
        icon: 'mdi-cart'
      },
      {
        label: 'Calendar',
        route: '/calendar',
        icon: 'mdi-cart'
      },
      {
        label: 'Company profile',
        route: '/company-profile',
        icon: 'mdi-cart'
      },
      {
        label: 'Invoice',
        route: '/invoice',
        icon: 'mdi-cart'
      },
      {
        label: 'Interests',
        route: '/interests',
        icon: 'mdi-information'
      }
    ];
  }

}
