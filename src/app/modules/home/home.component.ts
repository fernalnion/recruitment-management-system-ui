import { AfterViewInit, Component } from '@angular/core';
import * as echarts from 'echarts';
import { groupBy, sumBy } from 'lodash';
import { JOB_APPLIED_STATUS_ENUM } from 'src/app/enums/status.enum';
import { IUser } from 'src/app/models/User';
import { IApplicant } from 'src/app/models/applicant';
import { IApplication } from 'src/app/models/application';
import { IInterview } from 'src/app/models/interview';
import { IComment } from 'src/app/models/comment';
import { IDepartment } from 'src/app/models/department';
import { IJob } from 'src/app/models/job';
import { ApplicantService } from 'src/app/services/applicant.service';
import { InterviewService } from 'src/app/services/interview.service';
import { ApplicationService } from 'src/app/services/application.service';
import { CommentService } from 'src/app/services/comment.service';
import { DepartmentService } from 'src/app/services/department.service';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';
import { addDays, format, getDate, getDayOfYear } from 'date-fns';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  host: { class: 'inner-content-sub' },
})
export class HomeComponent implements AfterViewInit {
  user: IUser | null = null;
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

  interviews: {
    total: number;
    data: IInterview[];
    objects: { [id: string]: IInterview };
  } = {
    total: 0,
    data: [],
    objects: {},
  };

  upcomingInterviews: IInterview[] = [];

  comments: {
    total: number;
    data: IComment[];
    objects: { [id: string]: IComment };
  } = {
    total: 0,
    data: [],
    objects: {},
  };

  isLoadingDone = false;

  recent_comments: IComment[] = [];
  status: { [id: string]: number } = {};
  current_openings: number = 0;

  constructor(
    private readonly userService: UserService,
    private readonly applicationService: ApplicationService,
    private readonly applicantService: ApplicantService,
    private readonly jobService: JobService,
    private readonly departmentService: DepartmentService,
    private readonly interviewService: InterviewService,
    private readonly commentService: CommentService
  ) {
    this.userService.$user.subscribe((user) => {
      this.user = user;
    });
  }
  ngAfterViewInit(): void {
    this.isLoadingDone = false;
    this.applicationService.getApplications().subscribe((data) => {
      this.applications = {
        ...data,
        objects: Object.fromEntries(
          data.data.map((application) => [application._id, application])
        ),
      };

      Object.entries(JOB_APPLIED_STATUS_ENUM).map(([key, value]) => {
        const count = this.applications.data.filter(
          (x) => x.status === value
        ).length;

        this.status[key] = count;
      });

      this.applicantService.getApplicants().subscribe((data) => {
        this.applicants = {
          ...data,
          objects: Object.fromEntries(
            data.data.map((applicant) => [applicant._id, applicant])
          ),
        };

        this.isLoadingDone = true;
      });
    });

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
        this.current_openings = sumBy(
          data.data.filter((x) => x.isActive),
          (x) => x.openings
        );

        this.initDepartmentChart();
      });
    });

    this.interviewService.getInterviews(false).subscribe((data) => {
      this.interviews = {
        ...data,
        objects: Object.fromEntries(
          data.data.map((interview) => [interview._id, interview])
        ),
      };

      this.upcomingInterviews = [
        ...this.interviews.data.filter(
          (x) => new Date(x.scheduleAt) > new Date()
        ),
      ];

      this.initTaskDeliveryChart();
    });

    this.commentService.getComments().subscribe((data) => {
      this.comments = {
        ...data,
        objects: Object.fromEntries(
          data.data.map((comment) => [comment._id, comment])
        ),
      };

      this.recent_comments = [...this.comments.data.slice(0, 10)];
    });
  }

  initTaskDeliveryChart = () => {
    const groupByDate = groupBy(this.interviews.data, (x) =>
      format(new Date(x.scheduleAt), 'yyyy-MM-dd')
    );

    const group = Object.entries(groupByDate).map(([key, values]) => {
      return {
        date: key,
        completed: values.filter((x) => x.isCanceled).length,
        canceled: values.filter((x) => !x.isCanceled).length,
      };
    });

    const taskDeliveryChart = echarts.init(
      document.getElementById('task-delivery')
    );
    taskDeliveryChart.setOption({
      xAxis: {
        type: 'category',
        // data: group.map((x) => x.date),
        data: Array.from({ length: 7 }).map((_, index) =>
          format(addDays(new Date('2023-10-21'), index), 'ddd')
        ),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Scheduled',
          // data: group.map((x) => x.completed),
          data: [4, 3, 4, 5, 2, 5, 6],
          type: 'line',
          smooth: true,
        },
        {
          name: 'Canceled',
          data: [0, 1, 2, 0, 1, 2, 4],
          // data: group.map((x) => x.canceled),
          type: 'line',
          smooth: true,
        },
      ],
    });
  };
  initDepartmentChart = () => {
    const seriesdata = this.departments.data.map((department) => ({
      name: department.name,
      value: sumBy(
        this.jobs.data.filter(
          (x) => x.department === department._id && x.isActive
        ),
        (x) => x.openings
      ),
    }));
    const taskRoleWorkingTypeChart = echarts.init(
      document.getElementById('role-working-type')
    );
    taskRoleWorkingTypeChart.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '30%',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['30%', '70%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          data: seriesdata,
        },
      ],
    });
  };

  ngOnInit(): void {}

  get GetUserFullName(): string {
    return this.user ? `${this.user.firstname} ${this.user.lastname}` : '';
  }
}
