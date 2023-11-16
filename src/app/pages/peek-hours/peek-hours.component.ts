import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
@Component({
  selector: 'app-peek-hours',
  templateUrl: './peek-hours.component.html',
  styleUrls: ['./peek-hours.component.css']
})
export class PeekHoursComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    peekvehicle: new FormControl('', Validators.required),
    peekstaffing: new FormControl('', Validators.required),
    peektransport: new FormControl('', Validators.required)
  })

  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  get formControls(){
    return this.formGroup.controls;
  }

  loadData(){
    this.http.get('home').subscribe(
      (response: any)=>{
        this.formGroup.patchValue(response);
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

  save(){
    this.http.post('home/update', this.formGroup.value).subscribe(
      (response: any)=>{
        this.http.successMessage('Updated');  
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

}
