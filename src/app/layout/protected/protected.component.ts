import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { IUser } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

export interface Breadcrumb {
  text: string;
  url: string;
}
@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.less'],
})
export class ProtectedComponent implements OnInit {
  user: IUser | null = null;
  isCollapsed: boolean = false;
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    document.body.classList.toggle('menu-collapsed', this.isCollapsed);
  }
  ngOnInit(): void {
    this.userService.$user.subscribe((user) => {
      this.user = user;
      this.loadBreadCrumbs();
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.loadBreadCrumbs());
  }

  private loadBreadCrumbs = () => {
    const breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    this.breadcrumbsSubject.next(breadcrumbs);
  };

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    document.body.classList.toggle('menu-collapsed', this.isCollapsed);
  }

  logout(): void {
    this.authService.logout();
  }

  get GetUserFullName(): string {
    return this.user ? `${this.user.firstname} ${this.user.lastname}` : '';
  }

  get GetUserLabel(): string {
    return this.user
      ? `${this.user.firstname.charAt(0).toUpperCase()}${this.user.lastname
          ?.charAt(0)
          .toUpperCase()}`
      : '';
  }

  get getRole(): string {
    return this.user?.role.name ?? '';
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const routeURL: string = route.snapshot.url
      .map((segment) => segment.path)
      .join('/');
    if (routeURL !== '') {
      url += `/${routeURL}`;
      breadcrumbs.push({
        text: `${routeURL.charAt(0).toUpperCase()}${routeURL
          .slice(1)
          .toLowerCase()}`,
        url,
      });
    }

    if (route.firstChild) {
      return this.createBreadcrumbs(route.firstChild, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
