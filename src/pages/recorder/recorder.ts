import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Alert } from 'ionic-angular';
//import { Media, MediaObject } from '@ionic-native/media/ngx';

import { File } from '@ionic-native/file/ngx';

//import { MediaPlugin } from 'ionic-native';
 

/**
 * Generated class for the RecorderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-recorder',
  templateUrl: 'recorder.html',
})
export class RecorderPage {



fileName:string;
filePath:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController, public file:File,
    // public media:Media, 
     public platform: Platform) {


   this.platform.ready().then(() => {
    this.fileName = file.externalDataDirectory.replace(/file:\/\//g, '') + 'recording.m4a';
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecorderPage');
  }

  startRecord() {
    // let mediaPlugin = new MediaPlugin('../../assets/audios/recording1.mp3');
    // mediaPlugin.startRecord();

    // this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
    // this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    
    // let audioObject: MediaObject = this.media.create(this.filePath);
    // audioObject.onSuccess.subscribe(() => this.showAlert('Nice','Nice'));
    // audioObject.onError.subscribe(error => this.showAlert('Bad','Bad'));
    // audioObject.onStatusUpdate.subscribe(status => console.log('status is ', status));

    // audioObject.startRecord();

  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  stopRecord() {
    // let audioObject: MediaObject = this.media.create(this.filePath);

    // audioObject.stopRecord();

  }

  startPlaying() {
    // // let mediaPlugin = new MediaPlugin('../../assets/audios/MoonRiver.mp3');
    // mediaPlugin.play();
  }

  stopPlaying() {

  }
}
