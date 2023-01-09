import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chat } from '../../models/Chat';
import { ChatPage } from '../chat/chat';
import { Page } from 'ionic-angular/navigation/nav-util';

/**
 * Generated class for the ForwardTargetsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forward-targets',
  templateUrl: 'forward-targets.html',
})
export class ForwardTargetsPage {


  forwardTargets: Chat[];
  chatMsg: Chat;
  chats:Chat[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

    this.forwardTargets = new Array<Chat>();
    this.chatMsg = new Chat;
    this.chats=new Array<Chat>();
    this.chatMsg = this.navParams.get("chatMsg");

    this.storage.get("forwardTargets").then((val) => {
      this.forwardTargets = val;
      console.log(this.forwardTargets);
    })

  }

  forwardToTarget(forwardTargetID: string) {
    //this.navCtrl.getPrevious().data.displayID=forwardTargetID;
    this.chats=new Array<Chat>();
    this.navCtrl.push(ChatPage, {
      displayID: forwardTargetID, //displayID is the other user's key
      pageSource:"ForwardTargets",
      chatMsg:this.chatMsg
    });

    // this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-2),{
    //   : forwardTargetID, //displayID is the other user's key
    //   pageSource:"ForwardTargets",
    //   chatMsg:this.chatMsg
    // });
  }



}
