The current Blog section is not functioning properly and lacks consistency between the Admin dashboard, User portal, and the public Blog page. The blog system should be redesigned and rebuilt to ensure proper functionality, smooth workflow, and a professional layout.

The goal is to create a fully dynamic blog system where users can submit blogs, admins can review and manage them, and approved blogs appear on the public blog page automatically.

1. Rebuild the Blog Page

The current blog page is not satisfactory and needs to be redesigned and structured properly.

Create a clean and modern /blogs page that displays all published blogs.

Each blog card should include:

Blog Cover Image

Blog Title

Author Name

Short Preview (first 2–3 lines)

Publish Date

Category or Tag

"Read More" Button

Example layout:

Blog Image
Blog Title
Author Name • Date
Short preview text...
[ Read More ]

Clicking Read More should open the full blog article.

2. Dedicated Blog Article Page

Each blog should have its own page.

Example route:

/blogs/blog-id

The blog article page should include:

Blog title

Cover image

Author name

Publish date

Full blog content

Related blogs section

3. Blog Submission by Users

Allow users to submit blogs from the user portal.

Create a Submit Blog form with the following fields:

Blog Title
Blog Category
Blog Cover Image
Blog Content
Author Name
Author Email

Images should be uploaded and stored using Cloudinary.

4. Blog Approval System

When a user submits a blog:

The blog should be saved with status Pending

It should not appear publicly until approved

Example database structure in Firebase:

blogs
   blogID
      title
      content
      imageURL
      author
      category
      date
      status (pending / approved / rejected)
5. Admin Blog Management

Create a Blog Management section in the Admin Dashboard.

Admin should be able to:

View all blog submissions

Preview blogs

Approve blogs

Reject blogs

Edit blog content

Delete blogs

Publish blogs

Admin-approved blogs should automatically appear on the public blog page.

6. Consistency Between Admin, User Portal, and Blog Page

Ensure all three areas are connected and synchronized:

User Portal

Users should be able to:

Submit blogs

See status of submitted blogs (Pending / Approved / Rejected)

Admin Dashboard

Admins should be able to:

Review submissions

Approve or reject blogs

Edit blog content

Public Blog Page

Only approved blogs should appear publicly.

Any changes made by the admin should immediately update the blog page.

7. Fix Existing Bugs

Resolve the following issues:

Blogs not appearing after submission

Blogs not syncing between admin and public pages

Images not loading correctly

Blog content not displaying properly

Updates not reflecting across pages

Ensure the entire blog system works dynamically and consistently.

8. Improve Blog Page Design

Improve the blog UI to make it more professional.

Add:

Search blogs feature

Category filter

Latest blogs section

Featured blog section

Pagination or load more button

9. Maintain Existing Website Theme

Do not change the overall website design.

Maintain:

Aerospace themed UI

Dark theme

Smooth animations

Responsive layout

Only improve functionality and structure of the blog system.