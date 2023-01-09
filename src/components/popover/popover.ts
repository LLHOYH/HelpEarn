import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Chat } from '../../models/Chat';
import { ForwardTargetsPage } from '../../pages/forward-targets/forward-targets';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
chatMsg:Chat;


  constructor(public navParams:NavParams, public navCtrl:NavController) {
    this.chatMsg=new Chat();

  }

  forwardMsg(){
    this.chatMsg=this.navParams.get("chatMsg");
    this.navCtrl.push(ForwardTargetsPage,{
      chatMsg:this.chatMsg
    })
  }

}
