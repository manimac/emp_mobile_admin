import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { types } from 'src/app/models/vehicleTypes';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  vehicleTypes: any = [];
  thumbImage: any;
  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    type: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    priceperhr: new FormControl('', Validators.required),
    priceperday: new FormControl('', Validators.required),
    adavanceamountforday: new FormControl('', Validators.required),
    noofseats: new FormControl('', Validators.required),
    acceleration: new FormControl('', Validators.required),
    location_id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    shortdescription: new FormControl('', Validators.required),
    thumbnail: new FormControl('', Validators.required),
    images: new FormControl(''),
    vehicle: new FormControl(''),
    fuel: new FormControl(''),
    transmission: new FormControl(''),
    parkingspace: new FormControl(''),
    storagespace: new FormControl(''),
    beroep: new FormControl(''),
    leeftijd: new FormControl(''),
    ervaring: new FormControl(''),
    nationality: new FormControl(''),
    voertuig: new FormControl(''),
    status: new FormControl(''),
    availabledays: new FormControl('')
  })
  showForm: boolean = false;
  dataLists: any = [];
  vehicleFilers: any = [];
  staffFilers: any = [];
  transportFilers: any = [];
  locations: any = [];
  specifications: any = [];
  selectedSpecifications: any = [];
  public selectedRow: any = {};
  userDetails: any = {};
  isAdmin: boolean = false;
  userRole: any = '';
  constructor(private http: HttpRequestService, private storage: StorageService) {
    this.userDetails = this.storage.getUserDetails();
    this.isAdmin = this.storage.isAdmin();
    this.userRole = this.storage.getRole();
    this.loadTypes();
  }

  loadTypes() {
    if (this.isAdmin || (this.userRole == 'All')) {
      this.vehicleTypes = types;
    }
    else if (this.userRole == 'Rent & Staffing') {
      this.vehicleTypes = ['Rent', 'Staffing'];
    }
    else if (this.userRole == 'Rent & Transport') {
      this.vehicleTypes = ['Rent', 'Transport'];
    }
    else if (this.userRole == 'Staffing & Transport') {
      this.vehicleTypes = ['Staffing', 'Transport'];
    }
    else if (this.userRole == 'Rent') {
      this.vehicleTypes = ['Rent'];
    }
    else if (this.userRole == 'Staffing') {
      this.vehicleTypes = ['Staffing'];
    }
    else if (this.userRole == 'Transport') {
      this.vehicleTypes = ['Transport'];
    }
  }

  ngOnInit(): void {
    this.loadData();
    this.loadLocations();
    this.loadSpecifications();
  }

  get formControls() {
    return this.formGroup.controls;
  }

  showFilter() {
    this.loadFilters(this.formGroup.value.type);
  }

  loadData() {
    this.http.post('products', { fromadmin: 1 }).subscribe(
      (response: any) => {
        this.dataLists = response && response.data;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadFilters(type: string) {
    this.http.get('filters/' + type).subscribe(
      (response: any) => {
        if (type == 'Rent')
          this.vehicleFilers = response
        if (type == 'Staffing')
          this.staffFilers = response
        if (type == 'Transport')
          this.transportFilers = response
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadLocations() {
    this.http.get('filter/locations').subscribe(
      (response: any) => {
        this.locations = response;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadSpecifications() {
    this.http.get('specifications').subscribe(
      (response: any) => {
        this.specifications = response;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }


  selectSpecification(event: any) {
    let alreadySpec = this.selectedSpecifications.find((x: any) => x.id == event.target.value);
    if (!alreadySpec) {
      let tmp = { id: event.target.value, name: '' };
      let spec = this.specifications.find((x: any) => x.id == event.target.value)
      tmp.name = spec.name;
      this.selectedSpecifications.push(tmp);
    }
    event.target.value = '';
  }

  deleteSpec(index: any) {
    this.selectedSpecifications.splice(index, 1);
  }

  create(element: HTMLElement) {
    element.scrollIntoView()
    this.selectedSpecifications = [];
    this.showForm = true;
  }

  viewElement(params: any, element: HTMLElement) {
    this.showForm = true;
    this.loadFilters(params.type);
    this.selectedRow = params;
    for (const spec of params.productspecifications) {
      if (spec.specification) {
        this.selectedSpecifications.push({ id: spec.specification_id, name: spec.specification.name });
      }
    }
    this.formGroup.patchValue(params);
    element.scrollIntoView()
  }

  deleteElement(id: number) {
    this.showForm = false;
    this.formGroup.reset();
    // this.dataLists.splice(index, 1)
    this.http.delete('order/delete/', id).subscribe(
      (response: any) => {
        this.http.successMessage('Deleted');
        this.showForm = false;
        this.formGroup.reset();
        this.loadData();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  deleteImage(id: number, index: number) {

    // this.dataLists.splice(index, 1)
    this.http.delete('order/image/delete/', id).subscribe(
      (response: any) => {
        this.http.successMessage('Deleted');
        this.selectedRow.Productimages.splice(index, 1)
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }
  onThumbnailChange(file: any) {
    // this.thumbImage = file[0];
    this.formGroup.patchValue({
      thumbnail: file[0]
    });
  }

  onImageChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files;
      this.formGroup.patchValue({
        images: file
      });
    }
  }

  save() {
    let url = (this.formGroup.value.id) ? 'order/update' : 'order/create'
    let _form = new FormData();
    _form.append('id', this.formGroup.value.id);
    _form.append('name', this.formGroup.value.name);
    let str = this.formGroup.value.name.replace(/\s+/g, '-').toLowerCase();
    _form.append('route', str);
    _form.append('type', this.formGroup.value.type);
    _form.append('priceperhr', this.formGroup.value.priceperhr);
    _form.append('adavanceamountforday', this.formGroup.value.adavanceamountforday);
    _form.append('noofseats', this.formGroup.value.noofseats);
    _form.append('acceleration', this.formGroup.value.acceleration);
    _form.append('location_id', this.formGroup.value.location_id);
    _form.append('shortdescription', this.formGroup.value.shortdescription);
    _form.append('description', this.formGroup.value.description);
    _form.append('status', this.formGroup.value.status ? "1" : "0");
    _form.append('showinindex', this.formGroup.value.showinindex);
    _form.append('thumbnail', this.formGroup.value.thumbnail);
    if (this.formGroup.value.vehicle)
      _form.append('vehicle', this.formGroup.value.vehicle || null);
    if (this.formGroup.value.fuel)
      _form.append('fuel', this.formGroup.value.fuel || null);
    if (this.formGroup.value.transmission)
      _form.append('transmission', this.formGroup.value.transmission || null);
    if (this.formGroup.value.parkingspace)
      _form.append('parkingspace', this.formGroup.value.parkingspace || null);
    if (this.formGroup.value.storagespace)
      _form.append('storagespace', this.formGroup.value.storagespace || null);
    if (this.formGroup.value.beroep)
      _form.append('beroep', this.formGroup.value.beroep || null);
    if (this.formGroup.value.leeftijd)
      _form.append('leeftijd', this.formGroup.value.leeftijd || null);
    if (this.formGroup.value.ervaring)
      _form.append('ervaring', this.formGroup.value.ervaring || null);
    if (this.formGroup.value.nationality)
      _form.append('nationality', this.formGroup.value.nationality || null);
    if (this.formGroup.value.voertuig)
      _form.append('voertuig', this.formGroup.value.voertuig || null);
    if (this.formGroup.value.availabledays)
      _form.append('availabledays', this.formGroup.value.availabledays || '');
    if (this.formGroup.value.images && this.formGroup.value.images.length > 0) {
      for (let i = 0; i < this.formGroup.value.images.length; i++) {
        _form.append('images', this.formGroup.value.images[i], this.formGroup.value.images[i]['name'])
      }
    }
    if (this.selectedSpecifications.length) {
      _form.append('specifications', JSON.stringify(this.selectedSpecifications));
    }
    this.http.post(url, _form).subscribe(
      (response: any) => {
        if (this.formGroup.value.id) {
          this.http.successMessage('Updated');
        }
        else {
          this.http.successMessage('Created');
        }
        this.showForm = false;
        this.selectedSpecifications = [];
        this.formGroup.reset();
        this.loadData();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  cancel() {
    this.showForm = false;
    this.formGroup.reset();
  }

}
