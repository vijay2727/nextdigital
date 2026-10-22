# NextDigital India — Official E-Commerce Platform

A modern, high-performance, responsive e-commerce web application built for **NextDigital India** ([nextdigitalindia.com](https://www.nextdigitalindia.com/)).

---

## Tech Stack
- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [React Router v7](https://reactrouter.com/) + [Lucide Icons](https://lucide.dev/)
- **Styling**: Tailored Modern Vanilla CSS (Zero Tailwind, no emojis, strict corporate/enterprise aesthetic)
- **Backend**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) (ES Modules)
- **Product Assets**: Authentic high-resolution imagery from `atoz_product_images`

---

## Quick Start (How to Run)

### 1. Start the Backend API (Port 5000)
```powershell
cd server
npm run dev
```
API runs at: `http://localhost:5000`

### 2. Start the Frontend React Client (Port 5173)
```powershell
cd client
npm run dev
```
Web App runs at: `http://localhost:5173`

---

## Pages & Features

1. **Home (`/`)**:
   - Hero banner highlighting the **NextDigital HY260 PRO Smart Projector** (1080P Full HD, 4K Supported, Android 11).
   - Trust pillars (Free shipping above ₹999, Lowest Price Guarantee, Brand Warranties, After Sales Support).
   - **Flash Deals** showcase with genuine discount calculations.
   - Interactive category tiles.
   - **Explore Our Best Sellers** product grid.
   - Promotional banner for 3-channel car dashcams.
   - **Proud Associations** client logos (Guru Gobind Singh Indraprastha University, Amity, GTB Hospital, IMS, Jaypee, Modern Public School, MSN Labs, and more).

2. **Shop Catalog (`/shop`)**:
   - Category filtering (Projectors, Interactive Panels, CCTV Cameras, Spy Cam, Car Dashcams, HDMI Cables, SSD & Memory Cards).
   - Real-time search by title, subtitle, and specs.
   - Sorting by Price (Low to High, High to Low) and Customer Rating.
   - Discount badges, stock indicators, and instant Add-to-Cart.

3. **Product Detail (`/product/:id`)**:
   - Dynamic gallery with thumbnails.
   - Comprehensive technical specifications table (Resolution, Lumens, OS, Contrast, Warranty).
   - Key highlights with checkmark indicators.
   - Quantity selector with stock verification.
   - Related products recommendation carousel.

4. **Cart Drawer & Checkout (`/checkout`)**:
   - Slide-out cart drawer with live subtotal calculation.
   - Free shipping indicator progress bar.
   - Coupon system: Apply code `NEXTEXCLUSIVE1` to get **₹300 OFF** on orders above ₹1,999.
   - Delivery address form with validation.
   - Payment options: Cash on Delivery (COD), Direct Bank Transfer/NEFT, and Payment Gateway integration placeholder ready for production API keys.

5. **About Us (`/about`)**:
   - NextDigital company story, mission, and the famous **"CCTV Wale & Projector Wale"** brand identity.
   - Verified statistics (5,000+ installations, 50+ institutional partners).

6. **Contact Us (`/contact`)**:
   - Registered Delhi office: `C-76, Street No-7, West Vinod Nagar, Mandawali, Delhi-110092`.
   - Email: `info@cctvwale.com`
   - Helpline: `+91 99995 93931`.
   - Interactive quote & inquiry form sending requests directly to `/api/inquiries`.

7. **Customer Authentication & Account (`/login`, `/register`, `/account`)**:
   - Customer Sign In with Email/Mobile number and password toggle.
   - 1-click **Auto-fill Demo Credentials** (`demo@nextdigital.com` / `password123`) for instant testing.
   - Customer Sign Up with live password strength indicator and default shipping address pre-filling.
   - Forgot Password reset simulation modal.
   - Customer Dashboard (`/account`): My Orders & Shipments history, editable Profile & Shipping Addresses, and VIP Member Benefits.
   - Navbar integration: "Sign In / Welcome" and personalized "Hi, [Name]" status.
   - Checkout integration: Auto pre-fills customer information when logged in for fast 1-click checkout.
