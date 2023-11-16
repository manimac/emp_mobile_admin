import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  employerFormGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    companylogo: new FormControl('', Validators.required),
    coverphoto: new FormControl(''),
    companyname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    description: new FormControl(''),
    website: new FormControl('', Validators.required),
    kvk: new FormControl(''),
    btw: new FormControl(''),
  });
  userDetails: any = {};
  constructor(private http: HttpRequestService, private storage: StorageService, private router: Router) {
    this.userDetails = this.storage.getUserDetails();
    if (this.userDetails && this.userDetails.id) {
      this.loadData();
    }
  }

  ngOnInit(): void {
  }

  loadData() {
    let params = {
      id: this.userDetails.id
    }
    this.http.post('employeruser/get', params).subscribe(
      (response: any) => {
        if (response) {
          this.employerFormGroup.patchValue(response);
        }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  submitEmployer() {
    const formData = new FormData();
    let keys = Object.keys(this.employerFormGroup.value);
    keys.forEach((key) => {
      // if (this.employerFormGroup.controls[key].value && (key == 'companylogo' || key == 'coverphoto'))
      formData.append(key, this.employerFormGroup.controls[key].value);
    });
    let url = 'employeruser/update'
    this.http.post(url, formData).subscribe(
      (response: any) => {
        if (response) {
          this.http.successMessage('Update successfully');
          this.loadData();
        }
      }, error => {
        console.log(error);
        this.http.errorMessage('Error updating form');
        // Handle the error
      });
  }

  onFileChange(event: any, section: string) {
    const file = event.target.files;
    if (section == 'logo') {
      this.employerFormGroup.patchValue({
        companylogo: file[0]
      });
    }
    else if (section == 'cover') {
      this.employerFormGroup.patchValue({
        coverphoto: file[0]
      });
    }
  }

}
