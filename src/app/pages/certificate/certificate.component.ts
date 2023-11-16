import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
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
    this.http.get('certificate').subscribe(
      (response: any)=>{
        if(response){
          this.formGroup.patchValue(response);
        }
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  save(){
    this.http.post('certificate', this.formGroup.value).subscribe(
      (response: any)=>{
        this.http.successMessage('Updated');
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

}