import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  })
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  get formControls(){
    return this.formGroup.controls;
  }

  loadData(){
    this.http.get('contactus').subscribe(
      (response: any)=>{
        if(response && Array.isArray(response) && response.length>0){
          this.formGroup.patchValue(response[0]);
        }
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  save(){
    this.http.post('contact/update', this.formGroup.value).subscribe(
      (response: any)=>{
        this.http.successMessage('Updated');
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

}
