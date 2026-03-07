Fix Clubs Section and Resolve Website Data Synchronization Bugs

The Aeronautical Department website design is excellent, but there are several functional issues and inconsistencies across the website that need to be fixed. The goal is to make the system fully dynamic, bug-free, and synchronized across all pages.


---

1. Fix Clubs Section (Major Issue)

The current Clubs section is not satisfactory and needs to be rebuilt properly.

Create a clean and dynamic clubs system.

Clubs Page

Create a dedicated /clubs page that displays all clubs dynamically.

Each club card should include:

Club Logo

Club Name

Short Description

Explore Button


Example:

Aero Club
Description about Aero Club
[ Explore ]

The clubs must be loaded dynamically from the database so that when the admin adds or edits a club, the change appears automatically.


---

2. Dedicated Club Pages

Each club must have its own dedicated page.

Example routes:

/clubs/aero-club
/clubs/robotics-club
/clubs/coding-club

Each club page should contain:

Club introduction

Club banner or logo

Club members with roles

Club projects

Club achievements

Club gallery

Events conducted by the club

Join Club button



---

3. Join Club Feature

Add a Join Club form.

Form fields:

Full Name
Department
Year
Email
Phone Number
Skills / Interests
Why do you want to join

The form submissions should be saved in Firebase and visible to the admin dashboard.

Admin should be able to:

Approve or reject applications

Export data as Excel

Manage members



---

4. Admin Control for Clubs

Admin should have full control over the clubs section through the dashboard.

Admin should be able to:

Add new clubs

Edit club details

Delete clubs

Upload club logos

Manage club members

Upload club gallery images

Edit club descriptions


Images should be stored using Cloudinary.


---

5. Fix Data Synchronization Bugs

Currently, information across the website pages is not consistent.

Examples of problems:

Updates made by admin are not reflected everywhere

Home page shows outdated information

Portal page shows different information

Club updates do not appear in the clubs page


Fix this by ensuring:

All pages fetch data from a single database source

After create/edit/delete actions, the frontend refreshes the data automatically

Implement proper API fetching or real-time listeners


When admin updates something, the change should appear on:

Home Page
Portal Page
Clubs Page
Events Page
Blogs Page


---

6. Home Page Updates Not Showing

Fix the issue where updates made in the admin panel are not reflected on the home page.

Examples:

Latest events

Blogs

Announcements

Clubs


The home page should always display the latest data from the database.


---

7. Portal Page Data Issue

The user portal should display the same updated information as the main website.

Ensure:

Registered events appear correctly

Club applications appear correctly

User information updates correctly

Data is synced with the database



---

8. Fix General Website Bugs

Perform a complete bug fix across the website:

Fix broken buttons

Fix incorrect routing

Fix pages not loading data

Fix forms not saving data

Fix admin actions not updating UI

Fix navigation inconsistencies


Ensure the entire website works smoothly without errors.


---

9. Maintain Current Design

Do not change the existing design.

Keep the current:

Aerospace theme

Dark navy color palette

Glassmorphism UI

Animations

Responsive layout


Only fix functionality and improve the clubs system.


---

10. Final Goal

The website should function like a fully dynamic department platform where:

Admin can manage everything easily

Users can explore clubs and apply

Data updates appear instantly across all pages

No inconsistent or outdated information appears anywhere.