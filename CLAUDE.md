# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application for a lifting diary course, built with:
- **Next.js 16.1.0** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Tailwind CSS 4** (with @tailwindcss/postcss)
- **ESLint 9** (with Next.js config)

## Documentation Reference

**CRITICAL: ALWAYS consult the `/docs` directory FIRST before generating any code.**

Before writing or modifying code:
1. Check for relevant documentation files in `/docs` directory
2. Review the official documentation for the technology/library you're working with
3. Follow patterns and conventions specified in the docs
4. If no docs exist for a specific feature, create documentation as you implement

All code generation must be informed by and consistent with the documentation in `/docs`.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### App Router Structure
This project uses Next.js App Router (not Pages Router). All routes are defined in the `app/` directory:
- `app/layout.tsx` - Root layout with Geist fonts (sans and mono) and global styles
- `app/page.tsx` - Homepage/root route
- `app/globals.css` - Global styles with Tailwind CSS and custom theme variables

### Styling System
- **Tailwind CSS 4** is configured with PostCSS plugin (`@tailwindcss/postcss`)
- Uses CSS custom properties for theming (`--background`, `--foreground`)
- Dark mode support via `prefers-color-scheme` media query
- Custom theme variables defined inline in `globals.css` using `@theme inline`
- Geist fonts are loaded via `next/font/google` and exposed as CSS variables

### TypeScript Configuration
- Path alias: `@/*` maps to project root
- Target: ES2017
- Module resolution: `bundler`
- React JSX runtime (no need to import React in components)
- Strict mode enabled

### ESLint Configuration
Uses Next.js recommended configs:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Conventions

### File Structure
- Use lowercase with hyphens for directories (e.g., `app/user-profile/`)
- Use PascalCase for React component files (e.g., `UserProfile.tsx`)
- Server Components by default (no "use client" needed unless using hooks/interactivity)

### Styling
- Use Tailwind utility classes for styling
- Reference theme variables: `bg-background`, `text-foreground`
- Font variables available: `font-sans`, `font-mono`

### Images
- Use `next/image` component for all images
- Public assets go in `public/` directory
- Reference with leading slash (e.g., `/logo.svg`)
