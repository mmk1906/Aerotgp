Perform a full audit and repair of the **Gallery module**. Currently, images uploaded to the gallery are not loading or displaying properly, and the gallery tab is not functioning as expected.

Analyze the entire gallery system and fix the backend logic, image upload process, and frontend display so the gallery works reliably across the website.

---

1. Fix Image Upload System

Ensure that when the admin uploads images to the gallery:

• The image file uploads successfully
• The image is stored in the correct storage service or server
• The image URL is generated correctly
• The URL is saved in the database

Prevent cases where images upload but the link is missing or broken.

---

2. Fix Image Loading on Gallery Page

Repair the gallery page so that images stored in the database load correctly.

Ensure:

• The gallery fetches image URLs dynamically
• Images display correctly in the gallery grid
• Broken image placeholders are avoided
• Images remain visible after page refresh

---

3. Verify Database Integration

Check the gallery database collection and ensure it stores:

• Image URL
• Image title or description
• Upload date
• Uploaded by (optional)

Ensure the frontend fetches this data correctly.

---

4. Fix Admin Gallery Management

The admin dashboard should allow full control of gallery content.

Admin must be able to:

• Upload images
• Edit image details
• Delete images
• View all uploaded images

Ensure all actions update the gallery page immediately.

---

5. Optimize Image Display Layout

Improve the gallery layout so images display properly on all screen sizes.

Ensure:

• Images appear in a clean grid layout
• Image cards maintain consistent sizes
• Images do not stretch or overflow containers
• Clicking an image opens a larger preview if implemented

---

6. Improve Image Performance

Optimize the gallery so images load quickly.

Ensure:

• Large images are compressed or optimized
• Lazy loading is used for images
• The gallery loads smoothly even with many images

---

7. Fix Synchronization

Ensure that when the admin uploads or deletes an image:

Admin dashboard update
→ Database update
→ Gallery page updates immediately

The gallery must stay synchronized across:

• Public website
• Admin portal
• Student portal (if gallery appears there)

---

8. Remove Broken Gallery Logic

Audit the codebase and remove:

• Old gallery components
• Broken upload handlers
• Duplicate API routes
• Unused gallery files

Simplify the gallery system to make it stable and maintainable.

---

9. Test the Gallery System

After fixing the module verify that:

• Admin can upload images successfully
• Uploaded images appear immediately on the gallery page
• Images remain visible after page reload
• Admin can delete images and they disappear from the gallery

---

Final Goal

Create a fully functional gallery system where:

• Images upload correctly
• Image URLs are stored and fetched properly
• Gallery images display without errors
• Admin can manage gallery content easily
• The gallery remains synchronized across the platform
