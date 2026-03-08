The website frontend design is good, but the backend architecture is very poorly implemented. There are many bugs, improper data synchronization, and unnecessary files. Perform a **complete backend audit and refactor the system architecture** while keeping the existing frontend design unchanged.

Focus on fixing the functionality, database structure, and admin-user synchronization.

1. Fix Data Synchronization Across the Entire Website

Currently there is no proper sync between:

* Admin Dashboard
* User Portal
* Public Website Pages

When the admin adds, edits, or deletes any data, the changes must immediately reflect on the public website and user dashboards.

Ensure proper real-time data fetching from the database using a consistent data service layer.

All modules that must sync correctly include:

* Clubs
* Faculty
* Events
* Gallery
* Quiz
* Users

Fix all broken API calls, incorrect database queries, and caching issues that prevent real-time updates.

2. Fix Faculty Page Structure

The Faculty page must follow a clear hierarchy.

The **Head of Department (HOD)** must always appear first at the top of the faculty list.

Implement a role-based sorting system where faculty members are ordered like this:

1. HOD
2. Professors
3. Associate Professors
4. Assistant Professors
5. Other Faculty

Add a "role" or "position" field in the faculty database so sorting happens automatically.

Ensure the admin dashboard allows editing:

* Faculty name
* Position
* Department role
* Profile photo
* Description

3. Fix Admin Dashboard Control

The admin dashboard must properly control all website content.

Ensure the admin can:

* Add, edit, and delete faculty
* Add, edit, and delete clubs
* Manage club members
* Add and manage events
* Approve user applications
* Manage gallery images
* Manage quizzes

All admin actions must instantly update the database and refresh on the website.

4. Remove Unnecessary Files and Clean the Codebase

The project currently contains many unnecessary and unused files.

Perform a cleanup and remove:

* Unused components
* Unused API routes
* Duplicate pages
* Old test files
* Unused database models
* Unused image assets
* Dead code and unused imports

The project folder structure should be simplified and organized clearly.

Example clean structure:

/components
/pages
/admin
/services
/database
/utils
/public

Ensure each module is separated logically and easy to maintain.

5. Improve Backend Architecture

Refactor the backend to follow proper architecture.

Create:

* A central API service layer
* Clean database models
* Proper CRUD operations
* Error handling for all requests
* Validation for forms

All modules must interact with the database in a consistent way.

6. Fix Website Data Loading

Fix all issues where:

* Data disappears after refresh
* Updates do not show on the website
* Admin changes do not reflect on the frontend
* Images fail to load properly

Ensure every page fetches the latest data dynamically.

7. Maintain Existing Frontend Design

Do not redesign the frontend.

Keep the existing:

* UI layout
* Aerospace theme
* Animations
* Responsive design

Only improve the backend functionality and system stability.

Final Goal

The website must become a stable, clean, and well-structured platform where:

* Admin dashboard fully controls the content
* User actions sync with the database correctly
* Public website always displays the latest data
* Backend code is clean and maintainable
* No unnecessary files remain in the project
* Faculty hierarchy correctly displays with HOD first.
