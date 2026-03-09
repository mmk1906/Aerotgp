Perform a complete improvement and cleanup of the **User Portal**. The portal currently has several non-functional features and unnecessary sections that make the interface confusing. Refactor the portal so it becomes clean, functional, and properly synchronized with the public website and the admin dashboard.

Do not redesign the overall theme. Improve functionality, simplify the interface, and ensure all core features work properly.

---

1. Fix the User Profile Update System

The **Update Profile** feature is currently not working correctly.

Repair the functionality so users can successfully update:

• Profile picture
• Full name
• Department
• Academic year
• Bio or description

Ensure:

• Profile picture uploads correctly
• Image URL is saved in the database
• Updated information is stored successfully
• Changes reflect immediately in the user profile and portal

---

2. Fix Change Password Function

The **Change Password** feature must work properly.

Correct workflow:

User enters current password
→ System verifies the current password
→ User enters new password
→ New password is securely updated

Ensure:

• Password validation works correctly
• Proper error messages appear if verification fails
• Passwords are securely stored and updated

---

3. Add Show / Hide Password Option

Improve the login and registration forms by adding a **Show / Hide Password** toggle.

Requirements:

• Add an eye icon inside the password field
• When clicked, the password becomes visible
• Clicking again hides the password

This feature should be available on:

• Login page
• Registration page
• Change password page

---

4. Remove Unnecessary Portal Sections

The portal currently contains unnecessary sections that are not being used.

Remove the following features:

• Attendance
• Academics
• Assignments
• Results
• Resources

These sections should not appear in the portal anymore.

---

5. Sync Portal Features with Public Website

The portal should display only the features that exist on the public website and are controlled by the admin.

For example, if the admin adds or edits sections such as:

• Clubs
• Events
• Quiz / MCQ
• Faculty
• Gallery

Then those sections should automatically appear inside the User Portal.

Ensure the portal dynamically fetches the same data shown on the public website.

---

6. Fix Data Synchronization

Currently there is poor synchronization between:

• Admin dashboard
• Public website
• User portal

Fix the backend logic so that:

Admin updates → appear instantly on website
Website data → appears correctly in user portal
User updates → save correctly in database

---

7. Improve Portal Layout

Make the user portal cleaner and easier to navigate.

Implement:

• Simple dashboard layout
• Clear navigation sidebar
• Organized feature sections

Avoid overcrowding the interface with unused features.

---

8. Remove Broken Code

Audit the portal system and remove:

• Unused components
• Old API routes
• Broken form handlers
• Duplicate files

Ensure the codebase becomes clean and maintainable.

---

9. Test All Portal Features

After implementing improvements verify that the following work correctly:

• User login
• User registration
• Profile update
• Profile picture upload
• Password change
• Club joining
• Quiz access
• Event registration

Ensure all features save and fetch data correctly.

---

Final Goal

Transform the user portal into a clean and fully functional system where:

• Users can update their profiles
• Users can change passwords securely
• Login and registration forms are improved with password visibility
• Unnecessary sections are removed
• Portal features match the public website
• Data stays synchronized with the admin dashboard
