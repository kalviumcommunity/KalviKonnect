# 🧠 Schema Design Decisions (LU 2, 3, 7, 8)

## 1. Entity Extraction (LU 2)

Based on the user stories, we extracted the following core entities:

| Entity | Attributes | Relationships | Constraints |
| :--- | :--- | :--- | :--- |
| **User** | email, password, role, lastActiveAt | 1:M with Posts, 1:1 with University | Email must be unique; Role limited to Enum. |
| **University** | name, location | 1:M with Users, 1:M with Notes | Name must be unique. |
| **Note** | title, content, fileUrl, semester, upvoteCount | M:M with Tags, 1:M with Upvotes | Content uses DB Text for storage. |
| **PlacementPost**| company, role, rounds (JSON), upvoteCount | 1:M with Upvotes | Rounds stored as JSON for flexibility. |
| **Hackathon** | title, description, deadline, status | 1:M with Bookmarks | Status default: "OPEN". |
| **Announcement** | title, content, isSticky | M:1 with User (Campus Manager) | Pinned logic for "Sticky" posts. |
| **Tag** | name | M:M with Notes and Threads | Case-insensitive unique names. |

---

## 2. Normalization Steps (LU 3)

We strictly followed 1NF, 2NF, and 3NF before making performance-based trade-offs:

- **1NF**: All fields are atomic (e.g., `rounds` in Placement is JSON but logically treated as a single structured object; in v1 we avoid multi-valued strings).
- **2NF**: All non-key attributes are fully functionally dependent on the primary key.
- **3NF**: Removed transitive dependencies.
    - **University**: Extracted from `User` and `Note` into its own table to avoid repeating strings and to allow global university-level management.
    - **Tags**: Extracted into a `Tag` table with `NoteTag` and `ThreadTag` junction tables to support many-to-many relationships without data duplication.

---

## 3. Controlled Denormalization (LU 7)

To optimize feed performance (avoiding heavy `COUNT` joins on every page load), we've implemented controlled redundancy:

- **`upvoteCount`** in `Note`, `PlacementPost`, and `DiscussionReply`: Automatically incremented/decremented when an `Upvote` is created/deleted.
- **`replyCount`** in `DiscussionThread`: Tracks the number of replies to avoid deep joins in the community feed.
- **`lastActiveAt`** in `User`: Updated on every request/login to track engagement without querying audit logs.

**Trade-off:** We accept a slight increase in write-cost and the need for logic to maintain sync (via Prisma Middleware or DB Triggers) in exchange for sub-10ms read times for our main discovery feeds.

---

## 4. Indexing Strategy (LU 8)

We identified the 5 most frequent query patterns and added indexes:

1.  **Notes Feed by Uni & Time**: `@@index([universityId, createdAt])` (Composite index for filtered sorting).
2.  **Tag Discovery**: `@@index([tagId])` on junction tables for fast resource lookup by subject.
3.  **Active Hackathons**: `@@index([status])` to quickly separate "OPEN" from "CLOSED" events.
4.  **Sticky Announcements**: `@@index([isSticky, createdAt])` to ensure official news is prioritized instantly.
5.  **User Content Ownership**: `@@index([authorId])` on all post tables to load "My Posts" in the user profile.

### **EXPLAIN ANALYZE Concept**
For a query like `SELECT * FROM Note WHERE universityId = 'X' ORDER BY createdAt DESC`, the composite index allows the DB to "Seek" directly to the University bucket and read the "Sorted" dates sequentially, avoiding a full table scan and a costly "FileSort" operation.

**Write-Cost:** Every new note will now take ~2ms longer to insert because the DB must update 3 separate indexes (Primary, University-Date, and Author). This is a 100% acceptable trade-off for a read-heavy community platform.
