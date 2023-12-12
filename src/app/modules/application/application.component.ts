import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { JOB_APPLIED_STATUS_ENUM } from 'src/app/enums/status.enum';
import { IApplicant } from 'src/app/models/applicant';
import { IApplication } from 'src/app/models/application';
import { IDepartment } from 'src/app/models/department';
import { IJob } from 'src/app/models/job';
import { ApplicantService } from 'src/app/services/applicant.service';
import { ApplicationService } from 'src/app/services/application.service';
import { DepartmentService } from 'src/app/services/department.service';
import { InterviewService } from 'src/app/services/interview.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less'],
})
export class ApplicationComponent {
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

  applications: {
    total: number;
    data: IApplication[];
    objects: { [id: string]: IApplication };
  } = {
    total: 0,
    data: [],
    objects: {},
  };

  applicants: {
    total: number;
    data: IApplicant[];
    objects: { [id: string]: IApplicant };
  } = {
    total: 0,
    data: [],
    objects: {},
  };

  jobs: {
    total: number;
    data: IJob[];
    objects: { [id: string]: IJob };
  } = {
    total: 0,
    data: [],
    objects: {},
  };

  departments: {
    total: number;
    data: IDepartment[];
    objects: { [id: string]: IDepartment };
  } = {
    total: 0,
    data: [],
    objects: {},
  };

  listOfJobsFiltered: Array<IJob> = [];

  loading = true;
  visibleAddModal = false;
  visibleEditdModal = false;
  isVisibleInterview = false;

  appliationStatus = Object.entries(JOB_APPLIED_STATUS_ENUM).map(
    ([key, value]) => ({ key, value })
  );

  validateForm: FormGroup<{
    _id: FormControl<string>;
    applicant: FormControl<string>;
    department: FormControl<string>;
    job: FormControl<string>;
    status: FormControl<string>;
  }> = this.notNullFB.group({
    _id: [''],
    applicant: ['', [Validators.required]],
    department: ['', [Validators.required]],
    job: ['', [Validators.required]],
    status: ['', [Validators.required]],
  });

  interviewForm: FormGroup<{
    _id: FormControl<string>;
    scheduleAt: FormControl<Date>;
    isCanceled: FormControl<boolean>;
    application: FormControl<string>;
    applicant: FormControl<string>;
  }> = this.notNullFB.group({
    _id: [''],
    scheduleAt: [new Date(), [Validators.required]],
    isCanceled: [false],
    application: ['', [Validators.required]],
    applicant: ['', [Validators.required]],
  });
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicantService: ApplicantService,
    private readonly departmentService: DepartmentService,
    private readonly jobService: JobService,
    private readonly interviewService: InterviewService,
    private notNullFB: NonNullableFormBuilder
  ) {}
  ngOnInit(): void {
    this.loading = true;
    this.departmentService.getDepartments().subscribe((data) => {
      this.departments = {
        ...data,
        objects: Object.fromEntries(
          data.data.map((department) => [department._id, department])
        ),
      };
      this.jobService.getJobs().subscribe((data) => {
        this.jobs = {
          ...data,
          objects: Object.fromEntries(data.data.map((job) => [job._id, job])),
        };
      });
    });

    this.applicantService.getApplicants().subscribe((data) => {
      this.applicants = {
        ...data,
        objects: Object.fromEntries(
          data.data.map((applicant) => [applicant._id, applicant])
        ),
      };
      this.applicationService.getApplications().subscribe((data) => {
        this.applications = {
          ...data,
          objects: Object.fromEntries(
            data.data.map((application) => [application._id, application])
          ),
        };

        this.loading = false;
      });
    });
  }

  departmentChanged = (id: string) => {
    this.validateForm.patchValue({
      job: undefined,
    });

    this.listOfJobsFiltered = this.jobs.data.filter(
      (job) => !(id && id == '') || job.department === id
    );
  };

  showAddModal(): void {
    this.resetForm();
    this.visibleAddModal = true;
  }

  showInterviewModal(value: IApplication): void {
    this.resetForm();
    this.interviewForm.patchValue({
      applicant: value.applicant,
      application: value._id,
      isCanceled: false,
    });
    this.isVisibleInterview = true;
  }

  showEditModal(value: IApplication): void {
    this.resetForm();
    this.departmentChanged(this.jobs.objects[value.job].department);
    this.validateForm.patchValue({
      _id: value._id,
      applicant: value.applicant,
      department: this.jobs.objects[value.job].department,
      job: value.job,
      status: value.status,
    });

    this.visibleEditdModal = true;
  }

  private resetForm = () => {
    this.validateForm.reset();
    this.interviewForm.reset();
  };

  handleAddModalOk(): void {
    if (
      this.validateForm.valid &&
      this.validateForm.value.applicant &&
      this.validateForm.value.job &&
      this.validateForm.value.status
    ) {
      this.loading = true;
      this.applicationService
        .saveApplication({
          applicant: this.validateForm.value.applicant,
          job: this.validateForm.value.job,
          status: this.validateForm.value.status,
          appliedAt: new Date(),
        })
        .pipe(first())
        .subscribe((data) => {
          this.applications = {
            ...this.applications,
            data: [...this.applications.data, data],
            total: this.applications.total + 1,
            objects: {
              ...this.applications.objects,
              [data._id]: data,
            },
          };

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
      this.validateForm.value.applicant &&
      this.validateForm.value.job &&
      this.validateForm.value.status
    ) {
      this.loading = true;
      this.applicationService
        .updateApplication(this.validateForm.value._id, {
          applicant: this.validateForm.value.applicant,
          job: this.validateForm.value.job,
          status: this.validateForm.value.status,
        })
        .pipe(first())
        .subscribe((data) => {
          const applications = { ...this.applications };
          const applicationIndex = applications.data.findIndex(
            (f) => f._id === data._id
          );
          if (applicationIndex) {
            applications.data[applicationIndex] = {
              ...data,
            };
            this.applications = { ...applications };
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

  handleInterviewOk(): void {
    if (
      this.interviewForm.valid &&
      this.interviewForm.value.scheduleAt &&
      this.interviewForm.value.applicant &&
      this.interviewForm.value.application
    ) {
      this.interviewService
        .saveInterview({
          applicant: this.interviewForm.value.applicant,
          application: this.interviewForm.value.application,
          isCanceled: !!this.interviewForm.value.isCanceled,
          scheduleAt: this.interviewForm.value.scheduleAt,
        })
        .subscribe(() => {
          if (this.interviewForm.value.application) {
            this.applicationService
              .updateApplication(this.interviewForm.value.application, {
                status: JOB_APPLIED_STATUS_ENUM.INTERVIEW_SCHEDULED,
              })
              .subscribe(() => {
                this.isVisibleInterview = false;
              });
          }
        });
    } else {
      Object.values(this.interviewForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleAddModalCancel(): void {
    this.visibleAddModal = false;
  }

  handleEditModalCancel(): void {
    this.visibleEditdModal = false;
  }

  handleInterviewCancel(): void {
    this.isVisibleInterview = false;
  }

  deleteRole = (data: IApplication) => {
    if (data && data._id) {
      this.applicationService
        .deleteApplication(data._id)
        .pipe(first())
        .subscribe(() => {
          const appliations = { ...this.applications };
          appliations.data = appliations.data.filter((r) => r._id !== data._id);
          this.applications = { ...appliations };
        });
    }
  };
}
