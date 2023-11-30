import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { IRole } from 'src/app/models/Role';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less'],
})
export class RoleComponent implements OnInit {
  lisOfRoles: Array<IRole> = [];
  loading = true;
  visibleAddModal = false;
  visibleEditdModal = false;

  validateForm: FormGroup<{
    _id: FormControl<string>;
    name: FormControl<string>;
    isDefault: FormControl<boolean>;
  }> = this.fb.group({
    _id: [''],
    name: ['', [Validators.required]],
    isDefault: [false],
  });
  constructor(
    private readonly roleService: RoleService,
    private fb: NonNullableFormBuilder
  ) {}
  ngOnInit(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe((data) => {
      this.lisOfRoles = data.data;
      this.loading = false;
    });
  }

  showAddModal(): void {
    this.resetForm();
    this.visibleAddModal = true;
  }

  showEditModal(value: IRole): void {
    this.resetForm();
    this.validateForm.setValue({
      _id: value._id,
      name: value.name,
      isDefault: value.isDefault,
    });
    this.visibleEditdModal = true;
  }

  private resetForm = () => {
    this.validateForm.reset();
  };

  handleAddModalOk(): void {
    if (this.validateForm.valid && this.validateForm.value.name) {
      this.loading = true;
      this.roleService
        .saveRole({
          name: this.validateForm.value.name,
          isDefault: false,
        })
        .pipe(first())
        .subscribe((data) => {
          this.lisOfRoles = [...this.lisOfRoles, data];
          this.visibleAddModal = false;
          this.loading = false;
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
        this.loading = false;
      });
    }
  }

  handleEditModalOk(): void {
    if (
      this.validateForm.valid &&
      this.validateForm.value._id &&
      this.validateForm.value.name
    ) {
      this.loading = true;
      this.roleService
        .updateRole(this.validateForm.value._id, {
          name: this.validateForm.value.name,
          isDefault: this.validateForm.value.isDefault,
        })
        .pipe(first())
        .subscribe((data) => {
          const roles = [...this.lisOfRoles];
          const roleIndex = roles.findIndex((f) => f._id === data._id);
          if (roleIndex) {
            roles[roleIndex] = {
              ...data,
            };
            this.lisOfRoles = [...roles];
          }
          this.visibleEditdModal = false;
          this.loading = false;
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
        this.loading = false;
      });
    }
  }

  handleAddModalCancel(): void {
    this.visibleAddModal = false;
  }

  handleEditModalCancel(): void {
    this.visibleEditdModal = false;
  }

  deleteRole = (data: IRole) => {
    if (data && data._id) {
      this.roleService
        .deleteRole(data._id)
        .pipe(first())
        .subscribe(() => {
          this.lisOfRoles = this.lisOfRoles.filter((r) => r._id !== data._id);
        });
    }
  };
}
