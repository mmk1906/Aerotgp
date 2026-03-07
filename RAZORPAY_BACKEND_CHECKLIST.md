# Razorpay Backend Implementation Checklist

## ⚠️ IMPORTANT: Production Security Requirements

The current implementation includes **frontend mock functions** for demonstration purposes. Before going live with real payments, you **MUST** implement proper backend APIs.

## 🎯 Why Backend is Required

### Security Issues with Frontend-Only Implementation:
1. ❌ **Key Secret exposed** - Anyone can view your secret key in browser
2. ❌ **Payment verification bypass** - Users could fake payment success
3. ❌ **Order manipulation** - Malicious users could alter payment amounts
4. ❌ **No audit trail** - Difficult to track and verify real payments
5. ❌ **Compliance violations** - PCI-DSS requires server-side processing

### Benefits of Backend Implementation:
1. ✅ **Secure key storage** - Keys never exposed to frontend
2. ✅ **Verified payments** - Cryptographic signature verification
3. ✅ **Immutable orders** - Server controls all payment parameters
4. ✅ **Complete audit** - Full transaction logging
5. ✅ **PCI compliant** - Meets payment industry standards

---

## 📋 Implementation Checklist

### Phase 1: Setup Backend Server

#### Option A: Node.js/Express Backend
- [ ] Install required packages:
  ```bash
  npm install express razorpay cors dotenv
  ```
- [ ] Create `/backend` directory
- [ ] Set up Express server
- [ ] Configure environment variables
- [ ] Enable CORS for your frontend domain

#### Option B: Firebase Cloud Functions
- [ ] Initialize Firebase Cloud Functions
  ```bash
  firebase init functions
  ```
- [ ] Install Razorpay SDK in functions directory
  ```bash
  cd functions && npm install razorpay
  ```
- [ ] Configure function environment variables
- [ ] Deploy functions to Firebase

#### Option C: Other Backends (Python/Django, PHP/Laravel, etc.)
- [ ] Choose appropriate Razorpay SDK for your language
- [ ] Set up REST API endpoints
- [ ] Configure CORS and security headers

---

### Phase 2: Implement Order Creation Endpoint

#### Requirements:
- [ ] Create `POST /api/create-order` endpoint
- [ ] Validate user authentication
- [ ] Validate event exists and is paid
- [ ] Calculate order amount from event price
- [ ] Create Razorpay order using backend SDK
- [ ] Store order details in database
- [ ] Return order ID to frontend

#### Node.js/Express Example:
```javascript
const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  try {
    // 1. Authenticate user
    const userId = req.user.id; // from auth middleware
    
    // 2. Validate request
    const { amount, eventId, currency } = req.body;
    if (!amount || !eventId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // 3. Verify event price matches
    const event = await getEventFromDB(eventId);
    if (event.price * 100 !== amount) {
      return res.status(400).json({ error: 'Amount mismatch' });
    }
    
    // 4. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // in paise
      currency: currency || 'INR',
      receipt: `event_${eventId}_${userId}_${Date.now()}`,
      notes: {
        eventId: eventId,
        userId: userId,
      },
    });
    
    // 5. Store order in database
    await saveOrderToDB({
      orderId: order.id,
      userId: userId,
      eventId: eventId,
      amount: amount,
      status: 'created',
    });
    
    // 6. Return order details
    res.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});
```

#### Checklist:
- [ ] Endpoint validates user authentication
- [ ] Amount is verified against event price
- [ ] Order is created with Razorpay SDK
- [ ] Order details are logged to database
- [ ] Error handling is implemented
- [ ] Response includes order ID

---

### Phase 3: Implement Payment Verification Endpoint

#### Requirements:
- [ ] Create `POST /api/verify-payment` endpoint
- [ ] Validate user authentication
- [ ] Receive payment details from frontend
- [ ] Verify signature using crypto
- [ ] Update registration in database
- [ ] Send confirmation email (optional)
- [ ] Return verification result

#### Node.js/Express Example:
```javascript
const crypto = require('crypto');

router.post('/verify-payment', async (req, res) => {
  try {
    // 1. Authenticate user
    const userId = req.user.id;
    
    // 2. Extract payment details
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
    } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }
    
    // 3. Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    const isVerified = expectedSignature === razorpay_signature;
    
    if (!isVerified) {
      // Log failed verification attempt
      await logFailedPayment({
        userId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        reason: 'Signature verification failed',
      });
      
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
    
    // 4. Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    // 5. Update registration in database
    await createEventRegistration({
      userId: userId,
      eventId: eventId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentSignature: razorpay_signature,
      amount: payment.amount,
      status: 'pending', // Awaiting admin approval
      paymentStatus: 'completed',
      createdAt: new Date(),
    });
    
    // 6. Send confirmation email (optional)
    await sendConfirmationEmail(userId, eventId);
    
    // 7. Return success
    res.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment',
    });
  }
});
```

#### Checklist:
- [ ] Endpoint validates user authentication
- [ ] Signature is verified cryptographically
- [ ] Payment details are fetched from Razorpay
- [ ] Registration is created in database
- [ ] Payment amount is validated
- [ ] Failed verifications are logged
- [ ] Success/failure is properly communicated

---

### Phase 4: Update Frontend to Use Backend APIs

#### File: `/src/app/services/razorpayService.ts`

Replace mock functions with API calls:

```typescript
// Replace createRazorpayOrder
export const createRazorpayOrder = async (data: RazorpayOrderData): Promise<any> => {
  try {
    const response = await fetch('https://your-backend.com/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // Add auth token
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Order creation error:', error);
    throw error;
  }
};

// Replace verifyRazorpayPayment
export const verifyRazorpayPayment = async (
  paymentId: string,
  orderId?: string,
  signature?: string,
  eventId?: string
): Promise<boolean> => {
  try {
    const response = await fetch('https://your-backend.com/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // Add auth token
      },
      body: JSON.stringify({
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
        eventId: eventId,
      }),
    });
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};
```

#### Checklist:
- [ ] Remove mock implementations
- [ ] Add API base URL configuration
- [ ] Include authentication headers
- [ ] Handle API errors properly
- [ ] Add loading states
- [ ] Test with backend APIs

---

### Phase 5: Set Up Webhooks (Recommended)

Webhooks provide real-time payment notifications even if user closes browser.

#### Setup Steps:
1. [ ] Create webhook endpoint: `POST /api/razorpay-webhook`
2. [ ] Configure webhook URL in Razorpay Dashboard
3. [ ] Implement webhook signature verification
4. [ ] Handle different event types:
   - `payment.captured` - Payment successful
   - `payment.failed` - Payment failed
   - `order.paid` - Order completed
5. [ ] Update registration status based on webhook
6. [ ] Send email notifications

#### Node.js/Express Example:
```javascript
router.post('/razorpay-webhook', async (req, res) => {
  try {
    // 1. Verify webhook signature
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // 2. Process webhook event
    const event = req.body.event;
    const payload = req.body.payload.payment.entity;
    
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;
      default:
        console.log('Unhandled event:', event);
    }
    
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});
```

#### Checklist:
- [ ] Webhook endpoint created
- [ ] URL configured in Razorpay Dashboard
- [ ] Signature verification implemented
- [ ] Payment events handled
- [ ] Database updated on events
- [ ] Email notifications sent

---

### Phase 6: Testing

#### Test Scenarios:
- [ ] **Successful Payment Flow**
  - Create order via backend
  - Complete payment with test card
  - Verify payment signature
  - Check registration created
  - Verify email sent

- [ ] **Failed Payment Flow**
  - Create order via backend
  - Fail payment intentionally
  - Check error handling
  - Verify no registration created

- [ ] **Webhook Testing**
  - Trigger webhook from Razorpay Dashboard
  - Verify signature validation
  - Check database updates
  - Confirm email notifications

- [ ] **Security Testing**
  - Try payment without authentication
  - Try tampering with payment amount
  - Try replaying old signatures
  - Test rate limiting

#### Checklist:
- [ ] All test cards work correctly
- [ ] Webhooks are received and processed
- [ ] Database updates are correct
- [ ] Emails are sent properly
- [ ] Error cases are handled
- [ ] Security tests pass

---

### Phase 7: Production Deployment

#### Prerequisites:
- [ ] Complete Razorpay KYC verification
- [ ] Switch to live API keys
- [ ] Enable HTTPS on domain
- [ ] Configure production database
- [ ] Set up monitoring and logging

#### Deployment Steps:
1. [ ] Update `.env` with live keys
2. [ ] Deploy backend to production server
3. [ ] Update frontend API URLs
4. [ ] Configure Razorpay webhook URL
5. [ ] Test with real payment (small amount)
6. [ ] Monitor first few transactions
7. [ ] Set up alerts for failed payments

#### Checklist:
- [ ] Live keys configured
- [ ] HTTPS enabled
- [ ] Webhooks working
- [ ] Monitoring active
- [ ] Error logging enabled
- [ ] Backup systems ready

---

## 🔒 Security Best Practices

- [ ] Never expose Key Secret in frontend code
- [ ] Always verify signatures on backend
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on API endpoints
- [ ] Log all transactions for audit
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement proper authentication
- [ ] Validate all user inputs

---

## 📚 Additional Resources

### Official Documentation:
- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Payment Gateway Integration Guide](https://razorpay.com/docs/payment-gateway/)
- [Webhook Documentation](https://razorpay.com/docs/webhooks/)
- [Signature Verification](https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/)

### SDK References:
- [Node.js SDK](https://github.com/razorpay/razorpay-node)
- [Python SDK](https://github.com/razorpay/razorpay-python)
- [PHP SDK](https://github.com/razorpay/razorpay-php)
- [Java SDK](https://github.com/razorpay/razorpay-java)

---

## ✅ Final Pre-Launch Checklist

Before accepting real payments:

- [ ] Backend APIs implemented and tested
- [ ] Payment verification working correctly
- [ ] Webhooks configured and tested
- [ ] KYC completed with Razorpay
- [ ] Live keys configured
- [ ] HTTPS enabled
- [ ] All test scenarios passed
- [ ] Monitoring and logging active
- [ ] Error handling comprehensive
- [ ] Security audit completed
- [ ] Team trained on payment flow
- [ ] Support process defined
- [ ] Refund process documented

---

## 🆘 Need Help?

- **Razorpay Support**: support@razorpay.com
- **Documentation**: https://razorpay.com/docs/
- **Dashboard**: https://dashboard.razorpay.com/

---

Remember: **Never go live with frontend-only payment processing!** Always implement proper backend verification before accepting real payments.
