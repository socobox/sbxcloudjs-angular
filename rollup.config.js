
const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
  '@angular/common/http': 'ng.common.http',
  'sbx-querybuilder/index': 'QueryBuilder',
  'sbxcorejs': 'Find',
  'ngx-cookie-service': 'ngxCookieService',
  'rxjs': 'rxjs',
  'rxjs/operators': 'rxjs.operators'
};

export default {
	entry: 'dist/index.js',
	dest: 'dist/bundles/sbx.umd.js',
	sourceMap: false,
	format: 'umd',
	moduleName: 'sbxangular',
	globals: globals,
  external: Object.keys(globals)
}
