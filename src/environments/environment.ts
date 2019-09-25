// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://203.157.182.3:3000',
  SECRET_KEY: '##0123456**789000@@0001234**567890##',
  tokenName: 'r9refer-account',
  systemName: 'ระบบ R9Refer',
  pathRoute: 'refer-path',
  monit_hospcode: 'refer-hospcode',
  monit_token: 'refer-token',
  monit_referType: 'refer-type',
  socket_connect_name: 'r9refer-socketio'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
