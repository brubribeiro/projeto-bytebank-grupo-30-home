import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class BaseService<T> {
  protected baseUrl = `${environment.apiBaseUrl}`;

  constructor(protected http: HttpClient, private entityPath: string) {}

  findAll() {
    return this.http.get<T[]>(`${this.baseUrl}/${this.entityPath}`);
  }

  findById(id: string) {
    return this.http.get<T>(`${this.baseUrl}/${this.entityPath}/${id}`);
  }

  create(data: T) {
    return this.http.post<T>(`${this.baseUrl}/${this.entityPath}`, data);
  }

  update(id: string, data: T) {
    return this.http.put<T>(`${this.baseUrl}/${this.entityPath}/${id}`, data);
  }

  patch(id: string, data: T) {
    return this.http.patch<T>(`${this.baseUrl}/${this.entityPath}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${this.entityPath}/${id}`);
  }

  auth(credentials: {email: string, password: string}) {
    return this.http.post(`${this.baseUrl}/user/auth`, credentials);
  }
}
