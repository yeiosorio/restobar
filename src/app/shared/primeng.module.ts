import { NgModule } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';

@NgModule({
  exports: [
    FileUploadModule,
    TableModule,
    CalendarModule,
    CardModule,
    ButtonModule,
    ChartModule,
    ToastModule,
    ToolbarModule,
    RippleModule,
    StyleClassModule
  ]
})
export class PrimeNgModule { } 