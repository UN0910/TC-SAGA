import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserService } from '@t.c.saga/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcadmin-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._getUsers();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  editUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`);
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(userId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
          this._getUsers();
          this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'User Deleted!!!' });
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "User can't be Added!!!" });
          });
      }
    });
  }

  private _getUsers() {
    this.userService.getUsers().pipe(takeUntil(this.endsubs$)).subscribe((users) => {
      this.users = users;
    })
  }

}
