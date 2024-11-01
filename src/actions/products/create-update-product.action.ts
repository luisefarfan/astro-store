
import { ImageUpload } from "@/utils/server";
import { defineAction } from "astro:actions";
import { db, eq, Product, ProductImage } from "astro:db";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";
import { v4 as UUID } from 'uuid'

const MAX_FILE_SIZE = 5_000_000 // 5MB 
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
]

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

    imageFiles: z.array(
      z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
        .refine((file) => {
          if (file.size === 0) return true
          return ACCEPTED_IMAGE_TYPES.includes(file.type)
        }, `Only supported image types are valid: ${ACCEPTED_IMAGE_TYPES.join(', ')}`)
    ).optional(),
  }),
  handler: async (form, { request }) => {
    const session = await getSession(request)
    const user = session?.user

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { id = UUID(), imageFiles, ...rest } = form

    rest.slug = rest.slug.toLowerCase().replaceAll(' ', '-').trim()

    const product = {
      id: id,
      user: user.id!,
      ...rest
    }

    const queries: any = []

    if (!form.id) {
      queries.push(db.insert(Product).values(product))
    }
    else {
      queries.push(db.update(Product).set(product).where(eq(Product.id, id)))
    }

    // Images
    let secureUrls: string[] = []
    if (
      imageFiles &&
      imageFiles.length > 0 &&
      imageFiles[0].size > 0
    ) {
      const urls = await Promise.all(
        imageFiles.map(file => ImageUpload.upload(file))
      )

      secureUrls.push(...urls)
    }

    // imageFiles?.forEach(async (imageFile: File) => {
    //   if (imageFile.size <= 0) return

    //   const url = await ImageUpload.upload(imageFile)
    // })

    secureUrls.forEach(imageUrl => {
      const imageObj = {
        id: UUID(),
        productId: product.id,
        image: imageUrl
      }

      queries.push(db.insert(ProductImage).values(imageObj))
    })

    await db.batch(queries)

    return { success: true, product }
  }
})
