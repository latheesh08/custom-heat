import { Component, OnInit, ViewChild, Optional, Inject, NgZone ,ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatCheckbox } from '@angular/material/checkbox'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTools, faHome, faCheck } from '@fortawesome/free-solid-svg-icons';
import { AppointmentsStepperComponent } from '../appointments-stepper/appointments-stepper.component'
import { DetailsStepperComponent } from '../details-stepper/details-stepper.component'
import { CustomerNotfoundComponent } from '../customer-notfound/customer-notfound.component'
import { MatSnackBar, MAT_SNACK_BAR_DATA,MatSnackBarRef } from '@angular/material/snack-bar';


@Component({
  selector: 'app-booking-portal',
  templateUrl: './booking-portal.component.html',
  styleUrls: ['./booking-portal.component.scss']
})
export class BookingPortalComponent implements OnInit {

  apiToken = 'pACtNd5kgAREc0I95zhz_7LaOYw5hNqGI_ITHu5C1zLcBoJp4xpV7zXo0S-2DntZ9F3O2nhKKU-R8W7Z0CN8ng';
  available_services = []
  moreAddresses = []
  customerId = '16006'
  isLoaded = false
  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContent, {
      panelClass: 'my-dialog',
      disableClose: true,
      data: {
        values: this.available_services
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  ngOnInit(): void {
    this.http.get<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/jobdescriptions?token=${this.apiToken}`).subscribe(data => {
      console.log(data)
      this.available_services = data.jobdescription.map(it => ({ service: it.description, id: it.id, time_to_complete: it.timetocomplete, selected: false , price : it.price}))
      this.isLoaded = true
    })
  }

}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./booking-portal.component.scss']
})
export class DialogContent implements OnInit {
  Services = []
  isServiceList
  apiToken = 'pACtNd5kgAREc0I95zhz_7LaOYw5hNqGI_ITHu5C1zLcBoJp4xpV7zXo0S-2DntZ9F3O2nhKKU-R8W7Z0CN8ng';
  selectedAddress;
  isServiceSelected = false
  CusNotFound_By_intital = false
  searchString = null
  filter_by_mail;
  filter_by_number;
  filter_by_newString = [];
  final_filtered_customer_address = []
  data;
  isNewCustomer = false
  detailedComponent
  custNotFound 
  isloader = false
  isloader_in_search = false
  isNoCustomerFoundBySearch = false
  bookedDate
  BookedTime
  BookedAddress
  submitted = false
  isnewPlaceEntered = false

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  @ViewChild(AppointmentsStepperComponent) appointments: AppointmentsStepperComponent;
  @ViewChild(DetailsStepperComponent) details: DetailsStepperComponent;
  @ViewChild(CustomerNotfoundComponent) cusnfound : CustomerNotfoundComponent;
  @ViewChild('addresstext') addresstext: ElementRef;


  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public datas: any,
    private fb: FormBuilder,
    private http: HttpClient,
    public zone: NgZone,
    public snackBar: MatSnackBar,
    library: FaIconLibrary
  ) {
    library.addIcons(faTools, faHome, faCheck);
    this.Services = datas.values
    this.isServiceList = this.Services.length > 5 ? false : true
    this.data = datas


  }
  serviceForm = this.fb.group({
    emailAddress: ['', [Validators.required,Validators.email]],
    phoneNumber: ['', [Validators.required]],
  })

  selectedService = new FormControl();


  searchForm = this.fb.group({
    search_string: ['', [Validators.required]],
  })
  get f() { return this.serviceForm.controls; }

  changeAddress() {

  }
  onClose(): void {
    this.openSnackBar();
    // this.dialogRef.close();
  }
  newAddress() {
    this.isNewCustomer = !this.isNewCustomer
    this.isnewPlaceEntered = false
   
  }
  enterAddNormally(){
    this.isNewCustomer = !this.isNewCustomer
    this.cusnfound.enterAddNor()
  }
  cancel(){
    this.CusNotFound_By_intital = false
    this.isnewPlaceEntered = false
    this.stepper.reset()
  }
  proceedWithNewCus(id) {
    this.newSearch(id)
  }
  async newSearch(newId) {
    this.isloader_in_search = true
    this.isNoCustomerFoundBySearch = false
    newId !== null ? await this.getCustomersfromNewSearch(newId) : await this.getCustomersfromNewSearch(null)

    if (this.filter_by_newString.length > 0) {
      const seen = new Set();
      var unique_customers = this.filter_by_newString.filter(el => {
        const duplicate = seen.has(el.id);
        seen.add(el.id);
        return !duplicate;
      });

      console.log(unique_customers)

      this.final_filtered_customer_address = unique_customers.map(it => ({
        cid: it.id,
        cus_name: (it.customer_name !== undefined || it.customer_name !== null) ? it.customer_name : "",
        cus_address: ((it.addressline1_s !== undefined || it.addressline1_s !== null) ? it.addressline1_s : "") + " " + ((it.addressline2_s !== undefined || it.addressline2_s !== null) ? it.addressline2_s : "") + " " + ((it.addressline3_s !== undefined || it.addressline3_s !== null) ? it.addressline3_s : ""),
        cus_country: (it.county_s !== undefined || it.county_s !== null) ? it.county_s : "",
        cus_postcode: (it.postcode_s !== undefined || it.postcode_s !== null) ? it.postcode_s : "",
        isSelected: false
      }))

      this.data.customer_addresses = this.final_filtered_customer_address
      this.CusNotFound_By_intital = false
      this.detailedComponent.SettingAddress()
      this.isNoCustomerFoundBySearch = false
    }
    else {
      this.isNoCustomerFoundBySearch = true
    }

    this.isloader_in_search = false
  }
  newCusFromSearch(){
    if(this.isnewPlaceEntered){
      this.cusnfound.valuesplacing()
      this.isNewCustomer = !this.isNewCustomer
    }
    
  }
  serviceSelection(service) {
    this.Services.map(it => it.service === service ? it.selected = true : it.selected = false)
    this.isServiceSelected = true
    this.data.selectedJob = this.Services.filter(it => it.service === service)[0]

  }

  returnfromdetailstepper() {

    this.complete()

  }

  public parentFun(data: any): void {
    console.log('Picked date: ', data);
    this.bookedDate = data.DairyEventDate
    this.BookedTime = data.BookedTime
    this.BookedAddress = data.selectedAddress
    this.complete()
  }

  getCustomersfromNewSearch(newID) {
    var search_string = newID !== null ? newID : this.searchForm.value.search_string
    let promise = new Promise((resolve) => {
      let apiURL = `https://dev.commusoft.net/webservice_dev.php/api/v1/search?token=${this.apiToken}&_format=json&q=${search_string}`;
      this.http.get(apiURL)
        .toPromise()
        .then(
          res => { // Success
            console.log(res)
            if (res['status'] == 404) {
              this.filter_by_newString = []
            }
            else {
              this.filter_by_newString = res['search'].properties.filter(it => it.parentpropertiesid_i === undefined)

            }
            resolve();
          },
          err => { // Error
            // reject(err);
            resolve();
            if (err.status == 404) {
              this.filter_by_mail = []
            }
          }
        );
    });
    return promise;
  }
  getCustomersfromMail() {
    let promise = new Promise((resolve) => {
      let apiURL = `https://dev.commusoft.net/webservice_dev.php/api/v1/search?token=${this.apiToken}&_format=json&q=${this.serviceForm.value.emailAddress}`;
      this.http.get(apiURL)
        .toPromise()
        .then(
          res => { // Success
            console.log(res)
            if (res['status'] == 404) {
              this.filter_by_mail = []
            }
            else {
              this.filter_by_mail = res['search'].properties.filter(it => it.parentpropertiesid_i === undefined)

            }
            resolve();
          },
          err => { // Error
            // reject(err);
            resolve();
            if (err.status == 404) {
              this.filter_by_mail = []
            }
          }
        );
    });
    return promise;
  }

  getCustomersfromNumber() {

    let promise = new Promise((resolve, reject) => {
      let apiURL = `https://dev.commusoft.net/webservice_dev.php/api/v1/search?token=${this.apiToken}&_format=json&q=${this.serviceForm.value.phoneNumber}`;
      this.http.get(apiURL)
        .toPromise()
        .then(
          res => { // Success
            console.log(res)
            this.filter_by_number = res['search'].properties.filter(it => it.parentpropertiesid_i === undefined)
            resolve();
          },
          err => { // Error
            console.log('inside error')
            resolve();
            // reject(err);
            if (err.status == 404) {
              this.filter_by_number = []
            }
          }
        );
    });
    return promise;
  }

  getAddress(place: object) {
    console.log(place)
    this.isnewPlaceEntered = true
    var Address_from_google = {};
    for (var i = 0; i < place['address_components'].length; i++) {
      var c = place['address_components'][i];
      Address_from_google[c.types[0]] = c;
    }
    this.data.Address_from_google = Address_from_google
    console.log(Address_from_google);

  }
  async getCustomerDetails() {
    this.detailedComponent = this.details
    // this.custNotFound = this.cusnfound
    this.submitted = true
    if (this.serviceForm.invalid) {
      return
    }
    this.isloader = true
    !this.isServiceList ? this.data.selectedJob = this.selectedService.value : ''
    this.data.appointments = this.appointments
    this.data.number =  this.serviceForm.value.phoneNumber
    this.data.email = this.serviceForm.value.emailAddress
    
    await this.getCustomersfromMail()
    await this.getCustomersfromNumber()

    let combine_filters = this.filter_by_mail.concat(this.filter_by_number)
    console.log(combine_filters)
    if (combine_filters.length > 0) {
      const seen = new Set();
      var unique_customers = combine_filters.filter(el => {
        const duplicate = seen.has(el.id);
        seen.add(el.id);
        return !duplicate;
      });

      console.log(unique_customers)

      this.final_filtered_customer_address = unique_customers.map(it => ({
        cid: it.id,
        cus_name: (it.customer_name !== undefined || it.customer_name !== null) ? it.customer_name : "",
        cus_address: ((it.addressline1_s !== undefined || it.addressline1_s !== null) ? it.addressline1_s : "") + " " + ((it.addressline2_s !== undefined || it.addressline2_s !== null) ? it.addressline2_s : "") + " " + ((it.addressline3_s !== undefined || it.addressline3_s !== null) ? it.addressline3_s : ""),
        cus_country: (it.county_s !== undefined || it.county_s !== null) ? it.county_s : "",
        cus_postcode: (it.postcode_s !== undefined || it.postcode_s !== null) ? it.postcode_s : "",
        isSelected: false
      }))

      this.data.customer_addresses = this.final_filtered_customer_address
      this.MoveToDetailsStepper()
    }
    else {
      this.data.customer_addresses = []
      this.CusNotFound_By_intital = true
      this.isloader = false
      this.stepper.selected.completed = true;
      this.stepper.selected.editable = false;
      this.stepper.next();
    }

  }

  complete() {
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = false;
    this.stepper.next();
  }
  MoveToDetailsStepper() {
    this.isloader = false

    //  !this.isServiceList ? this.data.selectedJob = this.selectedService.value : ''
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = false;
    this.stepper.next();
    this.detailedComponent.SettingAddress()
  }

  notBillingAdd() {
    this.CusNotFound_By_intital = true
  }
  secondNext() {
    // console.log(this.detailForm)
  }
  openSnackBar() {
    // this.snackBar.openFromComponent(WarningComponent, {
    //   data: 'Sample data',
    //   verticalPosition: 'top',
    //   horizontalPosition: 'end',
    // });
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['yellow-snackbar'],
      data: {
        message: 'Are you sure you want to close ?',
        action: () => {this.dialogRef.close() ; this.snackBar.dismiss() },
        dismiss: () => {this.snackBar.dismiss()}
      }

    })
  }
  ngOnInit(): void {
    // debugger
    // let myCompOneObj = new CustomerNotfoundComponent(this.fb,this.http);
    // console.log(myCompOneObj , 'in oninit')
    // this.custNotFound = myCompOneObj
  }
  ngAfterViewInit() {
    // this.apiToken = this.main.apiToken
  }

}


// @Component({
//   selector: 'snack-bar-component',
//   templateUrl: 'snack-bar-component.html',
// })
// export class WarningComponent {
//   constructor( 
//     public dialogRef: MatDialogRef<DialogContent>,
//     public snackBarRef: MatSnackBarRef<WarningComponent>,
//     @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

// close(){
//       this.dialogRef.close();
// }

// }

@Component({
  selector: 'icon-component',
  template: `<div class='icon_content_container'><span>{{ data?.message }}</span>  <button class='close_btn_snack' (click)="data.action()">yes</button> <button class='close_btn_snack' (click)="data.dismiss()">no</button> </div>`,
  styleUrls: ['./booking-portal.component.scss']
})

export class IconSnackBarComponent {
  public snackBarRef: MatSnackBarRef<IconSnackBarComponent>
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

}