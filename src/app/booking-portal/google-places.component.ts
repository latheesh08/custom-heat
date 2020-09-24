import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input ,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
// import {  } from '@types/googlemaps';

declare var google;

@Component({
    selector: 'AutocompleteComponent',
    template: `
      <input class="service_search_inputs"
        type="text"
        [(ngModel)]="autocompleteInput"
        #addresstext
        >
    `,
    styleUrls: ['./booking-portal.component.scss']
})

export class AutocompleteComponent implements OnInit, AfterViewInit {
    @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext') addresstext: any;
    @ViewChild("addresstext") div1: ElementRef;


    autocompleteInput: string;
    queryWait: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        console.log('in viewinit')
        console.log(this.div1.nativeElement.innerText)
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
            {
                componentRestrictions: { country: ['UK','US'] },
                // types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

}
