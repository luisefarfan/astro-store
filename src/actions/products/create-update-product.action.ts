
import { defineAction } from "astro:actions";
import { db, eq, Product } from "astro:db";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";
import { v4 as UUID } from 'uuid'

export const createUpdateProduct = defineAction({
  accept: 'form',
  input: z.object({
    id: z.string().optional(),
    stock: z.number(),
    slug: z.string(),
    price: z.number(),
    sizes: z.string(),
    type: z.string(),
    tags: z.string(),
    title: z.string(),
    description: z.string(),
    gender: z.string(),

    // TODO: Image
  }),
  handler: async (form, { request }) => {
    const session = await getSession(request)
    const user = session?.user

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { id = UUID(), ...rest } = form

    rest.slug = rest.slug.toLowerCase().replaceAll(' ', '-').trim()

    const product = {
      id: id,
      user: user.id!,
      ...rest
    }

    if (!form.id) {
      await db.insert(Product).values(product)
    }
    else {
      await db.update(Product).set(product).where(eq(Product.id, id))
    }


    return { success: true, product }
  }
})
