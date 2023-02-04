import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap, tap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import axios from 'axios';


interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}


@Injectable({
  providedIn: 'root',
})

export class UserService {
  userData: any;
  uid = this.auth.authState.pipe(
    map((authState) => {
      if (!authState) {
        return null;
      } else {
        return authState.uid;
      }
    })
  );



  // test to see if already logged in
  // isLoggedIn: Observable<boolean> = this.uid.pipe(
  //   tap((uid) => console.log('this.uid is of type:', typeof this.uid)),
  //   switchMap((uid) => {
  //     if (!uid) {
  //       return observableOf(false);
  //     } else {
  //       return this.db.object<boolean>('/admin/' + uid).valueChanges();
  //     }
  //   })
  // );
  // test to see if user has specific permissions
  constructor(
    public afs: AngularFirestore,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    public router: Router,
    ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        let token = user.getIdToken().then(id=>{
          axios.defaults.headers.common['authorization'] = `Bearer ${id}`
          axios.defaults.baseURL = 'http://localhost:3000/'
          localStorage.setItem('token', id);
        })

        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // SetUserData(user: any) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(
  //     `users/${user.uid}`
  //   );
  //   const userData: User = {
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL,
  //     emailVerified: user.emailVerified,
  //   };
  //   return userRef.set(userData, {
  //     merge: true,
  //   });
  // }
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
      // this.SetUserData(result.user);
      this.auth.authState.subscribe((user) => {
        if (user) {
          console.log(user)

          this.router.navigate(['/first-component']);
          // axios.defaults.headers.post['authorization'] = 'value' // for POST requests

        }else{
          this.router.navigate(['/login-page']);
        }
      });
    })
    .catch((error) => {
      window.alert(error.message);
    });
  }
  logout() {
    this.auth.signOut().then(()=>{
      localStorage.setItem('user', 'null');
      this.router.navigate(['/login-page']);
    })

  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
}
