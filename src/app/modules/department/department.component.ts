import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { IDepartment } from 'src/app/models/department';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.less'],
})
export class DepartmentComponent implements OnInit {
  lisOfDepartments: Array<IDepartment> = [];
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
    private readonly departmentService: DepartmentService,
    private fb: NonNullableFormBuilder
  ) {}
  ngOnInit(): void {
    this.loading = true;
    this.departmentService.getDepartments().subscribe((data) => {
      this.lisOfDepartments = data.data;
      this.loading = false;
    });
  }

  showAddModal(): void {
    this.resetForm();
    this.visibleAddModal = true;
  }

  showEditModal(value: IDepartment): void {
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
      this.departmentService
        .saveDepartment({
          name: this.validateForm.value.name,
          isDefault: false,
        })
        .pipe(first())
        .subscribe((data) => {
          this.lisOfDepartments = [...this.lisOfDepartments, data];
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
      this.departmentService
        .updateDepartment(this.validateForm.value._id, {
          name: this.validateForm.value.name,
          isDefault: this.validateForm.value.isDefault,
        })
        .pipe(first())
        .subscribe((data) => {
          const roles = [...this.lisOfDepartments];
          const roleIndex = roles.findIndex((f) => f._id === data._id);
          if (roleIndex) {
            roles[roleIndex] = {
              ...data,
            };
            this.lisOfDepartments = [...roles];
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

  deleteRole = (data: IDepartment) => {
    if (data && data._id) {
      this.departmentService
        .deleteDepartment(data._id)
        .pipe(first())
        .subscribe(() => {
          this.lisOfDepartments = this.lisOfDepartments.filter(
            (r) => r._id !== data._id
          );
        });
    }
  };
}
