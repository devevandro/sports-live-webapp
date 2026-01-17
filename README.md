# Live App - YouTube Lives Viewer

A modern [Next.js 16](https://nextjs.org) application for viewing and managing YouTube sports live streams with a clean, responsive UI.

## 🚀 Technologies Used

- **Framework**: Next.js 16.0.10 with App Router
- **Language**: TypeScript (ES2017)
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Radix UI with shadcn/ui
- **Styling Tools**: Lucide React icons, class-variance-authority, clsx
- **Theme Support**: next-themes for dark/light mode
- **Code Quality**: ESLint

## 📋 Project Structure

```
├── app/
│   ├── api/
│   │   └── youtube-lives/     # API routes for YouTube data
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── globals.css             # Global styles
├── components/
│   ├── youtube-player.tsx       # Video player component
│   ├── video-sidebar.tsx        # Sidebar component
│   └── mobile-video-list.tsx    # Mobile list component
├── lib/
│   └── utils.ts                # Utility functions
└── public/                      # Static assets
```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

The page will auto-update as you edit files in `app/` and `components/` directories.

## TypeScript Configuration

The project uses strict TypeScript settings with:
- Path aliases (`@/*` for root imports)
- Incremental compilation
- React JSX transform
- ES modules

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
