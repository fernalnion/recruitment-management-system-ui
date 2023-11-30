import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { IDepartment } from 'src/app/models/department';
import { IJob } from 'src/app/models/job';
import { DepartmentService } from 'src/app/services/department.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.less'],
})
export class JobComponent {
  @ViewChild('popTags', { static: false }) popTags?: ElementRef;
  tagInputVisible = false;
  tagInputValue = '';

  tagcolors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];

  lisOfJobs: Array<IJob> = [];
  lisOfDepartments: Array<IDepartment> = [];
  departmentObject: { [id: string]: IDepartment } = {};
  loading = true;
  visibleAddModal = false;
  visibleEditdModal = false;

  validateForm: FormGroup<{
    _id: FormControl<string>;
    title: FormControl<string>;
    description: FormControl<string>;
    department: FormControl<string>;
    openings: FormControl<number>;
    skills: FormControl<Array<string>>;
    isActive: FormControl<boolean>;
  }> = this.fb.group({
    _id: [''],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    department: ['', [Validators.required]],
    openings: [
      0,
      [Validators.required, Validators.min(1), Validators.max(100)],
    ],
    skills: [[''], [Validators.required]],
    isActive: [true],
  });
  data: any;
  constructor(
    private readonly jobService: JobService,
    private readonly departmentService: DepartmentService,
    private fb: NonNullableFormBuilder
  ) {}
  ngOnInit(): void {
    this.loading = true;
    this.jobService.getJobs().subscribe((data) => {
      this.lisOfJobs = data.data;
      this.loading = false;
    });

    this.departmentService.getDepartments().subscribe((data) => {
      this.departmentObject = Object.fromEntries(
        data.data.map((department) => [department._id, department])
      );
      this.lisOfDepartments = data.data;
    });
  }

  showAddModal(): void {
    this.resetForm();
    this.visibleAddModal = true;
  }

  showEditModal(value: IJob): void {
    this.resetForm();
    this.validateForm.patchValue({
      _id: value._id,
      title: value.title,
      description: value.department,
      department: value.department,
      openings: value.openings,
      skills: value.skills,
      isActive: value.isActive,
    });
    this.visibleEditdModal = true;
  }

  private resetForm = () => {
    this.validateForm.reset({ skills: [], isActive: true });
  };

  handleAddModalOk(): void {
    if (
      this.validateForm.valid &&
      this.validateForm.value.title &&
      this.validateForm.value.description &&
      this.validateForm.value.department &&
      this.validateForm.value.openings &&
      this.validateForm.value.skills
    ) {
      this.loading = true;
      this.jobService
        .saveJob({
          title: this.validateForm.value.title,
          description: this.validateForm.value.department,
          department: this.validateForm.value.department,
          openings: this.validateForm.value.openings,
          skills: this.validateForm.value.skills,
          isActive: !!this.validateForm.value.isActive,
          postedAt: new Date(),
        })
        .pipe(first())
        .subscribe((data) => {
          this.lisOfJobs = [...this.lisOfJobs, data];
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
      this.validateForm.valid &&
      this.validateForm.value.title &&
      this.validateForm.value.description &&
      this.validateForm.value.department &&
      this.validateForm.value.openings &&
      this.validateForm.value.skills
    ) {
      this.loading = true;
      this.jobService
        .updateJob(this.validateForm.value._id, {
          title: this.validateForm.value.title,
          description: this.validateForm.value.department,
          department: this.validateForm.value.department,
          openings: this.validateForm.value.openings,
          skills: this.validateForm.value.skills,
          isActive: this.validateForm.value.isActive,
        })
        .pipe(first())
        .subscribe((data) => {
          const roles = [...this.lisOfJobs];
          const roleIndex = roles.findIndex((f) => f._id === data._id);
          if (roleIndex) {
            roles[roleIndex] = {
              ...data,
            };
            this.lisOfJobs = [...roles];
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

  deleteRole = (data: IJob) => {
    if (data && data._id) {
      this.jobService
        .deleteJob(data._id)
        .pipe(first())
        .subscribe(() => {
          this.lisOfJobs = this.lisOfJobs.filter((r) => r._id !== data._id);
        });
    }
  };

  handleClose(removedTag: string): void {
    if (this.validateForm.value.skills && removedTag !== '') {
      this.validateForm.patchValue({
        skills: [
          ...this.validateForm.value.skills.filter((tag) => tag !== removedTag),
        ],
      });
    }
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.tagInputVisible = true;
    setTimeout(() => {
      this.popTags?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(event: any): void {
    const tagInputValue = this.popTags?.nativeElement?.value;
    if (
      tagInputValue &&
      this.validateForm.value.skills?.indexOf(tagInputValue) === -1
    ) {
      this.validateForm.patchValue({
        skills: [
          ...(this.validateForm.value.skills.length
            ? this.validateForm.value.skills
            : []),
          tagInputValue,
        ],
      });
    }
    if (this.popTags?.nativeElement) {
      this.popTags.nativeElement.value = '';
    }
    this.tagInputVisible = false;
  }

  updateStatus = (_id: string, isActive: boolean) => {
    this.loading = true;
    this.jobService
      .updateJob(_id, {
        isActive: !isActive,
      })
      .pipe(first())
      .subscribe((data) => {
        const roles = [...this.lisOfJobs];
        const roleIndex = roles.findIndex((f) => f._id === data._id);
        if (roleIndex != -1) {
          roles[roleIndex] = { ...data };
          this.lisOfJobs = [...roles];
        }
        this.visibleEditdModal = false;
        this.loading = false;
      });
  };
}
