Enhance the Clubs section of the Aeronautical Department website by creating a fully dynamic and manageable system where clubs, members, and applications can be easily controlled by the admin.

1. Dynamic Clubs Page

Create a dedicated /clubs page that displays all clubs in the department dynamically.

Each club should appear as a card containing:

Club Logo

Club Name

Short Description

"Explore" Button

Example layout:

Aero Club
Short description of the club
[ Explore ]

The clubs displayed should come from the database so that when the admin adds or edits clubs, the page updates automatically.

2. Dedicated Club Pages

When a user clicks Explore, they should be redirected to a dedicated club page.

Example structure:

/clubs/aero-club
/clubs/robotics-club
/clubs/coding-club

Each club page should contain:

Club introduction

Club logo/banner

Active members with photos and designations

Club achievements

Club projects

Photo gallery

Events organized by the club

Join Club button

3. Join Club Application Form

Clicking Join Club should open a detailed form.

Fields required:

Full Name
Department
Year
Email
Phone Number
Skills / Interests
Previous experience
Why do you want to join this club
Portfolio or LinkedIn (optional)

After submission:

The application should be stored in the database

Admin should be able to review applications from the dashboard

4. Admin Control Panel for Clubs

Create a Club Management section in the Admin Dashboard.

Admin should be able to:

Add Club
Edit Club
Delete Club
Upload club logo
Update club description
Add or remove club members
Upload gallery images
Update projects
View join-club applications

The interface should be simple and user-friendly for non-technical admins.

5. Editing Existing Data

Admin should be able to edit any existing club information, including:

Club name

Description

Members

Gallery

Projects

Events related to the club

Changes made by the admin should immediately update the website.

6. Form Data Export to Excel

For every form in the website (including Join Club, Event Registration, Blog Submission, Contact Forms, etc.):

Automatically save the submitted data

Generate or update an Excel spreadsheet (.xlsx) containing the form responses.

Each form should have its own sheet such as:

JoinClubApplications.xlsx
EventRegistrations.xlsx
BlogSubmissions.xlsx
ContactMessages.xlsx

Each spreadsheet should include:

Name
Email
Phone
Submission Date
Form Details
Status

These spreadsheets should be accessible to the admin for download from the dashboard.

7. Media Storage

All images (club logos, gallery photos, member photos) should be uploaded and stored using Cloudinary.

The database should store only the image URLs, not the files themselves.

8. Maintain Website Design

Keep the existing aerospace theme:

Dark navy / matte black design

Glassmorphism cards

Smooth animations

Fully responsive layout

Only improve functionality without changing the visual style.