import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { first } from 'rxjs';
import { IApplicant } from 'src/app/models/applicant';
import { ApplicantService } from 'src/app/services/applicant.service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.less'],
})
export class ApplicantComponent implements OnInit {
  listOfApplicants: Array<IApplicant> = [];
  loading = true;
  visibleAddModal = false;
  visibleEditdModal = false;

  validateForm: FormGroup<{
    _id: FormControl<string>;
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    email: FormControl<string>;
    mobile: FormControl<string>;
    image: FormControl<any>;
  }> = this.notNullFB.group({
    _id: [''],
    firstname: ['', [Validators.required]],
    lastname: ['', []],
    email: ['', [Validators.required]],
    mobile: ['', [Validators.required]],
    image: [null],
  });
  constructor(
    private readonly applicantService: ApplicantService,
    private notNullFB: NonNullableFormBuilder
  ) {}
  ngOnInit(): void {
    this.loading = true;
    this.applicantService.getApplicants().subscribe((data) => {
      this.listOfApplicants = data.data;
      this.loading = false;
    });
  }

  showAddModal(): void {
    this.resetForm();
    this.visibleAddModal = true;
  }

  showEditModal(value: IApplicant): void {
    this.resetForm();
    this.validateForm.setValue({
      _id: value._id,
      firstname: value.firstname,
      lastname: value.lastname ?? '',
      email: value.email,
      mobile: value.mobile,
      image: null,
    });
    this.visibleEditdModal = true;
  }

  private resetForm = () => {
    this.validateForm.reset();
  };

  handleAddModalOk(): void {
    if (
      this.validateForm.valid &&
      this.validateForm.value.firstname &&
      this.validateForm.value.email &&
      this.validateForm.value.mobile
    ) {
      this.loading = true;
      this.applicantService
        .saveApplicant({
          firstname: this.validateForm.value.firstname,
          lastname: this.validateForm.value.lastname,
          email: this.validateForm.value.email,
          mobile: this.validateForm.value.mobile,
          image: this.validateForm.value.image,
        })
        .pipe(first())
        .subscribe((data) => {
          this.listOfApplicants = [...this.listOfApplicants, data];
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
      this.validateForm.value.firstname &&
      this.validateForm.value.email &&
      this.validateForm.value.mobile
    ) {
      this.loading = true;
      this.applicantService
        .updateApplicant(this.validateForm.value._id, {
          firstname: this.validateForm.value.firstname,
          lastname: this.validateForm.value.lastname,
          email: this.validateForm.value.email,
          mobile: this.validateForm.value.mobile,
          image: this.validateForm.value.image,
        })
        .pipe(first())
        .subscribe((data) => {
          const roles = [...this.listOfApplicants];
          const roleIndex = roles.findIndex((f) => f._id === data._id);
          if (roleIndex) {
            roles[roleIndex] = {
              ...data,
            };
            this.listOfApplicants = [...roles];
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

  deleteRole = (data: IApplicant) => {
    if (data && data._id) {
      this.applicantService
        .deleteApplicant(data._id)
        .pipe(first())
        .subscribe(() => {
          this.listOfApplicants = this.listOfApplicants.filter(
            (r) => r._id !== data._id
          );
        });
    }
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    this.validateForm.patchValue({ image: file });
    return false;
  };

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'uploading') {
      this.validateForm.patchValue({ image: info.file.originFileObj });
    }
  }
}
