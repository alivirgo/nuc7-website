# SendGrid API Setup Guide for NUC7

This guide walks you through obtaining a SendGrid API key and connecting it to your NUC7 Cloudflare Worker so that assessment emails are dispatched automatically when students register.

---

## Step 1: Create a SendGrid Account

1. Go to [https://signup.sendgrid.com/](https://signup.sendgrid.com/)
2. Sign up with your email. The **Free Tier** gives you **100 emails/day** — more than enough for NUC7.
3. Complete the account setup wizard (name, company, website).

> **Tip:** Use `nuc7.com` as the website and "Education" as the industry for faster approval.

---

## Step 2: Verify a Sender Identity

SendGrid requires a verified sender before you can send emails.

### Option A: Single Sender Verification (Quick Start)
1. Go to **Settings → Sender Authentication → Single Sender Verification**.
2. Click **Create a Sender**.
3. Fill in:
   - **From Name:** `NUC7 Course Team`
   - **From Email:** `noreply@nuc7.com` (or your personal email to start)
   - **Reply To:** your personal email
4. Click **Create** → Check your inbox → Click the **verification link**.

### Option B: Domain Authentication (Recommended for Production)
1. Go to **Settings → Sender Authentication → Domain Authentication**.
2. Enter `nuc7.com` as the domain.
3. SendGrid will give you **3 CNAME records** to add in your DNS (Cloudflare).
4. In **Cloudflare Dashboard → DNS**, add those 3 CNAME records.
5. Return to SendGrid and click **Verify**.

> Domain authentication prevents your emails from landing in spam.

---

## Step 3: Generate an API Key

1. In SendGrid, go to **Settings → API Keys**.
2. Click **Create API Key**.
3. Name it: `NUC7 Auth Bridge`
4. Select **Restricted Access**:
   - **Mail Send → Full Access** ✅
   - Everything else → No Access
5. Click **Create & View**.
6. **Copy the key immediately** — it will only be shown once.

The key looks like: `SG.xxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 4: Add the Key to Cloudflare Worker

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages → nuc7-auth-bridge → Settings → Variables**.
3. Click **Add Variable**:
   - **Variable Name:** `SENDGRID_API_KEY`
   - **Value:** Paste the `SG.xxx...` key
   - Check **Encrypt** ✅
4. Also add (if not already set):
   - **Variable Name:** `FRONTEND_URL`
   - **Value:** `https://nuc7.com`
5. Click **Save and Deploy**.

---

## Step 5: Test the Integration

1. Go to [https://nuc7.com](https://nuc7.com).
2. Select a course and fill in the registration form.
3. Submit → You should see "Assessment link dispatched to your inbox."
4. Check the email inbox — the assessment link should arrive within 60 seconds.

---

## How It Works in NUC7

```
Student registers on index.html
        ↓
Form submits to auth-bridge /send-registration
        ↓
Worker generates a token + quiz URL
        ↓
Worker calls SendGrid API to send the email
        ↓
Student receives email with quiz link
        ↓
Student passes quiz → gets course access token
```

The relevant code is in `auth-bridge.js` under the `// 3. INTEGRATION: SEND EMAIL (SENDGRID)` section.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Emails going to spam | Set up Domain Authentication (Step 2 Option B) |
| `403 Forbidden` from SendGrid | API key doesn't have Mail Send permission |
| No email received | Check SendGrid **Activity Feed** for delivery status |
| `SENDGRID_API_KEY` not found | Ensure the variable is saved in Cloudflare Worker settings |

---

## Pricing

| Plan | Emails/Day | Cost |
|---|---|---|
| **Free** | 100 | $0 |
| Essentials | 50,000/month | $19.95/mo |
| Pro | 100,000/month | $89.95/mo |

The Free tier is perfect for NUC7's current scale.
