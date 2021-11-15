import {Injectable} from '@angular/core';
import {objectExists} from './utilities.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {filter, first, map, startWith, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class SubscribedService {

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {}

  readonly currentUser$ = this.afAuth.authState.pipe(filter(objectExists));

  readonly doesNotHaveSubs$: Observable<boolean> = this.currentUser$.pipe(
    
    filter(objectExists),
    switchMap((user) => {
      return new Promise<boolean>((resolve, reject) => {
        // had to update firebase.firestore() to firebase.default.firestore() (from stripe firebase extension docs)
        firebase
          .firestore()
          .collection('customers')
          .doc(user.uid)
          .collection('subscriptions')
          .where('status', 'in', ['trialing', 'active'])
          .onSnapshot(async (snapshot) => {
            // In this implementation we only expect one active or trialing subscription to exist.
            // If we get anything back, it means this user has a subscription.
            const doc = snapshot.docs[0];
            console.log(doc.id, ' => ', doc.data()); // console log subscription info if you want to do anything with it
            resolve(true);
          });
      });
    }),
    startWith(false)
  );
}


/* 
import { Component, OnInit } from '@angular/core';
// *** NEW ***
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase                              from 'firebase/app';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {loadStripe} from '@stripe/stripe-js';
import {filter, first, map, startWith, switchMap} from 'rxjs/operators';
import {objectExists} from '../../services/utilities.service';
import 'firebase/functions';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {}

  ngOnInit(): void {}

  STRIPE_PUBLISHABLE_KEY = (environment.stripe.publisableKey);
  firebaseConfig = (environment.firebase);
  functionLocation = (environment.location);
  // taxRates = (environment.stripe_tax);
  STRIPE_SUBS_PRICE = (environment.stripe.subsPrice);
  webapp_url = (environment.webapp_url);

  isloading: boolean // new spinner
  
  readonly currentUser$ = this.afAuth.authState.pipe(filter(objectExists));

  readonly doesNotHaveSubs$: Observable<boolean> = this.currentUser$.pipe(
    
    filter(objectExists),
    switchMap((user) => {
      return new Promise<boolean>((resolve, reject) => {
        // had to update firebase.firestore() to firebase.default.firestore() (from stripe firebase extension docs)
        firebase
          .firestore()
          .collection('customers')
          .doc(user.uid)
          .collection('subscriptions')
          .where('status', 'in', ['trialing', 'active'])
          .onSnapshot(async (snapshot) => {
            // In this implementation we only expect one active or trialing subscription to exist.
            // If we get anything back, it means this user has a subscription.
            const doc = snapshot.docs[0];
            console.log(doc.id, ' => ', doc.data()); // console log subscription info if you want to do anything with it
            resolve(true);
          });
      });
    }),
    startWith(false)
  );

  async sendToCheckout() {
    this.isloading = true // new spinner
  // async sendToCheckout(event) {
    // await this.afAuth.authState
    // await this.afAuth.auth.currentUser
    await this.currentUser$
      .pipe(
        map((user) => {
          return this.db //firebase.default.firestore()
            .collection('customers')
            .doc(user.uid)
            .collection('checkout_sessions')
            .add({
              price: this.STRIPE_SUBS_PRICE, // todo price Id from your products price in the Stripe Dashboard
              success_url: window.location.href,
              cancel_url: window.location.href,
              // success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`, // window.location.origin, // return user to this screen on successful purchase
              // cancel_url: `${url}/failed`,
            })
            .then((docRef) => {
              // Wait for the checkoutSession to get attached by the extension
              docRef.onSnapshot(async (snap) => {
                const { error, sessionId } = snap.data();
                if (error) {
                  // Show an error to your customer and inspect
                  // your Cloud Function logs in the Firebase console.
                  alert(`An error occurred: ${error.message}`);
                }

                if (sessionId) {
                  // We have a session, let's redirect to Checkout
                  // Init Stripe
                  const stripe = await loadStripe(
                    this.STRIPE_PUBLISHABLE_KEY // todo enter your public stripe key here
                  );
                  console.log(`redirecting`);
                  await stripe.redirectToCheckout({ sessionId });
                }
              });
            });
        }),
        first() // prevent any memory leaks
      )
      .toPromise();
  }

  async sendToCustomerPortal() {
    const functionRef = firebase
      .app()
      .functions(this.functionLocation)
      .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);
  }
}

*/