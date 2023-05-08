// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import axios from "axios";

export const environment = {
  production: false,
	SOCKET_ENDPOINT: 'http://localhost:5000',
  baseUrl: 'http://localhost:4200',
  endpointUrl: 'http://localhost:3000',
  firebaseConfig : {
    apiKey: "AIzaSyDpR4P95ehxX3iN0IwLjVM8KFWP6JCN33Q",
    authDomain: "teamfinder-e7048.firebaseapp.com",
    projectId: "teamfinder-e7048",
    storageBucket: "teamfinder-e7048.appspot.com",
    messagingSenderId: "760131924547",
    appId: "1:760131924547:web:9e93ae9834f848699fdaf6",
    measurementId: "G-Q0LNWXCFB6",
    vapidKey: "BNvDzxHlCpYtuvbJVr-u4YhAMUzEaHkh7F522s0KUrDXoQQx8zjxU8mT_DuAWaB2KQlv9fuGz_cA40b6IINuC0Q"
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
