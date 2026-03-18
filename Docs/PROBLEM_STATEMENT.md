# 🎯 Problem Statement & User Research

## 1. The Core Problem
Kalvium students lose critical career and academic opportunities because high-value information—like placement interview patterns, semester notes, and hackathon registrations—is buried within noisy, transient, and unsearchable WhatsApp/Discord threads, leading to significant redundant effort and "information luck."

## 2. User Personas

### 👨‍🎓 Arjun | The Junior Student
- **Role:** 1st/2nd Year Student
- **Needs:** Reliable study materials, hackathon team-up opportunities, and a clear roadmap of what to expect in future semesters.
- **Doesn't Care About:** Campus management logistics or complex analytics.
- **Feature Map:** Academic Notes, Hackathon Module, Discussion Forum.

### 👩‍💼 Priya | The Senior/Mentor
- **Role:** 3rd/4th Year Student (Placed)
- **Needs:** A structured way to document "placement experiences" to leave a legacy and help juniors avoid common interview mistakes.
- **Doesn't Care About:** Basic campus announcements or trivial day-to-day polls.
- **Feature Map:** Placement Experiences, Career Mentorship, Discussion Forum.

### 🏫 Raj | The Campus Manager
- **Role:** Administrator/Point of Contact
- **Needs:** An authoritative "Source of Truth" to post announcements that don't get buried by student memes in group chats.
- **Doesn't Care About:** Detailed technical notes or hackathon team formations.
- **Feature Map:** Official Announcements.

## 3. User Stories

| Role | I want to... | So that... |
| :--- | :--- | :--- |
| **Student** | Log in using my Kalvium email | I can access exclusive community resources securely. |
| **Student** | Upload and search for notes by semester/subject | I don't have to scroll through 6 months of WhatsApp media for a PDF. |
| **Senior** | Post my 3-round interview experience for a specific company | Juniors can prepare for exactly what that company asks. |
| **Student** | View upcoming hackathon deadlines in a single feed | I can find team members and register before the deadline. |
| **Manager** | Post a "Sticky" announcement about a campus event | it is the first thing every student sees when they log in. |
| **Student** | Comment on a placement experience post | I can ask specific follow-up questions about a particular interview round. |

## 4. Acceptance Criteria (Examples)

### **Story: Placement Experience Posting**
- **Given:** A logged-in Senior/Mentor is on the Placement page.
- **When:** They fill out the "Experience Form" (Company, Role, Difficulty, Rounds) and click Submit.
- **Then:** The post should appear at the top of the "Experiences" feed with a searchable "Company" tag.

### **Story: Semester-wise Note Search**
- **Given:** A student is on the Notes dashboard.
- **When:** They filter by "Semester 3" and "Operating Systems."
- **Then:** Only notes matching both criteria are displayed, excluding irrelevant files.

### **Story: Authoritative Announcements**
- **Given:** A Campus Manager is logged in.
- **When:** They publish a post in the "Announcements" section.
- **Then:** Students receive a visual indicator (red dot or sticky header) that a new official update is available.
