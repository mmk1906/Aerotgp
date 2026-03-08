The current implementation of the Clubs system, Student Portal, Profile system, and Quiz integration is not functioning correctly and does not follow the required workflow. Perform a full refactor of these modules while keeping the existing frontend design unchanged.

Do not add unnecessary features, questions, or forms. Implement only the exact functionality described below.

---

1. Fix the Clubs Page Structure

The Clubs page must properly display all clubs available in the platform.

Each club should contain:

• Club name
• Club description
• Club banner or logo
• Active members section
• Core team section
• Achievements or activities

The Clubs page must dynamically fetch data from the database so that any changes made by the admin appear immediately on the website.

---

2. Remove the Join Aeroclub Section from the Student Portal

The Student Portal currently contains a **Join Aeroclub section**, which should be completely removed.

Instead, create a section called:

**“My Clubs”**

Inside this section users should see:

• Clubs they have already joined
• A button called **Join Club**

When the user clicks Join Club, they should be able to join any available club.

Do not ask unnecessary questions in the form. Only collect essential information.

---

3. Fix Join Club Workflow

The Join Club form must be simple and functional.

Correct workflow:

User selects a club
→ User submits join request
→ Data stored in database
→ Admin sees the request in admin dashboard
→ Admin approves or rejects the request

After approval:

• The user automatically appears in the club members list
• The club appears inside the user's **My Clubs** section

---

4. Special Rule for Aerocious Club

There is a special club called **Aerocious**.

For this club:

• Users cannot directly add members themselves
• Only the admin can add members manually
• The Aerocious form must only allow admin-controlled membership

All other clubs can allow normal join requests.

---

5. Admin Club Management System

The Admin Dashboard must allow full control of all clubs.

Admin must be able to:

• Add clubs
• Edit existing clubs
• Delete clubs
• Add members manually
• Remove members
• View club member lists
• Download club member data

The admin must be able to **download member data as CSV or Excel format**.

---

6. Highlight Active Members

Admin must have the option to highlight important members.

For each club the admin should be able to mark members as:

• Active Member
• Core Member
• Club Lead
• Featured Member

Highlighted members must appear at the top of the club page.

Each member card should display:

• Profile photo
• Name
• Role
• Contribution or achievement

---

7. Fix User Profile Update System

The user profile update feature is currently broken.

Fix the system so users can properly update:

• Profile picture
• Name
• Department
• Year
• Bio or description

Ensure:

• Profile picture uploads correctly
• Data saves correctly in the database
• Updated information reflects immediately on the website

---

8. Fix Quiz and Student Portal Synchronization

The Quiz system must properly connect with the Student Portal.

Fix the logic so that:

• Quizzes appear inside the Student Portal
• Users can attempt quizzes
• Scores are stored in the database
• Quiz results appear in the user's academic progress section

Ensure quizzes are correctly connected with the Academics module.

---

9. Fix Data Synchronization

Currently there is poor synchronization between:

• Admin dashboard
• Student portal
• Public website

Fix all database connections so that:

Admin changes → update website instantly
User updates → reflect in admin dashboard
Quiz results → update in user portal

---

10. Remove Unnecessary Files and Broken Logic

Audit the project and remove:

• Duplicate club components
• Unused forms
• Old API routes
• Broken club logic
• Unused profile components

Simplify the codebase so that the system becomes stable and maintainable.

---

Final Goal

The platform should function as a clean and stable system where:

• Users can join clubs through the My Clubs section
• Admin can manage all clubs and members easily
• Admin can highlight active members
• Admin can download club member data
• Aerocious club membership is controlled only by admin
• User profiles update correctly
• Quiz system syncs properly with the Student Portal
• All modules stay synchronized across the platform.
