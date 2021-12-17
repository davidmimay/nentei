import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { SubscribedService } from './../../services/subscribed.service';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent {

  isloading: boolean;
  products = [];
  functionLocation = 'us-central1';

  public userId:any = this.afAuth.auth.currentUser.uid;
  
  readonly currentUser$ = this.subscribedService.currentUser$
  readonly doesNotHaveSubs$ = this.subscribedService.doesNotHaveSubs$

  constructor(
    private afStore: AngularFirestore,
    private afFunctions: AngularFireFunctions,
    private afAuth: AngularFireAuth,
    public subscribedService: SubscribedService,
  ) {
    this.displayProducts();
    this.setCurrentUser();
  }
  
  // ✅ DISPLAY PRODUCTS
  displayProducts() {
    const ref = this.afStore.collection('products').ref;
    ref.where('active', '==', true)
      .get()
      .then(querySnapshot => {
        const items = [];
        querySnapshot.forEach(async function (doc) {

          const priceSnap = await doc.ref
            .collection('prices')
            .where('active', '==', true)
            .orderBy('unit_amount')
            .get();

          const product: any = doc.data();

          priceSnap.docs.forEach((doc) => {
            const priceId = doc.id;
            const priceData = doc.data();

            if (priceData.active === true) {
              items.push({
                name: product.name,
                image: product.images[0],
                description: product.description,
                billing_scheme: priceData.billing_scheme,
                currency: priceData.currency,
                interval: priceData.interval,
                price: ((priceData.unit_amount / 100).toFixed(0)),
                limit_point: product.metadata.limit_point,
                priceId,
              });
            }
          });
        });
        this.products = items;  
      });
  }

  // ✅ SUBSCRIBE
  public async subscribe(price: string) {
    // const modalRef = this.modalService.open(WaitDialogComponent);
    const selectedPrice = [{
      price,
      quantity: 1
    }];

    const id = [];
    for (const prod of this.products) {
      id.push({
        price: prod.priceId,
        quantity: 1
      });
    }

    const checkoutSession = {
      // automatic_tax: true,
      // tax_id_collection: true,
      collect_shipping_address: false,
      // tax_rates: environment.taxRates,
      allow_promotion_codes: true,
      line_items: selectedPrice, // id,
      success_url: window.location.href,
      cancel_url: window.location.href,
      metadata: { key: 'value'},
    };

    this.afStore
      .collection('customers')
      .doc(this.userId)
      .collection('checkout_sessions')
      .add(checkoutSession).then(docRef => {
        // Wait for the CheckoutSession to get attached by the extension
        docRef.onSnapshot((snap) => {
          const { error, url } = snap.data();
          if (error) {
            alert(`An error occured: ${error.message}`);
          } else if (url) {
            window.location.assign(url);
          }
        });
      });
  }

  // ✅ SET USER DEFAULT DATA
  private setCurrentUser(): void {
    this.userId = {
      uid: '',
      displayName: '',
      priceId: '',
      billing_scheme: '',
      currency: '',
      interval: '',
      price: 0,
    }
    /*
    this.userId((firebaseUser) => {
      if (firebaseUser) {
        //this.userId.uid = firebaseUser.uid;
        //this.userId.displayName = firebaseUser.displayName;
        this.checkUserProduct();
      }
    });
    */  
    this.checkUserProduct();
  }
  
  // ✅ GET USER SUBSCRIPTION
  private checkUserProduct() {
    const userId = this.afAuth.auth.currentUser.uid;
    const ref = this.afStore.collection('customers').ref;
    ref.doc(userId)
      .collection('subscriptions')
      .where('status', 'in', ['trialing', 'active'])
      .onSnapshot(async (snapshot) => {
        if (snapshot.empty) {
          return;
        }
        // In this implementation we only expect one Subscription to exist
        const subscription = snapshot.docs[0].data();
        // console.log('📄 USER SUBSCRIPTION:', subscription);
          this.userId.nextPayment = subscription.current_period_end.seconds * 1000;

        const priceData = (await subscription.price.get()).data();
          this.userId.billing_scheme = priceData.billing_scheme;
          this.userId.active = priceData.active;
          this.userId.currency = priceData.currency;
          this.userId.interval = priceData.interval;
          this.userId.price = ((priceData.unit_amount / 100).toFixed(0));
          this.userId.priceId = subscription.price.id;

        const productData = (await subscription.product.get()).data();
          this.userId.name = productData.name;
          this.userId.description = productData.description;
      });
  }

  // ✅ CUSTOMER PORTAL  
  async accessCustomerPortal() {
    const functionRef = this.afFunctions
      .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    await functionRef({ returnUrl: window.location.origin })
      .pipe()
      .subscribe(data => {
        window.location.assign(data.url);
      }, err => {
        alert(`An error occured: ${err}`);
      });
  }

  // 🟠 TO-DO STRIPE ROLES
  /*
  async getCustomClaimRole() {
    await firebase.auth().currentUser.getIdToken(true);
    const decodedToken = await firebase.auth().currentUser.getIdTokenResult();
    return decodedToken.claims.stripeRole;
  }
  */

}