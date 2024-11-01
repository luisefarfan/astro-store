import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET
});

export class ImageUpload {
  static async upload(file: File) {
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const imageType = file.type.split('/').at(1);

    const response = await cloudinary.uploader.upload(
      `data:image/${imageType};base64,${base64Image}`
    );

    return response.secure_url
  }

  static async delete(imageUrl: string) {
    try {
      const imageName = imageUrl.split('/').pop() ?? ''

      const imageId = imageName.split('.').at(0) ?? ''

      const resp = await cloudinary.uploader.destroy(imageId)

      console.info('Image deleted', resp)

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
