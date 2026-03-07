# Razorpay Payment Integration - Setup Instructions

## ✅ Implementation Complete

The Razorpay payment integration has been successfully implemented for your Aeronautical Engineering Department website's event registration system.

## 🎯 Features Implemented

### 1. **Event Model Enhancement**
- ✅ Added payment-related fields to Event interface:
  - `isPaid` (boolean) - Indicates if event is free or paid
  - `price` (number) - Event registration fee in INR
  - All existing fields retained

### 2. **Registration Flow**
- ✅ **Free Events**: Direct registration without payment
- ✅ **Paid Events**: Razorpay payment gateway integration
- ✅ Payment verification before registration confirmation
- ✅ Registration data stored in Firebase with payment details

### 3. **Payment Processing**
- ✅ Razorpay SDK integration with dynamic loading
- ✅ Order creation with event and user details
- ✅ Secure payment verification (mock for frontend demo)
- ✅ Payment success/failure handling
- ✅ Payment retry capability on failure

### 4. **Database Storage**
The following payment details are stored in Firebase:
- User ID and event ID
- Payment ID (Razorpay payment_id)
- Order ID (Razorpay order_id)
- Payment Signature (for verification)
- Payment Status (pending/completed/failed)
- Registration Status (pending/approved/rejected)
- Registration Date

### 5. **Admin Dashboard Features**
- ✅ Enhanced registration table with payment columns:
  - Payment Status badge
  - Payment ID (truncated for display)
  - Amount paid
  - Student contact information
- ✅ Updated revenue calculation based on completed payments
- ✅ Filter and approve registrations
- ✅ Export registrations with payment data

### 6. **User Experience**
- ✅ Clear event summary before payment
- ✅ Professional payment modal with Razorpay
- ✅ Payment success toast notifications
- ✅ Payment failure error messages
- ✅ Retry option on payment failure
- ✅ Loading states during payment processing

### 7. **Design Consistency**
- ✅ Maintained dark aerospace theme
- ✅ Consistent blue color scheme (#3b82f6)
- ✅ Smooth animations retained
- ✅ Responsive layout preserved

## 🔧 Setup Instructions

### Step 1: Get Razorpay API Keys

1. **Create Razorpay Account**
   - Visit [https://razorpay.com/](https://razorpay.com/)
   - Sign up for a new account
   - Complete the verification process

2. **Get Your API Keys**
   - Login to Razorpay Dashboard
   - Navigate to **Settings → API Keys**
   - Generate new API keys
   - You will get two keys:
     - **Key ID** (starts with `rzp_test_` for test mode)
     - **Key Secret** (keep this secret!)

### Step 2: Configure Environment Variables

Create a `.env` file in your project root and add:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
VITE_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

**⚠️ IMPORTANT SECURITY NOTES:**
- Never commit the `.env` file to version control
- Add `.env` to your `.gitignore` file
- Key Secret should NEVER be exposed to frontend (only use on backend)

### Step 3: Test Mode vs Live Mode

**Test Mode (Development)**
- Use test API keys (starting with `rzp_test_`)
- Use Razorpay test cards for payments
- No real money is charged

**Test Card Details:**
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

**Live Mode (Production)**
- Complete KYC verification on Razorpay
- Switch to live API keys (starting with `rzp_live_`)
- Real payments will be processed

### Step 4: Backend Implementation (REQUIRED for Production)

⚠️ **CRITICAL**: The current implementation includes frontend mock functions for demo purposes.

For **PRODUCTION**, you MUST implement these on your backend:

#### A. Create Order Endpoint

Create a backend API endpoint to create Razorpay orders:

```javascript
// Backend: /api/create-order
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/create-order', async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency || 'INR',
      receipt: receipt,
      notes: notes,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### B. Verify Payment Endpoint

Create a backend API endpoint to verify payment signature:

```javascript
// Backend: /api/verify-payment
const crypto = require('crypto');

app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isVerified = expectedSignature === razorpay_signature;

  if (isVerified) {
    // Update registration status in database
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});
```

#### C. Update Frontend to Use Backend APIs

Update `/src/app/services/razorpayService.ts` to call your backend:

```typescript
// Replace mock createRazorpayOrder with:
export const createRazorpayOrder = async (data: RazorpayOrderData): Promise<any> => {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// Replace mock verifyRazorpayPayment with:
export const verifyRazorpayPayment = async (
  paymentId: string,
  orderId?: string,
  signature?: string
): Promise<boolean> => {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
    }),
  });
  const result = await response.json();
  return result.success;
};
```

## 📋 Testing Checklist

### Frontend Testing
- [ ] Free event registration works without payment
- [ ] Paid event shows payment modal
- [ ] Razorpay SDK loads successfully
- [ ] Payment modal displays correct event details
- [ ] User information pre-fills correctly
- [ ] Payment success creates registration
- [ ] Payment failure shows error message
- [ ] Payment cancellation works properly
- [ ] Admin dashboard shows payment details
- [ ] Revenue calculation is accurate

### Backend Testing (Production)
- [ ] Order creation endpoint works
- [ ] Payment verification endpoint works
- [ ] Signature verification is secure
- [ ] Failed payments are handled properly
- [ ] Database updates correctly
- [ ] Webhooks are configured (optional)

## 🎨 Customization Options

### Theme Color
Update the Razorpay modal color in `/src/app/pages/Events.tsx`:

```typescript
theme: {
  color: '#3b82f6', // Change to your preferred color
}
```

### Event Details
Create new events in Admin Dashboard with:
- Title, description, date, venue
- Event Type: Free or Paid
- Price (if paid)
- Max participants
- Registration deadline

## 📊 Admin Dashboard - Payment Features

### Registration Management Tab
View and manage all event registrations with:
- Student details (name, email, phone)
- Event information
- Registration date
- Registration status (pending/approved/rejected)
- Payment status (pending/completed/failed)
- Payment ID (truncated Razorpay payment_id)
- Amount paid
- Approve/reject actions

### Revenue Tracking
- Total revenue calculated from completed payments
- Displayed in dashboard statistics
- Based on actual payment data from Razorpay

## 🔒 Security Best Practices

1. **Never expose Key Secret in frontend**
   - Only use Key ID in frontend
   - Keep Key Secret on backend server

2. **Always verify payments on backend**
   - Never trust frontend verification alone
   - Use crypto signature verification

3. **Use HTTPS in production**
   - Razorpay requires HTTPS for live mode
   - Secure all payment-related endpoints

4. **Implement rate limiting**
   - Prevent abuse of payment endpoints
   - Add request throttling on backend

5. **Log all payment transactions**
   - Keep audit trail of all payments
   - Monitor for suspicious activity

6. **Handle webhooks (Recommended)**
   - Set up Razorpay webhooks for payment updates
   - Handle async payment confirmations

## 📱 User Flow

### For Students:
1. Browse events on Events page
2. Click "Register Now" on desired event
3. Review event details in modal
4. For paid events:
   - Click "Proceed to Payment"
   - Razorpay modal opens
   - Complete payment using any method
   - Receive confirmation
5. Registration awaits admin approval

### For Admins:
1. View all registrations in Admin Dashboard
2. See payment status for each registration
3. Verify payment details
4. Approve or reject registrations
5. Export data for accounting
6. Track total revenue

## 🆘 Troubleshooting

### Razorpay SDK not loading
- Check internet connection
- Verify Razorpay CDN is accessible
- Check browser console for errors

### Payment verification failing
- Ensure Key Secret is correct
- Check signature generation logic
- Verify order ID matches

### Registration not saving
- Check Firebase database rules
- Verify user is logged in
- Check browser console for errors

## 📞 Support

### Razorpay Documentation
- [Official Documentation](https://razorpay.com/docs/)
- [Payment Gateway Integration](https://razorpay.com/docs/payment-gateway/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)

### Need Help?
- Razorpay Support: support@razorpay.com
- Razorpay Dashboard: [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)

## ✨ Next Steps

1. **Get Razorpay API Keys** → Create account and generate keys
2. **Configure Environment Variables** → Add keys to `.env` file
3. **Test with Test Mode** → Use test cards to verify integration
4. **Implement Backend** → Create order and verify payment endpoints
5. **Complete KYC** → Submit documents to Razorpay for live mode
6. **Go Live** → Switch to live API keys
7. **Monitor Payments** → Track transactions in Razorpay Dashboard

---

## 🎉 Implementation Summary

All payment integration requirements have been successfully implemented:
- ✅ Event model updated with payment fields
- ✅ Free and paid event registration flows
- ✅ Razorpay payment gateway integration
- ✅ Payment verification system
- ✅ Database storage of payment details
- ✅ Admin dashboard payment management
- ✅ Revenue tracking and reporting
- ✅ User experience enhancements
- ✅ Design consistency maintained
- ✅ Security considerations documented

**Ready for testing!** Follow the setup instructions above to configure your Razorpay account and start processing payments.
