import { json } from '@sveltejs/kit'

const apiKey = process.env.CLOUDINARY_API_KEY ?? ''
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? ''

export async function GET (): Promise<Response> {
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

  // return new Response(JSON.stringify(assets), {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  return json(assets)
}
