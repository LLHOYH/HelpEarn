import { Component } from '@angular/core';
import { NavController, NavParams, DateTime } from 'ionic-angular';


//class and provider
import { Task } from '../../models/Task';
import { TaskProvider } from '../../providers/TaskProvider';

@Component({
  selector: 'page-select-category',
  templateUrl: 'select-category.html'
})
export class SelectCategoryPage {

  category: string;
  task: Task;
  date;
  year;
  month;
  min;
  hr;
  sec;

  buttonColorGeneral;
  buttonColorDelivery;
  buttonColorRepair;
  buttonColorCleaning;
  buttonColorProfessional;
  buttonColorRental;


  constructor(public navCtrl: NavController, public navParam: NavParams, private taskPvd: TaskProvider) {

  }

  SubmitTask() {
    this.date = new Date().getDate();
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth()+1;

    this.hr = new Date().getHours();
    this.min = new Date().getMinutes();
    console.log(this.hr);
    console.log(this.min);
    this.task = this.navParam.get('task');
    this.task.category = this.category;
    this.task.status="Pending";
    this.task.timePosted = this.date + '/' + this.month + '/' + this.year + ' ' + this.hr + ':' + this.min;

    //not to insertTask at this stage!
    //only insert after payment completed!
    //remove this to redirect to payment page when integrate!
    //this.navCtrl.push(PaymentPage);

    this.taskPvd.insertTask(this.task);

  }




  confirmOnClick(category) {
    this.category = category;

    if (this.category == "General") {
      this.buttonColorGeneral = "#d4f442";
    }
    else {
      this.buttonColorGeneral = "white";
    }

    if (this.category == "Delivery") {
      this.buttonColorDelivery = "#d4f442";
    }
    else {
      this.buttonColorDelivery = "white";
    }

    if (this.category == "Repair") {
      this.buttonColorRepair = "#d4f442";
    }
    else {
      this.buttonColorRepair = "white";
    }

    if (this.category == "Cleaning") {
      this.buttonColorCleaning = "#d4f442";
    }
    else {
      this.buttonColorCleaning = "white";
    }

    if (this.category == "Professional") {
      this.buttonColorProfessional = "#d4f442";
    }
    else {
      this.buttonColorProfessional = "white";
    }

    if (this.category == "Rental") {
      this.buttonColorRental = "#d4f442";
    }
    else {
      this.buttonColorRental = "white";
    }


  }

}
