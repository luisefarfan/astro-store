import { db, Role, User, Product, ProductImage } from 'astro:db';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcryptjs';
import { seedProducts } from './seed-data';

// https://astro.build/db/seed
export default async function seed() {
	// TODO
	const roles = [
		{ id: 'admin', name: 'Administrador' },
		{ id: 'user', name: 'Usuario de sistema' }
	]

	const users = [
		// Create 5 users
		{ id: UUID(), name: 'Jhon Doe', email: 'jhon.doe@example.com', password: bcrypt.hashSync('123456'), role: 'admin' },
		{ id: UUID(), name: 'Jane Doe', email: 'jane.doe@example.com', password: bcrypt.hashSync('123456'), role: 'user' },
		{ id: UUID(), name: 'Jhon Smith', email: 'jhon.smith@example.com', password: bcrypt.hashSync('123456'), role: 'user' }
	]

	await db.insert(Role).values(roles)
	await db.insert(User).values(users)

	const queries: any = []

	seedProducts.forEach((product) => {
		const newProduct = {
			id: UUID(),
			stock: product.stock,
			slug: product.slug,
			price: product.price,
			sizes: product.sizes.join(','),
			type: product.type,
			tags: product.tags.join(','),
			title: product.title,
			description: product.description,
			gender: product.gender,
			user: users.at(0)?.id ?? '',
		}

		queries.push(db.insert(Product).values(newProduct))

		product.images.forEach((img) => {
			const image = {
				id: UUID(),
				productId: newProduct.id,
				image: img
			}

			queries.push(db.insert(ProductImage).values(image))
		})
	})

	await db.batch(queries)
}
