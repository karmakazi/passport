import { NextResponse } from 'next/server'
import { networkInterfaces } from 'os'

export async function GET() {
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

  return NextResponse.json({ 
    ip: networkIP,
    port: process.env.PORT || '3002'
  })
}

