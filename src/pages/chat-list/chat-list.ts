import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chat } from '../../models/Chat';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ChatProvider } from '../../providers/ChatProvider';
import { ChatPage } from '../chat/chat';
/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  chatTargets: Chat[];
  unfilteredChatTargets: Chat[];
  filteredChatTargets: Chat[];
  chatTarget: Chat;
  chatPvd: ChatProvider;
  chatTargetsBySender: Chat[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    this.chatTarget = new Chat();
    this.unfilteredChatTargets = new Array<Chat>();
    this.chatTargets = new Array<Chat>();
    this.filteredChatTargets = new Array<Chat>();
    this.chatTargetsBySender = new Array<Chat>();
    this.chatPvd = new ChatProvider(db);
  }


  async getChatTargets() {
    this.db.list('/chat').valueChanges().subscribe(
      data => {
        this.unfilteredChatTargets = data;
        this.chatTargets = this.chatPvd.filterChatTargets(this.unfilteredChatTargets, "Ammie");
      }
    )
  }

  goChatWithTarget(chatTarget: Chat) {

    this.navCtrl.push(ChatPage, {
      displayID: chatTarget.displayID, //displayID is the other user's key
      pageSource:"ChatList"
    });

  }

  ionViewWillEnter() {
    console.log(this.chatTargets);
    this.getChatTargets();

  }

}
