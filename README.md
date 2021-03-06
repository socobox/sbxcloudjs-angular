# Angular4library

[![SBX](https://sbxcloud.com/www/api/base/powered-sbx__black.png)](https://sbxcloud.com)

Welcome, this repo is the Angular 5 implementation of [sbxcorejs](https://github.com/sbxcloud/sbxcorejs) library.

All the functions have the implementation with Promise and with Rxjs, in case of using Promise, a polyfill of Promise must be installed if the browser does not have Promise implementation.

Examples of polyfill:
- [es6-promise](https://github.com/stefanpenner/es6-promise)
- [rsvp](https://github.com/tildeio/rsvp.js/)

### Initialization

In app.module.ts file:
```
import { SbxCoreModule, SbxSessionModule, SbxSessionService } from 'sbxangular';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SbxCoreModule,
    SbxSessionModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private session: SbxSessionService) {
    this.session.initialize(domain, appKey);
  }
}
```
#### Also, you can initialize with Angular environment: 

In environment.ts file:
```
export const environment = {
  appKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  domain: x // Integer
}
```
then, in app.module.ts file:
```
import { SbxCoreModule, SbxSessionModule, SbxSessionService } from 'sbxangular';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SbxCoreModule,
    SbxSessionModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private sbxSessionService: SbxSessionService) {
    this.sbxSessionService.initializeWithEnvironment(environment);
  }
}
```
