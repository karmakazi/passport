# Richmond Hill Passport - Stamp Collection App

A sleek, mobile-first web application for collecting stamps at participating Richmond Hill businesses and entering contests. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **📱 Mobile-First Design** - Optimized for smartphones with a beautiful, modern UI
- **🎨 Polished Animations** - Smooth transitions and engaging interactions
- **💾 Local Storage** - No database required - all data stored locally in the browser
- **📸 QR Code Scanning** - Scan location-specific QR codes to collect stamps (with demo mode)
- **🏆 Contest Entry** - Enter to win prizes once all stamps are collected
- **✅ Progress Tracking** - Visual progress bar and stamp grid to track collection
- **🔄 Reset Functionality** - Easy reset for testing and demos

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### For Testing/Demo:

#### Desktop Testing:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit the Demo Page** - Navigate to `http://localhost:3002/demo`

3. **Desktop Simulation:**
   - Use the "Quick Select" buttons on the scan page
   - Or use manual entry with location IDs: `loc1`, `loc2`, `loc3`, etc.

#### Mobile Testing (Recommended):

1. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Note the network URL shown (e.g., `http://192.168.1.100:3002`)

2. **Connect your phone:**
   - Make sure your phone and laptop are on the same WiFi network
   - Visit `/demo` on your laptop
   - Scan the "Connect from Your Phone" QR code with your phone's camera
   - The app will open on your phone

3. **Scan Business QR Codes:**
   - On your phone, tap "Scan QR Code"
   - Scan any of the 9 business QR codes shown on the demo page
   - Watch the stamp get collected with animation!

4. **Complete Your Passport:**
   - Collect all 9 stamps from different locations
   - Watch the progress bar fill up

5. **Enter the Contest:**
   - Once all stamps are collected, a contest entry button appears
   - Fill out your information
   - Submit to win amazing prizes!

#### Print QR Codes for Physical Testing:

1. Visit `/print-qr` to get printable versions
2. Print each QR code page
3. Display them at different locations
4. Test the real scanning experience

### For Production Deployment:

1. **Replace QR Code Simulation:**
   - Integrate a real QR code scanner library (e.g., `html5-qrcode`, `react-qr-reader`)
   - Replace the demo scanning in `/app/scan/page.tsx`

2. **Add Backend:**
   - Connect to a database (PostgreSQL, MongoDB, etc.)
   - Store user data and contest entries
   - Implement authentication if needed

3. **Customize Locations:**
   - Edit `/lib/locations.ts` to add your participating businesses
   - Update icons, names, addresses, and descriptions

4. **Update Prizes:**
   - Modify contest details in `/app/contest/page.tsx`
   - Adjust prize information to match your campaign

## 🏗️ Project Structure

```
passport/
├── app/
│   ├── page.tsx              # Home page with passport view
│   ├── scan/
│   │   └── page.tsx          # QR code scanner page
│   ├── contest/
│   │   └── page.tsx          # Contest entry form
│   ├── success/
│   │   └── page.tsx          # Success confirmation page
│   ├── demo/
│   │   └── page.tsx          # Demo QR codes and reset
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles
├── components/
│   ├── Header.tsx            # App header component
│   ├── ProgressBar.tsx       # Progress tracking component
│   └── StampCard.tsx         # Individual stamp card component
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── locations.ts          # Location data and utilities
│   └── storage.ts            # Local storage management
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: { ... },  // Main brand color
  accent: { ... },   // Secondary brand color
}
```

### Locations

Edit `lib/locations.ts` to add/remove locations:

```typescript
export const LOCATIONS: Location[] = [
  {
    id: 'loc1',
    name: 'Your Business Name',
    address: '123 Main St, Richmond Hill',
    description: 'Description of the business',
    imageUrl: '/images/locations/your-business.jpg',
  },
  // Add more locations...
]
```

### Replacing Placeholder Images

The app currently uses SVG placeholders for location images. To replace them with actual photos:

1. Take high-quality photos of each business (landscape orientation, 16:9 ratio recommended)
2. Optimize images for web (recommended: 800x450px, JPEG format, compressed)
3. Place images in `public/images/locations/`
4. Update the `imageUrl` in `lib/locations.ts` to point to your images
5. Supported formats: JPG, PNG, WebP

Example:
```typescript
imageUrl: '/images/locations/downtown-coffee.jpg',
```

### Animations

Customize animations in `tailwind.config.ts`:

```typescript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in',
  'slide-up': 'slideUp 0.5s ease-out',
  'stamp': 'stamp 0.6s cubic-bezier(0.36, 0, 0.66, -0.56)',
  'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}
```

## 🔧 Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📱 Progressive Web App (PWA)

To make this a PWA that users can install on their phones:

1. Add a manifest file at `public/manifest.json`
2. Add service worker for offline support
3. Add meta tags for app icons in `app/layout.tsx`

## 🎯 Future Enhancements

- [ ] Real QR code camera scanning
- [ ] Backend API integration
- [ ] User authentication
- [ ] Push notifications
- [ ] Social sharing integration
- [ ] Analytics tracking
- [ ] Admin dashboard for businesses
- [ ] Multiple passport campaigns
- [ ] Leaderboards and achievements

## 📄 License

This project is open source and available for customization and commercial use.

## 🤝 Support

For questions or issues, please contact:
- Email: support@passport.com
- Website: https://passport.com

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

