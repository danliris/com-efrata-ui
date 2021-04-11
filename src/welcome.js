//import {computedFrom} from 'aurelia-framework';
// import { inject, bindable } from 'aurelia-framework';

import { inject, Aurelia, BindingEngine, computedFrom } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { Router } from 'aurelia-router';
import { LocalStorage } from './utils/storage';

@inject(Aurelia, Router, BindingEngine, AuthService, LocalStorage)



export class Welcome {
  heading = 'Selamat datang di aplikasi efrata management system';
  firstName = 'John';
  lastName = 'Doe';
  previousValue = this.fullName;

  //Getters can't be directly observed, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below
  //as well as the corresponding import above.
  //@computedFrom('firstName', 'lastName')

  // constructor() {

  // }

  constructor(aurelia, router, bindingEngine, authService, localStorage) {
    this.aurelia = aurelia;
    this.router = router;
    this.bindingEngine = bindingEngine;
    this.authService = authService;
    this.localStorage = localStorage;
    this.storeId = this.localStorage.store._id;

    this.user = this.localStorage.me;
}

attached() {



  this.stores = [];
  var storage = this.authService.authentication.storage;
  if (storage.get("me")) {
      this.stores = JSON.parse(storage.get("me")).data.stores;
  }


  this.bindingEngine.propertyObserver(this, "storeId").subscribe((newValue, oldValue) => {
      for (var store of this.stores) {
          if (store._id.toString() === this.storeId.toString()) {
              this.authService.authentication.storage.set("store", JSON.stringify(store)); 
              document.location.reload()
              break;
          }
      }
  });
}

@computedFrom('authService.authenticated')
get isAuthenticated() {
    if (this.authService.authenticated) {
        this.authService.getMe()
            .then((result) => {
                this.me = result.data;
            })
    }
    else {
        this.me = null;
    }

    return this.authService.authenticated;
}

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  submit() {
    this.previousValue = this.fullName;
    alert(`Welcome, ${this.fullName}!`);
  }

  canDeactivate() {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }
}

export class UpperValueConverter {
  toView(value) {
    return value && value.toUpperCase();
  }
}
