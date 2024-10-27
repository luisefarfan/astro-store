import type { CartItem } from "@/interfaces"
import Cookies from "js-cookie"

export class CartCookiesClient {
  static cartCookieKey = 'cart'

  static getCart(): CartItem[] {
    return JSON.parse(Cookies.get(CartCookiesClient.cartCookieKey) ?? '[]')
  }

  static addItem(item: CartItem): CartItem[] {
    const cart = CartCookiesClient.getCart()

    // Verificar si el producto ya existe en el carro
    const existingItem = cart.find(
      (cartItem) =>
        cartItem.productId === item.productId &&
        item.size === cartItem.size
    )

    if (existingItem) {
      // Incrementar la cantidad de producto en el carro
      existingItem.quantity += item.quantity

      // Actualizar el carro en la cookie
      cart.splice(cart.indexOf(existingItem), 1, existingItem)
    } else {
      cart.push(item)
    }

    Cookies.set(CartCookiesClient.cartCookieKey, JSON.stringify(cart))

    return cart
  }

  static removeItem(productId: string, size: string): CartItem[] {
    const cart = CartCookiesClient.getCart()

    const updatedCart = cart.filter(
      (cartItem) =>
        !(cartItem.productId === productId && cartItem.size === size)
    )

    Cookies.set(CartCookiesClient.cartCookieKey, JSON.stringify(updatedCart))

    return updatedCart
  }
}
