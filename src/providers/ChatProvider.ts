import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'firebase/auth'
import { enableProdMode } from '@angular/core';


import { Chat } from '../models/Chat';
import { toTypeScript } from '@angular/compiler';
import { Http } from '@angular/http';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { Storage, StorageConfig } from '@ionic/storage';

enableProdMode()
@Injectable()
export class ChatProvider {
    // chatList: Chat[];
    // chatTargetsBySender: Chat[];
    // chatTargetsByReceiver: Chat[];
    // chatTargetsFiltered: Chat[];
    //item: any;
    //ref = firebase.database().ref('/chat');
    //inputText: string = '';
    //chat: Chat;
    //itemsRef: AngularFireList<any>;
    //chatObservable: Observable<any[]>;
    //result: boolean;
    // msgTime: string;
    // msgHr: string;
    // msgMin: string;
    //senderCounter: any = 0;
    //receiverCounter: any = 0;



    receiverKeys: string[];
    pushedReceiverKeys: string[];
    chatTargetsAll: Chat[];
    pushRKCounter: number = 0;
    msgBadgeCounter: number = 0;

    public storage:Storage;
    public http:Http;
    config: StorageConfig;
    constructor(public db: AngularFireDatabase) {
        //this.chat = new Chat();
        // this.chatTargetsBySender = new Array<Chat>();
        // this.chatTargetsByReceiver = new Array<Chat>();
        // this.chatTargetsFiltered = new Array<Chat>();

        this.receiverKeys = new Array<string>();
        this.pushedReceiverKeys = new Array<string>();
        this.chatTargetsAll = new Array<Chat>();


    }

    static get parameters() {
        return [[Http], [Storage]];
      }

    //chat page

    

    updateMsgStatus(chat: Chat) { //update msgStatus to seen
        this.db.list('/chat', ref => ref.orderByChild('chatKey').equalTo(chat.chatKey)).snapshotChanges()
            .subscribe(actions => {
                actions.forEach(action => {
                    // here gets the key
                    this.db.list('/chat').update(action.key, {
                        msgStatus: "Seen"
                    });
                });
            });
    }



    //chat-list page
    //chatTargets part

    filterChatTargets(chatTargets: Chat[], senderKey: string) {  //solved function!

        this.receiverKeys = new Array<string>();
        this.pushedReceiverKeys = new Array<string>();
        this.chatTargetsAll = new Array<Chat>();
        this.pushRKCounter = 0;
        this.msgBadgeCounter = 0;


        //this forloop gets all unique receiverKeys and save the keys inside this.receiverKeys --> a string array
        for (var c = 0; c < chatTargets.length; c++) {
            if (chatTargets[c].senderKey == senderKey || chatTargets[c].receiverKey==senderKey) {
                if ((this.receiverKeys.indexOf(chatTargets[c].receiverKey) <= -1) && chatTargets[c].receiverKey!=senderKey) {
                    this.receiverKeys.push(chatTargets[c].receiverKey);
                }
                else if((this.receiverKeys.indexOf(chatTargets[c].senderKey) <= -1) && chatTargets[c].senderKey!=senderKey){
                    this.receiverKeys.push(chatTargets[c].senderKey);
                }
            }
        } //end of for

console.log(this.receiverKeys);


        //this forloop is the logic to filter out the latest and the unqiue chatTarget
        for (var r = 0; r < this.receiverKeys.length; r++) {  //go thru the rounds of unique receivers
            for (var c = 0; c < chatTargets.length; c++) { //go thru the rounds of all chat records
                if (chatTargets[c].senderKey == senderKey || chatTargets[c].receiverKey == senderKey) {
                    if (chatTargets[c].senderKey == this.receiverKeys[r] || chatTargets[c].receiverKey == this.receiverKeys[r]) {
                        if (this.pushedReceiverKeys.indexOf(this.receiverKeys[r]) <= -1) { //if never contain that receiverKey, push it in
                            this.pushedReceiverKeys.push(this.receiverKeys[r]);
                            this.chatTargetsAll.push(chatTargets[c]);
                        }
                        else { // if already contain that receiverKey, replace the old one to get the new one
                            this.pushRKCounter = this.pushedReceiverKeys.indexOf(this.receiverKeys[r]);
                            this.chatTargetsAll[this.pushRKCounter] = chatTargets[c];
                        }
                    }
                }
            }

        } //end of for




        //this forloop replace the msgContent shown in the chat-list page with sth else
        for (var i = 0; i < this.chatTargetsAll.length; i++) {
            if (this.chatTargetsAll[i].msgContent == null && this.chatTargetsAll[i].msgImage != null) {
                this.chatTargetsAll[i].msgContent = "[Image]";
            }
            else if (this.chatTargetsAll[i].msgContent == null && this.chatTargetsAll[i].msgImage == null && this.chatTargetsAll[i].taskKey != null) {
                this.chatTargetsAll[i].msgContent = "[Task Information]";
            }
        }//end of for



        //this forloop set the displayID of chatTargets to the name of the person who the current user is talking to.
        for (var i = 0; i < this.chatTargetsAll.length; i++) {
            if (this.chatTargetsAll[i].receiverKey == senderKey) {
                this.chatTargetsAll[i].displayID = this.chatTargetsAll[i].senderKey;
            }
            else {
                this.chatTargetsAll[i].displayID = this.chatTargetsAll[i].receiverKey;
            }

        }//end of for



        //this forloop calculates the number of message that the current user received but not seen yet. 
        for (var i = 0; i < this.chatTargetsAll.length; i++) {
            this.chatTargetsAll[i].msgBadgeNum = this.getMsgBadge(chatTargets, senderKey, this.chatTargetsAll[i].displayID);
            if (this.chatTargetsAll[i].msgBadgeNum > 0) {
                this.chatTargetsAll[i].unseenMsg = true;
            }
            else {
                this.chatTargetsAll[i].unseenMsg = false;
            }
        }//end of for


        this.storage=new Storage(this.config);
        this.storage.set('forwardTargets',this.chatTargetsAll);

        return this.chatTargetsAll;


    }//end of FilterChatTargets() Method


    getMsgBadge(chatTargets: Chat[], senderKey: string, displayID: string) {
this.msgBadgeCounter=0;
        for (var c = 0; c < chatTargets.length; c++) { //go thru the rounds of all chat records
            if (chatTargets[c].receiverKey == senderKey && chatTargets[c].senderKey == displayID) {
                if (chatTargets[c].msgStatus == "Delivered") {
                    this.msgBadgeCounter++;

                }
            }
        }

        return this.msgBadgeCounter;
    }

    setChatKey(chatKeys:number[]){
        this.storage=new Storage(this.config);

        this.storage.set("chatKeys",chatKeys);
    }



    //-------------------------------------------------------------------------------------------------
    //version 1
    //only able to show latest msg by login user as sender

    // filterChatTargets(chatTargets: Chat[], senderKey:string) {
    //     //filter all chatTargets that the sender is from current user
    //     for (var i = 0; i < chatTargets.length; i++) {
    //         if (chatTargets[i].senderKey == senderKey) {
    //             this.chatTargetsBySender[this.senderCounter] = chatTargets[i];
    //             this.senderCounter++;
    //         }
    //     }

    //     this.receiverCounter = 0;
    //     let counter = 0;


    //     //filter chatTargetsBySender where receiver is unique and the message send is new
    //     for (var i = 0; i < this.chatTargetsBySender.length; i++) {



    //         if (this.chatTargetsByReceiver.length == 0) {
    //             this.chatTargetsByReceiver.push(this.chatTargetsBySender[i]);

    //         }
    //         else {
    //             for (var receiverCounter = 0; receiverCounter < this.chatTargetsByReceiver.length; receiverCounter++) {

    //                 //if not the same, push.   If the same, replace
    //                 if (this.chatTargetsByReceiver[receiverCounter].receiverKey != this.chatTargetsBySender[i].receiverKey) {



    //                     this.chatTargetsByReceiver.push(this.chatTargetsBySender[i]);

    //                 } else {
    //                     this.chatTargetsByReceiver[receiverCounter] = this.chatTargetsBySender[i];
    //                 }
    //             }
    //         }
    //     }

    //     this.chatTargetsFiltered.length=0;
    //     for (var i = 0; i < this.chatTargetsByReceiver.length; i++) {
    //         if (this.chatTargetsFiltered.indexOf(this.chatTargetsByReceiver[i]) < 0 ) {
    //             this.chatTargetsFiltered.push(this.chatTargetsByReceiver[i]);
    //         }

    //     }

    //     for(var i=0;i<this.chatTargetsFiltered.length;i++){
    //         if(this.chatTargetsFiltered[i].msgContent==null && this.chatTargetsFiltered[i].msgImage !=null){
    //             this.chatTargetsFiltered[i].msgContent="[Image]";
    //         }
    //         else if(this.chatTargetsFiltered[i].msgContent==null && this.chatTargetsFiltered[i].msgImage ==null && this.chatTargetsFiltered[i].taskKey!=null){
    //             this.chatTargetsFiltered[i].msgContent="[Task Information]";
    //         }
    //     }


    //     console.log(this.chatTargetsFiltered);
    //     return this.chatTargetsFiltered;

    // }




}
