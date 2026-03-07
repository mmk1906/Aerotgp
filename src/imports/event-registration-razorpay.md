Enhance the event registration system of the website by integrating secure payment authentication using Razorpay. The goal is to allow users to register for both free and paid events, while ensuring payment verification before confirming registration.

1. Event Model Update

Modify the event data structure to support paid events.

Each event should contain the following fields:

Event Title
Description
Date
Time
Venue
Registration Deadline
Event Type (Free or Paid)
Price (only if event is paid)
Maximum Participants
Event Poster

If the event type is Free, users should be able to register directly without payment.

If the event type is Paid, the system must require payment before confirming registration.

2. Registration Flow

Implement the following registration process:

Step 1 — User clicks “Register for Event”

The system checks if the event is free or paid.

Step 2 — Free Event

Show registration form

Save user registration details

Confirm registration

Step 3 — Paid Event

Show registration form

After form submission, redirect to Razorpay payment gateway

User completes payment

3. Payment Authentication

After payment is completed:

Verify the payment using Razorpay payment verification

Only confirm the registration if payment verification is successful

Store the following payment details in the database:

User ID
Event ID
Payment ID
Order ID
Payment Status
Registration Status
Registration Date
4. Payment Failure Handling

If the payment fails:

Show error message

Do not register the user for the event

Allow the user to retry payment

5. Admin Dashboard Features

Update the admin dashboard to show event registration details including payment information.

Admin should be able to see:

List of registered users

Payment status (Paid / Pending / Failed)

Total number of participants

Total revenue collected for the event

Admin should also be able to:

Export event registrations as Excel

View payment transaction IDs

Manually approve or reject registrations if necessary

6. Security Requirements

Ensure secure payment handling:

Payment verification must happen on the backend

Do not expose Razorpay secret keys in the frontend

Use environment variables for Razorpay keys

Store keys securely using environment variables.

7. User Experience

The payment experience should be smooth and professional:

Show a clear event summary before payment

Show payment success confirmation

Show payment failure message with retry option

Redirect the user to a confirmation page after successful registration

8. Maintain Existing Design

Do not change the existing website design.

Maintain the current:

Aerospace theme

Dark UI style

Smooth animations

Responsive layout

Only add payment functionality to the event registration system.