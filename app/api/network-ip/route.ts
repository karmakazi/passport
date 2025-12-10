import { NextResponse } from 'next/server'
import { networkInterfaces } from 'os'

export async function GET(request: Request) {
  // Check if we're in production (Vercel or other hosting)
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // In production, always use the host header (actual domain being accessed)
    // This works for both Vercel's default domain and custom domains
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

