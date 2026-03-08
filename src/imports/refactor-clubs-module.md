The current Clubs module is messy, confusing, and not functioning properly. Users cannot join clubs, the admin cannot manage clubs properly, and there is poor synchronization between the admin dashboard, student portal, and website.

Completely refactor and rebuild the Clubs system so it becomes clean, organized, and fully functional. Do not apply small fixes or patches. Instead, redesign the logic and structure while keeping the existing frontend design style.

---

1. Rebuild the Clubs Architecture

Analyze the current Clubs module and remove the messy logic that is causing synchronization problems.

Rebuild the Clubs system with a clean architecture consisting of:

• Clubs database collection
• Club members collection
• Club join requests collection
• Club roles system

Each club should have a unique ID and a clear relationship with its members.

---

2. Simplify the Clubs Page

Redesign the Clubs page so it becomes clean and easy to understand.

Each club card should display:

• Club name
• Club description
• Club logo or banner
• Number of members
• Join button

When users click a club, they should see the **club detail page**.

---

3. Club Detail Page

Each club should have a dedicated page showing:

• Club banner
• Club description
• Achievements or activities
• Active members section
• Core team section
• Featured members section

Members must appear in a clean grid layout with profile photos.

---

4. Fix the Join Club System

The Join Club feature must work properly.

Correct workflow:

User clicks **Join Club**
→ System checks if user already joined
→ If not joined, request is created in database
→ Request appears in admin dashboard
→ Admin approves or rejects request
→ Approved user automatically appears in club member list

Ensure the join system works smoothly without unnecessary forms.

---

5. Create "My Clubs" Section in Student Portal

Inside the student portal create a **My Clubs** section.

Users should see:

• Clubs they have joined
• Clubs they can join
• Join / Leave buttons

The list must update dynamically when the admin approves membership.

---

6. Admin Club Management System

The admin dashboard must fully control clubs.

Admin should be able to:

• Add clubs
• Edit clubs
• Delete clubs
• Approve join requests
• Remove members
• Assign roles to members
• Highlight important members

Roles should include:

• Club Lead
• Core Member
• Active Member
• Featured Member

---

7. Highlight Active Members

Admin must be able to highlight members.

Highlighted members must appear in a **Featured Members section** at the top of the club page.

Each member card must display:

• Profile photo
• Name
• Role
• Short description

---

8. Fix Data Synchronization

Currently the system has poor synchronization.

Fix the logic so that:

• Admin changes update the website instantly
• Approved members appear immediately in the club page
• User portal updates automatically
• Club member counts update automatically

Ensure all pages fetch data dynamically from the database.

---

9. Remove Broken Code

Audit the entire Clubs module and remove:

• Duplicate club components
• Unused forms
• Old API routes
• Broken join logic
• Unused database queries

Clean the codebase so the Clubs module becomes stable and maintainable.

---

10. Maintain Existing Frontend Design

Do not redesign the entire UI.

Keep the current:

• Aerospace themed UI
• Animations
• Dark theme
• Responsive design

Only fix the system structure and functionality.

---

Final Goal

The Clubs module should become a clean and fully functional system where:

• Users can easily join clubs
• Admin can manage clubs and members easily
• Members are displayed properly with roles
• Featured members can be highlighted
• Data stays synchronized across admin dashboard, student portal, and website
