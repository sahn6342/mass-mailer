import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MassMailer } from './mass-mailer/mass-mailer.component';

@NgModule({
  declarations: [
    AppComponent,MassMailer
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
