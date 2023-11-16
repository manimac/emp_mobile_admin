import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setToken(params: any) {
    localStorage.setItem('jwtEmpToken', params);
  }

  getToken() {
    let token = localStorage.getItem('jwtEmpToken')
    if (token) {
      token = token;
    }
    return token;
  }

  setUserDetails(params: any) {
    localStorage.setItem('jwtEmpUserDetails', JSON.stringify(params));
  }

  getUserDetails() {
    let userDetails = localStorage.getItem('jwtEmpUserDetails')
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
    }
    return userDetails;
  }

  isAdmin() {
    let result = false;
    let userDetails: any = localStorage.getItem('jwtEmpUserDetails')
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      if (userDetails.role && (userDetails.role == 'Admin')) {
        result = true;
      }
    }
    return result;
  }

  getRole() {
    let result = '';
    let userDetails: any = localStorage.getItem('jwtEmpUserDetails')
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      result = userDetails.role;
    }
    return result;
  }
}
