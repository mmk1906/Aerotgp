Create a full-stack, production-ready website for an Aeronautical Engineering Department with a premium aerospace theme and integrated event management system.

TECH STACK:
- Next.js (App Router)
- Tailwind CSS
- Framer Motion animations
- MongoDB (or PostgreSQL)
- Prisma ORM
- NextAuth (Authentication)
- Role-based access control
- Admin dashboard
- Payment gateway integration (Razorpay or Stripe for optional paid events)

DESIGN STYLE:
- Dark navy, matte black, metallic silver theme
- Aerospace-inspired UI
- Subtle particle background (starfield or airflow effect)
- Glassmorphism cards
- Fully responsive (mobile-first design)
- Smooth animations and parallax effects

-------------------------------------
PAGES & FEATURES
-------------------------------------

1) HOME PAGE
- Full-screen hero with aircraft or wind tunnel visual
- Animated heading: “Shaping the Future of Flight”
- Quick stats counter
- Department highlights
- Upcoming events preview
- Call-to-action buttons (Explore | Register for Events)

2) ABOUT PAGE
- Department overview
- Vision & Mission
- Labs and infrastructure
- Achievements

3) FACULTY PAGE
- Grid layout with filters
- Faculty card:
  - Photo
  - Name
  - Designation
  - Qualification
  - Specialization
  - Email

4) CLUBS PAGE
- Aero Club section
- Project showcase
- Gallery
- Join Club button

5) ACADEMICS PAGE
- Courses offered
- Semester-wise subjects
- Download syllabus option
- Academic calendar

6) CONTACT PAGE
- Address
- Google Maps embed
- Contact form
- Social links

-------------------------------------
AUTHENTICATION SYSTEM
-------------------------------------

Create secure login & registration system with:

User Roles:
- Student
- Admin

Student Capabilities:
- Register account
- Login
- View upcoming events
- Register for events
- View registration status (Pending / Approved / Rejected)
- Download participation certificate (after approval)
- View payment status (if event is paid)

Admin Capabilities:
- Secure admin dashboard
- Create/Edit/Delete events
- Set event as:
  - Free
  - Paid (with configurable price)
- Define:
  - Event date
  - Maximum seats
  - Registration deadline
- View all registered students
- Approve or reject registrations
- Manually mark payment as verified (or auto-verify if integrated)
- Export registration list (CSV)
- Generate certificates

-------------------------------------
EVENT REGISTRATION SYSTEM
-------------------------------------

Event Model:
- Event ID
- Title
- Description
- Date
- Venue
- Free or Paid (Boolean)
- Price (if paid)
- Max participants
- Registration deadline
- Status (Upcoming / Ongoing / Completed)

Registration Model:
- Student ID
- Event ID
- Registration timestamp
- Approval status (Pending / Approved / Rejected)
- Payment status (Not Required / Pending / Paid)

If event is paid:
- Redirect to payment gateway
- Only confirm registration after payment success

-------------------------------------
ADMIN DASHBOARD UI
-------------------------------------
- Sidebar navigation
- Analytics overview:
  - Total students
  - Total events
  - Total registrations
  - Revenue (if paid events)
- Event management panel
- Registration approval panel
- Certificate generation module

-------------------------------------
SECURITY
-------------------------------------
- Role-based route protection
- Secure API routes
- Form validation
- Password encryption
- Prevent duplicate event registrations
- Email confirmation on registration

-------------------------------------
PERFORMANCE
-------------------------------------
- SEO optimized
- Lazy loading images
- Optimized database queries
- Fast loading

-------------------------------------
EXTRA
-------------------------------------
- Aircraft takeoff animation in hero
- Smooth navbar scroll effect
- Professional aerospace aesthetic
- Clean scalable folder structure