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
        'sbxcore': 'Find',
        'ngx-cookie-service': 'ngxCookieService',
		'rxjs/Observable': 'Rx',
		'rxjs/add/operator/map': 'Rx.Observable.prototype',
		'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
		'rxjs/add/observable/of': 'Rx.Observable',
		'rxjs/add/observable/forkJoin': 'Rx.Observable'
	},
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/common/http',
        '@angular/forms',
        'sbx-querybuilder/index',
        'sbxcore',
        'ngx-cookie-service',
        'rxjs/Observable',
        'rxjs/add/operator/map',
        'rxjs/add/operator/mergeMap',
        'rxjs/add/observable/of',
        'rxjs/add/observable/forkJoin'
	]
}
