# LLFG Platform Setup Guide

## 1. Twenty CRM (crm.llfg.us)

### What it does
Modern Salesforce alternative — tracks agent pipeline, deals, contacts, and team performance. Already integrated into the portal via `LLFG_CRM` hooks.

### Deploy (free self-hosted)
```bash
git clone https://github.com/twentyhq/twenty.git
cd twenty
docker compose up -d
```

### Connect to LLFG
1. Add CNAME record: `crm.llfg.us` → your server IP
2. In the portal, set: `LLFG_CRM.endpoint = 'https://crm.llfg.us/api'`
3. Generate an API key in Twenty dashboard
4. Set: `LLFG_CRM.apiKey = 'your-key'`

Applications submitted on llfg.us will auto-push to Twenty as leads.

---

## 2. LobeHub AI Assistant (ai.llfg.us)

### What it does
AI-powered assistant for agents — answers product questions, generates scripts, helps with training.

### Deploy (free self-hosted)
```bash
git clone https://github.com/lobehub/lobehub.git
cd lobehub
docker compose up -d
```

Or deploy to Vercel for free: https://github.com/lobehub/lobehub#deploy-with-vercel

### Connect to LLFG
1. Add CNAME record: `ai.llfg.us` → your Vercel/server
2. In the portal: `LLFG_AI.init('https://ai.llfg.us')`

---

## 3. AI Chat Widget (already live)

The landing page chat widget uses a built-in knowledge base. To upgrade to a real AI backend:

1. Get an OpenAI API key
2. Create a Netlify function at `netlify/functions/chat.js`
3. Update `getAIResponse()` in index.html to call the function

---

## Domain Setup (GoDaddy/Netlify DNS)

| Subdomain | Points To | Purpose |
|-----------|-----------|---------|
| llfg.us | Netlify | Main portal |
| crm.llfg.us | Twenty server | CRM |
| ai.llfg.us | LobeHub/Vercel | AI Assistant |
