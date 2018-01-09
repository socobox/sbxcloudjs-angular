import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbxCoreService } from './sbxcore.service';
import {HttpClientModule} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {SbxInterceptor} from './sbxinterceptor.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: SbxInterceptor,
    multi: true
  }, SbxCoreService]
})
export class SbxCoreModule { }
