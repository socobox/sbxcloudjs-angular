import resolve from 'rollup-plugin-node-resolve';

const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
  '@angular/common/http': 'ng.common.http',
  'sbx-querybuilder/index': 'QueryBuilder',
  'sbxcorejs': 'Find',
  'rxjs': 'rxjs',
  'rxjs/operators': 'rxjs.operators'
};

export default {
	input: 'dist/src/index.js',
	output: {
    name: 'sbxangular',
	  file: 'dist/bundles/sbx.umd.js',
    format: 'umd',
    globals: globals
  },
  external: Object.keys(globals),
  plugins: [
    resolve({
      module: true,
      main: true
    })
  ]
}
