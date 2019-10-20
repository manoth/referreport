import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.component.html',
  styleUrls: ['./ambulance.component.scss']
})
export class AmbulanceComponent implements OnInit, OnDestroy {

  referId: string;
  loding: boolean = false;
  lat: any;
  lng: any;
  road: any;
  dir: any;
  interval: any;

  private querySubscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private main: MainService
  ) { }

  ngOnInit() {
    document.body.className = 'hold-transition login-page';
    const secondsCounter = interval(2000);
    this.route.params.subscribe((params) => {
      try {
        this.referId = params.referId;
        this.getDirection(this.referId);
        this.querySubscription = secondsCounter.subscribe(n => this.getLocations());
      } catch (err) {
        this.router.navigate(['/']);
      }
    });
  }

  getLocations() {
    const positionOption = { maximumAge: 1500000, timeout: 0 };
    const gpsFailed = () => { this.dir = null; };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position => {
        const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
        const data = { refer_no: this.referId, lat: position.coords.latitude, lng: position.coords.longitude };
        this.getDir(origin);
        // this.main.post('ambulance/setlocation', data).then();
      }), gpsFailed, positionOption);
    }
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  getResponse(e: any) {
    if (e.routes[0].legs[0].distance.value < 20) {
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
    }
  }

  getDirection(referId: string) {
    this.main.get('ambulance/' + referId).then((row: any) => {
      this.loding = row.ok;
      if (row.ok) {
        this.lat = Number(row.data.refer_lat);
        this.lng = Number(row.data.refer_lng);
        this.getRoad(row);
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
