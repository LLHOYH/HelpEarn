import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ChatPage } from '../pages/chat/chat';
import { ChatListPage } from '../pages/chat-list/chat-list';
import { TabsPage } from '../pages/tabs/tabs';

import { AddTaskPage } from '../pages/add-task/add-task';
import { SelectCategoryPage } from '../pages/select-category/select-category';
import { RecorderPage } from '../pages/recorder/recorder';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { Notification } from '../models/Notification';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { StorageProvider } from '../providers/StorageProvider';

import { Storage } from '@ionic/storage';


//import { AudioTestPage } from '../pages/audio-test/audio-test';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = TabsPage;

    notification:Notification;
    notifications:Notification[];

    username:string;
    stPvd:StorageProvider;
  constructor(platform: Platform, statusBar: StatusBar, storage:Storage, splashScreen: SplashScreen, public localNoti:LocalNotifications, public db: AngularFireDatabase, public alertCtrl:AlertController ) {


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      let recipientKey ="Ammie";

      this.notification=new Notification();
      this.notifications=new Array<Notification>();

      this.db.list('/notification').valueChanges().subscribe(
        data => {
          this.notifications = data;

          for(var i=0; i<this.notifications.length;i++){
            if(this.notifications[i].notistatus=="Unread" && this.notifications[i].recipient==recipientKey){
              this.DingNotification(this.notifications[i]);
            } //end of if
          } //end of forloop
        }); //end of retrieve


        platform.ready().then(() => {

          this.localNoti.on("click",(showNoti,state) =>{
  
            let json=JSON.parse(showNoti.data);
      
      
            console.log(showNoti.title);
            let alert=this.alertCtrl.create({
              title:showNoti.title,
              subTitle:json.mydata,
              
            });
            alert.present();
          });
          }
        )//end of platform.ready()
  }


  DingNotification(notification:Notification){
    
    this.localNoti.schedule({
      id:1,
      title:"You have a new notification",
      text:notification.notimessage,
      data:{mydata:notification.notimessage},
      icon:"../assets/imgs/logo.png",
      led:"#f5bf42",
      
    });    
  }


  goToAddTask(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AddTaskPage);
  }goToChat(params){
    if (!params) params = {};
    this.navCtrl.setRoot(ChatPage);
  }goToSelectCategory(params){
    if (!params) params = {};
    this.navCtrl.setRoot(SelectCategoryPage);
  }
}
