import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SbxInterceptor implements HttpInterceptor {
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const authReq = req.clone({
    //   headers: req.headers.set('Accept-Encoding', 'gzip')
    // });
    return next.handle(req);
  }
}
