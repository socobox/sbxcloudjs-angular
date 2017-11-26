import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import QueryBuilder from 'sbx-querybuilder/index';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class SbxCoreService {


  public static environment = {} as any;
  private headers: any;

  private urls: any = {
    update_password: '/user/v1/password',
    login: '/user/v1/login',
    register: '/user/v1/register',
    validate: '/user/v1/validate',
    row: '/data/v1/row',
    find: '/data/v1/row/find',
    update: '/data/v1/row/update',
    delete: '/data/v1/row/delete',
    downloadFile: '/content/v1/download',
    uploadFile: '/content/v1/upload',
    addFolder: '/content/v1/folder',
    folderList: '/content/v1/folder',
    send_mail: '/email/v1/send',
    payment_customer: '/payment/v1/customer',
    payment_card: '/payment/v1/card',
    payment_token: '/payment/v1/token',
    password: '/user/v1/password/request',
    cloudscript_run: '/cloudscript/v1/run'
  };

  constructor(private httpClient: HttpClient) {

  }


  public initialize(domain: number, baseUrl: string, appKey: string) {
    SbxCoreService.environment.domain = domain;
    SbxCoreService.environment.baseUrl = baseUrl;
    SbxCoreService.environment.appKey = appKey;
    this.headers = new HttpHeaders()
      .set('App-Key', SbxCoreService.environment.appKey);
  }
  public addHeaderAttr(name: string, value: string): void {
    this.headers = this.getHeaders().set(name, value);
  }

  public removeHeaderAttr(name: string) {
    this.headers = this.getHeaders().delete(name);
  }

  private getHeaders(): any {
    return  this.headers;
  }

  private getHeadersJSON(): any {
    return this.getHeaders().append('Content-Type', 'application/json');
  }

  $p(path: string) {
    return SbxCoreService.environment.baseUrl + path;
  }

  /**
   * AUTH
   */

  /**
   * @param {string} token
   * @param {Callback} callBack
   */
  validate(token: string,  callBack: Callback) {
    const httpParams = new HttpParams().set('token', token) ;
    const option = {headers: this.getHeadersJSON(), params: httpParams};
    this.observableToCallBack(this.httpClient.get(this.$p(this.urls.validate), option), callBack);
  }

  /**
   * @param {string} token
   * @return {Observable<any>}
   */
  validateRx(token: string): Observable<any> {
    const httpParams = new HttpParams().set('token', token) ;
    const option = {headers: this.getHeadersJSON(), params: httpParams};
    return this.httpClient.get(this.$p(this.urls.validate), option).map(data => data as any) ;
  }

  private encodeEmails(email: string) {
    const spl = email.split('@');
    if (spl.length > 1) {
      email = encodeURIComponent(spl[0]) + '@' + spl[1];
    }
    return email;
  }

  private validateLogin(login: string): boolean {
    const rlogin   =  /^(\w?\.?\-?)+$/;
    return rlogin.test(login);
  }

  private validateEmail(email: string): boolean {
    const rlogin  =  /^(\w?\.?\-?\+?)+@(\w?\.?\-?)+$/;
    return rlogin.test(email);
  }

  /**
   *
   * @param {string} login
   * @param {string} email
   * @param {string} name
   * @param {string} password
   * @param {Callback} callBack
   */
  signUp(login: string, email: string, name: string, password: string, callBack: Callback) {
    if (this.validateLogin(login) && this.validateEmail(email)) {
      const option = {headers: this.getHeadersJSON()};
      const params = '?email=' + this.encodeEmails(email) + '&password=' +  encodeURIComponent(password) + '&name='
        + name + '&login=' + login + '&domain=' + SbxCoreService.environment.domain.toLocaleString();
      this.observableToCallBack(this.httpClient.get(this.$p(this.urls.register) + params, option), callBack);
    } else {
      callBack.error({success: false, error: 'Login or email contains invalid characters. Letters, numbers and underscore are accepted'});
    }
  }

  /**
   * @param {string} login
   * @param {string} email
   * @param {string} name
   * @param {string} password
   * @return {Observable<any>}
   */
  signUpRx(login: string, email: string, name: string, password: string): Observable<any> {
    if (this.validateLogin(login) && this.validateEmail(email)) {
      const option = {headers: this.getHeadersJSON()};
      const params = '?email=' + this.encodeEmails(email) + '&password=' +  encodeURIComponent(password) + '&name='
        + name + '&login=' + login + '&domain=' + SbxCoreService.environment.domain.toLocaleString();
      return this.httpClient.get(this.$p(this.urls.register) + params, option).map(data => data as any);
    } else {
      return Observable.of({success: false,
        error: 'Login or email contains invalid characters. Letters, numbers and underscore are accepted'});
    }
  }

  /**
   * @param {string} login
   * @param {string} password
   * @param {Callback} callBack
   */
  login(login: string, password: string, callBack: Callback) {
    if ( (this.validateLogin(login) && login.indexOf('@') < 0) ||  (login.indexOf('@') >= 0 && this.validateEmail(login))) {
      const option = {headers: this.getHeadersJSON()};
      const params = '?login=' + this.encodeEmails(login) + '&password=' + encodeURIComponent(password);
      this.observableToCallBack(this.httpClient.get(this.$p(this.urls.login) + params, option), callBack);
    } else {
      callBack.error({success: false,
        error: 'Login contains invalid characters. Letters, numbers and underscore are accepted'});
    }
  }

  /**
   * @param {string} login
   * @param {string} password
   * @return {Observable<any>}
   */
  loginRx(login: string, password: string): Observable<any> {
    if ( (this.validateLogin(login) && login.indexOf('@') < 0) ||  (login.indexOf('@') >= 0 && this.validateEmail(login))) {
      const option = {headers: this.getHeadersJSON()};
      const params = '?login=' + this.encodeEmails(login) + '&password=' + encodeURIComponent(password);
      return this.httpClient.get(this.$p(this.urls.login) + params, option).map(data => data as any);
    }else {
      return Observable.of({success: false,
        error: 'Login contains invalid characters. Letters, numbers and underscore are accepted'});
    }
  }


  /**
   * Send email to changePassword
   * @param {string} userEmail
   * @param {string} subject
   * @param {string} emailTemplate
   * @param {Callback} callBack
   */
  sendPasswordRequest(userEmail: string, subject: string, emailTemplate: string, callBack: Callback) {
    const body =  {user_email: userEmail,
      domain: SbxCoreService.environment.domain, subject: subject, email_template: emailTemplate};
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.password), body, option), callBack);
  }

  /**
   * Send email to changePassword
   * @param {string} userEmail
   * @param {string} subject
   * @param {string} emailTemplate
   * @return {Observable<Object>}
   */
  sendPasswordRequestRx(userEmail: string, subject: string, emailTemplate: string): Observable<any> {
    const body =  {user_email: userEmail,
      domain: SbxCoreService.environment.domain, subject: subject, email_template: emailTemplate};
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.password), body, option).map( data => data as any);
  }

  /**
   * change password with email code
   * @param {number} userId
   * @param {number} userCode
   * @param {string} newPassword
   * @param {Callback} callBack
   */
  requestChangePassword(userId, userCode, newPassword, callBack) {
    const body = {domain: SbxCoreService.environment.domain,
      password: newPassword,
      user_id: userId,
      code: userCode};
    const option = { headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.put(this.$p(this.urls.password), body, option), callBack);
  }

  /**
   * change password with email code
   * @param {number} userId
   * @param {number} userCode
   * @param {string} newPassword
   * @return {Observable<Object>}
   */
  requestChangePasswordRx(userId, userCode, newPassword) {
    const body = {domain: SbxCoreService.environment.domain,
      password: newPassword,
      user_id: userId,
      code: userCode};
    const option = { headers: this.getHeadersJSON()};
    return this.httpClient.put(this.$p(this.urls.password), body , option).map(data => data);
  }

  /**
   * change password
   * @param {string} newPassword
   * @param {Callback} callBack
   */
  changePassword(newPassword, callBack) {
    const httpParams = new HttpParams().set('domain', SbxCoreService.environment.domain).set('password', newPassword);
    const option = { headers: this.getHeadersJSON(), params: httpParams };
    this.observableToCallBack(this.httpClient.get(this.$p(this.urls.update_password), option), callBack);
  }

  /**
   * change password
   * @param {string} newPassword
   * @return {Observable<Object>}
   */
  changePasswordRx(newPassword) {
    const httpParams = new HttpParams().set('domain', SbxCoreService.environment.domain).set('password', newPassword);
    const option = { headers: this.getHeadersJSON(), params: httpParams };
    return this.httpClient.get(this.$p(this.urls.update_password), option).map(data => data);
  }

  /***
   * DATA
   */

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @param {Callback} callBack the Callback class to call
   */
  insert(model: string, data: any, callBack: Callback) {
    const body = this.queryBuilderToInsert(data).setModel(model).compile();
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.row), body, option), callBack);
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @param {Callback} callBack he Callback class to call
   */
  update(model: string, data: any, callBack: Callback) {
    const body = this.queryBuilderToInsert(data).setModel(model).compile();
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.update), body, option), callBack);

  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @return {Observable}
   */
  insertRx(model: string, data: any): Observable<any> {
    const body = this.queryBuilderToInsert(data).setModel(model).compile();
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.row), body, option).map(res => res as any);
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @return {Observable}
   */
  updateRx(model: string, data: any): Observable<any> {
    const body = this.queryBuilderToInsert(data).setModel(model).compile();
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.update), body, option).map(res => res as any);
  }
  /**
   * @param {string} model the name model in sbxcloud
   * @param keys can be a string, a Class or array of both
   * @param {Callback} callBack
   */
  delete(model: string) {
    return new Find(model, this, false);
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param keys can be a string, a Class or array of both
   * @param {Callback} callBack
   */
  find(model: string) {
    return new Find(model, this, true);
  }


  /**
   * @param {EmailData} data
   * @param {Callback} callBack
   */
  sendEmail(data: EmailData  , callBack: Callback) {
    const mail = {
      subject: data.subject,
      to: data.to,
      domain: SbxCoreService.environment.domain,
      from: data.from,
    } as any;
    if (data.template) {
      mail.html = data.template;
    } else {
      mail.email_template = data.template_key;
    }
    if (data.cc) {
      mail.cc = data.cc;
    }
    if (data.bcc) {
      mail.bcc = data.bcc;
    }
    if (data.data) {
      mail.data = data.data;
    }
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.send_mail), mail, option), callBack);
  }

  /**
   * @param {string} subject
   * @param {string} to
   * @param {string} from
   * @param {string} body can be a html or a template
   * @param {boolean} isTemplate
   * @return {Observable<any>}
   */
  sendEmailRx(data: EmailData): Observable<any> {
    const mail = {
      subject: data.subject,
      to: data.to,
      domain: SbxCoreService.environment.domain,
      from: data.from,
    } as any;
    if (data.template) {
      mail.html = data.template;
    } else {
      mail.email_template = data.template_key;
    }
    if (data.cc) {
      mail.cc = data.cc;
    }
    if (data.bcc) {
      mail.bcc = data.bcc;
    }
    if (data.data) {
      mail.data = data.data;
    }
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.send_mail), mail, option).map(res => res as any);
  }


  /**
   * @param data
   * @param {Callback} callBack
   */
  paymentCustomer(data: Object, callBack: Callback) {
    data['domain'] = SbxCoreService.environment.domain;
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.payment_customer), data, option), callBack);
  }

  /**
   * @param data
   * @return {Observable<any>}
   */
  paymentCustomerRx(data: Object): Observable<any> {
    data['domain'] = SbxCoreService.environment.domain;
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.payment_customer), data, option).map(res => res as any);
  }

  /**
   * @param data
   * @param {Callback} callBack
   */
  paymentCard(data: Object, callBack: Callback) {
    data['domain'] = SbxCoreService.environment.domain;
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.payment_card), data, option), callBack);
  }

  /**
   * @param data
   * @return {Observable<any>}
   */
  paymentCardRx(data: Object): Observable<any> {
    data['domain'] = SbxCoreService.environment.domain;
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.payment_card), data, option).map(res => res as any);
  }


  /**
   * @param {string} key
   * @param file
   * @return {Observable<any>}
   */
  uploadFileRx(key: string, file: any): Observable<any> {
    const input = new FormData();
    input.append('file', file);
    input.append('model', JSON.stringify({ key: key}));
    const option = {headers: this.getHeaders() };
    return this.httpClient.post(this.$p(this.urls.uploadFile), input, option).map(res => res as any);
  }

  /**
   *
   * @param {string} key
   * @param file
   * @param {Callback} callBack
   */
  uploadFile(key: string, file: any, callBack: Callback) {
    const input = new FormData();
    input.append('file', file);
    input.append('model', JSON.stringify({ key: key}));
    const option = {headers: this.getHeaders() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.uploadFile), input, option), callBack);
  }

  /**
   * @param {string} key
   * @return {Observable<any>}
   */
  downloadFileRx(key: string): Observable<any> {
    const httpParams = new HttpParams().set('action', 'download').set('key', key);
    const option = {headers: this.getHeaders(), params: httpParams };
    return this.httpClient.get(this.$p(this.urls.downloadFile), option).map(res => res as any);
  }

  /**
   *
   * @param {string} key
   * @param {Callback} callBack
   */
  downloadFile(key: string, callBack: Callback) {
    const httpParams = new HttpParams().set('action', 'download').set('key', key);
    const option = {headers: this.getHeaders(), params: httpParams };
    this.observableToCallBack(this.httpClient.get(this.$p(this.urls.downloadFile), option), callBack);
  }



  /**
   * CLOUDSCRIPT
   */

  /**
   *
   * @param {string} key
   * @param params
   * @return {Observable<any>}
   */
  runRx(key: string, params: any): Observable<any> {
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.cloudscript_run), { key: key, params: params }, option).map(res => res as any);
  }

  /**
   * @param {string} key
   * @param params
   * @param {Callback} callBack
   */
  run(key: string, params: any, callBack: Callback) {
    const option = {headers: this.getHeadersJSON() };
    this.observableToCallBack(this.httpClient.post(this.$p(this.urls.cloudscript_run), { key: key, params: params }, option), callBack);
  }

  /**
   * UTILS
   */

  private queryBuilderToInsert(data): any {
    const query =   new QueryBuilder()
      .setDomain(SbxCoreService.environment.domain);
    if (Array.isArray(data) ) {
      data.forEach(item => {
        query.addObject(this.validateData(item));
      });
    }else {
      query.addObject(this.validateData(data));
    }
    return query;
  }

  public validateData(data: any): any {
    const temp = {};
    Object.keys(data)
      .filter(key => {
        const v = data[key];
        return (Array.isArray(v) || typeof v === 'string') ?
          (v.length > 0) :
          (v !== null && v !== undefined);
      }).forEach(key => {
      if (data[key]._KEY != null) {
        data[key] = data[key]._KEY;
      }
      const key2 = (key !== '_KEY') ? key.replace(/^_/, '') : key;
      temp[key2] = data[key];
    });
    return temp;
  }

  public validateKeys(data: any): any {
    const temp = [];
    if (Array.isArray(data) ) {
      data.forEach(key => {
        if (typeof key === 'string') {
          temp.push(key);
        }else {
          temp.push(key._KEY);
        }
      });
    }else {
      if (typeof data === 'string') {
        temp.push(data);
      }else {
        temp.push(data._KEY);
      }
    }
    return temp;
  }

  public observableToCallBack(observable: Observable<Object>, callBack: Callback) {
    observable.map(res => res as any)
      .subscribe(response => {
        callBack.ok(response);
      }, error => {
        callBack.error(error as any);
      });
  }

  /**
   * @param response the response of the server
   * @param {string[]} completefetch the array of fetch
   * @returns {any} the response with the union between fetch_results and results
   */
  public mapFetchesResult(response: any, completefetch: string[] ) {

    if (response.fetched_results) {
      const fetch = [];
      const secondfetch = {};
      for (let i = 0; i < completefetch.length; i++) {
        let index = 0;
        const temp = completefetch[i].split('.');
        if (fetch.indexOf(temp[0]) < 0) {
          fetch.push(temp[0]);
          index = fetch.length - 1;
        } else {
          index = fetch.indexOf(temp[0]);
        }
        if (temp.length === 2 && !secondfetch[fetch[index]]) {
          secondfetch[fetch[index]] = [];
        }

        if (temp.length === 2) {
          secondfetch[fetch[index]].push(temp[1]);
        }
      }
      for (let i = 0; i < response.results.length; i++) {
        for (let j = 0; j < fetch.length; j++) {
          for (const mod in response.fetched_results) {
            if (response.fetched_results[mod][response.results[i][fetch[j]]]) {
              response.results[i][fetch[j]] = response.fetched_results[mod][response.results[i][fetch[j]]];
              if (secondfetch[fetch[j]]) {
                for (let k = 0; k < secondfetch[fetch[j]].length; k++) {
                  const second = secondfetch[fetch[j]][k];
                  for (const mod2 in response.fetched_results) {
                    if (response.fetched_results[mod2][response.results[i][fetch[j]][second]]) {
                      response.results[i][fetch[j]][second] =
                        response.fetched_results[mod2][response.results[i][fetch[j]][second]];
                      break;
                    }
                  }
                }
              }

              break;
            }
          }
        }

      }
    }

    return response;
  }

}

export class Callback {

  public ok: any;
  public error: any;

  constructor(ok: (data: any) => any, error: (error: any) => any) {
    this.ok = ok;
    this.error = error;
  }
}

export class Find {

  public query;
  private core;
  private isFind;
  private lastANDOR?: string;
  private totalpages: number;
  private fecth: string[];


  constructor(model: string, core: SbxCoreService, isFind: boolean) {
    this.query = new QueryBuilder()
      .setDomain(SbxCoreService.environment.domain)
      .setModel(model);
    this.core = core;
    this.isFind = isFind;
    this.lastANDOR = null;
    this.totalpages = 1;
  }

  public newGroupWithAnd() {
    this.query.newGroup('AND');
    this.lastANDOR = null;
    return this;
  }

  public newGroupWithOr() {
    this.query.newGroup('OR');
    this.lastANDOR = null;
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereIsEqual(field: string, value: any) {
    this.lastANDOR =  'AND';
    this.query.addCondition(this.lastANDOR, field, '=', value);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public andWhereIsNotNull(field: string) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, 'IS NOT', null);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public andWhereIsNull(field: string) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, 'IS', null);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereGreaterThan(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '>', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereLessThan(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '<', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereGreaterOrEqualThan(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '>=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereLessOrEqualThan(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '<=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereIsNotEqual(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '!=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereStartsWith(field: string, value: string) {
    this.lastANDOR = 'AND';
    value = value && value.length > 0 ? `%${value}` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }


  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereEndsWith(field: string, value: string) {
    this.lastANDOR = 'AND';
    value = value && value.length > 0 ? `${value}%` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereContains(field: string, value: string) {
    this.lastANDOR = 'AND';
    value = value && value.length > 0 ? `%${value.split(' ').join('%')}%` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereIn(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, 'IN', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereNotIn(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, 'NOT IN', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereIsEqual(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '=', value);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public orWhereIsNotNull(field: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, 'IS NOT', null);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public orWhereIsNull(field: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, 'IS', null);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereGreaterThan(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '>', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereLessThan(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '<', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereGreaterOrEqualThan(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '>=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereLessOrEqualThan(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '<=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereIsNotEqual(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '!=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereStartsWith(field: string, value: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    value = value && value.length > 0 ? `%${value}` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereEndsWith(field: string, value: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    value = value && value.length > 0 ? `${value}%` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereContains(field: string, value: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    // if the user sends null or empty, there will be no wildcar placed.
    value = value && value.length > 0 ? `%${value.split(' ').join('%')}%` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereIn(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, 'IN', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereNotIn(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, 'NOT IN', value);
    return this;
  }

  /**
   * Reference Join between two model
   * @param {string} field column name of principal model
   * @param {string} referenceField column name of subQuery
   */
  public orWhereReferenceJoinBetween(field: string, referenceField: string) {
    return new ReferenceJoin(this, field, referenceField, 'OR');
  }

  /**
   * Reference Join between two model
   * @param {string} field column name of principal model
   * @param {string} referenceField column name of subQuery
   */
  public andWhereReferenceJoinBetween(field: string, referenceField: string) {
    return new ReferenceJoin(this, field, referenceField, 'AND');
  }

  public whereWithKeys(keys) {
    this.query.whereWithKeys(this.core.validateKeys(keys));
    return this;
  }

  /**
   * @param {string} field
   * @param asc
   * @return {Find}
   */
  public orderBy(field: string, asc: Boolean= false) {
    this.query.orderBy(  field, asc);
    return this;
  }

  public fetchModels(array: string[]) {
    if (this.isFind) {
      this.query.fetchModels(array);
      this.fecth = array;
    }
    return this;
  }

  public then(callBack: Callback, query?: any) {
    const option = {headers: this.core.getHeadersJSON() };
    this.core.observableToCallBack(this.core.httpClient.post(this.isFind ? this.core.$p(this.core.urls.find)
      : this.core.$p(this.core.urls.delete),
      (query == null) ? this.query.compile() : query, option), callBack);
  }

  public thenRx(query?: any): Observable<any> {
    const option = {headers: this.core.getHeadersJSON() };
    return this.core.httpClient.post(this.isFind ? this.core.$p(this.core.urls.find) : this.core.$p(this.core.urls.delete),
      (query == null) ? this.query.compile() : query, option).map(res => res as any);
  }

  public setPage(page: number) {
    this.query.setPage(page);
    return this;
  }

  public setPageSize(limit: number) {
    this.query.setPageSize(limit);
    return this;
  }

  private find(query?: any) {
    const option = {headers: this.core.getHeadersJSON() };
    return  this.core.httpClient.post(this.core.$p(this.core.urls.find),
      (query == null) ? this.query.compile() : query, option).map(res => res as any);

  }

  public loadAll (callBack: Callback) {
    if (this.isFind) {
      this.setPageSize(100);
      const query = this.query.compile();
      this.then(new Callback(response => {
        this.totalpages = response.total_pages;
        let i = 1;
        const temp = [];
        while (i <= this.totalpages) {
          const queryAux = JSON.parse(JSON.stringify(query));
          queryAux.page = i;
          temp.push(this.find(queryAux));
          i = i + 1;
        }
        Observable.forkJoin(temp)
          .map(res => res as any).subscribe(results => {
            let result = [];
            results.forEach(array => {
              const v = array as any;
              result = result.concat(v.results);
            });
            callBack.ok(result);
          },
          error2 => {
            callBack.error(error2 as any);
          });
      }, error2 => {callBack.error(error2 as any); } ), query);
    } else {
      this.then(callBack);
    }
  }

  public loadAllRx () {
    if (this.isFind) {
      this.setPageSize(100);
      const query = this.query.compile();
      return this.thenRx(query)
        .flatMap(response => {
          this.totalpages = response.total_pages;
          let i = 1;
          const temp = [];
          while (i <= this.totalpages) {
            const queryAux = JSON.parse(JSON.stringify(query));
            queryAux.page = i;
            temp.push(this.find(queryAux));
            i = i + 1;
          }
          return Observable.forkJoin(temp);
        })
        .map(res => res as any)
        .map((results) => {
          let result = [];
          results.forEach(array => {
            const v = array as any;
            result = result.concat(v.results);
          });
          return {success: true, results: result};
        });
    }else {
      return this.thenRx();
    }}
}

export class ReferenceJoin {

  private find: Find;
  private field: string;
  private referenceField: string;

  constructor(find: Find, field: string, referenceField: string, type: string) {
    this.find = find;
    this.field = field;
    this.referenceField = referenceField;
    if (type === 'AND') {
      this.find.andWhereIn(this.field, '@reference_join@');
    } else {
      this.find.orWhereIn(this.field, '@reference_join@');
    }
  }

  /**
   * set model to Join
   * @param {string} referenceModel
   * @return {FilterJoin}
   */
  public in(referenceModel: string) {
    return new FilterJoin(this.find, this.field, this.referenceField, referenceModel);
  }
}


export class FilterJoin {

  private find: Find;
  private field: string;
  private referenceField: string;
  private referenceModel: string;


  constructor(find: Find, field: string, referenceField: string, referenceModel: string) {
    this.find = find;
    this.field = field;
    this.referenceField = referenceField;
    this.referenceModel = referenceModel;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public filterWhereIsEqual(field: string, value: any) {
    this.find.query.setReferenceJoin('=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNotNull(field: string) {
    this.find.query.setReferenceJoin('IS NOT', this.field, this.referenceField, this.referenceModel, null);
    return this.find;
  }

  /**
   * @param {string} field
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNull(field: string) {
    this.find.query.setReferenceJoin('IS', this.field, this.referenceField, this.referenceModel, null);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereGreaterThan(field: string, value: any) {
    this.find.query.setReferenceJoin('>', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLessThan(field: string, value: any) {
    this.find.query.setReferenceJoin('<', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereGreaterOrEqualThan(field: string, value: any) {
    this.find.query.setReferenceJoin('>=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLessOrEqualThan(field: string, value: any) {
    this.find.query.setReferenceJoin('<=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNotEqual(field: string, value: any) {
    this.find.query.setReferenceJoin('!=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLike(field: string, value: any) {
    this.find.query.setReferenceJoin('LIKE', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereIn(field: string, value: any) {
    this.find.query.setReferenceJoin('IN', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereNotIn(field: string, value: any) {
    this.find.query.setReferenceJoin('NOT IN', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

}

export interface EmailData {
  subject: string;
  from: string;
  template?: string;
  template_key?: string;
  data?: any;
  to: string|Array<string>;
  bcc?: string|Array<string>;
  cc?: string|Array<string>;
}
