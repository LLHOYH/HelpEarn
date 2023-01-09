import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Alert, AlertController, Platform, Popover, PopoverController } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { AddTaskPage } from '../pages/add-task/add-task';
import { SelectCategoryPage } from '../pages/select-category/select-category';
import { ChatPage } from '../pages/chat/chat';
import { ChatListPage } from '../pages/chat-list/chat-list';
import { TabsPage } from '../pages/tabs/tabs';
import { RecorderPage } from '../pages/recorder/recorder';
import { TaskLocationPage } from '../pages/task-location/task-location';
//import { AudioTestPage } from '../pages/audio-test/audio-test';

// import {LocationSelect} from '../pages/location-select/location-select';
// import {LocationLaunchPage} from '../pages/location-launch/location-launch';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Local Notifications
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';

//Camera
import { Camera } from '@ionic-native/camera';

//Audio
//import {MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media/ngx';

//provider
import { TaskProvider } from '../providers/TaskProvider';
import { ChatProvider } from '../providers/ChatProvider';
import { StorageProvider } from '../providers/StorageProvider';
import { GeocoderProvider } from '../providers/GeocoderProvider';

//database
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';

//image viewer
import { IonicImageViewerModule } from 'ionic-img-viewer';

//Base64 save image to gallery
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

//long press
import { LongPressModule } from 'ionic-long-press';

//google map
// import { ConnectivityServiceProvider } from '../providers/connectivity-service';
// import { GoogleMapsProvider } from '../providers/google-maps';
// import { Network } from '@ionic-native/network/ngx';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { PopoverComponent } from '../components/popover/popover';
import { ForwardTargetsPage } from '../pages/forward-targets/forward-targets';



var firebaseConfig = {
  apiKey: "AIzaSyDKayX8dObXg4FBIDSaYwEwRFOEsSheYC8",
  authDomain: "help8earn-b858b.firebaseapp.com",
  databaseURL: "https://help8earn-b858b.firebaseio.com/",
  projectId: "help8earn-b858b",
  storageBucket: "help8earn-b858b.appspot.com",
  messagingSenderId: "437596274337",
  appId: "1:437596274337:web:4a7a758883c494a3"
};

@NgModule({
  declarations: [
    MyApp,
    
    AddTaskPage,
    SelectCategoryPage,
    ChatPage,
    TabsPage,
    ChatListPage,
    RecorderPage,
    TaskLocationPage,
    PopoverComponent,
    ForwardTargetsPage,
    // LocationSelect,
    // LocationLaunchPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicImageViewerModule,
    LongPressModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddTaskPage,
    SelectCategoryPage,
    ChatPage,
    TabsPage,
    ChatListPage,
    RecorderPage,
    TaskLocationPage,
    PopoverComponent,
    ForwardTargetsPage,
    // LocationSelect,
    // LocationLaunchPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Media,
    //MediaObject,
    TaskProvider,
    ChatProvider,
    StorageProvider,
    GeocoderProvider,
    LocalNotifications,
    PhonegapLocalNotification,
    //MediaPlugin,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // ConnectivityServiceProvider,
    // GoogleMapsProvider,
    //Network,
    NativeGeocoder,
    Base64ToGallery,
    
  ]
})
export class AppModule { }