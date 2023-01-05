import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { MsgStatusComponent } from './msg-status/msg-status.component';

const routes: Routes = [
  {path:'',component:MainPageComponent},
  {path:"sms-status",component:MsgStatusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
