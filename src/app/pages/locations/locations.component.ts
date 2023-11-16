import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  // content: any = '';
  // dataLists: any = [];
  // showForm: boolean = false;
  // formGroup: FormGroup = new FormGroup({
  //   id: new FormControl(''),
  //   content: new FormControl('', Validators.required)
  // })
  // constructor(private http: HttpRequestService) { }

  // ngOnInit(): void {
  //   this.loadData();
  // }

  // loadData(){
  //   this.http.get('location').subscribe(
  //     (response: any)=>{
  //       if(response){
  //         this.dataLists = response.iframes ? response.iframes.split(',') : [];
  //         this.formGroup.patchValue({content: response.content});
  //       }
  //     },
  //     (error: any)=>{
  //       this.http.exceptionHandling(error);
  //     }
  //   )
  // }

  // save(){
  //   let iframes = this.dataLists.join(',');
  //   let obj = {content: this.formGroup.value.content, iframes: iframes}
  //   this.http.post('location', obj).subscribe(
  //     (response: any)=>{
  //       this.http.successMessage('Updated');
  //     },
  //     (error: any)=>{
  //       this.http.exceptionHandling(error);
  //     }
  //   )
  // }

  // create(element: HTMLElement){
  //   this.dataLists.push('');
  // }

  // updateLocation(index: number, event: any){
  //   for(let i = 0;i < this.dataLists.length;i++){
  //     if(index == i){
  //       this.dataLists[i] = event.target.value;
  //     }
  //   }
  // }

  // deleteElement(index: number){
  //   this.dataLists.splice(index, 1);
  // }
  
  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    content: new FormControl('', Validators.required),
    iframes: new FormControl('', Validators.required)
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
    this.http.get('location').subscribe(
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
    this.http.delete('/location/delete/', id).subscribe(
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
    let url = (this.formGroup.value.id) ? 'location/update' : 'location/create'
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
