import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddTaskPage } from '../add-task/add-task';
import { ChatPage } from '../chat/chat';
import { ChatListPage } from '../chat-list/chat-list';
import { SelectCategoryPage } from '../select-category/select-category';
import { RecorderPage } from '../recorder/recorder';
import { TaskLocationPage } from '../task-location/task-location';
import { PopoverComponent } from '../../components/popover/popover';

//here import your pages


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  //here is to set page to the tabs
  //you might can only set one page before everyone links together

  task: any = TaskLocationPage;
  addTask: any = AddTaskPage;
  activity: any = SelectCategoryPage;
  profile: any = ChatListPage;



}
