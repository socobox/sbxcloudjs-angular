
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
	input: 'dist/src/index.js',
	output: {
	  file: 'dist/bundles/sbx.umd.js',
    format: 'umd',
    globals: globals,
    name: 'sbxangular'
  },
  external: Object.keys(globals)
}
