The website currently has Razorpay integrated for event payments. Remove the Razorpay integration and replace it with a manual payment system using QR code or payment details. The goal is to allow students to register for events and upload their payment proof.

1. Remove Razorpay Integration

Completely remove Razorpay from the event registration system.

Remove:

Razorpay checkout scripts

Payment APIs

Razorpay order creation logic

Payment verification logic

Event registrations should no longer depend on Razorpay payments.

2. Event Creation Improvements (Admin Panel)

Enhance the Admin Event Creation section so the admin can add more details when creating an event.

Admin should be able to add:

Event Title
Event Description
Event Date
Event Time
Venue
Registration Deadline
Event Banner Image
Coordinator Name
Coordinator Contact Number
Event Type (Free or Paid)
Registration Limit
Payment QR Code / Payment Details Image

If the event is Free, users can register directly.

If the event is Paid, the payment QR code image uploaded by admin should be displayed on the event registration page.

All event images (banner and QR code) should be stored using Cloudinary.

3. Event Registration Form

Create a detailed registration form that works for both internal students and students from other colleges.

Form fields should include:

Full Name
Email Address
Phone Number
Department
Year
College Name
City
Are you from this college? (Yes/No)
Team Name (optional)
Number of participants (if team event)

If the event is paid, add additional fields:

Transaction ID
Upload Payment Receipt Image

The receipt image must be uploaded and stored in Cloudinary.

4. Registration Flow

The registration process should work as follows:

Free Event

User fills registration form

Submit form

Registration saved successfully

Paid Event

User fills registration form

QR code / payment details image is displayed

User completes payment using the QR code

User uploads payment receipt image

User enters transaction ID

Form submission saved

5. Admin Dashboard for Event Registrations

Create a section in the admin dashboard where admin can see all event registrations.

Admin should see:

Participant Name
Email
Phone Number
College Name
Event Name
Transaction ID
Receipt Image
Registration Date
Approval Status

Admin should be able to:

View receipt images

Verify transaction IDs

Approve or reject registrations

Export registration data to Excel

6. Data Storage

Event registrations should be stored in Firebase.

Example structure:

events
   eventID
      title
      description
      bannerImage
      coordinatorName
      coordinatorContact
      paymentQR

registrations
   registrationID
      eventID
      name
      email
      phone
      college
      transactionID
      receiptImage
      status
7. User Experience

Improve the user experience by:

Showing event banner on registration page

Displaying coordinator contact number

Showing payment instructions clearly

Showing confirmation message after submission

Allowing users to check their registration status

8. Maintain Website Design

Keep the current website design and theme unchanged:

Aerospace theme

Dark UI

Smooth animations

Fully responsive layout

Only update the event registration system functionality.