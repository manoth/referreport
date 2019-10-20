import { Component, OnInit, Input } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @Input() referNo: string;
  @Input() toMaps: any;
  @Input() socket: any;

  loding: boolean = false;
  lat: any;
  lng: any;
  road: any;
  dir: any;

  ngOnChanges(): void {
    this.getLocation();
  }

  constructor(
    private main: MainService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.socket.off('r9refer-ambulance-tracking-' + this.referNo);
    this.loding = false;
    this.road = null;
    this.dir = null;
  }

  getResponse(e: any) {
    // console.log(e.routes[0].legs[0].distance.value / 1000);
  }

  getLocation() {
    this.main.get('refer/location/' + this.referNo).then((row: any) => {
      this.loding = row.ok;
      if (row.ok) {
        this.lat = Number(row.data.refer_lat);
        this.lng = Number(row.data.refer_lng);
        this.getRoad(row);
        this.socket.on('r9refer-ambulance-tracking-' + row.data.refer_no, (location: any) => {
          this.getDir(location);
        });
      }
    });
  }

  getRoad(row: any) {
    this.road = {
      origin: row.data.from_hospname,
      destination: row.data.refer_hospname,
      renderOptions: { suppressMarkers: true },
      markerOptions: {
        origin: {
          icon: './assets/img/hospital-A.png',
          infoWindow: row.data.from_hospname,
          label: row.data.from_hospname
        },
        destination: {
          icon: './assets/img/hospital-B.png',
          infoWindow: row.data.refer_hospname,
          label: row.data.refer_hospname
        }
      }
    }
  }

  getDir(origin: any) {
    this.dir = {
      origin: origin,
      renderOptions: {
        suppressMarkers: true, polylineOptions: { strokeColor: 'red' }
      },
      markerOptions: {
        origin: { icon: './assets/img/ambulance-car.png' }
      }
    }
  }

}
