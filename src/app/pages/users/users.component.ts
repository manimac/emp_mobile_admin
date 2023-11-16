import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  dataLists: any = [];
  searchName: any = '';
  searchEmail: any = '';
  searchPhone: any = '';
  constructor(private http: HttpRequestService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.http.post('users' ,{}).subscribe(
      (response: any)=>{
        if(response.data){
          this.dataLists = response.data;
        }        
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  updateStatus(id: number, user: any, event: any){
    user['status'] = event.target.checked ? 1 : 0;
    user['username'] = user.firstname;
    this.http.post('user/update' ,user).subscribe(
      (response: any)=>{
        // this.loadData();       
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  navigateUser(id: any){
    this.http.post('user/update-userread' ,{id: id, isreaded: 1}).subscribe(
      (response: any)=>{
        this.http.updateUser.emit();
        this.router.navigateByUrl(`/user-detail/${id}`);
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )    
  }

}
