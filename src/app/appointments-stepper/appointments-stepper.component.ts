import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-appointments-stepper',
  templateUrl: './appointments-stepper.component.html',
  styleUrls: ['./appointments-stepper.component.scss', '../booking-portal/booking-portal.component.scss']
})
export class AppointmentsStepperComponent implements OnInit {

  AvailableButtons = {};
  finalResult = [];
  appointmentsData;
  isAppointmentSelected = false;
  isLoaded = false
  apiToken = 'pACtNd5kgAREc0I95zhz_7LaOYw5hNqGI_ITHu5C1zLcBoJp4xpV7zXo0S-2DntZ9F3O2nhKKU-R8W7Z0CN8ng';
  noSlots
  nextFour = 0
  propertyId = null
  contactId = null
  JobId = null
  emailSubject = ''
  emailMessage = ''
  EngineerId = null
  StartDate;
  EndDate;
  isWholeLoading = false
  BookedTime 
  @Input() data: Object;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMailMaessage()
  }

  public FirstCall(id , cid , jid) {
    this.propertyId = id
    this.contactId = cid
    this.JobId = jid
    this.SuggestedAppointement(3 , this.nextFour)
  }

  callFunction(event) {
    let temp = Object.keys(this.AvailableButtons)
    for (let i = 0; i < temp.length; i++) {
      if (temp[i] === event) {
        this.AvailableButtons[event] = true
      } else {
        this.AvailableButtons[temp[i]] = false
      }

    }
    this.isAppointmentSelected = true
    console.log(this.data['selectedJob'])
    let time_date = event.split('_')
    let selectedTime = time_date[0]
    let selectedKey = time_date[1];
    let selectedDate = selectedKey.split(' ')[0]
    let selectedSlot = this.appointmentsData[selectedKey].filter(it => selectedTime === it.serviceWindowCustomerAppearance)[0]
    this.BookedTime = selectedSlot.serviceWindowCustomerAppearance
    this.StartDate = selectedDate + ' ' + selectedSlot.fromDateTime.split(' ')[4]
    this.EndDate = selectedDate + ' ' + selectedSlot.endDateTime.split(' ')[4]
    this.EngineerId = selectedSlot.engineerId
    // this.isSelected = true;
  }

  getMailMaessage(){
    this.http.get<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/customerjobconfirmations?token=${this.apiToken}`).subscribe(data => {
   console.log('mail details')
   console.log(data)
  this.emailSubject = data.customerjobconfirmation.messages.email.subject;
  this.emailMessage = data.customerjobconfirmation.messages.email.message;
  
  })
  }
  BookDiaryEvent(){
    this.isWholeLoading = true
    let body = {
      data:{
        eventType : 'job',
        description : this.data['selectedJob'].service,
        event_start : this.StartDate,
        event_end : this.EndDate,
        resourceId : this.EngineerId,
        jobid : this.JobId,
        notify_customer: true,
        notifications: {
          for_customer: {
            recipient: this.contactId,
            type: "email",
            values: {
              subject : this.emailSubject,
              message: this.emailMessage
            }
          }
        }
      }
    }
    console.log('body befor send' , body)
    this.http.post<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/diaryevents?token=${this.apiToken}`,body).subscribe(data => {
      console.log(data)
        let bookedInfo = {
        DairyEventDate : moment(this.StartDate.split(' ')[0]).format('dddd Do MMMM YYYY'),
        BookedTime : this.BookedTime,
        selectedAddress :  this.data['WorkAddresses']
        }
        this.isWholeLoading = false
        this.parentFun.emit(bookedInfo)
  
  }, err => {
    this.isWholeLoading = false
    console.log('err in diary event bookin' , err)
    if(err.status === 400 && err.includes('overlapping')){
           this.snackBar.open('Time slot is already booked. Please choose another', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'end',
          panelClass: ['red-snackbar'],
        });
        this.SuggestedAppointement(3 , this.nextFour)

    }
  
  })
  }

  SuggestedAppointement(range, next) {
    const body = {
      property: this.propertyId,
      job_description: this.data['selectedJob']['id'],
      date_range: range,
      length_of_event: (this.data['time_to_complete'] == null || this.data['time_to_complete'] == undefined || this.data['time_to_complete'] == 0) ? 60 : this.data['time_to_complete']
    }
    if (next !== 0) {
      this.isLoaded = false
      this.nextFour = next
      let today = new Date()
      let tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + next)
      console.log(next, tomorrow.toISOString().split('T')[0])
      body['date_time'] = tomorrow.toISOString().split('T')[0]
    }
    this.finalResult = []
    this.AvailableButtons = {}
    this.http.post<any>(`https://dev.commusoft.net/webservice_dev.php/api/v1/suggested-appointments?token=${this.apiToken}`, body,).subscribe(data => {
      console.log(data)
      if ( data !== undefined && data.appointments.status == "500 erorr") {
        this.isLoaded = true
        this.noSlots = true
      }
      else{
        var fil_result = {}
        if(next !== 0){
         var fil_keys = Object.keys(data.appointments).splice(3,Object.keys(data.appointments).length)
         for(let i =0 ; i< fil_keys.length ; i++){
          fil_result[fil_keys[i]] = data.appointments[fil_keys[i]]
      }
      this.appointmentsData = fil_result
      var keys = Object.keys(fil_result)
        }
        else{
          this.appointmentsData = data.appointments
          var keys = Object.keys(data.appointments)
        }

        for (let i = 0; i < keys.length; i++) {
          let obj = {
            key: '',
            Day: '',
            time_key: [],
            times: []
          }
          obj.key = keys[i]
          obj.Day = moment(keys[i].split(' ')[0]).format('ddd Do MMM YYYY')
          data.appointments[keys[i]].map(it => {
            let t_k = {
              t: it.serviceWindowCustomerAppearance,
              k: it.engineerId
            }
            obj.time_key.push(t_k)
          })
          let filtered_slots = data.appointments[keys[i]].map(it => it.serviceWindowCustomerAppearance)
          filtered_slots = filtered_slots.filter((it, id) => id === filtered_slots.indexOf(it))
          obj.times = filtered_slots
          this.finalResult.push(obj)
        }
        this.finalResult.map(it => it.times.map(itm => this.AvailableButtons[itm + '_' + it.key] = false))
        console.log(this.finalResult)
        this.finalResult.map(it => it.times.length > 0).filter(it => it === true).length > 0 ? this.noSlots = false : this.noSlots = true
        this.isLoaded = true
      }
      
    },
      err => {
        console.log(err)
        this.isLoaded = true
      }
    )
  }
}
