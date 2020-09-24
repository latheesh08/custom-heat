import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingPortalComponent , DialogContent , IconSnackBarComponent} from './booking-portal/booking-portal.component';
import { AutocompleteComponent } from './booking-portal/google-places.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper'
import { MatDialogModule } from '@angular/material/dialog'
import { ReactiveFormsModule  , FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { DetailsStepperComponent } from './details-stepper/details-stepper.component';
import { AppointmentsStepperComponent } from './appointments-stepper/appointments-stepper.component';
// import { GoogleMapsModule } from '@angular/google-maps'
import { AgmCoreModule } from '@agm/core';
import { CustomerNotfoundComponent } from './customer-notfound/customer-notfound.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'

// import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
      path: 'website',
      component: BookingPortalComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    BookingPortalComponent,
    DialogContent,
    DetailsStepperComponent,
    AppointmentsStepperComponent,
    CustomerNotfoundComponent,
    AutocompleteComponent,
    IconSnackBarComponent
    // MapComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDfy9Ku-B9KKZIFOydJ2tFPbgqzfnhj6XA'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
