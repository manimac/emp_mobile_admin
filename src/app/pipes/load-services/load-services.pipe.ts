import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from 'src/app/services/storage/storage.service';

@Pipe({
  name: 'loadServices'
})
export class LoadServicesPipe implements PipeTransform {

  constructor(private storage: StorageService){}
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }
    let role = this.storage.getRole();
    if(role == 'Admin' || role == 'All'){
      return items;
    }
    else if(role == 'Rent & Staffing'){
      return items.filter(item => ((item.type=='Rent')||(item.type=='Staffing')));
    }
    else if(role == 'Rent & Transport'){
      return items.filter(item => ((item.type=='Rent')||(item.type=='Transport')));
    }
    else if(role == 'Staffing & Transport'){
      return items.filter(item => ((item.type=='Staffing')||(item.type=='Transport')));
    }
    else if(role == 'Rent'){
      return items.filter(item => ((item.type=='Rent')));
    }
    else if(role == 'Staffing'){
      return items.filter(item => ((item.type=='Staffing')));
    }
    else if(role == 'Transport'){
      return items.filter(item => ((item.type=='Transport')));
    }
    return items;
  }

}

@Pipe({
  name: 'filterOrderId'
})
export class FilterOrderIdPipe implements PipeTransform {

  constructor(private storage: StorageService){}
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => ((item.id.toString().startsWith(filter))));
  }

}

@Pipe({
  name: 'filterUsersName'
})
export class FilterUsersNamePipe implements PipeTransform {

  constructor(private storage: StorageService){}
  transform(items: any[], filter: String): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => ((item.firstname.toLowerCase().startsWith(filter.toLowerCase()))));
  }

}


@Pipe({
  name: 'filterUsersEmail'
})
export class FilterUsersEmailPipe implements PipeTransform {

  constructor(private storage: StorageService){}
  transform(items: any[], filter: String): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => ((item.email.toLowerCase().startsWith(filter.toLowerCase()))));
  }

}


@Pipe({
  name: 'filterUsersPhone'
})
export class FilterUsersPhonePipe implements PipeTransform {

  constructor(private storage: StorageService){}
  transform(items: any[], filter: String): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => (item.phone && (item.phone.toString().startsWith(filter))));
  }

}