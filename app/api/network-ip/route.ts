import { NextResponse } from 'next/server'
import { networkInterfaces } from 'os'

export async function GET(request: Request) {
  // Check if we're in production (Vercel or other hosting)
  const isProduction = process.env.NODE_ENV === 'production'
  const vercelUrl = process.env.VERCEL_URL
  
  if (isProduction && vercelUrl) {
    // In production on Vercel, use the Vercel URL
    return NextResponse.json({ 
      url: `https://${vercelUrl}`,
      isProduction: true
    })
  }
  
  if (isProduction) {
    // In production but not Vercel, try to get from request headers
    const host = request.headers.get('host')
    if (host) {
      return NextResponse.json({ 
        url: `https://${host}`,
        isProduction: true
      })
    }
  }
  
  // Local development - detect network IP
  const nets = networkInterfaces()
  let networkIP = 'localhost'

  // Find the first non-internal IPv4 address
  for (const name of Object.keys(nets)) {
    const netInfo = nets[name]
    if (!netInfo) continue
    
    for (const net of netInfo) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        networkIP = net.address
        break
      }
    }
    
    if (networkIP !== 'localhost') break
  }

  const port = process.env.PORT || '3002'
  const protocol = process.env.USE_HTTPS === 'true' ? 'https' : 'http'

  return NextResponse.json({ 
    url: `${protocol}://${networkIP}:${port}`,
    isProduction: false
  })
}

