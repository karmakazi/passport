# Mobile Testing Guide

## Quick Start - Testing on Your Phone

### Step 1: Start the Server
Your dev server is already running! Look for the network URL in your terminal:
```
- Local:        http://localhost:3002
- Network:      http://10.2.56.188:3002  👈 This is your network IP
```

### Step 2: Open Demo Page on Laptop
1. On your laptop, navigate to: `http://localhost:3002/demo`
2. You'll see a large QR code at the top labeled "Connect from Your Phone"

### Step 3: Connect Your Phone
1. Make sure your phone is on the same WiFi network as your laptop
2. Open your phone's camera app
3. Point it at the "Connect from Your Phone" QR code
4. Tap the notification that appears to open the link
5. The Richmond Hill Passport app will open on your phone!

### Step 4: Test Scanning Business QR Codes
1. On your phone, tap the "Scan QR Code" button
2. Back on your laptop, scroll down to see the 9 business QR codes
3. Point your phone's camera at any business QR code
4. The app will automatically detect it and collect the stamp!
5. Watch the cool stamp collection animation

### Step 5: Collect All Stamps
- Scan all 9 different business QR codes
- Watch your progress bar fill up
- After collecting all stamps, enter the contest!

## Alternative: Print QR Codes

If you want to test like the real experience:

1. Visit `/print-qr` on your laptop
2. Click "Print QR Codes"
3. Save as PDF or print them out
4. Display the printed QR codes around your space
5. Walk around with your phone and scan them!

## Troubleshooting

**Phone won't connect?**
- Make sure both devices are on the same WiFi network
- Check that your firewall isn't blocking port 3002
- Try manually typing the network URL (http://10.2.56.188:3002) in your phone's browser

**QR codes not scanning?**
- Make sure you have good lighting
- Hold your phone steady for a moment
- Try moving closer or further away
- Ensure your camera has permission to access the camera

**Already collected message?**
- Each location can only be stamped once
- Use the "Demo & Reset" button to clear all stamps and start over

## Features to Test

✅ Responsive mobile design  
✅ QR code scanning  
✅ Stamp collection animations  
✅ Progress tracking  
✅ Contest entry form  
✅ Success page  
✅ Local storage persistence (stamps saved even if you close the app)  

## Network Information

Your current network URL is shown at the top of the demo page. This will automatically detect your computer's IP address and create a QR code for easy access from your phone.

Enjoy testing! 🎉

