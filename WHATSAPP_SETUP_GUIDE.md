# 📱 WhatsApp Connection Setup Guide

Complete step-by-step guide to connect WhatsApp to your Contact Center AI application.

## ✅ What's Already Built

Your application already has:
- ✅ WhatsApp API endpoints (`/api/twilio/whatsapp/incoming`, `/api/twilio/whatsapp/send`)
- ✅ Message storage and conversation management
- ✅ AI-powered message processing
- ✅ Media attachment support
- ✅ Webhook handling for incoming messages

## 🚀 Step-by-Step Setup

### Step 1: Get Twilio Account & WhatsApp Number

1. **Sign up for Twilio** (if you don't have an account):
   - Go to: https://www.twilio.com/try-twilio
   - Create a free trial account (includes $15 credit)

2. **Get a WhatsApp-enabled number**:
   - **Option A: Use Twilio WhatsApp Sandbox** (Free, for testing)
     - Go to: https://console.twilio.com/us1/develop/sms/sandbox
     - Follow instructions to join the sandbox
     - You'll get a sandbox number like `+1 415 523 8886`
   
   - **Option B: Get a real WhatsApp Business Number** (Production)
     - Go to: https://console.twilio.com/us1/develop/sms/whatsapp/learn
     - Apply for WhatsApp Business API access
     - This requires Meta Business verification (can take a few days)

### Step 2: Set Up Meta Business Account & Connect to Twilio

**⚠️ IMPORTANT**: For production WhatsApp Business API (not sandbox), you need to connect your phone number to Meta's WhatsApp Business API.

#### 2.1: Access WhatsApp Manager

1. **Go to WhatsApp Manager**: https://business.facebook.com/wa/manage/home
   - If you don't have a Meta Business Account, you'll need to create one first
   - Sign in with your Facebook account or create a new Meta Business Account

2. **Alternative direct link**: https://business.facebook.com/wa/manage/phone-numbers

#### 2.2: Create or Access Your Meta Business Account

1. **Go to Meta Business Suite**: https://business.facebook.com
2. **Create Business Account** (if you don't have one):
   - Click "Create Account" or "Get Started"
   - Enter your business information
   - Verify your email address
   - Complete business verification (may take 1-3 days)

#### 2.3: Set Up WhatsApp Business API

1. **In WhatsApp Manager** (https://business.facebook.com/wa/manage/home):
   - Click **"Get Started"** or **"Add Phone Number"**
   - Select **"Use WhatsApp Business API"** (not WhatsApp Business App)
   - Choose **"Twilio"** as your Business Solution Provider

2. **Add Your Phone Number**:
   - Enter your Twilio phone number (e.g., `+1234567890`)
   - Click **"Next"** or **"Add Number"**

3. **Verify Your Phone Number**:
   - Meta will send a verification code via SMS or phone call
   - **See `WHATSAPP_VERIFICATION_GUIDE.md`** for detailed verification steps
   - Enter the verification code when prompted

#### 2.4: Connect Twilio to Meta

1. **In Twilio Console**: https://console.twilio.com
   - Go to: **Messaging** → **Try it out** → **Send a WhatsApp message**
   - Or go to: **Phone Numbers** → **Manage** → **Active Numbers** → Your WhatsApp number

2. **Complete Twilio WhatsApp Setup**:
   - Follow Twilio's setup wizard
   - You'll need:
     - **Phone Number ID** (from Meta WhatsApp Manager)
     - **Business Account ID** (from Meta)
     - **Access Token** (from Meta, if required)

3. **Get Your Meta Credentials**:
   - **Phone Number ID**: WhatsApp Manager → Settings → Phone Numbers → Your Number → Copy Phone Number ID
   - **Business Account ID**: WhatsApp Manager → Settings → Business Settings → Copy Business Account ID

#### 2.5: Complete Business Verification (Required for Production)

1. **In WhatsApp Manager** → **Settings** → **Business Verification**:
   - Submit required business documents
   - Complete business information
   - Wait for approval (usually 1-3 business days)

2. **Alternative: Use Display Name Only** (Faster for demos):
   - In Twilio WhatsApp setup, choose **"Use a display name only"**
   - Skip phone number verification temporarily
   - Complete business verification later
   - See `WHATSAPP_VERIFICATION_ALTERNATIVES.md` for details

#### Quick Links Reference

- **WhatsApp Manager**: https://business.facebook.com/wa/manage/home
- **Phone Numbers Management**: https://business.facebook.com/wa/manage/phone-numbers
- **Meta Business Suite**: https://business.facebook.com
- **Twilio WhatsApp Setup**: https://console.twilio.com/us1/develop/sms/whatsapp/learn
- **Twilio Console**: https://console.twilio.com

### Step 3: Get Your Twilio Credentials

1. **Go to Twilio Console**: https://console.twilio.com
2. **Find your credentials**:
   - **Account SID**: Dashboard → Account Info (starts with `AC...`)
   - **Auth Token**: Dashboard → Account Info (click "Show" to reveal)
   - **Phone Number**: Phone Numbers → Manage → Active Numbers

### Step 4: Configure Environment Variables

1. **Create/Update `.env.local`** in your project root:

```bash
# Twilio Configuration (REQUIRED)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Your App URL (for webhooks)
# For local development, use ngrok: https://your-ngrok-url.ngrok-free.app
# For production, use your Vercel URL: https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app-url.com
```

**Important Notes**:
- Replace `TWILIO_WHATSAPP_NUMBER` with your actual WhatsApp number in format: `whatsapp:+14155238886`
- If using sandbox, the number format is: `whatsapp:+14155238886`
- Never commit `.env.local` to git (it should be in `.gitignore`)

### Step 5: Deploy Your Application (or use ngrok for local)

#### Option A: Deploy to Vercel (Recommended for Production)

1. **Deploy to Vercel**:
   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Add WhatsApp integration"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to: https://vercel.com
   - Import your GitHub repository
   - Add environment variables in Vercel Dashboard → Settings → Environment Variables
   - Deploy

3. **Get your Vercel URL**: `https://your-project.vercel.app`

#### Option B: Use ngrok for Local Testing

1. **Install ngrok**: https://ngrok.com/download
2. **Start your Next.js app**:
   ```bash
   pnpm dev
   ```
3. **Start ngrok** (in another terminal):
   ```bash
   ngrok http 3000
   ```
4. **Copy the HTTPS URL**: `https://xxxx-xxxx-xxxx.ngrok-free.app`
   - ⚠️ **Note**: ngrok URLs change each time you restart ngrok

### Step 6: Configure Twilio Webhooks

1. **Go to Twilio Console**: https://console.twilio.com
2. **Navigate to**: Phone Numbers → Manage → Active Numbers
3. **Click** on your WhatsApp-enabled number
4. **Scroll to "Messaging"** section
5. **Configure "A MESSAGE COMES IN" webhook**:
   - **URL**: `https://your-app-url.com/api/twilio/whatsapp/incoming`
     - Replace `your-app-url.com` with your Vercel URL or ngrok URL
   - **Method**: `HTTP POST`
   - Click **"Save"**

6. **Configure "STATUS CALLBACK URL"** (Optional but recommended):
   - **URL**: `https://your-app-url.com/api/twilio/whatsapp/webhook`
   - **Method**: `HTTP POST`
   - Click **"Save"**

### Step 7: Join WhatsApp Sandbox (If Using Sandbox)

If you're using Twilio's WhatsApp Sandbox:

1. **Get your sandbox code**:
   - Go to: https://console.twilio.com/us1/develop/sms/sandbox
   - You'll see a code like `join <code-word>`

2. **Send the join message**:
   - Open WhatsApp on your phone
   - Send the join code to the sandbox number (e.g., `join code-word` to `+1 415 523 8886`)
   - You'll receive a confirmation message

3. **Add your phone number**:
   - In Twilio Console → Sandbox settings
   - Add your phone number to the allowed list

### Step 8: Test Your Integration

1. **Send a test WhatsApp message**:
   - Open WhatsApp on your phone
   - Send a message to your Twilio WhatsApp number
   - Example: "Hello, I need help with my account"

2. **Check if it's working**:
   - **Vercel Logs**: Go to Vercel Dashboard → Your Project → Logs
   - **Supabase**: Check `cc_conversations` and `cc_messages` tables
   - **Your App**: Check the inbox at `/inbox` (after logging in)

3. **Expected behavior**:
   - ✅ Message appears in your database
   - ✅ Conversation is created
   - ✅ AI processes the message (if configured)
   - ✅ Response is sent back (if AI is enabled)

### Step 9: Verify Everything Works

Run these checks:

- [ ] Environment variables are set correctly
- [ ] Webhook URL is configured in Twilio Console
- [ ] Webhook URL is accessible (try opening it in browser - should return 405 Method Not Allowed)
- [ ] WhatsApp sandbox joined (if using sandbox)
- [ ] Test message received and stored
- [ ] Conversation appears in your app's inbox

## 🐛 Troubleshooting

### Webhook Not Receiving Messages

1. **Check webhook URL**:
   - Must be `https://` (not `http://`)
   - No trailing slashes
   - URL is publicly accessible

2. **Test webhook endpoint**:
   ```bash
   curl -X POST https://your-app-url.com/api/twilio/whatsapp/incoming
   ```
   - Should return 400 (Bad Request) or 200, not 404

3. **Check Twilio logs**:
   - Go to: Twilio Console → Monitor → Logs → Messaging
   - Look for webhook delivery errors

### Messages Not Appearing in Database

1. **Check Supabase connection**:
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
   - Check Supabase Dashboard → Logs

2. **Check Vercel logs**:
   - Look for errors in webhook processing
   - Check for database connection errors

### "Invalid webhook URL" Error

- Ensure URL uses HTTPS
- Remove trailing slashes
- Verify URL is accessible from internet
- Check if ngrok is running (if using ngrok)

### Sandbox Not Working

- Make sure you've sent the join code
- Verify your phone number is added to sandbox
- Check sandbox number is correct in environment variables
- Wait a few minutes after joining

## 📋 Quick Checklist

- [ ] Twilio account created
- [ ] WhatsApp number obtained (sandbox or production)
- [ ] **Meta Business Account created** (for production)
- [ ] **WhatsApp Manager accessed** (https://business.facebook.com/wa/manage/home)
- [ ] **Phone number added to Meta WhatsApp Manager**
- [ ] **Phone number verified** (SMS or phone call)
- [ ] **Twilio connected to Meta WhatsApp Business API**
- [ ] Environment variables configured (`.env.local`)
- [ ] App deployed (Vercel) or ngrok running (local)
- [ ] Webhooks configured in Twilio Console
- [ ] WhatsApp sandbox joined (if using sandbox)
- [ ] Test message sent and received
- [ ] Messages appearing in database
- [ ] Conversations visible in app inbox

## 🎯 Next Steps After Setup

Once WhatsApp is connected:

1. **Customize Auto-Responses**: Edit AI agent responses in your supervisor workflow
2. **Add Media Support**: Test sending/receiving images, videos, documents
3. **Set Up Production**: Apply for WhatsApp Business API if using sandbox
4. **Monitor Usage**: Check Twilio Console for message usage and costs
5. **Configure Business Hours**: Set up automated responses for after-hours

## 📚 Additional Resources

- **WhatsApp Manager**: https://business.facebook.com/wa/manage/home
- **Meta Business Suite**: https://business.facebook.com
- **Twilio WhatsApp Docs**: https://www.twilio.com/docs/whatsapp
- **Twilio WhatsApp Setup**: https://console.twilio.com/us1/develop/sms/whatsapp/learn
- **WhatsApp Verification Guide**: See `WHATSAPP_VERIFICATION_GUIDE.md`
- **Verification Alternatives**: See `WHATSAPP_VERIFICATION_ALTERNATIVES.md`
- **Webhook Setup**: See `docs/TWILIO_WEBHOOK_SETUP.md`
- **API Documentation**: See `docs/contracts/CHANNELS_CONTRACT.md`

## 💡 Pro Tips

1. **Use Vercel for Production**: More reliable than ngrok for webhooks
2. **Monitor Twilio Costs**: WhatsApp messages cost ~$0.005 per message
3. **Test Thoroughly**: Send various message types (text, media, emojis)
4. **Set Up Alerts**: Configure Twilio webhook error alerts
5. **Keep ngrok URL Updated**: If using ngrok, update webhook URL when it changes

---

**Need Help?** Check the troubleshooting section above or review the existing documentation files in the `docs/` folder.

