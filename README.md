# 🎫 Ticketing App

A modern, full-featured ticketing and event management application built with Next.js, TypeScript, and Tailwind CSS.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)

**Live Demo:** [antorip.vercel.app](https://antorip.vercel.app/)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Building & Deployment](#building--deployment)
- [Project Structure](#project-structure)
- [Security](#security)
- [Contributing](#contributing)

---

## ✨ Features

- 🎟️ **Ticket Management** - Create, manage, and track tickets
- 📱 **QR Code Support** - Generate and scan QR codes for tickets
- 📧 **Email Notifications** - Automated email alerts via Nodemailer
- 🔐 **Google Authentication** - Secure login with NextAuth
- 📊 **Google Sheets Integration** - Sync data with Google Sheets
- 📄 **PDF Generation** - Export tickets as PDF documents
- 🎨 **Responsive Design** - Beautiful UI with Framer Motion animations
- ✅ **Form Validation** - Type-safe validation with Zod
- 📱 **Mobile Friendly** - Optimized for all device sizes

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript** - Static type checking
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Backend & Services
- **NextAuth 4** - Authentication & authorization
- **Google APIs** - Sheets, Drive, and OAuth integration
- **Nodemailer** - Email service

### Utilities
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **QR Code Libraries** - QR code generation & scanning
- **React PDF Renderer** - PDF generation

---

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** or **pnpm** or **bun**
- **Git**

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/IzayaRais/ticketing-app.git
cd ticketing-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

---

## 🔐 Environment Setup

### Create `.env.local` file

Copy the following template and fill in your actual credentials:

```bash
# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Google Sheets & Drive
GOOGLE_SHEETS_ID=your_google_sheets_id_here
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
SENDER_EMAIL=noreply@yourdomain.com

# Application
API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ⚠️ Environment Variables Guide

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | Random string for session encryption | Generate with: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | OAuth client ID from Google Cloud Console | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth secret (keep private!) | Set in `.env.local` only |
| `SMTP_PASSWORD` | App-specific password (not your main Google password) | Create in Google Account Security |

---

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

The page will auto-refresh when you edit files.

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## 🏗 Building & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

[Learn more about Vercel deployment](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 📂 Project Structure

```
ticketing-app/
├── src/                          # Source code
│   ├── app/                      # Next.js app directory
│   │   ├── api/                  # API routes
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/               # Reusable React components
│   ├── lib/                      # Utility functions
│   ├── types/                    # TypeScript type definitions
│   └── styles/                   # Global styles
├── public/                       # Static assets
├── data/                         # Data files
├── .env.local                    # Local environment variables (⚠️ never commit)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

---

## 🔒 Security

### Best Practices

✅ **Environment Variables:**
- Never commit `.env.local` or `.env.production.local`
- Use `.env.example` as a template for required variables
- Rotate secrets regularly in production

✅ **API Keys & Credentials:**
- Use `NEXTAUTH_SECRET` for session encryption
- Store all secrets in environment variables only
- Use app-specific passwords for email services

✅ **Dependencies:**
- Keep dependencies up to date: `npm update`
- Audit for vulnerabilities: `npm audit`
- Review security advisories regularly

✅ **Production:**
- Set `NEXTAUTH_URL` to your production domain
- Use HTTPS in production (Vercel handles this)
- Never expose credentials in client-side code

### `.env.local` Protection

This file is automatically ignored by Git (see `.gitignore`). Always use:

```bash
# ✅ Good - Use .env.local
GOOGLE_CLIENT_SECRET=actual_secret

# ❌ Bad - Never hardcode in code
const secret = "xyz123";
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📧 Support

For questions or issues, please [open an issue](https://github.com/IzayaRais/ticketing-app/issues) on GitHub.

---

**Made with ❤️ by [IzayaRais](https://github.com/IzayaRais)**
