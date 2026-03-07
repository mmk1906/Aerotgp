The website is mostly complete in terms of UI and structure, but there are several functional issues and inconsistencies across the system. Perform a complete technical audit and fix all architecture problems so the website becomes a fully functional dynamic platform.

Do not only patch small bugs — analyze the full data flow between the frontend, backend, admin dashboard, and database and fix the root causes.

1. Fix Data Synchronization Across the Entire Website

Currently, updates made by the admin do not consistently appear on the website pages.

Ensure that all sections fetch data dynamically from Firebase.

Sections that must sync correctly:

Blogs

Events

Clubs

Gallery

Faculty

Quizzes

Messages

Event registrations

When admin performs the following actions:

Add
Edit
Delete
Approve
Reject

the changes must immediately reflect on:

Home Page
Portal
Public Pages
Admin Dashboard

Fix all data-fetching logic so every page retrieves the latest data from the database.

2. Fix Admin Dashboard CRUD Operations

Many admin features are currently not working properly.

Ensure complete CRUD functionality (Create, Read, Update, Delete) for the following sections:

Blogs

Admin must be able to:

Approve blog submissions

Reject blogs

Edit blogs

Delete blogs

Publish blogs

Clubs

Admin must be able to:

Add clubs

Edit club details

Delete clubs

Manage club members

Faculty

Admin must be able to:

Add faculty

Edit faculty details

Delete faculty members

Quizzes

Admin must be able to:

Add quizzes

Add questions

Edit quizzes

Delete quizzes

Events

Admin must be able to:

Add events

Edit event details

Delete events

View registrations

3. Fix Image Upload System

Images uploaded on the website must be stored and retrieved properly using Cloudinary.

Fix the following problems:

Images saving in wrong folders

Images disappearing after login or page refresh

Image URLs not being saved in the database

Ensure the upload process works as follows:

Upload Image
→ Store image in Cloudinary
→ Get secure image URL
→ Save URL in Firebase database
→ Display image using the saved URL
4. Fix User and Admin Workflow

Ensure proper workflow between users and admin.

Blog Workflow
User submits blog
→ Blog stored with status "pending"
→ Admin reviews blog
→ Admin approves or rejects
→ Approved blogs appear on public blog page
Gallery Workflow
User uploads image
→ Image status = pending
→ Admin approves image
→ Approved images appear in gallery
Club Applications
User applies to club
→ Application stored
→ Admin reviews application
→ Admin approves or rejects
5. Fix Routing and Page Linking

Currently some pages are not properly connected.

Ensure proper routing between:

Home
Blogs
Clubs
Gallery
Faculty
Events
Portal
Admin Dashboard

Fix broken links and ensure navigation works smoothly across all sections.

6. Improve Database Structure

Ensure the database structure is organized properly.

Example structure:

users
blogs
events
clubs
faculty
gallery
quiz
messages
registrations

Each collection should have properly defined fields and unique IDs.

7. Fix UI State and Refresh Problems

Fix issues where:

Pages do not update after admin actions

Data disappears after login

UI shows outdated information

Ensure the frontend re-fetches data properly after any update.

8. Improve Admin Dashboard Usability

Make the admin dashboard easier to use.

Add:

Clear navigation sidebar

Separate management sections

Edit and delete buttons for each item

Confirmation dialogs before deletion

The dashboard must be simple enough for non-technical admins to manage the website.

9. Error Handling and Validation

Add proper validation for all forms.

Ensure:

Required fields cannot be empty

Email formats are validated

File uploads have size limits

Error messages are displayed clearly

10. Maintain Existing Design

Do not change the website design.

Keep the current:

Aerospace theme

Dark UI style

Smooth animations

Responsive layout

Only fix functionality and improve the system architecture.

Final Goal

Transform the website from a partially functional prototype into a stable production-ready platform where:

Admin can fully manage all sections

Users can interact with features smoothly

Data updates appear instantly across the entire website

No inconsistent information appears on different pages.