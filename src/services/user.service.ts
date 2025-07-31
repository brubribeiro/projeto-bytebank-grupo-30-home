import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  constructor(http: HttpClient) {
    super(http, 'user');
  }

  createUser(user: User) {
    return this.create(user);
  }

  login(username: string, email: string, password: string) {
    return this.auth({ username, password });
  }
}
