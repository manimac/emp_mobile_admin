import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrls: ['./staffs.component.css']
})
export class StaffsComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    firstname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    newpassword: new FormControl(''),
    role: new FormControl('', Validators.required)
  })
  showForm: boolean = false;
  dataLists: any = [];
  rolesLists: any = ['Admin', 'All', 'Rent', 'Staffing', 'Transport', 'Rent & Staffing', 'Rent & Transport', 'Staffing & Transport'];
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  get formControls(){
    return this.formGroup.controls;
  }

  loadData(){
    this.http.post('users' ,{is_admin: 1}).subscribe(
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

  create(element: HTMLElement){
    element.scrollIntoView()
    this.showForm = true;
  }

  viewElement(params: any, element: HTMLElement){
    this.showForm = true;
    params['confirmpassword'] = params['password'];
    this.formGroup.patchValue(params);
    element.scrollIntoView()
  }

  deleteElement(id: number){
    this.http.delete('user/delete/', id).subscribe(
      (response: any)=>{
        this.http.successMessage('Deleted');      
        this.showForm = false;
        this.formGroup.reset();
        this.loadData();
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  save(){
    this.formGroup.value['is_admin'] = true;
    let url = this.formGroup.value.id ? 'user/update' : 'signup';
    if(this.formGroup.value.id){
      this.formGroup.value['username'] = this.formGroup.value['firstname'];
      this.http.post(url, this.formGroup.value).subscribe(
        (response: any)=>{
          this.http.successMessage("User Updated Successfully");    
          this.showForm = false;
          this.formGroup.reset();
          this.loadData();
        },
        (error: any)=>{
          this.http.exceptionHandling(error);
        }
      )
    }
    else{
      this.http.postAuth(url, this.formGroup.value).subscribe(
        (response: any)=>{
          this.http.successMessage("User Created Successfully");      
          this.showForm = false;
          this.formGroup.reset();
          this.loadData();
        },
        (error: any)=>{
          this.http.exceptionHandling(error);
        }
      )
    }    
  }
  
  cancel(){
    this.showForm = false;
    this.formGroup.reset();
  }

}
