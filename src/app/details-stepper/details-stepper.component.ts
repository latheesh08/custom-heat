import { Component, OnInit, ViewChild, Optional, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuid } from 'uuid';
import { promise } from 'protractor';
// import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-details-stepper',
  templateUrl: './details-stepper.component.html',
  styleUrls: ['./details-stepper.component.scss', '../booking-portal/booking-portal.component.scss']
})
export class DetailsStepperComponent implements OnInit {

  Services = []
  BillingAddress = null
  SecondAddress;
  selectedAddress;
  WorkAddresses = []
  moreAddresses = []
  isServiceSelected = false
  isNewWorkAddress = false
  isNewWorkAddress_in_notFound = false
  isBillingandJobSame = true
  isBillingandJobSame_cus_notFound = true
  firstImage = null
  secondImage = null
  thirdImage = null
  CustomerAddresses
  apiToken = 'pACtNd5kgAREc0I95zhz_7LaOYw5hNqGI_ITHu5C1zLcBoJp4xpV7zXo0S-2DntZ9F3O2nhKKU-R8W7Z0CN8ng';
  customerId = ''
  isInnerLoad = true
  contactId = null
  newWorkAddressId = null
  workAddressId = null
  Titles = []
  submitted_new_WA = false
  workAdd_placeholder = 'Choose your address'
  selectedStep = false
  county = []
  JobId
  images =[]
  price = null

  @Input() data: Object;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  @Output("notBill") notBill: EventEmitter<any> = new EventEmitter();

  // @Output("newAddressFun") newAddressFun: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    library: FaIconLibrary,
    // private sanitizer:DomSanitizer

  ) {
    library.addIcons(faCamera);
  }

  detailForm = new FormControl();
  notes = new FormControl();
  newJobAddress = this.fb.group({
    title: [''],
    surName: ['', [Validators.required]],
    MobileNumber: ['', [Validators.required]],
    EmailId : [''],
    firstName: [''],
    Address1: ['', [Validators.required]],
    Address2: [''],
    Address3: [''],
    Town: ['', ],
    County: ['', ],
    Postcode: ['',[Validators.required] ],


  })
  get f() { return this.newJobAddress.controls; }
  questionsForm = this.fb.group({
    Question_1: ['', [Validators.required]],
    Question_2: ['', [Validators.required]],
    Question_3: ['', [Validators.required]],
    Question_4: ['', [Validators.required]]


  })
  ngOnInit(): void {
    this.http.get<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/titles?token=${this.apiToken}`).subscribe(data => { 
    console.log('response for county',data)
    this.Titles = data.titles.map(it => ({title : it.description, id : it.id}))
    })
  }

  getAddress(place: object) {


    console.log(place)
    var Address_from_google = {};
    for (var i = 0; i < place['address_components'].length; i++) {
      var c = place['address_components'][i];
      Address_from_google[c.types[0]] = c;
    }
    console.log(Address_from_google);
    this.selectedAddress = place['formatted_address']
var add_1 = (Address_from_google['street_number'] ? Address_from_google['street_number']['long_name'] : '') + ' ' + (Address_from_google['route'] ? Address_from_google['route']['long_name'] : '') + ' '+(Address_from_google['neighborhood'] ? Address_from_google['neighborhood']['long_name'] : '')
    this.newJobAddress.patchValue({
      Address1: add_1,
      Address2: Address_from_google['administrative_area_level_1'] ? Address_from_google['administrative_area_level_1']['long_name'] : '',
      Address3: Address_from_google['administrative_area_level_1'] ? Address_from_google['administrative_area_level_2']['long_name'] : '',
      Town: Address_from_google['postal_town'] ? Address_from_google['postal_town']['long_name'] : '',
      Postcode: Address_from_google['postal_code'] ? Address_from_google['postal_code']['long_name'] : '',
     })

  }

  public SettingAddress() {
    this.getCounty()
    if(this.data['customer_addresses'].length > 1){
      this.CustomerAddresses = this.data['customer_addresses']
    }else{
      this.BillingAddress = this.data['customer_addresses']
      this.customerId = this.BillingAddress[0].cid
      this.selectedStep = true
      this.getAllWorkAddress()

    }
  }
  getAllWorkAddress() {
    this.http.get<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/customers/${this.customerId}/workaddresses?token=${this.apiToken}`).subscribe(data => {
      console.log('Work Address ', data)
      data.workAddress.map(it => {
        let a = { address: '', id: '' }
        a.address = ((it.addressline1 !== undefined && it.addressline1 !== null) ? it.addressline1 : '') + ((it.addressline2 !== undefined && it.addressline2 !== null) ? ',' + it.addressline2  : '') + ((it.county !== undefined && it.county !== null) ? ',' + it.county : '') + ((it.town !== undefined && it.town !== null) ? ',' + it.town: '') + ((it.postcode !== undefined && it.postcode !== null) ? ',' + it.postcode : '');
        a.id = it.id
        this.WorkAddresses.push(a)
      })
      this.isInnerLoad = false
    },
    err => {
      console.log('error inside getting work address')
      console.log(err)
      err.status === 404 ? this.workAdd_placeholder = 'There is no work address' : this.workAdd_placeholder = 'Choose your address'
      this.isInnerLoad = false
    }
    
    )

  }

  getContactID() {
    let promise = new Promise((resolve, reject) => {
      let apiURL = `https://dev.commusoft.net/webservice_dev.php/api/v1/customers/${this.customerId}?token=${this.apiToken}`;
      this.http.get(apiURL)
        .toPromise()
        .then(
          res => { // Success
            console.log('contact ID', res)
            this.contactId = res['Customer'].contactid
            resolve();
          },
          err => { // Error
            console.log('inside error contact id')
            resolve();
          }
        );
    });
    return promise;

  }

  BookJob(jobid) {
    let body = {
      job: {
        contactid: this.contactId,
        settingsjobdescriptionid: this.data['selectedJob'].id,
        engineernotes : this.notes.value ? this.notes.value : '',
        uuid: uuid()
      }
    }
    let promise = new Promise((resolve, reject) => {
      let apiURL = `https://dev.commusoft.net/webservice_dev.php/api/v1/customers/${jobid}/jobs?token=${this.apiToken}`;
      this.http.post<any>(apiURL, body)
        .toPromise()
        .then(
          data => { // Success
            console.log("post job details")
            console.log(data)
            this.JobId = data.jobId
            resolve();
          },
          err => { // Error
            console.log('inside error post job details' , err)
            resolve();
          }
        );
    });
    return promise;

  }


  noBillingAddres(){
    this.CustomerAddresses = []
    this.WorkAddresses = []
    this.isBillingandJobSame = true
    this.selectedStep = false
    this.stepper.reset()
    this.notBill.emit()
  }
  getCounty(){
    this.http.get<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/stateprovinces?token=${this.apiToken}`).subscribe(data => { 
    
    console.log('response for county',data)
    this.county = data.stateprovinces.map(it => it.description)
    })
  
  }
  AddressSelect(id) {
    this.CustomerAddresses.map(it => it.cid == id ? it.isSelected = true : it.isSelected = false)
    this.customerId = id
    console.log('clicked')
    this.BillingAddress = this.CustomerAddresses.filter(it => it.isSelected == true)
  }
  async AfterSelectingaddress() {
    // this.isInnerLoad = false
    this.getAllWorkAddress()
    this.goNext()
  }
  onFileChanged(event) {
    const file = event.target.files[0]
  }
  check_toggle() {
    this.isBillingandJobSame = !this.isBillingandJobSame
  }
  notFound_check_toggle() {
    this.isBillingandJobSame_cus_notFound = !this.isBillingandJobSame_cus_notFound
    this.isNewWorkAddress_in_notFound = !this.isNewWorkAddress_in_notFound
  }
  workAddressNotFound() {
    this.isNewWorkAddress = !this.isNewWorkAddress
  }

  onSelectFile(event, value) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      var filedata = event.target.files[0]
      reader.readAsBinaryString(filedata); // read file as data url
      var fileDetails = {
        file_name : filedata.name,
        file_size : filedata.size,
        file_type : filedata.type,
        file_data : '',
        uuid: uuid()
      }
      reader.onload = (event: any) => { // called once readAsDataURL is completed

        console.log(event);
        let encoded = btoa(event.target.result)
        fileDetails.file_data = encoded
        this.images.push(fileDetails)
        console.log('base64', encoded)
        value === 'first' ? this.firstImage = encoded : (value === 'second' ? this.secondImage = encoded : this.thirdImage = encoded)

      }
    }
  }
  getDataUrl = imgData => `data:image/png;base64,${imgData}`;

  goNext() {
    this.stepper.next();
  }
  createNewWorkAddress() {
    let promise = new Promise((resolve, reject) => {
      let body = {
        workaddress: {
          contacts: {
            settingsTitlesid : this.newJobAddress.value.title.id,
            surname : this.newJobAddress.value.surName,
            name : this.newJobAddress.value.firstName,
            contactsemail : {
              emailaddress : this.newJobAddress.value.EmailId
            },
            contactstelephone: [
              {
                telephonenumber : ''
              },
              {
                telephonenumber: this.newJobAddress.value.MobileNumber
              }
            ]
          },
          addressline1: this.newJobAddress.value.Address1,
          addressline2: this.newJobAddress.value.Address2,
          addressline3: this.newJobAddress.value.Address3,
          town : this.newJobAddress.value.Town,
          county : this.newJobAddress.value.County,
          postcode : this.newJobAddress.value.Postcode,
          uuid: uuid()
        }
      }

      let apiURL = `https://dev.commusoft.net/webservice_dev.php/api/v1/customers/${this.customerId}/workaddresses?token=${this.apiToken}`;
      this.http.post(apiURL, body)
        .toPromise()
        .then(
          res => { // Success
            this.newWorkAddressId = res['workAddressId']
            resolve();
          },
          err => { // Error
            console.log('inside error contact id')
            resolve();
          }
        );
    });
    return promise;

  }

  async details_button_first() {
    this.price = this.data['selectedJob'].price
    if(this.isNewWorkAddress){
      this.submitted_new_WA = true
      if(this.newJobAddress.invalid){
        return
      }
      this.isInnerLoad = true
      await this.createNewWorkAddress()
    }
    this.isInnerLoad = true
    await this.getContactID()
    this.isInnerLoad = false
    this.stepper.next();
    this.price  == null ? this.stepper.next() : ''
  }

  imagePost(body){
    let promise = new Promise((resolve, reject) => {
      let apiURL = `https://dev.commusoft.net/webservice_dev.php/api/v1/customers/${this.customerId}/jobs/${this.JobId}/jobfiles?token=${this.apiToken}`;
      this.http.post<any>(apiURL, body)
        .toPromise()
        .then(
          data => { // Success
            console.log("uploading images success")
            console.log(data)
            resolve();
          },
          err => { // Error
            console.log('uploading images error' , err)
            resolve();
          }
        );
    });
    return promise;
  }

  details_button_second() {
    this.stepper.next();
  }
 async details_image_upload() {
    console.log(this.images)
    for(let i=0 ; i< this.images.length ; i++){
    await  this.imagePost(this.images[i])
    }

console.log('print after uploaded')
    this.stepper.next();
  }

  async  details_final_button(){
    this.isInnerLoad =true
    if(this.detailForm.value !== null && !this.isNewWorkAddress){
      this.workAddressId = this.detailForm.value.id
    }
  let jobid =  this.newWorkAddressId !== null ? this.newWorkAddressId  : (this.workAddressId !== null ? this.workAddressId : this.customerId)
    await this.BookJob(jobid)
if(this.images.length > 0){
await  this.details_image_upload()
}

    if (this.isBillingandJobSame) {
      this.data['WorkAddresses'] = this.BillingAddress.map(it => (it.cus_address !== undefined ? it.cus_address : '')+' '+(it.cus_country !== undefined ? it.cus_country : '')+' '+(it.cus_postcode !== undefined ? it.cus_postcode : ''))[0]
      console.log('before calling appointments if both job and bill same', this.customerId, this.contactId , this.JobId)
      this.data['appointments'].FirstCall(this.customerId, this.contactId , this.JobId)
    }
    else if (this.detailForm.value !== null && !this.isNewWorkAddress) {
      let newCusId = this.detailForm.value.id
      this.data['WorkAddresses'] = this.detailForm.value.address
      console.log('before calling appointments ', newCusId, this.contactId , this.JobId)
      this.data['appointments'].FirstCall(newCusId, this.contactId ,this.JobId)
    }
    else if (this.newJobAddress.value !== null) {
      this.data['WorkAddresses'] = this.selectedAddress
      console.log('before calling appointments new work address', this.newWorkAddressId, this.contactId ,this.JobId)
      this.data['appointments'].FirstCall(this.newWorkAddressId, this.contactId ,this.JobId)
    }

    this.isInnerLoad = false
    this.parentFun.emit()
  }

  skip_fun() {
    this.stepper.next();
  }
  details_button_third() {
    this.stepper.next();
  }
  details_button_fourth() {
    this.stepper.next();
  }
}
