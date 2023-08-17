import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../service/notification.service";
import {Notification} from "../dto/notification.type";
import {Subscription} from "rxjs";

@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];
  private notificationsSubscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.notificationsSubscription = this.notificationService.notificationsChanged
      .subscribe(
        (notifications: Notification[]) => {
          this.notifications = notifications;
        }
      );
    this.notifications = this.notificationService.getNotifications();
  }
}
