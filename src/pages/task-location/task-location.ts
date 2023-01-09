import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
//import { GeocoderProvider } from '../../providers/GeocoderProvider';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { NativeGeocoder, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';
import { AddTaskPage } from '../add-task/add-task';
import { TaskProvider } from '../../providers/TaskProvider';
//import { File } from '@ionic-native/file';
/**
 * Generated class for the TaskLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


declare var google;

@Component({
  selector: 'page-task-location',
  templateUrl: 'task-location.html',
})
export class TaskLocationPage {



  @ViewChild('map') mapElement: ElementRef;
  map: any;

  locationInput: string;

  GoogleAutocomplete;
  autocomplete;
  autocompleteItems;
  confirmLocation;


  latLong;

  lat;
  long;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    // public geoPvd:GeocoderProvider, 
    public platform: Platform, public alertCtrl: AlertController,
    private base64ToGallery: Base64ToGallery,
    public zone: NgZone,
    private nativeGeocoder: NativeGeocoder,
    public taskPvd:TaskProvider,
  public http:Http) {


    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocompleteItems = new Array<string>();
  }

  updateSearchResults(ev: any) {  //places autocomplete

    try {
      this.locationInput = ev.target.value;
      if (this.locationInput != null) {
        this.GoogleAutocomplete.getPlacePredictions({ input: this.locationInput },
          (predictions, status) => {
            this.autocompleteItems = [];
            this.zone.run(() => {
              predictions.forEach((prediction) => {
                this.autocompleteItems.push(prediction);
              });
              console.log(this.autocompleteItems);
            });
          });
      }
    }
    catch (error) {
      console.log(error);
    }

  }


  bringToInput(confirmLocation: string) {  //trigger when the autocomplete options are selected, bring the seletion to input
    this.confirmLocation = confirmLocation;
    this.autocompleteItems = new Array<string>();
    this.confirm(this.confirmLocation);
  }


  confirm(confirmLocation: string) {  //trigger when show map button clicked and calls the method below
    
    this.getGeoCodefromGoogleAPI(confirmLocation).subscribe(addressData => {  

      this.lat= addressData.results[0].geometry.location.lat;
      this.long = addressData.results[0].geometry.location.lng;

      this.showMap();
      this.addMarker();
      })
  }

  getGeoCodefromGoogleAPI(address: string): Observable<any> { //pass the address to google api to get coordinates
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAXyN-ZV1QjF4c-flqLsOctXtP7dWMtE98&address=' + address)
      .map(res => res.json());
  }

  addMarker(){  //add a marker to the center of the map, which is where the location is shown

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
  
    let content = this.confirmLocation;          
  
    this.addInfoWindow(marker, content);
  
  }

  addInfoWindow(marker, content){ //show the name of the location when the marker is onclick

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  showMap(){ //display map using coordinates
    console.log(this.lat);
    let latLng = new google.maps.LatLng(this.lat, this.long);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }


  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  Done(){
    this.taskPvd.setLocationStorage(this.confirmLocation,this.lat,this.long);
    this.navCtrl.pop();
  }

}
