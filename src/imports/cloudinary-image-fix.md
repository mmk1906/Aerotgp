The website currently uses Cloudinary for image storage, but there are two major issues that need to be fixed.

1. Images Not Saving in Correct Folders

Currently, when images are uploaded (gallery, club logos, event posters, etc.), they are not being stored in their respective folders. Instead, they are being saved in the main root folder in Cloudinary.

Fix the upload logic so that images are stored in specific folders based on the feature they belong to.

Example folder structure:

aero-website/
   gallery/
   events/
   clubs/
   blogs/
   profiles/

Update the upload configuration so that:

Gallery images go to aero-website/gallery

Event posters go to aero-website/events

Club logos go to aero-website/clubs

Blog images go to aero-website/blogs

Profile pictures go to aero-website/profiles

Ensure the folder parameter is properly set during the upload process.

2. Images Disappear After Re-login

Another issue is that images appear immediately after upload but disappear from the website after logging out and logging back in, even though they are still visible in Cloudinary.

Fix this by ensuring:

After uploading an image to Cloudinary, the secure image URL is saved in the database (such as Firebase).

The website should always fetch image URLs from the database, not from temporary frontend state.

On page reload or login, the frontend must retrieve image URLs from the database and render them again.

Example data structure:

gallery
   imageID
      imageURL
      caption
      uploadedBy
      uploadDate
3. Ensure Persistent Image Rendering

Fix the frontend logic so that:

Images load correctly on page refresh

Images load correctly after user login

Images remain visible across home page, gallery page, and club pages

Use proper data fetching methods so the UI always displays the latest saved images.

4. Verify Upload Response Handling

After uploading to Cloudinary, ensure the system correctly retrieves:

secure_url
public_id

Store these values in the database so images can be displayed and deleted later.

5. Fix Image Fetching Across Pages

Ensure all pages that display images (gallery, clubs, events, blogs) load images dynamically from the database instead of relying on temporary variables or cached state.

6. Maintain Existing Website Design

Do not change the existing UI design or layout.

Only fix the backend and data fetching logic so that:

Images save in the correct Cloudinary folders

Images remain visible after re-login

Images load consistently across the entire website.