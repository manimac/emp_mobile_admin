import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    icon1: new FormControl('', Validators.required)
  })
  showForm: boolean = false;
  dataLists: any = [];
  userDetails: any = {};
  constructor(private http: HttpRequestService, private storage: StorageService) { 
    this.userDetails = this.storage.getUserDetails();
  }

  ngOnInit(): void {
    this.loadData();
  }

  get formControls(){
    return this.formGroup.controls;
  }

  loadData(){
    this.http.post('category/get', {employer_id: this.userDetails.id}).subscribe(
      (response: any)=>{
        this.dataLists = response;
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
    this.http.delete('category/delete/', id).subscribe(
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
    let url = (this.formGroup.value.id) ? 'category/update' : 'category/create';
    let _form = new FormData();
    _form.append('id', this.formGroup.value.id);
    _form.append('title', this.formGroup.value.title);
    _form.append('icon1', this.formGroup.value.icon1);
    _form.append('employer_id', this.userDetails.id);
    this.http.post(url, _form).subscribe(
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

  onThumbnailChange(file: any) {
    this.formGroup.patchValue({
      icon1: file[0]
    });
  }

}