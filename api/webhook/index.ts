import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Webhook } from '../../src/interfaces/message'

const token = process.env.WA_TOKEN ?? ''

export default async function (req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const challenge = req.query['hub.challenge']
    const verifyToken = req.query['hub.verify_token']

    if (mode === 'subscribe' && verifyToken === token) {
      return res.send(challenge)
    }
    return res.status(403).end()
  }

  if (req.method === 'POST') {
    console.log(JSON.stringify(req.body, null, 2))

    const body = (req.body as Webhook).entry[0].changes[0]
    const phoneNumberId = body.value.metadata.phone_number_id

    if (body.field !== 'messages') {
      return res.status(400).end()
    }

    if (body.value.statuses != null) {
      const errorCode = body.value.statuses[0].errors?.[0].code
      if (errorCode === 131053) {
        await fetch(`https://graph.facebook.com/v16.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: body.value.statuses[0].recipient_id,
            type: 'text',
            text: {
              body: 'El sticker que buscas excede el tamaño permitido 😔'
            }
          })
        }).catch(err => {
          console.error(err)
        })
      }
      return res.status(200).end()
    }

    if (body.value.messages == null) {
      return res.status(400).end()
    }

    const message = body.value.messages[0]
    if (message.type !== 'text') {
      return res.status(400).end()
    }

    const { text: { body: text } } = message

    if (!text.includes('sticker-ID') || text.split(' ').length !== 2) {
      await fetch(`https://graph.facebook.com/v16.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: message.from,
          type: 'text',
          text: {
            body: `Hola 👋, soy un bot que te envía stickers 🤖
Para recibir un sticker, envía el mensaje *sticker-ID [ID del sticker]* y te lo enviaré 😉
Puedes crear tus propios stickers en https://stickerland.vercel.app
o puedes seleccionar uno de los stickers disponibles en https://stickerland.vercel.app/galery`
          }
        })
      }).catch(err => {
        console.error(err)
      })

      return res.status(200).end()
    }

    const stickerId = text.split(' ')[1]

    const { status } = await fetch(`https://res.cloudinary.com/jhormanrus/image/upload/v1677629788/stickerland/${stickerId}`, {
      method: 'HEAD'
    })

    if (status !== 200) {
      await fetch(`https://graph.facebook.com/v16.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: message.from,
          type: 'text',
          text: {
            body: 'El sticker que buscas no existe 😔'
          }
        })
      }).catch(err => {
        console.error(err)
      })

      return res.status(200).end()
    }

    await fetch(`https://graph.facebook.com/v16.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: message.from,
        type: 'sticker',
        sticker: {
          link: `https://res.cloudinary.com/jhormanrus/image/upload/v1677629788/stickerland/${stickerId}`
        }
      })
    }).catch(err => {
      console.error(err)
    })

    return res.status(200).end()
  }

  return res.status(400).end()
}
