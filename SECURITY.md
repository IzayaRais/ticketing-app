# 🔒 Security Guidelines

This document outlines security best practices for the Ticketing App.

---

## 🚨 Critical Security Rules

### ✅ DO

- ✅ Keep all secrets in `.env.local` (never committed)
- ✅ Use `NEXTAUTH_SECRET` for session encryption
- ✅ Rotate secrets regularly in production
- ✅ Use app-specific passwords for email services
- ✅ Enable 2FA on Google Cloud Console and Gmail
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated with `npm audit`
- ✅ Review all environment variables before deployment
- ✅ Use `.env.example` as a template for team members

### ❌ DON'T

- ❌ Never commit `.env.local` to Git
- ❌ Never hardcode secrets in source code
- ❌ Never share credentials via email or chat
- ❌ Never use the same secrets in dev and production
- ❌ Never expose private keys in client-side code
- ❌ Never use main Google password for Gmail API
- ❌ Never commit `credentials.json` or service account files
- ❌ Never push secrets to GitHub, even in private repos

---

## 🔐 Environment Variables Security

### Protected Variables

These variables contain sensitive information and must be kept secret:

```
NEXTAUTH_SECRET          # Session encryption key
GOOGLE_CLIENT_SECRET     # OAuth credential
SMTP_PASSWORD            # Email service password
GOOGLE_DRIVE_FOLDER_ID   # (if used for secure files)
```

### Public Variables (Safe in Code)

These can be visible in client-side bundles:

```
NEXT_PUBLIC_APP_URL      # Application URL
GOOGLE_CLIENT_ID         # OAuth client ID (not secret)
API_BASE_URL             # API endpoint
```

### Setup Checklist

- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all required values
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Run `git status` to ensure `.env.local` is not tracked
- [ ] Never share `.env.local` with others
- [ ] Add same variables to production platform (Vercel, etc.)

---

## 🔑 Credentials Management

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Google Sheets API
   - Google Drive API
   - Google+ API (for OAuth)
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)

**Never commit:**
- `GOOGLE_CLIENT_SECRET`
- Service account JSON files
- API keys

### Gmail SMTP Setup

1. Enable 2-Factor Authentication on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Generate a 16-character app password
5. Use this password in `SMTP_PASSWORD`, NOT your main Gmail password

**Why app passwords?**
- More secure than main password
- Can be revoked independently
- Doesn't compromise main account if leaked

---

## 🚀 Production Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Go to **Settings > Environment Variables**
3. Add all variables from `.env.local`
4. Set different values for production:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `API_BASE_URL=https://yourdomain.com`
   - Fresh credentials recommended

5. Enable **Environment Isolation** (if available)
6. Deploy!

### Pre-Deployment Checklist

- [ ] `NEXTAUTH_SECRET` generated with `openssl rand -base64 32`
- [ ] All API credentials rotated
- [ ] Email credentials are app-specific passwords
- [ ] `NEXTAUTH_URL` matches your domain
- [ ] HTTPS is enforced
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets in source code (grep for "password", "secret", "key")
- [ ] Dependencies audited: `npm audit`

---

## 🕵️ Monitoring & Maintenance

### Regular Audits

```bash
# Check for vulnerable dependencies
npm audit

# Check for outdated packages
npm outdated

# Fix vulnerabilities
npm audit fix
```

### Secret Rotation Schedule

- **Every 90 days:** Rotate `NEXTAUTH_SECRET`
- **Quarterly:** Rotate OAuth credentials
- **When team members leave:** Regenerate all secrets
- **After suspected breach:** Immediately regenerate all credentials

### Monitoring Compromised Credentials

If you suspect credentials are compromised:

1. **Immediately regenerate in Google Cloud Console**
2. **Update all environment variables**
3. **Redeploy application**
4. **Check access logs** for unauthorized activity
5. **Review connected devices** in Google Account

---

## 🛡️ Code Security

### Sensitive Data in Code

❌ **Never do this:**
```typescript
const API_KEY = "sk-1234567890abcdef";
const PASSWORD = "mySecretPassword";
```

✅ **Always do this:**
```typescript
const API_KEY = process.env.GOOGLE_CLIENT_SECRET;
const PASSWORD = process.env.SMTP_PASSWORD;
```

### Client vs Server Code

❌ **Avoid in `app/` or `src/` (client-side):**
```typescript
const secret = process.env.NEXTAUTH_SECRET; // ❌ Wrong!
```

✅ **Only use in `app/api/` (server-side):**
```typescript
// In API route
export async function POST(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET; // ✅ Correct!
}
```

---

## 🚨 Incident Response

### If Credentials Are Leaked

1. **Stop using them immediately**
2. **Regenerate in Google Cloud Console**
3. **Update all environment variables**
4. **Redeploy application**
5. **Check for unauthorized access**
6. **Inform team members**
7. **Document the incident**

### Check Vercel Logs

```bash
# View deployment logs
# In Vercel Dashboard > Project > Deployments > View Logs
```

---

## 📚 Additional Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/deployment/securitymd)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Google Cloud Security](https://cloud.google.com/security)

---

## 👥 For Team Members

### Setting Up Local Development

```bash
# 1. Clone repository
git clone https://github.com/IzayaRais/ticketing-app.git
cd ticketing-app

# 2. Copy environment template
cp .env.example .env.local

# 3. Ask repository owner for .env.local values
# (They should provide it securely, not via email)

# 4. Install and run
npm install
npm run dev
```

**Never share `.env.local` via:**
- Email
- Slack
- GitHub
- Pastebin
- Screen sharing

---

## 📞 Report Security Issues

If you discover a security vulnerability:

1. **Do not open a public issue**
2. **Email security concerns to repository owner**
3. **Include details but no sensitive data**
4. **Wait for acknowledgment before disclosure**

---

**Last Updated:** 2026-05-29
**Review Frequency:** Quarterly
