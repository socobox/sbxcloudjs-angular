import { Injectable } from '@angular/core';
import {Callback, SbxCoreService} from '../sbxcore.service';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class SbxSessionService {

  constructor(private sbxCoreService: SbxCoreService, private cookieService: CookieService) {
  }

  private static day = 86400000;
  private daysToExpire = 30;
  private cookieToken = 'token';
  private _user: User;


  public initialize(domain: number, baseUrl: string, appKey: string) {
    this.sbxCoreService.initialize(domain, baseUrl, appKey);
    this.islogged();
  }

  /**
   * Initialize service with environment
   * @param environment (domain, base_url, appkey)
   */
  public initializeWithEnvironment(environment: any) {
    this.sbxCoreService.initialize(environment.domain, environment.baseUrl, environment.appKey);
    this.islogged();
  }

  /**
   * General User methods
   */

  getCurrentUser(): User {
    return (this._user == null) ? this._user = new User() : this._user;
  }

  islogged(): boolean {
    this.loadCookieToken();
    if (this.getCurrentUser().token != null) {
      this.sbxCoreService.addHeaderAttr('Authorization', 'Bearer ' + this.getCurrentUser().token);
      return true;
    } else {
      return false;
    }
  }

  /**
   * methods that uses cookies
   */

  private loadCookieToken(): void {
    this.getCurrentUser().token = this.cookieService.check(this.cookieToken) ? this.cookieService.get(this.cookieToken) : null;
  }

  public updateCookieToken(token: string): void {
    this.getCurrentUser().token = token;
    const today = new Date().getTime();
    this.cookieService.set(this.cookieToken, token, new Date(today + this.daysToExpire * SbxSessionService.day));
  }

  private updateUser(data: any) {
    this.sbxCoreService.addHeaderAttr('Authorization', 'Bearer ' + data.token);
    this.getCurrentUser().id = data.user.id;
    this.getCurrentUser().name = data.user.name;
    this.getCurrentUser().login = data.user.login;
    this.getCurrentUser().email = data.user.email;
  }
  /**
   * Auth user methods
   */

  login(login: string, password: string, callBack: Callback): void {
    this.sbxCoreService.login(login,
      password, new Callback(
        data => {
          if (data.success) {
            this.updateUser(data);
          }
          callBack.ok(data);
        }, callBack.error));
  }

  loginRx(login: string, password: string) {
    return this.sbxCoreService.loginRx(login, password)
      .map(data => {
        if (data.success) {
          this.updateUser(data);
        }
          return data;
      });
  }

  validate(token: string, callBack: Callback): void {
    this.sbxCoreService.validate(token, new Callback(
      data => {
        if (data.success) {
          data.token = token;
          this.updateUser(data);
        }
        callBack.ok(data);
      }, callBack.error));

  }

  validateRx(token: string ) {
    return this.sbxCoreService.validateRx(token)
      .map(data => {
        if (data.success) {
          data.token = token;
          this.updateUser(data);
        }
        return data;
      });
  }

  logout(): void {
    this.cookieService.delete(this.cookieToken);
    this.sbxCoreService.removeHeaderAttr('Authorization');
    this._user = null;
  }

  signUp(login: string, email: string, name: string, password: string, callBack: Callback): void {
    this.sbxCoreService.signUp(login, email,
      name,
      password, new Callback(
        data => {
          if (data.success) {
            this.updateUser(data);
          }
          callBack.ok(data);
        }, callBack.error));
  }

  signUpRx(login: string, email: string, name: string, password: string) {
    return this.sbxCoreService.signUpRx(login, email, name, password)
      .map(data => {
        if (data.success) {
          this.updateUser(data);
        }
          return data;
      });
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
