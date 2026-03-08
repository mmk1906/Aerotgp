The Clubs Page is currently incomplete and not functioning as expected. Perform a complete redesign and functional improvement of the Clubs module so that it becomes a fully interactive system connecting users and the admin dashboard.

Do not only fix UI issues — also fix backend logic, database structure, and data flow.

### 1. Create Proper Club Structure

Each club should have the following sections visible on the club page:

* Club Overview
* Club Description
* Club Achievements
* Active Members Section
* Member Progress Section
* Club Events
* Join Club Button

Make the club page visually organized and easy to navigate.

### 2. Add Active Members Section

Create a dedicated **Active Members** section on each club page that displays:

* Member photo
* Member name
* Role in the club (Member / Core Member / Lead / Coordinator)
* Short contribution description

This section must fetch data dynamically from the database.

### 3. Member Progress Tracking System

Add a **Member Progress System** where each club member can track their development inside the club.

Each member profile should include:

* Projects completed
* Tasks contributed
* Achievements or milestones
* Participation in events
* Skill development progress

Members should be able to update their own progress through their user dashboard.

### 4. Admin Member Highlight Feature

The admin must have the ability to **highlight important members**.

Admin controls should include:

* Highlight member of the month
* Feature top contributors
* Mark core team members
* Upload member photos
* Edit member roles
* Remove members from club

Highlighted members should appear in a **Featured Members section** on the club page.

### 5. Fix Join Club Form

The **Join Club Form is currently not working properly**. Fix the entire workflow.

Correct workflow should be:

User clicks **Join Club**
→ User fills form
→ Data is stored in the database with status **Pending**
→ Admin receives application in admin dashboard
→ Admin can **Approve or Reject**

After approval:

* User automatically appears in the club's member list
* User gets access to update their club progress.

### 6. User Club Dashboard

Create a **Club Dashboard for Members** where users can:

* View their club membership
* Update their club progress
* Upload project work or achievements
* See tasks assigned by the club

### 7. Admin Club Management Panel

Improve the admin dashboard to fully manage clubs.

Admin must be able to:

* Add clubs
* Edit club information
* Delete clubs
* Manage club members
* Approve or reject join requests
* Highlight top members
* Upload member photos
* Edit member roles

### 8. Fix Database Connections

Ensure that all club data is properly stored and retrieved from the database.

Collections should include:

clubs
clubMembers
clubApplications
memberProgress

Each record should contain proper IDs linking users to clubs.

### 9. Improve UI and Layout

Improve the clubs page layout so that it includes:

* Club banner or cover image
* Club statistics (members count, projects, achievements)
* Member showcase grid
* Progress cards for members
* Clear join button

The design should remain consistent with the aerospace-themed website.

### 10. Ensure Real-Time Updates

Whenever admin or users update club information:

* The club page must refresh automatically
* Member updates should appear instantly
* New members should appear immediately after approval

### Final Goal

Transform the Clubs Page from a static page into a **dynamic club management system** where:

* Users can join clubs
* Members can track their progress
* Admin can manage and highlight members
* Club activities and contributions are visible
* The page stays consistent with the rest of the website.
