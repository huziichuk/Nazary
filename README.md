# 📝 [Nazary](https://nazary.online) — E2EE Note App

### Link: [https://nazary.online](https://nazary.online)

A note-taking app with end-to-end encryption, tags, and tag-based search.  
Frontend in React. Backend in NestJS. Email verification. JWT with refresh tokens.

---

## ✨ Features

- ✅ Account registration with email confirmation  
- 🔐 End-to-end encryption (client-side only)  
- 🏷️ Tags for notes  
- 🔎 Tag-based search  
- 🖋️ Markdown preview (`react-markdown`)  
- ♻️ Access/Refresh tokens stored in httpOnly cookies  
- 🧾 Swagger API documentation  

---

## 🔐 Security Model (E2EE)

- Encryption happens in the browser **before** sending data to the server.  
- Server stores only ciphertext and metadata (id, tags, owner, timestamps).  
- Encryption key is derived from the user’s secret phrase and **never leaves** the client.  
- Decryption occurs locally in the browser.  
- Uses `crypto-js` (AES-GCM/CFB).  

> Note: if the user forgets their secret, data cannot be recovered.

---

## 🧱 Tech Stack

### Frontend (`client/`)
- React 19 + TypeScript  
- Vite 7  
- React Router 7  
- @tanstack/react-query v5  
- react-hook-form  
- react-markdown  
- axios  
- CSS Modules  
- lucide-react  

### Backend (`server/`)
- NestJS 11 (REST)  
- Prisma 6 + PostgreSQL  
- class-validator / class-transformer  
- @nestjs/jwt + jsonwebtoken  
- bcryptjs  
- cookie-parser  
- Swagger (`swagger-ui-express`, `@nestjs/swagger`)  
- Resend (email)  
- @react-email/components + render (email templates)  
