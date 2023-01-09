import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Task } from '../models/Task';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'firebase/auth'
import { enableProdMode } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';


enableProdMode()
@Injectable()
export class TaskProvider {
    taskList: Task[];
    item: any;

    ref = firebase.database().ref('/Task');
    inputText: string = '';
    task: Task;
    itemsRef: AngularFireList<any>;
    items: Observable<any[]>;
    requestor: string;

    config: StorageConfig;
    constructor(public db: AngularFireDatabase, private storage: Storage) {
        this.storage = new Storage(this.config);
    }

    insertTask(task: Task) {
        this.storage.set(this.requestor, 'Johnny');

        console.log(task.contentPic);
        if (task.contentPic == undefined) {
            console.log(task.contentPic);

            task.contentPic = "Not Applicable";
            console.log(task.contentPic);

        }
        this.storage.get(this.requestor).then((val) => {
            task.requestor = val;
            console.log(task.taskKey);
            this.db.list('/task').push({
                taskKey: task.taskKey,
                taskName: task.taskName,
                contentDesc: task.contentDesc,
                location: task.location,
                latitude:task.latitude,
                longtitude:task.longtitude,
                helperNum: task.helperNum,
                completeDate: task.completeDate,
                preferGender: task.preferGender,
                skillsNeeded: task.skillsNeeded,
                contentPic: task.contentPic,
                price: task.price,
                category: task.category,
                timePosted: task.timePosted,
                status: task.status,
                requestor: task.requestor,
            });
        })
    }

    clearLocationStorage(){
        this.storage.set("address", null);
        this.storage.set("latitude", null);
        this.storage.set("longtitude", null);
    }

    setLocationStorage(confirmLocation: string, lat: string, long: string) {

        this.storage.set("address", confirmLocation);
        this.storage.set("latitude", lat);
        this.storage.set("longtitude", long);
    }

}