import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabloidComponent } from './tabloid/tabloid.component';
import { HeaderComponent } from './header/header.component';
import { FiboComponent } from './fibo/fibo.component';

@NgModule({
  declarations: [AppComponent, TabloidComponent, HeaderComponent, FiboComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
