export default {
	entry: 'dist/index.js',
	dest: 'dist/bundles/sbx.umd.js',
	sourceMap: false,
	format: 'umd',
	moduleName: 'sbxangular',
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'@angular/forms': 'ng.forms',
    '@angular/common/http': 'ng.common.http',
    'sbx-querybuilder/index': 'QueryBuilder',
    'rxjs/Rx': 'rxjs_Rx',
    'ngx-cookie-service': 'ngxCookieService',
      'rxjs': 'Rx',
		'rxjs/Observable': 'Rx',
		'rxjs/ReplaySubject': 'Rx',
		'rxjs/add/operator/map': 'Rx.Observable.prototype',
		'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
		'rxjs/add/observable/fromEvent': 'Rx.Observable',
		'rxjs/add/observable/of': 'Rx.Observable'
	},
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/common/http',
        '@angular/forms',
        'sbx-querybuilder/index',
        'rxjs/Rx',
        'ngx-cookie-service'

	]
}
