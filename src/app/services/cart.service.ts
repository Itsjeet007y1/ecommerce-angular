import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {

    console.log("add to cart method...................."+ theCartItem.id);
    
    // check if we have already item in our cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    console.log(this.cartItems.length > 0);
    if(this.cartItems.length > 0) {
      // find the item in the cart based on thie item id
      
      // Old way to compare items
      for (let tempCartItem of this.cartItems) {
        if(tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }

      // // New way
      // existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistInCart = (existingCartItem != undefined);

      if(alreadyExistInCart) {
        // increment the quantity
        existingCartItem.quantity++;
      } else {
        // just add the item to the array
        this.cartItems.push(theCartItem);
      }

      // compute cart total item and total quantity
      this.computeCartTotals();
    } else {
      this.cartItems.push(theCartItem);
      this.computeCartTotals();
    }
  }
  computeCartTotals() {
    let totalPriceValue:number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new value .. all subscribers will recieve the new Data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue); 

    // log cart data just for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("content of the cart");
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice} and subTotalPrice: ${subTotalPrice}`);
    }

    console.log(`total Price: ${totalPriceValue.toFixed(2)}, total Quantity: ${totalQuantityValue}`);
    console.log("================")
  }
 
  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity === 0) {
      this.removeItem(cartItem);
    }
  }

  removeItem(cartItem: CartItem) {
    // get index of item in the araay
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    // if found, remove the from the array from the given index
    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}
