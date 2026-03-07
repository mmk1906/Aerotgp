Create a dedicated Gallery Page for the website where both users and admins can upload photos, but all photos uploaded by users must first be approved by the admin before they appear publicly.

1. Dedicated Gallery Page

Create a new page:

/gallery

This page should display all approved photos in a responsive grid layout.

Each gallery item should include:

Image

Caption

Uploaded by (optional)

Upload date

Event/Category tag (optional)

The page should be fully responsive and follow the existing aerospace theme.

2. Photo Upload Feature

Add an Upload Photo button on the gallery page.

Clicking it should open a photo upload form.

The form should include:

Photo Upload
Caption
Event / Category
Uploader Name
Uploader Email

The uploaded photo should be stored using Cloudinary.

3. Upload Request System

When a normal user uploads a photo, it should not immediately appear in the gallery.

Instead:

The photo should be stored in the database with status Pending

The admin must review the image before publishing

Example data structure stored in Firebase:

gallery
   imageID
      imageURL
      caption
      uploadedBy
      uploadDate
      category
      status (pending / approved / rejected)
4. Admin Approval Dashboard

Add a Gallery Management section in the admin dashboard.

Admin should see a list of uploaded images with:

Image preview

Caption

Uploader details

Upload date

Status

Admin should have the following actions:

Approve Photo
Reject Photo
Delete Photo
5. Gallery Display Logic

The public gallery page should only display photos with status = approved.

Pending or rejected photos should never appear publicly.

6. Admin Upload Privileges

Admins should also be able to upload photos directly.

Photos uploaded by the admin should automatically have status:

approved

So they appear immediately in the gallery.

7. Gallery Categories

Allow images to be categorized for better organization.

Example categories:

Events
Workshops
Projects
Industrial Visits
Aero Club
Campus Activities
Other

Users should be able to filter images by category.

8. Admin Control

Admin should be able to:

Add photos

Approve or reject user uploads

Delete photos

Edit captions

Change categories

The admin interface should be simple and easy for non-technical users.

9. Maintain Existing Design

Do not change the existing website UI.

Keep the current:

Aerospace themed design

Dark UI style

Smooth animations

Responsive layout

Only add the gallery system and approval functionality.