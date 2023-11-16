import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  constructor(private http: HttpRequestService, private storage: StorageService, private router: Router) {
    if(this.storage.getToken()){
      this.router.navigateByUrl('/vehicles');
    }
   }

  ngOnInit(): void {
  }

  login(){
    this.http.post('api/employer/login', this.formGroup.value).subscribe(
      (response: any)=>{
        this.storage.setToken(response.token);
        this.storage.setUserDetails(response);
        this.router.navigateByUrl('/assignments');
        setTimeout(()=>{
          location.reload();
        })
      },
      (error: any)=>{
        if(error && error.error && error.message){
          this.http.exceptionHandling(error);
        }
        else{
          this.http.errorMessage("Invalid Credentials");
        }        
      }
    )
  }

}
