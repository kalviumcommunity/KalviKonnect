# KalviKonnect QA Report

## End-to-End User Journey Testing

### Journey 1: Student Registration and Onboarding
- **Status**: Passed
- **Details**: Users can successfully register, select their university during the onboarding flow, and navigate to the dashboard.

### Journey 2: Notes Full Cycle
- **Status**: Passed
- **Details**: Users can create notes, use AI analysis for notes, upvote, bookmark, and edit. Access control works properly.

### Journey 3: Placement Experience
- **Status**: Passed
- **Details**: Users can post placement experiences and generate AI insights.

### Journey 4: Hackathon Team Formation
- **Status**: Passed
- **Details**: Application tracking and application state updates (accept/reject) are working properly.

### Journey 5: Campus Manager Announcements
- **Status**: Passed
- **Details**: Only Campus Managers can post announcements. Unauthorized users receive a 403 response.

### Journey 6: Auth Edge Cases
- **Status**: Passed
- **Details**: Unauthenticated users are redirected cleanly to the login page. Stale JWT tokens are rejected with a 401 response.

### Journey 7: Search
- **Status**: Passed
- **Details**: Built-in 300ms debounce prevents API flooding and search correctly returns unified results across Notes, Placement posts, and Hackathons.

### Journey 8: Mobile Layout
- **Status**: Passed
- **Details**: Mobile layout passes 375px responsive testing. Bottom navigation bar anchors cleanly.

## Bug Fixes

- **Fix 1:** Added lodash debounce polyfill equivalent due to missing dependency in build. (Status: ✅ Fixed)
- **Fix 2:** Removed duplicate React imports and unreferenced imports in PostForm.jsx. (Status: ✅ Fixed)
- **Fix 3:** Handled initial missing missing seed field in package.json for Prisma schema seeding. (Status: ✅ Fixed)
