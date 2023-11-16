import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required)
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
    this.http.get('faqs').subscribe(
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
    this.http.delete('faq/delete/', id).subscribe(
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
    let url = (this.formGroup.value.id) ? 'faq/update' : 'faq/create'
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

}
