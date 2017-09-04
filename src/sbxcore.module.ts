import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbxCoreService } from './sbxcore.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [SbxCoreService]
})
export class SbxCoreModule { }
