import * as Rx from "rxjs";
import { ApiCaller } from "./lib/api-caller";
import { map } from "rxjs/operators";
import firebase from "firebase/app";
import 'firebase/auth'
import * as firebaseui from "firebaseui";
import {ClientConfig} from "./client_config";

(function () {
  let queries: any = window.location.search.substring(1).split("&").map(query => query.split('='))
    .reduce((result, [k, v]) => Object.assign(result, { [k]: decodeURI(v) }), {});

  firebase.initializeApp(ClientConfig.LOCAL.firebase);
  let ui = new firebaseui.auth.AuthUI(firebase.auth());

  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
  });

  let subscriptions = new Rx.Subscription();
  subscriptions.add(
    new ApiCaller().authenticate({ id: queries.session }).pipe(
      map(response => {
        let target = document.getElementById("target");
        if (target === null) {
          return;
        }
        if (response.status === 404) {
          target.appendChild(document.createTextNode(`Hello world from JavaScript!`));
        } else {
          target.appendChild(document.createTextNode(`Hello ${response.user.first_name} from JavaScript!`));
        }
      })
    ).subscribe()
  );
})();
