# Razorpay Integration - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Create Razorpay Account (2 minutes)
1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click "Sign Up" and create an account
3. Verify your email address
4. Login to your Razorpay Dashboard

### Step 2: Get API Keys (1 minute)
1. In Razorpay Dashboard, navigate to **Settings → API Keys**
2. Click "Generate Test Key" (for development)
3. Copy both:
   - **Key ID** (example: `rzp_test_1DP5mmOlF5G5ag`)
   - **Key Secret** (example: `ThisisASecretkey`)

### Step 3: Configure Your Project (1 minute)
1. Create a `.env` file in your project root:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

2. Edit `.env` and add your keys:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
   VITE_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
   ```

3. Replace `YOUR_KEY_ID_HERE` and `YOUR_KEY_SECRET_HERE` with your actual keys

### Step 4: Test the Integration (1 minute)
1. **Restart your development server** (important for env vars to load)
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. **Login** as a student to your website

3. **Navigate to Events** page

4. **Create a paid event** (if you're admin) or register for an existing paid event

5. When the payment modal opens, use these **test card details**:
   ```
   Card Number: 4111 1111 1111 1111
   CVV: 123
   Expiry: 12/25
   Name: Test User
   ```

6. Complete the payment - you should see a success message!

## ✅ Verification Checklist

After setup, verify these are working:

- [ ] Razorpay SDK loads on Events page
- [ ] Payment modal opens for paid events
- [ ] Test payment completes successfully
- [ ] Registration appears in Admin Dashboard
- [ ] Payment status shows "completed"
- [ ] Payment ID is visible in admin panel
- [ ] Revenue updates correctly

## 🧪 Test Card Details

Use these cards for testing different scenarios:

### Successful Payment
```
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### Failed Payment
```
Card: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

### Payment Requires Authentication
```
Card: 4000 0025 0000 3155
CVV: Any 3 digits
Expiry: Any future date
```

## 🎯 Common Issues & Solutions

### Issue 1: "Razorpay SDK not loading"
**Solution:** Check your internet connection and ensure `https://checkout.razorpay.com/v1/checkout.js` is accessible

### Issue 2: "Invalid Key ID"
**Solution:** 
- Verify you copied the correct Key ID from Razorpay Dashboard
- Ensure `.env` file is in project root
- Restart your development server after adding env variables

### Issue 3: "Payment modal doesn't open"
**Solution:**
- Check browser console for errors
- Verify event is marked as "Paid" type
- Ensure event has a price set

### Issue 4: "Registration not saving after payment"
**Solution:**
- Check Firebase database rules are configured
- Verify user is logged in
- Check browser console for Firebase errors

## 📱 Testing User Flow

### As a Student:
1. Login to your account
2. Go to **Events** page
3. Find a paid event (₹ badge visible)
4. Click **"Register Now"**
5. Click **"Proceed to Payment"**
6. Fill payment details (use test card)
7. Complete payment
8. See success message
9. Check **My Events** in portal

### As an Admin:
1. Login as admin
2. Go to **Admin Dashboard**
3. Click **"Registrations"** tab
4. View payment details for each registration
5. Check Payment ID and Amount columns
6. Approve/reject registrations
7. Export data if needed

## 🔐 Security Reminder

**IMPORTANT:** The current implementation uses frontend mock functions for demo purposes.

### Before Going Live (Production):
1. ✅ Implement backend API for order creation
2. ✅ Implement backend API for payment verification  
3. ✅ Complete Razorpay KYC verification
4. ✅ Switch to live API keys
5. ✅ Enable HTTPS on your domain
6. ✅ Set up Razorpay webhooks (recommended)

See `RAZORPAY_SETUP_INSTRUCTIONS.md` for detailed production deployment guide.

## 🎉 You're All Set!

Your Razorpay integration is now ready for testing. Create some test events and process test payments to verify everything works correctly!

## 📚 Next Steps

1. **Test thoroughly** with different payment scenarios
2. **Create real events** for your department
3. **Configure Firebase rules** (see `FIREBASE_RULES_COPY_PASTE.txt`)
4. **Set up backend APIs** when ready for production
5. **Complete KYC** to go live with real payments

## 💡 Pro Tips

- Use Razorpay Test Mode during development
- Test both successful and failed payment scenarios
- Configure Razorpay webhooks for production
- Monitor transactions in Razorpay Dashboard
- Keep your Key Secret secure at all times

---

**Need help?** Check `RAZORPAY_SETUP_INSTRUCTIONS.md` for detailed documentation or contact Razorpay support at support@razorpay.com
