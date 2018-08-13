import { NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbxCoreService } from './sbxcore.service';
import {HttpClientModule} from '@angular/common/http';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: []
})
export class SbxCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SbxCoreModule,
      providers: [
         //   {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: SbxInterceptor,
        //   multi: true
        // },
        SbxCoreService
      ]
    };
  }
}
