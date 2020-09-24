import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  latitude = -28.68352;
  longitude = -147.20785;
  mapType = 'satellite';

  constructor() { }

  ngOnInit(): void {
  }

}

// @Component({
//   selector: 'your-comp',
//   styles: ['agm-map { height: 300px; /* height is required */ }'],
//   template: `
//     <agm-map [latitude]='latitude' [longitude]='longitude'
//       [mapTypeId]='mapType'>
//     </agm-map>
//   `
// })
// export class YourComponent {
//   latitude = -28.68352;
//   longitude = -147.20785;
//   mapType = 'satellite';
// }