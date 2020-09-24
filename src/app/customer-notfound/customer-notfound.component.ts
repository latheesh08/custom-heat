import { Component, OnInit, Output, EventEmitter,Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-customer-notfound',
  templateUrl: './customer-notfound.component.html',
  styleUrls: ['./customer-notfound.component.scss', '../booking-portal/booking-portal.component.scss']
})
export class CustomerNotfoundComponent implements OnInit {
  isManualAddress = false
  isBillingandJobSame = false
  submitted = false
  apiToken = 'pACtNd5kgAREc0I95zhz_7LaOYw5hNqGI_ITHu5C1zLcBoJp4xpV7zXo0S-2DntZ9F3O2nhKKU-R8W7Z0CN8ng'
  Titles = []
  newCustomer
  isLoaded = true
  county = []

  @Input() data: Object;
  @Output("backFun") backFun: EventEmitter<any> = new EventEmitter();
  @Output("nextFun") nextFun: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,

  ) { }

  ngOnInit(): void {
    this.getCounty()
    this.http.get<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/titles?token=${this.apiToken}`).subscribe(data => { 
      console.log('response for county',data)
      this.Titles = data.titles.map(it => ({title : it.description, id : it.id}))
    })
  }

  newAddressForm = this.fb.group({
    Title: [''],
    Name: [''],
    SurName: ['', [Validators.required]],
    MobileNumber: ['', [Validators.required]],
    EmailId :[''],
    Address1: ['', [Validators.required]],
    Address2: ['' ],
    Address3: ['' ],
    Town: ['', ],
    County: ['', ],
    Postcode: ['',[Validators.required]],

  })
  async secondNext() {
    this.submitted = true
    if(this.newAddressForm.invalid){
      return
    }
    this.isLoaded = false
    console.log('in not found')
   await this.createNewCustomer()
   this.nextFun.emit(this.newCustomer)
  //  this.isLoaded =true
  }
  back() {

  }
  public valuesplacing() {
    debugger
    console.log(this.data['Address_from_google'])
    var add_1 = (this.data['Address_from_google']['street_number'] ? this.data['Address_from_google']['street_number']['long_name'] : '') + ' ' + (this.data['Address_from_google']['route'] ? this.data['Address_from_google']['route']['long_name'] : '') +' ' +  (this.data['Address_from_google']['neighborhood'] ? this.data['Address_from_google']['neighborhood']['long_name'] : '')
    this.newAddressForm.patchValue({
      MobileNumber : this.data['number'],
      EmailId : this.data['email'],
      Address1: add_1,
      Address2: this.data['Address_from_google']['administrative_area_level_2'] ? this.data['Address_from_google']['administrative_area_level_2']['long_name'] : '',
      Address3: this.data['Address_from_google']['administrative_area_level_1'] ? this.data['Address_from_google']['administrative_area_level_1']['long_name'] : '',
      Town: this.data['Address_from_google']['postal_town'] ? this.data['Address_from_google']['postal_town']['long_name'] : '',
      Postcode: this.data['Address_from_google']['postal_code'] ? this.data['Address_from_google']['postal_code']['long_name'] : '',
     })
  }
  public enterAddNor(){
    this.newAddressForm.patchValue({
      EmailId : '',
      MobileNumber : '',
      Address1: '',
      Address2: '',
      Address3: '',
      Town: '',
      Postcode:  '',
     })
  }
//   getAddress(place: object) {
//     console.log(this.data)
//     console.log(place)
//     var Address_from_google = {};
//     for (var i = 0; i < place['address_components'].length; i++) {
//       var c = place['address_components'][i];
//       Address_from_google[c.types[0]] = c;
//     }
//     console.log(Address_from_google);
// var add_1 = Address_from_google['street_number'] ? Address_from_google['street_number'] : '' + Address_from_google['route'] ? Address_from_google['route'] : '' + Address_from_google['neighborhood'] ? Address_from_google['neighborhood'] : ''
//     this.newAddressForm.patchValue({
//       MobileNumber : this.data['number'],
//       Address1: add_1,
//       Address2: Address_from_google['administrative_area_level_2'] ? Address_from_google['administrative_area_level_2']['long_name'] : '',
//       Address3: Address_from_google['administrative_area_level_1'] ? Address_from_google['administrative_area_level_1']['long_name'] : '',
//       Town: Address_from_google['postal_town'] ? Address_from_google['postal_town']['long_name'] : '',
//       Postcode: Address_from_google['postal_code'] ? Address_from_google['postal_code']['long_name'] : '',
//      })
//   }
  getCounty(){
    this.http.get<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/stateprovinces?token=${this.apiToken}`).subscribe(data => { 
    
    console.log('response for county',data)
    this.county = data.stateprovinces.map(it => it.description)
    })
  
  }

  get f() { return this.newAddressForm.controls; }
  createNewCustomer() {
    let promise = new Promise((resolve, reject) => {
      let body = {
        customertype: {
          contacts: {
            contactsemail : {
            emailaddress : this.newAddressForm.value.EmailId 
            } ,
            settingsTitlesid : this.newAddressForm.value.Title.id,
            name: this.newAddressForm.value.Name,
            surname:  this.newAddressForm.value.SurName,
            contactstelephone: [
              {
                telephonenumber: ''
              },
              {
                telephonenumber: this.newAddressForm.value.MobileNumber
              }
            ],
            uuid: uuid(),
          },
          addressline1: this.newAddressForm.value.Address1,
          addressline2: this.newAddressForm.value.Address2,
          addressline3: this.newAddressForm.value.Address3,
          town : this.newAddressForm.value.Town,
          county : this.newAddressForm.value.County,
          postcode : this.newAddressForm.value.Postcode,
          uuid: uuid()
        }
      }

      
      let apiURL = `https://dev.commusoft.net/webservice_dev.php/api/v1/customers/1?token=${this.apiToken}`;

 
      this.http.post(apiURL,body,{ observe: 'response' })
        .toPromise()
        .then(
          res => { // Success
            console.log('new customer response',res , res.headers.get('Location'))
            this.newCustomer = res.headers.get('Location').split('/').pop()
            console.log(this.newCustomer)
            resolve();
          },
          err => { // Error
            console.log('inside error new Customer id')
            resolve();
          }
        );
    });
    return promise;

  }
  check_toggle() {
    this.isBillingandJobSame = !this.isBillingandJobSame
  }
}
