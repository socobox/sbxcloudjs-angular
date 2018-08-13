import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SbxSessionService} from './sbxsession.service';
import {CookieService} from 'ngx-cookie-service';
import {SbxCoreModule} from '../sbxcore.module';

@NgModule({
  imports: [
    CommonModule,
    SbxCoreModule
  ],
  declarations: []
})
export class SbxSessionModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SbxSessionModule,
      providers: [SbxSessionService, CookieService]
    };
  }
}
