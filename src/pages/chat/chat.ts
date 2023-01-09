import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, IonicModule, NavController, NavParams, AlertController, Alert, Content, Navbar,Popover, PopoverCmp, ToastController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';

import { PopoverController } from 'ionic-angular/components/popover/popover-controller';


import { Chat } from '../../models/Chat';
import { ChatProvider } from '../../providers/ChatProvider';
import { ChatListPage } from '../chat-list/chat-list';

import { Task } from '../../models/Task';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { map } from 'rxjs/operators';

//import { IonInfiniteScroll } from '@ionic/angular';
//image viewer
import { ImageViewerController } from 'ionic-img-viewer';
import { PopoverComponent } from '../../components/popover/popover';
import { Storage, StorageConfig } from '@ionic/storage';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})

export class ChatPage {

  @ViewChild(Content) content: Content;
  //@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  chat: Chat;
  chats: Chat[];
  duplicateChats:Chat[];
  unfilteredChats: Chat[];
  task: Task;
  recTask: Task;
  allTasks: Task[];
  tasks: Task[];
  chatPvd: ChatProvider;

  sendCounter;
  chatTargets: Chat[];

  chatObservable: Observable<any[]>;

  result: boolean;

  msgTime: string;
  msgHr: string;
  msgMin: string;

  msgDate;
  msgYear;
  msgMonth;

  senderKey: string;

  photo;
  msgInput;

  pageSource: string;

  showRecTask: boolean;

  chatKeys: number[];

  chatForwardMsg:Chat;

  public storage:Storage;
  config: StorageConfig;

  updateStatus:boolean;//true when user enters the page, update all msg to seen.   False when user leaves the page, no update actions taken.

   constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,
    public alertCtrl: AlertController, private navController: NavController, public camera: Camera,
    public imageViewerCtrl: ImageViewerController,
  public popoverCtrl:PopoverController, public toastCtrl:ToastController) {

    this.chatPvd = new ChatProvider(db);
    this.chat = new Chat();
    this.chatForwardMsg=new Chat();
    this.unfilteredChats = new Array<Chat>();
    this.chatTargets = new Array<Chat>();
    this.chats = new Array<Chat>();
    this.duplicateChats = new Array<Chat>();

    this.task = new Task();
    this.allTasks = new Array<Task>();
    this.recTask = new Task();
    this.tasks = new Array<Task>();
    this.chatKeys = new Array<number>();
    this.sendCounter = 0;

    this.storage=new Storage(this.config);


    this.chat.senderKey = "Ammie";
    this.senderKey = "Ammie";
    this.chat.chatKey = 0;
    
    this.updateStatus=true;

    //params from chat-list

    this.pageSource = this.navParams.get('pageSource');
    //use this when link together.
    this.pageSource="TaskDetails";
    if (this.pageSource == "ChatList") {
      this.chat.receiverKey = this.navParams.get('displayID');
    }
    else if (this.pageSource == "TaskDetails") {
      this.chat.receiverKey = this.navParams.get('displayID');
      //this.recTask = this.navParams.get('task');
      this.recTask.taskKey=75;
      this.recTask.taskName="Translate english document";
      this.recTask.contentDesc="Translate english document to Mandarin";
      this.recTask.price=100;
      this.showRecTask = true;

      if (this.recTask.contentPic == null) {
        this.recTask.contentPic = "../../assets/imgs/noImage.png";
      }
    }
    else if(this.pageSource=="ForwardTargets"){

      this.chatForwardMsg=this.navParams.get("chatMsg");
      this.chat=this.chatForwardMsg;
      this.chat.receiverKey = this.navParams.get('displayID');
      this.unfilteredChats= new Array<Chat>();
      this.chats = new Array<Chat>();

      this.db.list('/chat').valueChanges().subscribe(
        data => {
          this.unfilteredChats = data;
          for (var i = 0; i < this.unfilteredChats.length; i++) {
            this.chatKeys.push(this.unfilteredChats[i].chatKey);
          }

          this.chatPvd.setChatKey(this.chatKeys);
        }
      )
      if(this.chatForwardMsg.msgContent!=null){
        this.sendMessage("textMsg");
      }
      else if(this.chatForwardMsg.msgImage!=null){
        this.sendMessage("image");
      }
      else if(this.chatForwardMsg.taskKey!=null){
        this.sendMessage("recTask");
      }

    }

    //replace all these dummys with legit userID
    //senderKey get when login - from storage
    //receiveKey get from previous page - can be chatlist and view task page 'Chat' button
    this.getChatMsg();

  }


  getChatMsg() {  //get all messages from database
    this.chatKeys = new Array<number>();
    this.chats = new Array<Chat>();

    this.db.list('/chat').valueChanges().subscribe(
      data => {
        this.unfilteredChats = data;
        for (var i = 0; i < this.unfilteredChats.length; i++) {
          this.chatKeys.push(this.unfilteredChats[i].chatKey);
        }
        this.chatPvd.setChatKey(this.chatKeys);
        console.log(this.updateStatus);
if(this.updateStatus){
  this.updateMsgStatus();
}

        this.filterChatMsg(this.unfilteredChats);

        this.showMsgTask();
      }
    )
  }


  filterChatMsg(unfilteredChats: Chat[]) {
    //this forloop filters all the chats to chat records that are only between the current user and that specifc chat target
 
    //this.chat.senderKey is current user
    //this.chat.receiverKey is the displayID from previous page
    this.chats = new Array<Chat>();
    this.duplicateChats = new Array<Chat>();

    for (var i = 0; i < unfilteredChats.length; i++) {
      if ((unfilteredChats[i].senderKey == this.chat.senderKey && unfilteredChats[i].receiverKey == this.chat.receiverKey)
        || unfilteredChats[i].senderKey == this.chat.receiverKey && unfilteredChats[i].receiverKey == this.chat.senderKey) {

        this.duplicateChats.push(unfilteredChats[i]);
      }

    }//end of for
    for(var i=0;i<this.duplicateChats.length;i++){
      if(this.chats.indexOf(this.duplicateChats[i])<=-1){
        this.chats.push(this.duplicateChats[i]);
      }
    }

    //this forloop is just to set the senderKey to displayID
    for (var i = 0; i < this.chats.length; i++) {
      this.chats[i].displayID = this.chats[i].senderKey; //show display as senderKey
    }//end of for

    for (var i = 0; i < this.chats.length; i++) {
      if(this.chats[i].senderKey==this.senderKey){
        this.chats[i].sendFirStatus=true;
      }
      else{
        this.chats[i].sendFirStatus=false;
      }

      if(this.chats[i].msgStatus=="Seen" && this.chats[i].displayID==this.senderKey){
        this.chats[i].sendSecStatus=true;
      }
      else{
        this.chats[i].sendSecStatus=false;
      }
    }
  }

  updateMsgStatus() {
    for (var i = 0; i < this.unfilteredChats.length; i++) {
      if (this.unfilteredChats[i].senderKey == this.chat.receiverKey && this.unfilteredChats[i].receiverKey == this.chat.senderKey && this.unfilteredChats[i].msgStatus == "Delivered") {
        this.chatPvd.updateMsgStatus(this.unfilteredChats[i]);
      }
    }
  }

  showMsgTask() {
    //to check if there is taskKey
    //if no, make ion-card msg hidden
    //if yes, show task details based on taskKey

    for (var i = 0; i < this.chats.length; i++) { //do a forloop for chats to check for taskKey
      if (this.chats[i].taskKey == null) { //see if chats does not contain taskKey
        this.chats[i].msgTask = false;//Do not show task info
      }
      else { //if does contain taskKey
        this.chats[i].msgTask = true; //Making ion-card visible
      }
    }//end of for
  }


  sendMessage(msgType: string) {
    this.chats = new Array<Chat>();
    this.getCurrentDateTime();

    this.storage.get("chatKeys").then((val) => {
      this.chatKeys = val;


    

    if (this.chat.msgImage != null && msgType == "image") {
      this.db.list('/chat').push({
        chatKey: Math.max.apply(Math, this.chatKeys) + 1,
        msgImage: this.chat.msgImage,
        dateSend: this.chat.dateSend,
        timeSend: this.chat.timeSend,
        senderKey: this.chat.senderKey,
        receiverKey: this.chat.receiverKey,
        msgStatus: "Delivered"
      }).then(() => {
        this.chat.msgImage = null;

        if(this.pageSource=="ForwardTargets"){
          this.forwardToast();
        }
      }).catch(() => {
        this.showAlert("The message did not send", "Please check your internet connection");
      });
    }
    else if (this.recTask != null && msgType == "recTask") {
      this.db.list('/chat').push({
        chatKey: Math.max.apply(Math, this.chatKeys) + 1,
        taskKey: this.recTask.taskKey,

        // taskInfo: {
        //   taskName: this.recTask.taskName,
        //   contentDesc: this.recTask.contentDesc,
        //   price: this.recTask.price,
        //   contentPic:this.recTask.contentPic
        // },
        taskName: this.recTask.taskName,
        taskContentDesc: this.recTask.contentDesc,
        taskPrice: this.recTask.price,
        taskContentPic: this.recTask.contentPic,

        dateSend: this.chat.dateSend,
        timeSend: this.chat.timeSend,
        senderKey: this.chat.senderKey,
        receiverKey: this.chat.receiverKey,
        msgStatus: "Delivered"
      }).then(() => {
        this.recTask = null;
        this.showRecTask = false;
        
        if(this.pageSource=="ForwardTargets"){
          this.forwardToast();
        }
      }).catch(() => {
        this.showAlert("The message did not send", "Please check your internet connection");
      });
    }
    else if (this.chat.msgContent != null && msgType == "textMsg") {
      this.db.list('/chat').push({
        chatKey: Math.max.apply(Math, this.chatKeys) + 1,
        msgContent: this.chat.msgContent,
        dateSend: this.chat.dateSend,
        timeSend: this.chat.timeSend,
        senderKey: this.chat.senderKey,
        receiverKey: this.chat.receiverKey,
        msgStatus: "Delivered"
      }).then(() => {
        this.chat.msgContent = null;
        
        if(this.pageSource=="ForwardTargets"){
          this.forwardToast();
        }
      }).catch(() => {
        this.showAlert("The message did not send", "Please check your internet connection");
      });
    }
  })

  }

  async forwardToast(){
      // const toast = await this.toastCtrl.create({ 
      //   message: 'Forward message sent.',
      //   duration: 2000,
        
        
      // });
      // toast.present();
    
  }

  presentImage(image:string){
    const imageViewer=this.imageViewerCtrl.create(image);
    imageViewer.present();
  }

  takePicture() {
    let options = {
      quality: 100,
      targetWidth: 200,
      targetHeight: 200,
      destinationType: this.camera.DestinationType.DATA_URL,  //can try FILE_URL
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.ALLMEDIA,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.photo = 'data:image/jpeg;base64,' + imageData;
      this.chat.msgImage = this.photo;
      if (this.chat.msgImage != null) {
        this.sendMessage("image");
      }
    }, (err) => {
      // Handle error
      this.showAlert('Ooops', 'Camera Error');
    });
  }


  getImage() {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 200,
      targetHeight: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.ALLMEDIA,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.photo = 'data:image/jpeg;base64,' + imageData;
      this.chat.msgImage = this.photo;
      if (this.chat.msgImage != null) {
        this.sendMessage("image");
      }
    }, (err) => {
      // Handle error
      this.showAlert('Ooops', 'Photo Error');
    });
  }

  getCurrentDateTime() {
    this.msgHr = new Date().getHours().toString();
    if (this.msgHr.length == 1) {
      this.msgHr = "0" + this.msgHr;
    }
    this.msgMin = new Date().getMinutes().toString();
    if (this.msgMin.length == 1) {
      this.msgMin = "0" + this.msgMin;
    }
    this.chat.timeSend = this.msgHr + ':' + this.msgMin;

    this.msgDate = new Date().getDate().toString();
    this.msgMonth = (new Date().getMonth() + 1).toString();
    this.msgYear = new Date().getFullYear().toString();
    this.chat.dateSend = this.msgDate + "/" + this.msgMonth + "/" + this.msgYear;
  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  closeRecTask() {
    this.recTask = null;
    this.showRecTask = false;
  }

  goTaskPage(taskKey: number) {//go to specific task page to view task info when msgTask ion-card is clicked
    //this.navCtrl.push(TaskDetailsPage, {taskKey:taskKey});
    this.showAlert("Only works after integration", "Link to Task Details Page");
  }

  //scroll to page bottom when load and after sending msg
  fixedAtBottom() {
    this.content.scrollToBottom(0);
  }

  ionViewDidEnter(){
    console.log("I'm in");

  }

  ionViewDidLeave(){
    this.updateStatus=false;
    console.log("I'm leaving");
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 1000);
  }

  //reset chatTargets to prevent accumulating
  ionViewWillLeave() {
    this.chatTargets = new Array<Chat>();
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.complete();
    }, 2000);
  }

  // loadData(event) {
  //   setTimeout(() => {
  //     console.log('Done');
  //     event.target.complete();

  //     // App logic to determine if all data is loaded
  //     // and disable the infinite scroll
  //     if (this.chats.length == 1000) {
  //       event.target.disabled = true;
  //     }
  //   }, 500);
  // }

  // toggleInfiniteScroll() {
  //   this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  // }



  //popover methods
  async presentPopover(event:Event,chat:Chat){
    
    console.log(chat);
    let popover = await this.popoverCtrl.create(PopoverComponent, {chatMsg:chat})
    await popover.present({
      ev:event,
      });
  }

}
