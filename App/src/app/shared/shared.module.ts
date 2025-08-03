import { ModuleWithProviders, NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule} from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';

import { DataService } from './services/data.service';
import { ITemplate } from './models/account';
import { ApiMailService, ApiTempateService } from './services/all.service';
import { IMail } from './models/mail';
@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      HttpClientModule,
      HttpClientJsonpModule,
      MatIconModule,
      MatToolbarModule, 
      MatButtonModule, 
      MatIconModule,
      MatTreeModule,
      MatTableModule,
      MatMenuModule,
      MatBadgeModule,    
      MatFormFieldModule,
      MatInputModule,
      MatTabsModule,
      MatListModule,
      MatSelectModule,
      MatDatepickerModule,
      MatAutocompleteModule,
      MatProgressSpinnerModule,
      MatSlideToggleModule,
      MatPaginatorModule,
      MatSliderModule,
      MatCheckboxModule,
      MatSortModule, 
      MatTooltipModule,
      AsyncPipe,
      MatDividerModule,
      MatGridListModule
  ],
  declarations: [
      
  ],
  exports: [
      // Modules
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      MatTabsModule,
      MatFormFieldModule, 
      MatInputModule,
      MatIconModule,
      MatListModule,
      MatButtonModule,
      MatToolbarModule, 
      MatBadgeModule, 
      MatSelectModule,
      MatAutocompleteModule,
      MatCheckboxModule,
      MatSliderModule,
      MatTooltipModule,
      MatTableModule,
      MatMenuModule,
      MatProgressSpinnerModule,
      MatSlideToggleModule,
      MatSortModule, 
      MatDialogModule,
      MatPaginatorModule,
      MatTreeModule,
      MatCardModule,
      MatDatepickerModule,
      MatDividerModule,
      MatGridListModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
      return {
          ngModule: SharedModule,
          providers: [
              DataService,  
              ApiTempateService<ITemplate>,
              ApiMailService<IMail>,
          ]
      };
  }
}
