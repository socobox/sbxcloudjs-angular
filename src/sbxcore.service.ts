import {merge as observableMerge, of as observableOf,  Observable } from 'rxjs';
import {toArray, mergeAll, map, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Find, SbxCore } from 'sbxcorejs';



@Injectable()
export class SbxCoreService extends SbxCore {


  private headers: any;


  constructor(public httpClient: HttpClient) {
    super();
  }

  public initialize(domain: number, appKey: string, baseUrl: string = 'https://sbxcloud.com/api') {
    super.initialize(domain, appKey, baseUrl);
    this.headers = new HttpHeaders()
      .set('App-Key', appKey);
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

  public getHeadersJSON(): any {
    return this.getHeaders().append('Content-Type', 'application/json');
  }

  $p(path: string) {
    return SbxCore.environment.baseUrl + path;
  }

  /**
   * AUTH
   */

  /**
   * @param {string} token
   */
  validate(token: string) {
    return this.validateRx(token).toPromise();
  }

  /**
   * @param {string} token
   * @return {Observable<any>}
   */
  validateRx(token: string): Observable<any> {
    const httpParams = new HttpParams().set('token', token) ;
    const option = {headers: this.getHeadersJSON(), params: httpParams};
    return this.httpClient.get(this.$p(this.urls.validate), option).pipe(map(data => data as any)) ;
  }


  /**
   *
   * @param {string} login
   * @param {string} email
   * @param {string} name
   * @param {string} password
   */
  signUp(login: string, email: string, name: string, password: string) {
    return this.signUpRx(login, email, name, password).toPromise();
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
        + name + '&login=' + login + '&domain=' + SbxCore.environment.domain.toLocaleString();
      return this.httpClient.get(this.$p(this.urls.register) + params, option).pipe(map(data => data as any));
    } else {
      return observableOf({success: false,
        error: 'Login or email contains invalid characters. Letters, numbers and underscore are accepted'});
    }
  }

  /**
   * @param {string} login
   * @param {string} password
   * @param {Callback} callBack
   * @param {domain}
   */
  login(login: string, password: string, domain?: number) {
    return this.loginRx(login, password, domain).toPromise();
  }

  /**
   * @param {string} login
   * @param {string} password
   *  @param {domain}
   * @return {Observable<any>}
   */
  loginRx(login: string, password: string, domain?: number): Observable<any> {
    if ( (this.validateLogin(login) && login.indexOf('@') < 0) ||  (login.indexOf('@') >= 0 && this.validateEmail(login))) {
      const option = {headers: this.getHeadersJSON()};
      const params = '?login=' + this.encodeEmails(login) + '&password=' + encodeURIComponent(password)
        + (domain ? '&domain=' + domain : '');
      return this.httpClient.get(this.$p(this.urls.login) + params, option).pipe(map(data => data as any));
    }else {
      return observableOf({success: false,
        error: 'Login contains invalid characters. Letters, numbers and underscore are accepted'});
    }
  }


  /**
   * Send email to changePassword
   * @param {string} userEmail
   * @param {string} subject
   * @param {string} emailTemplate
   */
  sendPasswordRequest(userEmail: string, subject: string, emailTemplate: string) {
    return this.sendPasswordRequestRx(userEmail, subject, emailTemplate).toPromise();
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
      domain: SbxCore.environment.domain, subject: subject, email_template: emailTemplate};
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.password), body, option).pipe(map( data => data as any));
  }

  /**
   * change password with email code
   * @param {number} userId
   * @param {number} userCode
   * @param {string} newPassword
   */
  requestChangePassword(userId, userCode, newPassword) {
    return this.requestChangePasswordRx(userId, userCode, newPassword).toPromise();
  }

  /**
   * change password with email code
   * @param {number} userId
   * @param {number} userCode
   * @param {string} newPassword
   * @return {Observable<Object>}
   */
  requestChangePasswordRx(userId, userCode, newPassword) {
    const body = {domain: SbxCore.environment.domain,
      password: newPassword,
      user_id: userId,
      code: userCode};
    const option = { headers: this.getHeadersJSON()};
    return this.httpClient.put(this.$p(this.urls.password), body , option).pipe(map(data => data));
  }

  /**
   * change password
   * @param {string} newPassword
   */
  changePassword(newPassword) {
    return this.changePasswordRx(newPassword).toPromise();
  }

  /**
   * change password
   * @param {string} newPassword
   * @return {Observable<Object>}
   */
  changePasswordRx(newPassword) {
    const httpParams = new HttpParams().set('domain', SbxCore.environment.domain).set('password', newPassword);
    const option = { headers: this.getHeadersJSON(), params: httpParams };
    return this.httpClient.get(this.$p(this.urls.update_password), option).pipe(map(data => data));
  }

  /***
   * DATA
   */

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   *  @param letNull let null data
   */
  insert(model: string, data: any, letNull?: Boolean) {
    return this.insertRx(model, data, letNull).toPromise();
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @param letNull let null data
   */
  update(model: string, data: any, letNull?: Boolean) {
    return this.updateRx(model, data, letNull).toPromise();
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @param letNull let null data
   * @return {Observable}
   */
  insertRx(model: string, data: any, letNull?: Boolean): Observable<any> {
    const body = this.upsert(model, data, letNull);
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.row), body, option).pipe(map(res => res as any));
  }

  /**
   * @param {string} model the name model in sbxcloud
   * @param data can be a JSON, or TypeScript Class or Array of both
   * @param letNull let null data
   * @return {Observable}
   */
  updateRx(model: string, data: any, letNull?: Boolean): Observable<any> {
    const body = this.upsert(model, data, letNull);
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.update), body, option).pipe(map(res => res as any));
  }

  /**
   * @param {string} model the name model in sbxcloud
   */
  with(model: string) {
    return new AngularFind(model, this);
  }

  /**
   * @param {EmailData} data
   */
  sendEmail(data: EmailData) {
    return this.sendEmailRx(data).toPromise();
  }

  /**
   * @param {EmailData} data
   * @return {Observable<any>}
   */
  sendEmailRx(data: EmailData): Observable<any> {
    const mail = {
      subject: data.subject,
      to: data.to,
      domain: SbxCore.environment.domain,
      from: data.from,
    } as any;
    if (data.template) {
      mail.html = data.template;
    } else {
      mail.template_key = data.template_key;
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
    return this.httpClient.post(this.$p(this.urls.send_mail), mail, option).pipe(map(res => res as any));
  }


  /**
   * @param data
   */
  paymentCustomer(data: Object) {
    return this.paymentCustomerRx(data).toPromise();
  }

  /**
   * @param data
   * @return {Observable<any>}
   */
  paymentCustomerRx(data: Object): Observable<any> {
    data['domain'] = SbxCore.environment.domain;
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.payment_customer), data, option).pipe(map(res => res as any));
  }

  /**
   * @param data
   */
  paymentCard(data: Object) {
    return this.paymentCardRx(data).toPromise();
  }

  /**
   * @param data
   * @return {Observable<any>}
   */
  paymentCardRx(data: Object): Observable<any> {
    data['domain'] = SbxCore.environment.domain;
    const option = {headers: this.getHeadersJSON() };
    return this.httpClient.post(this.$p(this.urls.payment_card), data, option).pipe(map(res => res as any));
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
    return this.httpClient.post(this.$p(this.urls.uploadFile), input, option).pipe(map(res => res as any));
  }

  /**
   *
   * @param {string} key
   * @param file
   */
  uploadFile(key: string, file: any) {
    return this.uploadFileRx(key, file).toPromise();
  }

  /**
   * @param {string} key
   * @return {Observable<any>}
   */
  downloadFileRx(key: string): Observable<any> {
    const httpParams = new HttpParams().set('action', 'download').set('key', key);
    const option = {headers: this.getHeaders(), params: httpParams };
    return this.httpClient.get(this.$p(this.urls.downloadFile), option).pipe(map(res => res as any));
  }

  /**
   *
   * @param {string} key
   */
  downloadFile(key: string) {
    return this.downloadFileRx(key).toPromise();
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
    return this.httpClient.post(this.$p(this.urls.cloudscript_run), { key: key, params: params }, option).pipe(map(res => res as any));
  }

  /**
   * @param {string} key
   * @param params
   */
  run(key: string, params: any) {
    return this.runRx(key, params).toPromise();
  }

}

export class SbxResponse<T> {
  public success: boolean;
  public message?: string;
  public results?: Array<T>;
  public fetched_results?: any;
  public total_pages: number;

  public isAny(): boolean {
    return this.results === undefined
      || this.results === null
      || this.results.length === 0
      || this.results[0].constructor.name === 'Object';
  }

  public toAny(): any {
    return this as any;
  }
}

export class AngularFind extends Find {
  private core: SbxCoreService;
  private url;
  private totalpages;
  private isFind;

  constructor(model: string, core: SbxCoreService) {
    super(model, SbxCore.environment.domain);
    this.core = core;
    this.totalpages = 1;
  }

  public delete() {
    return this.deleteRx().toPromise();
  }

  public deleteRx(): Observable<any> {
    this.setUrl(false);
    return this.thenRx();
  }

  public find(toFetch: string[]);
  public find<T>();


  /**
  * @param {Array} toFetch Optional params to auto map fetches result.
  * match T object, no return fetched_results
   */
  public find<T>(toFetch = []): Promise<Array<T> | any> {
    return this.findRx<T>(toFetch).toPromise();
  }

  /**
   * @param {Array} toFetch Optional params to auto map fetches result.
   * match T object, no return fetched_results
   */

  public findRx<T>(toFetch = []): Observable<Array<T> | any> {
    this.setUrl(true);
    return this.thenRx<T>(toFetch);
  }

    /**
   * @param {Array} toFetch Optional params to auto map fetches result.
   */

  public loadAll (toFetch = []) {
    return this.loadAllRx(toFetch).toPromise();
  }

    /**
   * @param {Array} toFetch Optional params to auto map fetches result.
   */

  public loadAllRx (toFetch = []) {
      this.setPageSize(100);
      this.setUrl(true);
      const query = this.query.compile();
      return this.thenRx().pipe(mergeMap<any, any>(response => {
          this.totalpages = (<any>response).total_pages;
          let i = 2;
          const temp = [observableOf(response)];
          while (i <= this.totalpages) {
            const queryAux = JSON.parse(JSON.stringify(query));
            queryAux.page = i;
            temp.push(this.findPage(queryAux));
            i = i + 1;
          }
          return observableMerge(temp).pipe(mergeAll(5), toArray());
        }),
        map(res => res as any),
        map(results => {
          let result = [];
          const fetched_results = {};
          (<any>results).forEach(array => {
            const v = array as any;
            result = result.concat(v.results);
            if (v.fetched_results) {
              const objs = Object.keys(v.fetched_results);
              for (let i = 0; i < objs.length; i++) {
                const type_name =  objs[i];
                if (!fetched_results.hasOwnProperty(type_name)) {
                  fetched_results[type_name] = {};
                }
                const keys = Object.keys(v.fetched_results[type_name]);
                for (let j = 0; j < keys.length; j++) {
                  const key = keys[j];
                  if (v.fetched_results[type_name].hasOwnProperty(key)) {
                    fetched_results[type_name][key] = v.fetched_results[type_name][key];
                  }
                }
              }
              if (toFetch.length) {
                result = this.core.mapFetchesResult(result, toFetch);
              }
            }
          });
          return {success: true, results: result, fetched_results: fetched_results};
        }));
  }

  /**
   * Change the url, to find or to delete
   * @param isFind if true, the url is gotten from urls.find else urls.delete
   */
  private setUrl(isFind) {
    this.url = isFind ? this.core.$p(this.core.urls.find) : this.core.$p(this.core.urls.delete);
  }


  /**
   * get the data
   * @param {any[]} toFetch Optional params to auto map fetches result.
   * @return {Observable<any>}
   */
  private thenRx<T>(toFetch = []):  Observable<any | Array<T>>  {
    const option = {headers: this.core.getHeadersJSON() };
    return this.core.httpClient.post<SbxResponse<T>>(this.url, this.query.compile(), option).pipe(
      map<SbxResponse<T>, SbxResponse<T> | any>(res => {
        if ( res instanceof SbxResponse  &&  res.isAny() ) {
          const newRest = res.toAny();
          if (toFetch.length && this.isFind) {
            return this.core.mapFetchesResult(newRest, toFetch);
          }
          return newRest;
        }else {
          if ( res instanceof SbxResponse) {
            if (!res.success) {
              throw new Error(res.message);
            } else {
              return res.results;
            }
          } else {
            return res;
          }
        }
    })
    );
  }

  /**
   * Is used to paginate load all
   * @param query
   * @return {Observable<any>}
   */
  private findPage(query?: any) {
    const option = {headers: this.core.getHeadersJSON() };
    return this.core.httpClient.post(this.core.$p(this.core.urls.find),
      (query == null) ? this.query.compile() : query, option).pipe(map(res => res as any));
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
