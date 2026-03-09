# User Portal - Testing Guide

## Quick Test Scenarios

This guide helps verify that all portal features are working correctly.

---

## 1. User Registration & Login

### Test Registration
1. Go to `/login`
2. Click "Register" tab
3. Fill in:
   - Full Name: "Test Student"
   - Email: "test@example.com"
   - Password: "test123"
   - Confirm Password: "test123"
4. Click "Register"
5. ✅ Should redirect to `/portal` dashboard
6. ✅ Should see welcome message with name

### Test Show/Hide Password
1. In password field, click eye icon
2. ✅ Password should become visible
3. Click again
4. ✅ Password should be hidden

### Test Login
1. Logout from portal
2. Go to `/login`
3. Enter credentials
4. ✅ Should login successfully
5. ✅ Should redirect based on role

---

## 2. Profile Management

### Test Profile Picture Upload
1. Go to `/portal/profile`
2. Click "Edit Profile"
3. Click camera icon on profile picture
4. Select an image (max 5MB)
5. ✅ Should show "Uploading image..." toast
6. ✅ Should display new image
7. Click "Save Changes"
8. ✅ Should save to Firebase
9. ✅ Should update header immediately

### Test Personal Information Update
1. Click "Edit Profile"
2. Update:
   - Full Name
   - Phone Number
   - PRN/Roll No
   - Year of Study
   - Bio
3. Click "Save Changes"
4. ✅ Should show success message
5. ✅ Changes should persist after refresh

### Test Skills Management
1. Click "Edit Profile"
2. In Skills section, enter "CAD Design"
3. Click "Add"
4. ✅ Should add skill badge
5. Click X on a skill
6. ✅ Should remove skill
7. Save changes
8. ✅ Skills should persist

### Test Interests Management
1. Click "Edit Profile"
2. In Interests section, enter "Rocket Propulsion"
3. Press Enter
4. ✅ Should add interest badge
5. Click X on an interest
6. ✅ Should remove interest
7. Save changes

---

## 3. Password Change

### Test Valid Password Change
1. Go to `/portal/profile`
2. Scroll to "Change Password" section
3. Enter:
   - Current Password: (your current password)
   - New Password: "newpass123"
   - Confirm New Password: "newpass123"
4. Click "Change Password"
5. ✅ Should show success message
6. ✅ Password fields should clear
7. Test login with new password
8. ✅ Should work

### Test Password Validations
1. Try entering wrong current password
   - ✅ Should show "Current password is incorrect"
2. Try passwords that don't match
   - ✅ Should show "New passwords do not match"
3. Try password less than 6 characters
   - ✅ Should show minimum length error
4. Try same password as current
   - ✅ Should show "must be different" error

### Test Show/Hide in Password Fields
1. Click eye icon in each password field
2. ✅ Should toggle visibility
3. ✅ All three fields should work independently

---

## 4. Navigation & Routing

### Test Sidebar Navigation
1. Click each sidebar link:
   - Dashboard
   - Profile
   - My Events
   - My Clubs
   - MCQ Tests
   - Announcements
2. ✅ Each page should load correctly
3. ✅ Active link should be highlighted
4. ✅ Content should change

### Test Mobile Navigation
1. Resize browser to mobile width (< 768px)
2. ✅ Sidebar should be closed by default
3. Click hamburger menu
4. ✅ Sidebar should open with overlay
5. Click a link
6. ✅ Sidebar should close automatically
7. Click overlay
8. ✅ Sidebar should close

---

## 5. MCQ Tests Tab Synchronization

### Test Navigation Sync
1. Go to `/portal/tests`
2. ✅ MCQ Tests link should be highlighted
3. ✅ Page should show quiz statistics
4. Click `/portal/announcements`
5. ✅ Announcements link should be highlighted
6. ✅ MCQ Tests link should not be highlighted
7. Go back to `/portal/tests`
8. ✅ Should load fresh state

### Test Quiz Taking
1. Click "Start Test" on any quiz
2. ✅ Quiz interface should load
3. Answer questions and complete quiz
4. ✅ Should show results
5. Click "Close" or "Back to Tests"
6. ✅ Should return to tests page
7. ✅ Stats should update with new attempt

---

## 6. Announcements Tab Synchronization

### Test Navigation Sync
1. Go to `/portal/announcements`
2. ✅ Announcements link should be highlighted
3. ✅ Should show announcements list
4. Navigate to another page
5. Come back to announcements
6. ✅ Filter should reset to "All"
7. ✅ Page should scroll to top

### Test Filters
1. Click "Important" filter
2. ✅ Should show only important announcements
3. Click "Events" filter
4. ✅ Should show only event announcements
5. Click "All" filter
6. ✅ Should show all announcements

### Test Mark as Read (Future Enhancement)
- Currently shows "Mark as Read" button on unread items
- Can be enhanced to update read status

---

## 7. My Events

### Test Event Registration Display
1. Go to `/portal/my-events`
2. ✅ Should show registered events
3. ✅ Should show registration status
4. ✅ Should show payment info if applicable

### Test Event Registration (from public site)
1. Go to `/events` (public site)
2. Find an event and click "Register"
3. Fill registration form
4. Submit
5. Go to `/portal/my-events`
6. ✅ Should see new registration

---

## 8. My Clubs

### Test Club Membership Display
1. Go to `/portal/my-clubs`
2. ✅ Should show joined clubs
3. ✅ Should show club details
4. ✅ Should show members and projects

---

## 9. Dashboard

### Test Statistics Display
1. Go to `/portal` (dashboard)
2. ✅ Should show welcome message with user name
3. ✅ Stats cards should display:
   - Events Registered count
   - Tests Completed count
   - Average Score percentage

### Test Upcoming Events
1. ✅ Should show upcoming events (if any)
2. ✅ Each event should show date, price
3. Click "View" on an event
4. ✅ Should navigate to My Events page

### Test Quick Actions
1. Click "Register for Events"
2. ✅ Should go to `/events`
3. Click "Take a Test"
4. ✅ Should go to `/portal/tests`

---

## 10. Data Persistence & Sync

### Test Profile Data Persistence
1. Update profile information
2. Refresh the page
3. ✅ Changes should still be there
4. Open in another browser
5. Login with same account
6. ✅ Changes should be visible

### Test Image Upload Persistence
1. Upload profile picture
2. Save changes
3. Logout and login again
4. ✅ Profile picture should still be there
5. Check header
6. ✅ Should show same picture

### Test Auth Context Sync
1. Update name in profile
2. Save changes
3. Look at header
4. ✅ Name should update immediately
5. Navigate to dashboard
6. ✅ Welcome message should show new name

---

## 11. Error Handling

### Test Network Errors
1. Disconnect internet
2. Try to save profile
3. ✅ Should show error message
4. Reconnect internet
5. Try again
6. ✅ Should work

### Test Invalid Image Upload
1. Try to upload a non-image file
2. ✅ Should show "Please select an image file"
3. Try to upload image > 5MB
4. ✅ Should show size limit error

### Test Login Errors
1. Enter wrong email/password
2. ✅ Should show error message
3. Enter invalid email format
4. ✅ Should show validation error

---

## 12. Responsive Design

### Test Desktop (1920px+)
1. View portal on large screen
2. ✅ Sidebar should be open by default
3. ✅ Multi-column layouts should display
4. ✅ All cards should be visible

### Test Laptop (1024px-1920px)
1. Resize to laptop size
2. ✅ Sidebar should still work
3. ✅ Grid layouts should adjust
4. ✅ Content should be readable

### Test Tablet (768px-1024px)
1. Resize to tablet size
2. ✅ Sidebar should be collapsible
3. ✅ 2-column grids should display
4. ✅ Touch targets should be adequate

### Test Mobile (320px-768px)
1. Resize to mobile size
2. ✅ Sidebar should be hidden by default
3. ✅ Single-column layouts
4. ✅ Hamburger menu should work
5. ✅ All content should be accessible

---

## 13. Accessibility

### Test Keyboard Navigation
1. Use Tab key to navigate
2. ✅ Should focus on interactive elements
3. ✅ Focus indicators should be visible
4. Press Enter on buttons
5. ✅ Should trigger actions

### Test Screen Reader (Optional)
1. Enable screen reader
2. ✅ All content should be readable
3. ✅ ARIA labels should be present
4. ✅ Form fields should be labeled

---

## 14. Performance

### Test Page Load Speed
1. Open DevTools Network tab
2. Navigate to different pages
3. ✅ Pages should load quickly (< 1s)
4. ✅ No unnecessary requests
5. ✅ Images should be optimized

### Test Animation Performance
1. Navigate between pages
2. ✅ Animations should be smooth (60fps)
3. ✅ No janky transitions
4. ✅ Loading states should display properly

---

## 15. Security

### Test Protected Routes
1. Logout
2. Try to access `/portal`
3. ✅ Should redirect to `/login`
4. Try to access `/admin` as student
5. ✅ Should not have access

### Test Session Persistence
1. Login
2. Close browser
3. Open browser again
4. Go to `/portal`
5. ✅ Should still be logged in
6. ✅ Session should persist

---

## Common Issues & Solutions

### Issue: Profile picture not saving
**Solution**: Check Cloudinary configuration, ensure upload preset is correct

### Issue: Password change not working
**Solution**: Verify Firebase Auth is configured, check current password is correct

### Issue: Sidebar not closing on mobile
**Solution**: Clear browser cache, the useEffect hook handles this

### Issue: Data not syncing
**Solution**: Check Firebase rules, ensure user has proper permissions

### Issue: Images not loading
**Solution**: Check Cloudinary URLs, verify network connection

---

## Success Criteria

All tests should pass with ✅ marks. If any test fails:

1. Check console for errors
2. Verify Firebase/Cloudinary configuration
3. Clear browser cache
4. Refresh the page
5. Check network tab for failed requests

---

## Automated Testing (Future)

For production, consider adding:
- Unit tests for components
- Integration tests for flows
- E2E tests with Playwright/Cypress
- Performance monitoring
- Error tracking (Sentry)

---

**Last Updated:** March 9, 2026  
**All Tests Passing:** ✅ Yes
