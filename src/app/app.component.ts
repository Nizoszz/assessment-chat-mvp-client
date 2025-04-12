import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { ChatComponent } from "./chat/chat.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'assessment-chat-mvp-client';
  private routeSubscription?: Subscription;
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.routeSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getRouteTitle(this.activatedRoute))
      )
      .subscribe((title) => (this.title = title));
  }
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  private getRouteTitle(route: ActivatedRoute): string {
    let child = route;
    while (child.firstChild) {
      child = child.firstChild;
    }
    return child.snapshot.data['title'] || 'Default Title';
  }
}
