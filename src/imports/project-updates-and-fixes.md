Proceed with implementing the remaining fixes and improvements in the project. Do not ask additional questions and directly execute the required changes while maintaining the current frontend design.

Follow the tasks below systematically and ensure everything works correctly after implementation.

---

1. Fix Profile Update System

Repair the user profile update functionality so that users can correctly update their profile information.

Ensure the following works properly:

• Profile picture upload
• Updating name
• Updating department
• Updating academic year
• Updating bio or personal description

Requirements:

• Profile picture must upload successfully and store a valid image URL in the database.
• Updated profile data must save correctly.
• Changes must immediately reflect in the user profile and anywhere the user appears (club member lists, portal, etc.).
• Prevent broken image links or failed uploads.

---

2. Add CSV / Excel Export for Club Members

Implement an export feature in the admin dashboard for club management.

Admin should be able to:

• View the full member list for each club
• Download member data as CSV
• Download member data as Excel file

Exported data should include:

• Member name
• Email
• Department
• Year
• Club name
• Role in club
• Join date

Ensure the exported file is properly formatted and downloadable from the admin dashboard.

---

3. Fix Quiz – Student Portal Synchronization

Ensure quizzes are properly connected with the student portal.

The system should work as follows:

• Admin creates quizzes from the admin dashboard
• Quizzes are stored in the database
• The Student Portal fetches quizzes dynamically
• Students can attempt quizzes inside the portal
• Quiz results and scores are saved to the database
• Quiz results appear in the student's academic progress section

Ensure there are no missing or broken connections between quizzes and the portal.

---

4. Implement Member Highlighting System

Verify that the admin can mark specific club members with special roles.

Admin must be able to mark members as:

• Featured Member
• Core Member
• Club Lead

Highlighted members must appear at the top of the club page.

Each member card should display:

• Profile photo
• Name
• Role
• Contribution or achievement

---

5. Add Club Member Data Export

In the club management section of the admin dashboard, create a button to export the club member list.

Admin should be able to download:

• CSV file
• Excel file

Ensure the data exported matches the actual database records.

---

6. Perform Code Cleanup

Audit the project and remove unnecessary files.

Delete:

• Duplicate components
• Unused pages
• Old club logic files
• Unused API routes
• Dead imports
• Test files not used in production

Ensure the project folder structure becomes clean and organized.

---

7. Verify System Stability

After implementing all changes:

• Test profile updates
• Test club member highlighting
• Test CSV and Excel export
• Test quiz display in student portal
• Test quiz result saving
• Ensure admin dashboard actions update the website correctly

Fix any bugs found during testing.

---
