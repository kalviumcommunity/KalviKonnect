# 📜 User Stories (LU 7)

## 1. Stories Organized by Module

| Module | Story |
| :--- | :--- |
| **Auth** | As a **Student/Mentor**, I want to register and login with my Kalvium email so that I can access restricted community resources. |
| **Auth** | As a **Campus Manager**, I want a separate login so that I can access the "Announcement Dashboard." |
| **Announcements** | As a **Campus Manager**, I want to create a global announcement so that all students see critical alerts immediately. |
| **Announcements** | As a **Student**, I want to view a feed of official campus notices so that I don't miss any deadlines. |
| **Notes** | As a **Student**, I want to upload a resource with a semester and subject tag so that others can find it later. |
| **Notes** | As a **Student**, I want to search and filter notes by university and semester so that I find exactly what I need for my exam. |
| **Notes** | As a **Student**, I want to upvote a high-quality note so that the best resources rise to the top of the feed. |
| **Notes** | As a **Student**, I want to bookmark a specific resource so that I can access it quickly during study sessions. |
| **Placement** | As a **Mentor**, I want to share a step-by-step interview experience for a specific company so that juniors are better prepared. |
| **Placement** | As a **Student**, I want to search placement experiences by company name so that I can practice common interview patterns. |
| **Placement** | As a **Student**, I want to upvote an insightful experience so that fellow students know it is trustable. |
| **Hackathon** | As a **Student**, I want to post an upcoming hackathon and list "Roles Needed" so that I can build a team from across the Kalvium network. |
| **Hackathon** | As a **Student**, I want to apply to join a hackathon team so that I can collaborate with other skilled peers. |
| **Hackathon** | As a **Team Lead**, I want to accept or reject applicants to my team so that I can build the best competitive group. |
| **Discussion** | As a **Student**, I want to start a discussion thread for a specific coding problem so that mentors or peers can help me debug. |
| **Discussion** | As a **Mentor**, I want to reply to a thread or upvote a correct solution so that students get high-quality technical help. |
| **AI Features** | As a **Student**, I want the AI to generate a 3-point summary for long technical notes so that I can save time while reviewing. |
| **AI Features** | As a **Mentor**, I want the AI to structure my "Messy Thoughts" into a clean "Placement Experience Template" so that it's more readable for juniors. |

---

## 2. Full Acceptance Criteria (LU 7)

### **Story 1: Student submits a note with tags**
- **Given:** A logged-in Student is on the "Upload Resource" page.
- **When:** They fill in the "Title," select "Semester 4," pick the "Operating Systems" tag, and upload a valid PDF file.
- **Then:** The note is published and immediately appears in the "Notes Feed" under the specified Subject and Semester filters.

### **Story 2: Student applies to a hackathon**
- **Given:** A student is viewing a "Hackathon Post" with open roles.
- **When:** They click "Apply for Backend Developer role" and submit a brief 1-sentence interest note.
- **Then:** Their application status becomes "Pending," and the Team Lead receives a notification in their "Team Dashboard."

### **Story 3: Campus Manager creates an announcement**
- **Given:** A Campus Manager is logged into the "Manager Portal."
- **When:** They type an announcement titled "LPU Semester Exam Dates" and click "Publish."
- **Then:** The announcement is pinned to the top of the dashboard for all students belonging to the LPU branch, and marked with a "Priority" badge.

### **Story 4: Student upvotes a placement experience**
- **Given:** A student has already upvoted a specific "Placement Experience" post.
- **When:** They accidentally or intentionally click the "Upvote" button again.
- **Then:** The system should toggle the upvote (remove it) or ignore the second click, ensuring the same user cannot increment the vote count more than once for the same post.
