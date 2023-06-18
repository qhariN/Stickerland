import type { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'

export const allowCors = (fn: VercelApiHandler) => async (request: VercelRequest, response: VercelResponse) => {
  const allowedOrigins = ['https://stickerland.vercel.app']
  const origin = request.headers.origin ?? ''
  if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Credentials', 'true')
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    response.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (request.method === 'OPTIONS') {
      response.status(200).end()
      return
    }
    await fn(request, response)
  }
  response.status(403).end()
}
