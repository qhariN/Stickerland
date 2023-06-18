import type { VercelRequest, VercelResponse } from '@vercel/node'
import { allowCors } from '../../src/middlewares/cors'

const apiKey = process.env.CLOUDINARY_API_KEY ?? ''
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? ''

const asset = async (request: VercelRequest, response: VercelResponse): Promise<void> => {
  if (request.method === 'GET') {
    const endpoint = 'https://api.cloudinary.com/v1_1/jhormanrus/resources/image/upload?prefix=stickerland&max_results=1000'
    const headers = new Headers()
    const base64Credentials = btoa(`${apiKey}:${apiSecret}`)
    headers.append('Authorization', `Basic ${base64Credentials}`)

    const assets = await fetch(endpoint, {
      method: 'GET',
      headers
    }).then(async res => await res.json())
      .then(({ resources }) => (
        resources.map((resource: { public_id: string, url: string }) => {
          const { public_id: publicId, url } = resource
          return {
            public_id: publicId.replace('stickerland/', ''),
            url
          }
        })
      ))
      .catch(err => {
        console.error(err)
      })

    response.status(200).json(assets)
  }

  response.status(400).end()
}

export default allowCors(asset)
