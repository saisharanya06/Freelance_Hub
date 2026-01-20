# 🧪 Testing Guide - Step by Step

## Setup

Both servers are already running:
- **Backend**: http://127.0.0.1:8000
- **Frontend**: http://localhost:5175

Open the frontend in your browser.

---

## Test 1: Project Posting ✅

**Objective**: Verify authenticated users can post projects

### Steps:
1. Go to http://localhost:5175
2. Click **"Post Project"** in navbar (redirects to login if not authenticated)
3. Fill in form:
   - **Title**: "E-commerce Website Redesign"
   - **Description**: "Need modern redesign with React and Tailwind"
   - **Budget**: "50000"
   - **Tech Stack**: Select React, Node.js, MongoDB
4. Click **"Post"**
5. Should redirect to /projects page
6. Your new project appears at top of list ✅

### Verify:
- [ ] Project has your name as creator
- [ ] Project appears with all entered details
- [ ] Budget shows correctly (50K)
- [ ] Tech stack shows selected items
- [ ] You have Edit and Delete buttons

---

## Test 2: User-Specific Completion 🔄

**Objective**: Verify completion is tracked per-user, not globally

### Steps:

#### Part A - User 1:
1. Make sure you're logged in as User 1
2. Go to http://localhost:5175/projects
3. Find any project (not your own)
4. Click "View" → goes to /projects/{id}
5. Click **"Mark as Complete"** button
6. Should show checkmark and "Already completed" message
7. Keep this tab open

#### Part B - User 2 (Different Browser):
1. **Open Incognito/Private window** or **different browser**
2. Go to http://localhost:5175
3. Click **"Signup"** and create User 2 account:
   - Name: "User 2"
   - Email: "user2@example.com"
   - Password: "password123"
4. Go to /projects
5. Find the **same project** that User 1 completed
6. Click "View" → goes to project details
7. The button should say **"Mark as Complete"** (not completed for User 2) ✅

### Verify:
- [ ] User 1 sees project as completed
- [ ] User 2 sees same project as NOT completed
- [ ] Each user has independent status
- [ ] Mark complete button works in both accounts
- [ ] Completion persists after page refresh

---

## Test 3: Ownership Permissions 👤

**Objective**: Verify edit/delete buttons visible only to owner

### Steps:

#### Part A - View Own Project:
1. Stay logged in as User 1
2. Go to /projects
3. Look at a project YOU posted
4. You should see: **✏️ Edit** | **🗑️ Delete** | **→ View**

#### Part B - View Other's Project:
1. Go to /projects
2. Find a project by User 2
3. You should see: **→ View** only
4. **NO Edit or Delete buttons** ✅

#### Part C - Different User:
1. Switch to User 2 account (Incognito window)
2. Go to /projects
3. Find User 1's project
4. You should see: **→ View** only
5. **NO Edit or Delete buttons** ✅

### Verify:
- [ ] Own projects show edit/delete buttons
- [ ] Other's projects don't show edit/delete
- [ ] Delete button shows confirmation dialog
- [ ] Edit button is clickable (navigates to edit page)

---

## Test 4: Delete Project ❌

**Objective**: Verify delete removes project and cleanup

### Steps:
1. Stay logged as User 1
2. Go to /projects
3. Find a project YOU own (or post a test project)
4. Click **Delete button** (trash icon)
5. **Confirm** in dialog
6. Project disappears from list ✅
7. Refresh page - still gone ✅
8. As User 2, project also gone ✅

### Verify:
- [ ] Delete button shows confirmation
- [ ] Project removed from database
- [ ] All users see project removed
- [ ] Completion records cleaned up

---

## Test 5: Authentication Flow 🔐

**Objective**: Verify login/logout/session persistence

### Steps:
1. Go to http://localhost:5175
2. Click **"Signup"**
3. Create new account:
   - Email: "test@example.com"
   - Password: "test123"
   - Name: "Test User"
4. Should redirect to /projects
5. Navbar shows your name ✅
6. **Refresh page** - still logged in ✅
7. Click **Logout** in navbar
8. **Refresh page** - logged out ✅
9. Try clicking "Post Project" - redirects to login ✅

### Verify:
- [ ] Signup creates account
- [ ] Login works with correct credentials
- [ ] Session persists in localStorage
- [ ] Logout clears session
- [ ] Protected pages redirect to login

---

## Test 6: Project List Filtering 🔍

**Objective**: Verify search and filter work

### Steps:
1. Go to /projects
2. Try **Search**: Type "react" - filters projects with React
3. Try **Tech filter**: Click "React" - shows only React projects
4. Try **Status filter**: Select "OPEN" - shows only open projects
5. Try **Clear filters** - shows all projects again

### Verify:
- [ ] Search finds projects by title/description
- [ ] Tech filters work
- [ ] Status filter works
- [ ] Clear filters resets everything

---

## Test 7: Project Details Page 📄

**Objective**: Verify detailed view and all interactions

### Steps:
1. Go to /projects
2. Click **"View"** on any project
3. Should show:
   - Full title
   - Full description
   - Budget in ₹
   - Tech stack with all items
   - Creator name
   - Created date
   - "Mark as Complete" button
4. If you're the owner:
   - Should show ✏️ Edit button
   - Should show 🗑️ Delete button

### Verify:
- [ ] All project details display
- [ ] Dates formatted correctly
- [ ] Buttons visible/hidden based on ownership
- [ ] Mark complete works from detail page

---

## Test 8: Dark Mode 🌙

**Objective**: Verify theme toggle

### Steps:
1. Go to http://localhost:5175
2. Click theme toggle (moon/sun icon) in navbar
3. Entire site should switch to dark mode
4. **Refresh page** - dark mode persists ✅
5. Toggle back to light mode

### Verify:
- [ ] Theme toggles smoothly
- [ ] All elements visible in both modes
- [ ] Theme persists across page refresh

---

## Test 9: Responsive Design 📱

**Objective**: Verify mobile layout

### Steps:
1. Go to http://localhost:5175
2. Open **Developer Tools** (F12)
3. Toggle **Device Toolbar** (Responsive mode)
4. Test on **iPhone 12** (375px width)
5. Navigate through pages
6. All content should be readable
7. Buttons/forms should be accessible
8. No horizontal scroll

### Verify:
- [ ] Mobile layout readable
- [ ] Buttons large enough to click
- [ ] Navigation works on mobile
- [ ] Images responsive
- [ ] Forms stack vertically

---

## Test 10: Error Handling ⚠️

**Objective**: Verify errors display correctly

### Steps:

#### Part A - Invalid Login:
1. Logout if logged in
2. Go to Login page
3. Try login with:
   - Email: "wrong@example.com"
   - Password: "wrong"
4. Should show error toast ✅

#### Part B - Unauthorized Delete:
1. Login as User 1
2. Post a test project
3. Copy the project URL
4. Login as User 2 in incognito window
5. Manually navigate to that project
6. Try to delete it:
   - Should get 403 error ✅

#### Part C - Not Found:
1. Try URL: /projects/invalid-id-12345
2. Should show "Project Not Found" message ✅

### Verify:
- [ ] Login errors display
- [ ] Authorization errors handled
- [ ] 404 errors show user-friendly message
- [ ] Toast notifications appear for actions

---

## Test 11: Multiple Concurrent Users 👥

**Objective**: Verify independent user sessions

### Steps:
1. **Browser 1** - Login as User A
2. **Browser 2** - Login as User B
3. **Browser 1** - Post project "Project A"
4. **Browser 2** - See "Project A" in list ✅
5. **Browser 2** - Mark "Project A" as complete
6. **Browser 1** - See "Project A" as NOT completed ✅
7. **Browser 1** - Edit "Project A" title
8. **Browser 2** - See updated title ✅

### Verify:
- [ ] Both users can be logged in simultaneously
- [ ] User A can see User B's posts
- [ ] Each user's completion is independent
- [ ] Changes sync across users

---

## Quick Test Checklist ✅

Run through this in 5 minutes:

- [ ] Can signup
- [ ] Can login
- [ ] Can post project
- [ ] Project appears in list
- [ ] Can mark complete as User 1
- [ ] User 2 sees project as incomplete
- [ ] Own projects show edit/delete
- [ ] Others' projects don't show edit/delete
- [ ] Can delete project
- [ ] Delete shows confirmation

---

## Known Limitations (By Design)

⚠️ Not yet implemented (but API ready):
- Edit project form (route ready, form component needed)
- Forgot password (backend ready, needs email service)
- Google login (backend ready, needs OAuth setup)
- Project comments (database ready)
- User profiles (can be added later)

---

## Troubleshooting

### Project doesn't appear after posting
- [ ] Check if you're logged in
- [ ] Check browser console for errors (F12)
- [ ] Refresh page
- [ ] Check backend logs

### Mark complete not working
- [ ] Make sure you're logged in
- [ ] Check network tab in DevTools
- [ ] Verify API response is 200 OK
- [ ] Check that project ID is valid

### Edit/Delete buttons not showing
- [ ] Make sure you're viewing YOUR project
- [ ] Check if project `created_by` matches your user ID
- [ ] Refresh page
- [ ] Check browser cache (Ctrl+Shift+R)

### Backend not responding
- [ ] Verify backend is running: http://127.0.0.1:8000
- [ ] Should show {"status": "Backend running"}
- [ ] Check terminal for errors
- [ ] Restart server if needed

---

## What to Demonstrate

### To Show Project Posting Works:
1. Click Post Project
2. Fill in form
3. Submit
4. Project appears immediately

### To Show User-Specific Completion Works:
1. Open 2 browsers
2. Login as different users
3. Mark project complete in one
4. Show it's NOT marked in other

### To Show Ownership Works:
1. As owner, show edit/delete buttons
2. Logout
3. Login as different user
4. Show edit/delete are gone

---

**All tests should pass! If any fail, check the documentation or backend logs.**

Good luck! 🚀
