/* eslint-disable @typescript-eslint/no-throw-literal */
import type { Webhook } from '../../../interfaces/message'
import { error, json } from '@sveltejs/kit'
import wretch from 'wretch'

const token: string = process.env.WA_TOKEN ?? ''

export function GET ({ url }): Response {
  const mode = url.searchParams.get('hub.mode')
  const challenge = url.searchParams.get('hub.challenge')
  const verifyToken = url.searchParams.get('hub.verify_token')

  if (mode === 'subscribe' && verifyToken === token) {
    return new Response(challenge)
  }
  throw error(403, 'Forbidden')
}

export async function POST ({ request }): Promise<Response> {
  const body = (await request.json() as Webhook).entry[0].changes[0]
  const phoneNumberId = body.value.metadata.phone_number_id

  if (body.field !== 'messages') {
    throw error(400, 'Bad Request')
  }

  const api = wretch(`https://graph.facebook.com/v16.0/${phoneNumberId}/messages`).auth(`Bearer ${token}`)

  if (body.value.statuses != null) {
    const errorCode = body.value.statuses[0].errors?.[0].code
    if (errorCode === 131053) {
      await api.post({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: body.value.statuses[0].recipient_id,
        type: 'text',
        text: {
          body: 'El sticker que buscas excede el tamaño permitido 😔'
        }
      }).res()
    }
    return json(body.value.statuses)
  }

  if (body.value.messages == null) {
    throw error(400, 'Bad Request')
  }

  const message = body.value.messages[0]
  if (message.type !== 'text') {
    throw error(400, 'Bad Request')
  }

  const { text: { body: text } } = message

  if (!text.includes('sticker-ID') || text.split(' ').length !== 2) {
    await api.post({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: message.from,
      type: 'text',
      text: {
        body: `Hola 👋, soy un bot que te envía stickers 🤖
Para recibir un sticker, envía el mensaje *sticker-ID [ID del sticker]* y te lo enviaré 😉
Puedes crear tus propios stickers en https://stickerland.vercel.app
o puedes seleccionar uno de los stickers disponibles en https://stickerland.vercel.app/gallery`
      }
    }).res()

    return json({ message: 'ok' })
  }

  const stickerId = text.split(' ')[1]

  await wretch(`https://res.cloudinary.com/jhormanrus/image/upload/v1677629788/stickerland/${stickerId}`).head().notFound(async () => {
    await api.post({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: message.from,
      type: 'text',
      text: {
        body: 'El sticker que buscas no existe 😔'
      }
    }).res()

    return json({ message: 'ok' })
  }).res()

  await api.post({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: message.from,
    type: 'sticker',
    sticker: {
      link: `https://res.cloudinary.com/jhormanrus/image/upload/v1677629788/stickerland/${stickerId}`
    }
  }).res()

  return json({ message: 'ok' })
}
