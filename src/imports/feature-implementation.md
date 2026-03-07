The website design and structure are complete, but several sections are currently marked as "Coming Soon" and are not functional. These sections should now be fully developed and activated instead of displaying placeholder content.

Do not create placeholder pages. Instead, implement the complete functionality for these features.

1. Activate Send Message Feature

The Send Message / Contact section currently exists but does not function properly. Implement the full backend logic.

The contact form should collect:

Full Name
Email Address
Phone Number
Subject
Message

When the user submits the form:

The message should be saved in Firebase.

Store the following fields:

name
email
phone
subject
message
date
status (new/read)

After submission:

Display a success message to the user.

Clear the form fields.

2. Admin Dashboard for Messages

Add a Messages section in the Admin Dashboard.

Admin should be able to:

View all incoming messages

See sender details

Mark messages as read

Delete messages if necessary

Display messages in a table format with sorting and search functionality.

3. Replace All "Coming Soon" Sections With Actual Features

Any section currently marked "Coming Soon" must now be fully implemented.

Identify all such sections and develop the actual functionality.

Examples may include:

Clubs

Show all clubs dynamically

Add explore pages for each club

Allow students to apply to clubs

Events

Show upcoming and past events

Allow event registrations

Show event banners and coordinators

Gallery

Display approved photos

Allow users to upload images with admin approval

Blogs / Articles

Allow students or admins to publish blogs

Admin approval system before publishing

Projects / Research

Display aerospace projects

Allow uploading project details and images

4. Dynamic Data Across All Pages

Ensure all sections load data dynamically from the database.

When the admin updates:

events
clubs
gallery
blogs
messages

the updates should automatically appear on:

Home Page
Portal Page
Respective Section Pages

Fix any bugs preventing updates from appearing.

5. Maintain Existing Website Design

Keep the current UI design unchanged:

Aerospace theme

Dark UI

Smooth animations

Responsive layout

Only implement missing features and fix functionality issues.

6. Error Handling and Validation

Add proper validation to all forms.

Ensure:

Required fields cannot be empty

Email formats are validated

Errors are displayed clearly

Goal

Transform the website from a prototype with placeholder sections into a fully functional dynamic department platform where all features are operational.