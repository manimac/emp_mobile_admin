import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { types } from 'src/app/models/vehicleTypes';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  vehicleTypes: any = types;
  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    description: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    price: new FormControl(''),
    isGroup: new FormControl(0)
  })
  showForm: boolean = false;
  dataLists: any = [];
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  get formControls(){
    return this.formGroup.controls;
  }

  loadData(){
    this.http.get('product/extras').subscribe(
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

  create(element: HTMLElement){
    element.scrollIntoView()
    this.showForm = true;
  }

  viewElement(params: any, element: HTMLElement){
    this.showForm = true;
    this.formGroup.patchValue(params);
    element.scrollIntoView()
  }

  deleteElement(id: number){
    this.http.delete('order/extra/delete/delete/', id).subscribe(
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
    let url = (this.formGroup.value.id) ? 'order/extra/update' : 'order/extra/create'
    this.http.post(url, this.formGroup.value).subscribe(
      (response: any)=>{
        if(this.formGroup.value.id){
          this.http.successMessage('Updated');
        }
        else{
          this.http.successMessage('Created');
        }        
        this.showForm = false;
        this.formGroup.reset();
        this.loadData();
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }
  
  cancel(){
    this.showForm = false;
    this.formGroup.reset();
  }

  updateGroup(event: any){
    let data = 0;
    if(event.target.checked){
      data = 1;
    }
    this.formGroup.patchValue({isGroup: data});
  }

}

