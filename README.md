# 📦 Product Catalog - Web Application

Functional product catalog application with search, filters, and interactive details.

## ✨ Features

- ✅ **Product listing** with responsive grid
- ✅ **Real-time search** by name, SKU and tags
- ✅ **Dynamic filters** by category and price range
- ✅ **Persistent favorites system** with localStorage
- ✅ **Image carousel** with Swiper
- ✅ **Interactive product details**
- ✅ **Modern styles** with locally compiled Tailwind CSS
- ✅ **No CDN** - Everything from npm

## 📁 Project Structure

```
product-catalog-webapp/
├── html/
│   ├── home.html          # Landing page
│   ├── catalog.html       # Catalog with filters
│   ├── details.html       # Product details
│   └── contact.html       # (Contact page)
├── src/
│   ├── scripts/
│   │   ├── main.js                    # Catalog main script
│   │   ├── details.js                 # Details script
│   │   ├── services/
│   │   │   ├── api.js                 # Fetch functions
│   │   │   ├── inventory.js           # Load XML inventory
│   │   │   ├── pricing.js             # Load JSON pricing
│   │   │   ├── merge.js               # Merge data
│   │   │   ├── filters.js             # Filter logic
│   │   │   └── utils.js               # Utilities
│   │   └── ui/
│   │       ├── renderProducts.js      # Render products grid
│   │       └── renderProductDetails.js # Render details
│   └── assets/
│       └── sprite.svg                 # SVG icons
├── data/
│   ├── inventory.xml      # Catalog with 30 products
│   └── pricing.json       # Prices and promotions
├── styles/
│   ├── input.css          # CSS input file (Tailwind)
│   └── output.css         # Compiled CSS (generated)
├── package.json           # npm dependencies
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

## 🚀 Installation and Usage

### Requirements
- Node.js 16+ (download from https://nodejs.org/)

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile CSS:**
   ```bash
   npm run build
   ```

3. **Development (auto-recompile):**
   ```bash
   npm run watch
   ```

4. **Open in browser:**
   - `html/home.html` - Landing page
   - `html/catalog.html` - Full catalog

## 📦 Dependencies

- **tailwindcss** ^3.4.1 - CSS framework
- **swiper** ^11.0.0 - Image carousel

## 🔧 npm Scripts

```bash
npm run build   # Compile Tailwind CSS
npm run watch   # Monitor CSS changes (development)
npm install     # Install/reinstall packages
```

## 📊 Data

### Inventory (data/inventory.xml)
Contains 30 products with:
- Unique SKU
- Product name
- Category (Electronics, Home, Sports, Office)
- Available stock
- Image URLs
- Features

### Pricing (data/pricing.json)
Contains pricing and details with:
- SKU (key for merging)
- Price in USD
- Promotion percentage (null if not applicable)
- Rating (1-5 ⭐)
- Tags (new, sale, popular)

## 🎨 Customization

### Tailwind CSS
Edit `tailwind.config.js` to change:
- Colors
- Fonts
- Spacing
- Breakpoints

### Product Data
- Edit `data/inventory.xml` to add products
- Edit `data/pricing.json` to update prices

## 🌐 Navigation

- **home.html** → Landing page with catalog link
- **catalog.html** → Complete catalog with search and filters
- **details.html?sku=SKU-XXX** → Product details with carousel

## ✅ Current Status

✅ Project fully functional and restructured
✅ No CDN dependencies
✅ Relative paths corrected in all files
✅ Responsive with compiled Tailwind CSS
✅ Robust filter system
✅ State management with localStorage
✅ Swiper carousel from npm
✅ Consistent navigation between pages

---

**Last update:** January 2026
**Stack:** HTML5 • CSS3 (Tailwind) • JavaScript ES6+ • Node.js

---

## License

This project is intended for learning and portfolio purposes.