import { Component, OnInit } from '@angular/core';
// *** NEW ***
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase                              from 'firebase/app';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {loadStripe} from '@stripe/stripe-js';
import {filter, first, map, startWith, switchMap} from 'rxjs/operators';
import 'firebase/functions';
import { SubscribedService } from './../../services/subscribed.service';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  NENTEI_STRIPE_PUBLIC = 'pk_live_51JT0iQKgbetGeuy3AgnOyZ64emOlyQa21ILMXLWLwRRpQfq15eibuK4QVm04JtV9rSTqo5kkUoCG9lmavvDtFyFX00On5PpFHd';
  NENTEI_STRIPE_PRICE = 'price_1JXNenKgbetGeuy3r4XYqcUl';
  functionLocation = 'us-central1';
  
  // STRIPE_RESTRICTED_KEY = (environment.stripe.publicKey);
  // functionLocation = (environment.location);
  // taxRates = (environment.stripe_tax);
  // STRIPE_SUBS_PRICE = (environment.stripe.subsPrice);
  // WEBAPP_URL = (environment.webapp_url);

  isloading: boolean // new spinner
  
  readonly currentUser$ = this.subscribedService.currentUser$
  readonly doesNotHaveSubs$ = this.subscribedService.doesNotHaveSubs$

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    public subscribedService: SubscribedService,
  ) {}

  ngOnInit(): void {}

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
              price: this.NENTEI_STRIPE_PRICE, // todo price Id from your products price in the Stripe Dashboard
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
                    this.NENTEI_STRIPE_PUBLIC // todo enter your public stripe key here
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