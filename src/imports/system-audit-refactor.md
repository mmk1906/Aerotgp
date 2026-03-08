The platform currently has multiple functional issues in the Clubs system, MCQ quizzes, Events section, and User Profile management. These modules are not properly synchronized between the user portal, admin dashboard, and the database.

Perform a **full system audit and refactor** to fix these issues. Do not apply temporary patches. Instead, analyze the current architecture and correct the data flow, APIs, and database structure.

Keep the existing frontend design unchanged.

---

1. Fix Clubs System for Users

The current Clubs section is not functioning properly and users cannot join clubs.

Rebuild the join system so it works correctly.

Correct workflow:

User selects a club
→ User clicks **Join Club**
→ Join request stored in database
→ Request appears in admin dashboard
→ Admin approves request
→ Approved user automatically appears in club member list
→ Club appears in the user's **My Clubs** section

Ensure:

• Users cannot join the same club multiple times
• Join button works correctly
• Member list updates after approval

---

2. Fix MCQ Quiz Synchronization

The MCQ tab is not properly synced with the student portal.

Fix the logic so that:

• Admin can create quizzes from the admin dashboard
• Quizzes are stored correctly in the database
• Student portal fetches quizzes dynamically
• Users can attempt quizzes
• Quiz scores are saved to the database
• Results appear in the student's academic progress section

Ensure quiz data is synchronized across:

• Admin dashboard
• Student portal
• Academics section

---

3. Fix Events Section Synchronization

The Events tab is not properly synced with the website.

Correct workflow should be:

Admin creates event
→ Event saved in database
→ Events page fetches events dynamically
→ Users can view events
→ Users can register for events

Ensure:

• Events appear instantly after admin creates them
• Event registrations are saved properly
• Admin can view event registrations

---

4. Fix User Profile Update System

The profile update system is currently broken.

Fix the functionality so users can successfully update:

• Profile picture
• Name
• Department
• Year
• Bio or description

Ensure:

• Profile picture uploads correctly
• Image URL is stored in database
• Updated data saves successfully
• Changes reflect immediately in the user profile

Prevent broken image uploads or failed saves.

---

5. Fix Change Password System

The Change Password button is not functioning correctly.

Fix the password update workflow:

User enters current password
→ User enters new password
→ System verifies current password
→ New password is securely updated

Ensure:

• Proper password validation
• Password encryption / hashing
• Clear error messages if verification fails

---

6. Fix Data Synchronization

Currently there is poor synchronization between:

• Admin dashboard
• User portal
• Public website

Ensure that when:

Admin updates data → website updates instantly
User updates profile → admin dashboard reflects changes
Quiz results → update in user portal
Club membership → updates across all pages

---

7. Fix Broken APIs and Database Queries

Audit all backend APIs and database queries for:

• Clubs
• Quizzes
• Events
• User profiles

Fix any incorrect queries or missing endpoints that prevent data from saving or fetching properly.

---

8. Remove Broken Code

Clean the codebase by removing:

• Duplicate components
• Old or unused API routes
• Broken form handlers
• Dead code related to clubs, events, and quizzes

Ensure the project structure is clean and maintainable.

---

Final Goal

After implementing these fixes, the platform should function correctly where:

• Users can join clubs successfully
• MCQ quizzes work properly in the portal
• Events appear and sync correctly
• Users can update their profile and profile picture
• Password change functionality works properly
• Admin and user data stays synchronized across the system
