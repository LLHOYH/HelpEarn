import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { PopoverComponent } from '../../components/popover/popover';

@NgModule({
  declarations: [
    TabsPage,
    PopoverComponent,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    PopoverComponent,
  ],
})
export class TabsPageModule {}
