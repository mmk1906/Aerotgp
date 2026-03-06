Create a full-stack, production-ready website platform for an Aeronautical Engineering Department with a premium aerospace theme and an integrated student portal system.

The platform must contain two main sections within one website:

Public Website (accessible to everyone)

Student Portal (accessible after login)

TECH STACK

Use modern scalable technologies:

Next.js (App Router)

Tailwind CSS

Framer Motion for animations

MongoDB or PostgreSQL

Prisma ORM

NextAuth authentication

Role-based access control

Razorpay or Stripe for event payments

Secure API routes

DESIGN STYLE

Create a premium aerospace UI:

Dark navy + matte black + metallic silver theme

Glassmorphism UI cards

Particle background (stars or airflow effect)

Smooth animations and parallax effects

Aircraft themed hero sections

Fully responsive (mobile-first)

Modern professional typography

WEBSITE STRUCTURE

The website must be organized into two sections.

1️⃣ PUBLIC WEBSITE

Accessible without login.

Pages:

Home

Aircraft hero animation

Heading: “Shaping the Future of Flight”

Department highlights

Stats counter

Upcoming events preview

Aero Club preview

About

Department overview

Vision and mission

Labs and infrastructure

Achievements

Faculty

Grid layout with faculty cards:

Photo

Name

Designation

Qualification

Specialization

Email

Academics

Courses offered

Semester subjects

Syllabus download

Academic calendar

Online MCQ test section (login required)

Clubs

Display department clubs.

For Aero Club include:

Club description

Active members with designations

Project showcase

Photo gallery

Project updates

Blogs

Public blog listing with:

Cover image

Title

Author

Date

Category

Only approved blogs appear publicly.

Events

Show upcoming events with:

Title

Description

Date

Venue

Free / Paid label

Users must login to register.

Contact

Department address

Google map

Contact form

Social links

2️⃣ STUDENT PORTAL (LOGIN REQUIRED)

Users must login to access the portal.

Create a modern dashboard UI with sidebar navigation.

Portal sections:

Dashboard

Overview cards

Upcoming events

Notifications

Activity summary

Profile Management

Users can:

Edit personal information

Upload profile photo

Update phone number

Update department and year

Add skills and interests

Change password

My Events

Users can:

View events they registered for

Check status:

Pending

Approved

Rejected

View payment status

Download participation certificates

Event Registration System

Students can register for events.

Event fields:

Event title

Description

Date

Venue

Free or paid

Price

Max participants

Registration deadline

If event is paid:

Redirect to payment gateway

Confirm registration after payment

Admin must approve registrations.

Blogs System

Users can submit blog posts.

Blog submission fields:

Title

Category

Cover image

Blog content (rich editor)

Tags

Features:

Users can edit/delete their blogs

Blog status:

Pending

Approved

Rejected

Only approved blogs appear publicly.

MCQ Test Section

Create an online test platform.

Features:

Students can:

Choose subject quiz

Start timed MCQ test

Navigate questions

Submit answers

View results and score

Quiz data includes:

Question

4 options

Correct answer

Explanation

Aero Club Portal

If user is a club member they can:

Upload gallery photos

Post project updates

View team members

View club announcements

Project update fields:

Project title

Description

Team members

Progress stage

Images

ADMIN DASHBOARD

Admins have full system control.

Admin capabilities:

User Management

View users

Assign roles

Event Management

Create events

Edit events

Delete events

Approve registrations

Blog Moderation

Approve blogs

Reject blogs

Edit blogs

Club Management

Admin can:

Add new clubs

Edit clubs

Delete clubs

Manage club members

Manage gallery

Test Management

Admin can:

Create quizzes

Add MCQ questions

Edit tests

View student results

Analytics

Dashboard shows:

Total users

Total events

Total blog posts

Total registrations

Revenue from paid events

DATABASE MODELS

Include models for:

Users

User profiles

Events

Event registrations

Blogs

Blog approval status

MCQ tests

Questions

Test results

Clubs

Club members

Gallery images

Project updates

SECURITY

Implement:

Role-based authentication

Protected portal routes

Password encryption

Input validation

Duplicate registration prevention

PERFORMANCE

Ensure:

SEO optimization

Fast page loading

Lazy loaded images

Optimized database queries

EXTRA FEATURES

Aircraft takeoff hero animation

Smooth scrolling navigation

Responsive dashboard layout

Professional aerospace aesthetic

Clean scalable folder structure