import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  employerFormGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    companylogo: new FormControl('', Validators.required),
    coverphoto: new FormControl(''),
    companyname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    description: new FormControl(''),
    website: new FormControl('', Validators.required),
    kvk: new FormControl(''),
    btw: new FormControl(''),
  });
  userDetails: any = {};
  constructor(private http: HttpRequestService, private storage: StorageService, private router: Router) {
    if (this.storage.getToken()) {
      this.router.navigateByUrl('/assignments');
    }
    this.userDetails = this.storage.getUserDetails();
  }

  ngOnInit(): void {
  }

  submitEmployer() {
    let url = 'api/employer/signup'
    let params = JSON.parse(JSON.stringify(this.employerFormGroup.value));
    delete params.companylogo;
    delete params.coverphoto;
    this.http.post(url, params).subscribe(
      (response: any) => {
        if (response) {
          const formData = new FormData();
          let keys = Object.keys(this.employerFormGroup.value);
          keys.forEach((key) => {
            if (this.employerFormGroup.controls[key].value && (key == 'companylogo' || key == 'coverphoto'))
              formData.append(key, this.employerFormGroup.controls[key].value);
          });
          formData.append('id', response.userid);
          let url = 'employeruser/update' 
          this.http.post(url, formData).subscribe(
            (response: any) => {
              if (response) {
                this.http.successMessage('Registered successfully');
                this.employerFormGroup.reset();
                this.router.navigateByUrl('/login');
              }
            }, error => {
              console.log(error);
              this.http.errorMessage('Error Registering form');
              // Handle the error
            });
        }
      }, error => {
        console.log(error);
        this.http.errorMessage('Error Registering form');
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