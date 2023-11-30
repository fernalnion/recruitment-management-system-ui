import { NgModule } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ScrollingModule } from '@angular/cdk/scrolling';

const NZ_MODULES = [
  NzLayoutModule,
  NzFormModule,
  NzInputModule,
  NzButtonModule,
  NzCheckboxModule,
  NzSelectModule,
  NzNotificationModule,
  NzIconModule,
  NzMenuModule,
  NzBreadCrumbModule,
  NzBadgeModule,
  NzDropDownModule,
  NzSpaceModule,
  NzCardModule,
  NzAvatarModule,
  NzDividerModule,
  NzListModule,
  NzTableModule,
  NzModalModule,
  NzPopconfirmModule,
  NzUploadModule,
  NzSwitchModule,
  NzTagModule,
  NzDatePickerModule,
];
const OTHER_MODULES = [ReactiveFormsModule, FormsModule, ScrollingModule];

@NgModule({
  imports: [...NZ_MODULES, ...OTHER_MODULES],
  exports: [...NZ_MODULES, ...OTHER_MODULES],
})
export class SharedModules {}
