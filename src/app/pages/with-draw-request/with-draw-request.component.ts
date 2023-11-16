import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-with-draw-request',
  templateUrl: './with-draw-request.component.html',
  styleUrls: ['./with-draw-request.component.css']
})
export class WithDrawRequestComponent implements OnInit {

  dataLists: any = [];
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.http.post('withdraws' ,{}).subscribe(
      (response: any)=>{
        if(response){
          this.dataLists = response;
        }        
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  updateStatus(id: number, status: any, User: any){
    let params = {
      id: id,
      status: status,
      user: User,
    }
    this.http.post('withdraw/update' ,params).subscribe(
      (response: any)=>{     
        this.http.successMessage("Updated Successfully");
        this.loadData();  
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  navigatWithdraw(id: any){
    this.http.post('updateWithdrawRead' ,{id: id, isreaded: 1}).subscribe(
      (response: any)=>{
        this.http.updateWithdraw.emit();
        this.loadData();
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )    
  }

}