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
    type: new FormControl('Rent', Validators.required),
    vehicletype: new FormControl(''),
    name: new FormControl('', Validators.required),
    priceperhr: new FormControl('', Validators.required),
    priceperday: new FormControl('', Validators.required),
    adavanceamountforday: new FormControl('', Validators.required),
    noofseats: new FormControl('', Validators.required),
    acceleration: new FormControl('', Validators.required),
    location_id: new FormControl(''),
    location: new FormControl(''),
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
    image1: new FormControl(''),
    image2: new FormControl(''),
    image3: new FormControl(''),
    image4: new FormControl(''),
    availabledays: new FormControl(''),
    qnr: new FormControl('', Validators.required),
    lat: new FormControl('', Validators.required),
    lng: new FormControl('', Validators.required),
    fueltype: new FormControl('', Validators.required),
    fuelcapacity: new FormControl('', Validators.required),
    kmprice: new FormControl('', Validators.required),
    kmlimit: new FormControl('', Validators.required),
    additionalkm: new FormControl('', Validators.required)
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
    this.http.post('products', { fromadmin: 1, employer_id: this.userDetails.id }).subscribe(
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
  onImage1Change(file: any) {
    this.formGroup.patchValue({
      image1: file[0]
    });
  }
  onImage2Change(file: any) {
    this.formGroup.patchValue({
      image2: file[0]
    });
  }
  onImage3Change(file: any) {
    this.formGroup.patchValue({
      image3: file[0]
    });
  }
  onImage4Change(file: any) {
    this.formGroup.patchValue({
      image4: file[0]
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
    if(this.formGroup.value.id){
      _form.append('id', this.formGroup.value.id);
    }    
    _form.append('name', this.formGroup.value.name);
    let str = this.formGroup.value.name.replace(/\s+/g, '-').toLowerCase();
    _form.append('route', str);
    _form.append('type', this.formGroup.value.type);
    _form.append('priceperhr', this.formGroup.value.priceperhr);
    _form.append('adavanceamountforday', this.formGroup.value.adavanceamountforday);
    _form.append('priceperday', this.formGroup.value.priceperday);
    _form.append('noofseats', this.formGroup.value.noofseats);
    _form.append('acceleration', this.formGroup.value.acceleration);
    // _form.append('location_id', this.formGroup.value.location_id);
    _form.append('location', this.formGroup.value.location);
    _form.append('shortdescription', this.formGroup.value.shortdescription);
    _form.append('description', this.formGroup.value.description);
    _form.append('status', this.formGroup.value.status ? "1" : "0");
    _form.append('showinindex', "0");
    _form.append('thumbnail', this.formGroup.value.thumbnail);
    _form.append('qnr', this.formGroup.value.qnr);
    _form.append('lat', this.formGroup.value.lat);
    _form.append('lng', this.formGroup.value.lng);
    _form.append('vehicletype', this.formGroup.value.vehicletype);
    _form.append('image1', this.formGroup.value.image1);
    _form.append('image2', this.formGroup.value.image2);
    _form.append('image3', this.formGroup.value.image3);
    _form.append('image4', this.formGroup.value.image4);
    _form.append('fueltype', this.formGroup.value.fueltype);
    _form.append('fuelcapacity', this.formGroup.value.fuelcapacity);
    _form.append('employer_id', this.userDetails.id);
    _form.append('kmprice', this.formGroup.value.kmprice);
    _form.append('kmlimit', this.formGroup.value.kmlimit);
    _form.append('additionalkm', this.formGroup.value.additionalkm);
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
        location.reload()
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

  fetchLocation(){
    if(this.formGroup.value.qnr){
      this.http.post("invers/getStatus", {qnr: this.formGroup.value.qnr}).subscribe(
        (response: any) => {
          if(response && response.body){
            response.body = JSON.parse(response.body);
            if(response.body && response.body.position){
              this.http.getGoogleAddress(response.body.position.lat, response.body.position.lon).subscribe((element: any)=>{
                let locations = '';
                if (element && (element.results) && Array.isArray(element.results) && (element.results.length > 0)) {
                  let currentAddress = element.results.find((element: any)=>(element.types && Array.isArray(element.types) && (element.types.length>0) && (element.types[0]=='street_address')))
                  if(!currentAddress){
                    currentAddress = element.results[0];
                  }
                  if(currentAddress){
                    locations = currentAddress.formatted_address;
                  }          
                }
                let obj = {
                  lat: response.body.position.lat ? response.body.position.lat : '',
                  lng: response.body.position.lon ? response.body.position.lon : '',
                  location: locations
                }
                this.formGroup.patchValue(obj);
              })
              
            }
            console.log(response.body);
          }
          
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
    else{
      this.http.errorMessage("Please enter QNR Code")
    }
    
  }

  updateAddress(){
    this.http.getGoogleAddress(this.formGroup.value.lat, this.formGroup.value.lng).subscribe((element: any)=>{
      if (element && (element.results) && Array.isArray(element.results) && (element.results.length > 0)) {
        let currentAddress = element.results.find((element: any)=>(element.types && Array.isArray(element.types) && (element.types.length>0) && (element.types[0]=='street_address')))
        if(!currentAddress){
          currentAddress = element.results[0];
        }
        if(currentAddress){
          let obj = {
            location: currentAddress.formatted_address
          }
          this.formGroup.patchValue(obj);
        }          
      }
      
    })
  }

  checkOrder(){
    return this.selectedRow && this.selectedRow.Orderhistories && Array.isArray(this.selectedRow.Orderhistories) && (this.selectedRow.Orderhistories.length>0)
  }

}
