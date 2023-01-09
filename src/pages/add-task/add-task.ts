import { Component, } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, Alert, IonicPage } from 'ionic-angular';
import { NgForm } from '@angular/forms';

// import { PickerController } from '@ionic/angular';
// import { PickerOptions, PickerButton } from '@ionic/core';

//class and provider
import { Task } from '../../models/Task';
import { TaskProvider } from '../../providers/TaskProvider';

//Camera
import { Camera, CameraOptions } from '@ionic-native/camera';

//navigate to other pages
import { SelectCategoryPage } from '../select-category/select-category';
import { AngularFireDatabase,AngularFireAction } from 'angularfire2/database';
import { TaskLocationPage } from '../task-location/task-location';
import { StorageConfig, Storage } from '@ionic/storage';


@Component({
  selector: 'page-add-task',
  templateUrl: 'add-task.html'
})
export class AddTaskPage {

  imageSrc: any;
  task: Task;
  tasks:Task[];
  genders: string[];

  photo;

  imgStatus: boolean = false;
  defaultGender: string;
  config: StorageConfig;
storage:Storage;
  constructor(
    private navCtrl: NavController,
    private camera: Camera,
    private platform: Platform,
    private alertCtrl: AlertController,
    private taskPvd: TaskProvider,
    private db:AngularFireDatabase
    
  ) {
    this.storage=new Storage(this.config);

    this.task = new Task();
    this.tasks=new Array<Task>();
    this.task.taskKey=0;
    this.genders = ['No preference', 'Male', 'Female'];
    this.task.preferGender = "No preference";

    this.taskPvd.clearLocationStorage()

  }

  ionViewWillEnter(){  //rmb to clear the storage after sucessful inserting
    this.storage.get("address").then((val) => {
      this.task.location = val;
    })

    this.storage.get("latitude").then((val) => {
      this.task.latitude = val;
    })

    this.storage.get("longtitude").then((val) => {
      this.task.longtitude = val;
    })

console.log(this.task.location);
  }

  submitTask(form: NgForm) {
    this.getLatestTaskKey();

    if (form.valid) {
      if (this.task.location == null) {
        this.task.location = "Not Applicable";
        this.task.latitude = "Not Applicable";
        this.task.longtitude = "Not Applicable";

      }

      this.navCtrl.push(SelectCategoryPage,
        { task: this.task }
      );

    }

  }

  getLatestTaskKey() { //to create auto incrementing key
    this.db.list('/task').valueChanges().subscribe( //firstly, retrieve everything from the table
      data => {
        this.tasks = data;
        for(var i=0;i<this.tasks.length;i++){ // get the largest key in that table by doing a for loop and validate
          if(this.task.taskKey<=this.tasks[i].taskKey){
            this.task.taskKey=this.tasks[i].taskKey; //here gets the largest key
          }
        }

        this.task.taskKey++; //largest key +1, and use this value to insert a new record
    })
    console.log(this.task.taskKey);
  }

  goSelectLocation(){
    this.navCtrl.push(TaskLocationPage);
  }



  //getImageFromGallery
  getImage() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 100,
      targetHeight: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType:this.camera.MediaType.ALLMEDIA,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation:true,
      
    }



    this.camera.getPicture(options).then((imageData) => {
      this.photo = 'data:image/jpeg;base64,' + imageData;
      this.task.contentPic = this.photo;
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });
  }

}

