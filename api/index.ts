export default async function handler (req: any, res: any): Promise<any> {
  return res.status(200).json({
    success: true
  })
}
