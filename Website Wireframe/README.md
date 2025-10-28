# Paul Jeon - Personal Portfolio

A fast, accessible personal portfolio website built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, WCAG AA compliant
- **Performance**: Optimized images, lazy loading, reduced motion support
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Smooth Animations**: Scroll reveals with reduced motion support
- **Routing**: Client-side routing with React Router

## 📦 Installation

```bash
# Install dependencies
npm install
```

## 🛠️ Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Build

```bash
# Build for production
npm run build
```

The production build will be in the `dist` directory.

## 🚢 Deploy to GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy using GitHub Actions or manually:
   ```bash
   npm run deploy
   ```

3. Or manually push the dist folder to the `gh-pages` branch

## 📁 Project Structure

```
Website Wireframe/
├── src/
│   ├── components/       # React components
│   │   ├── layout/      # Layout components (Navbar, Footer, Container, Section)
│   │   └── ui/          # UI components (Button, Heading, Text, Reveal)
│   ├── pages/           # Page components (Home, Work, About, Contact)
│   ├── lib/             # Utilities and content
│   └── styles/          # Global styles
├── content/             # Content files (JSON)
├── design/              # Design tokens and wireframes
├── public/              # Static assets
└── dist/                # Production build
```

## 🎨 Design Tokens

Design tokens are defined in `design/tokens.ts` and mapped to Tailwind in `tailwind.config.js`. To update:

1. Edit tokens in `design/tokens.ts`
2. Update Tailwind config if needed
3. Rebuild the project

## 📝 Content Management

Content is managed in `content/copy.json`. To update:

1. Edit the JSON file
2. Changes are automatically reflected in the app

## 🧪 Testing

```bash
# Run tests (if configured)
npm test
```

## ♿ Accessibility

This site follows WCAG 2.1 AA guidelines:
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Focus-visible outlines
- Reduced motion support
- Minimum contrast ratios

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License - feel free to use this project as a starting point for your own portfolio.

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!
