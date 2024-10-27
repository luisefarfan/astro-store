
import type { CartItem } from "@/interfaces";
import { defineAction } from "astro:actions";
import { db, eq, inArray, Product, ProductImage } from "astro:db";
import { z } from "astro:schema";

export const loadProductsFromCart = defineAction({
  accept: 'json',
  input: z.object({
    cookies: z.string()
  }),
  handler: async ({ cookies }) => {
    const cart = JSON.parse(cookies) as CartItem[]

    if (cart.length === 0) {
      return []
    }

    const productIds = cart.map((cartItem) => cartItem.productId);

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productIds))

    return cart.map((cartItem) => {
      const dbProduct = dbProducts.find((dbProduct) => dbProduct.Product.id === cartItem.productId)

      if (!dbProduct) {
        throw new Error(`Product with id ${cartItem.productId} not found`)
      }

      const { title, price, slug } = dbProduct.Product
      const image = dbProduct.ProductImage.image

      return {
        productId: cartItem.productId,
        title,
        price,
        quantity: cartItem.quantity,
        size: cartItem.size,
        image: image.startsWith('http')
          ? image
          : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
        slug
      }
    })
  }
})
