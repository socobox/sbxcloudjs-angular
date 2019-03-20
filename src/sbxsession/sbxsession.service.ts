import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {SbxCoreService} from '../sbxcore.service';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class SbxSessionService {

  constructor(private sbxCoreService: SbxCoreService) {
  }

  private static day = 86400000;
  private _user: User;

  public initialize(domain: number, appKey: string) {
    this.sbxCoreService.initialize(domain, appKey);
    this.islogged();
  }

  /**
   * Initialize service with environment
   * @param environment (domain, base_url, appkey)
   */
  public initializeWithEnvironment(environment: any) {
    this.sbxCoreService.initialize(environment.domain, environment.appKey, environment.baseUrl);
    this.islogged();
  }

  /**
   * General User methods
   */

  getCurrentUser(): User {
    return (this._user == null) ? this._user = new User() : this._user;
  }

  islogged(): boolean {
    this.loadToken();
    if (this.getCurrentUser().token) {
      this.sbxCoreService.addHeaderAttr('Authorization', 'Bearer ' + this.getCurrentUser().token);
      return true;
    } else {
      return false;
    }
  }

  /**
   * methods that uses cookies
   */

  private loadToken(): void {
    this.getCurrentUser().token = window.localStorage.getItem('token');
  }

  public updateToken(token: string): void {
    window.localStorage.setItem('token', token);
  }

  private updateUser(data: any) {
    this.getCurrentUser().token = data.token;
    this.getCurrentUser().id = data.user.id;
    this.getCurrentUser().name = data.user.name;
    this.getCurrentUser().login = data.user.login;
    this.getCurrentUser().email = data.user.email;
    this.updateToken(data.token);
    this.sbxCoreService.addHeaderAttr('Authorization', 'Bearer ' + data.token);
  }

  /**
   * Auth user methods
   */

  login(login: string, password: string, domain?: number) {
    return this.loginRx(login, password, domain).toPromise();
  }

  loginRx(login: string, password: string, domain?: number): Observable<any> {
    return this.sbxCoreService.loginRx(login, password, domain).pipe(
      map(data => {
        if ((<any>data).success) {
          this.updateUser(data);
        }
          return data;
      }));
  }

  validate(token: string) {
    this.validateRx(token).toPromise();
  }

  validateRx(token: string ): Observable<any> {
    return this.sbxCoreService.validateRx(token).pipe(
      map(data => {
        if ((<any>data).success) {
          (<any>data).token = token;
          this.updateUser(data);
        }
        return data;
      }));
  }

  logout(): void {
    window.localStorage.removeItem('token');
    this.sbxCoreService.removeHeaderAttr('Authorization');
    this._user = null;
  }

  signUp(login: string, email: string, name: string, password: string) {
    return this.signUpRx(login, email, name, password).toPromise();
  }

  signUpRx(login: string, email: string, name: string, password: string): Observable<any> {
    return this.sbxCoreService.signUpRx(login, email, name, password).pipe(
      map(data => {
        if ((<any>data).success) {
          this.updateUser(data);
        }
          return data;
      }));
  }

}

export class User {

  constructor() {
  }

  private _name: string;
  private _login: string;
  private _token: string;
  private _id: number;
  private _email: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get login(): string {
    return this._login;
  }

  set login(value: string) {
    this._login = value;
  }
}
