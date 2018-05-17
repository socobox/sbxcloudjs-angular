const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
  '@angular/common/http': 'ng.common.http',
  'sbx-querybuilder/index': 'QueryBuilder',
  'sbxcorejs': 'Find',
  'ngx-cookie-service': 'ngxCookieService',
  'rxjs/Observable': 'Rx',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/add/operator/mergeAll': 'Rx.Observable.prototype',
  'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',
  'rxjs/add/operator/toArray': 'Rx.Observable.prototype',
  'rxjs/add/observable/of': 'Rx.Observable',
  'rxjs/add/observable/forkJoin': 'Rx.Observable',
  'rxjs/add/observable/merge': 'Rx.Observable'
};

export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundles/sbx.umd.js',
    format: 'umd',
    globals: globals,
    name: 'sbxangular'
  },
  external: Object.keys(globals)
}
