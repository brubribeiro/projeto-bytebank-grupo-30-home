import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { BaseService } from './base.service';
import { catchError, throwError, map } from 'rxjs';

export interface CreateUserResponse {
  message: string;
  result: User;
}

export interface LoginResponse {
  message: string;
  result: {
    token: string;
  };
}

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  constructor(http: HttpClient) {
    super(http, 'user');
  }

  createUser(user: User) {
    return this.http.post<CreateUserResponse>(`${this.baseUrl}/user`, user).pipe(
      map(response => response.result)
    );
  }

  login(credential: Pick<User, 'email' | 'password'>) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/user/auth`, credential).pipe(
      map(response => response.result.token),
      catchError((error: unknown) => {
        console.error('Login failed', error);

        const httpError = error as HttpErrorResponse;

        let errorMessage: string;

        if (httpError.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (httpError.status === 401 || httpError.status === 403) {
          errorMessage = 'E-mail ou senha inválidos';
        } else if (httpError.status === 0) {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        } else {
          errorMessage = 'E-mail ou senha inválidos';
        }

        return throwError(() => errorMessage);
      })
    );
  }
}
