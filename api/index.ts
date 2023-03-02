import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler (req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  return res.status(200).json({
    success: true
  })
}
