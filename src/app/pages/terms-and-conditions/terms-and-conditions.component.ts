import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    content: new FormControl('', Validators.required)
  })
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  get formControls(){
    return this.formGroup.controls;
  }

  loadData(){
    this.http.get('terms-and-condition').subscribe(
      (response: any)=>{
        if(response){
          this.formGroup.patchValue({content: response.content});
        }
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  save(){
    this.http.post('update-term-and-cond', this.formGroup.value).subscribe(
      (response: any)=>{
        this.http.successMessage('Updated');
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

}