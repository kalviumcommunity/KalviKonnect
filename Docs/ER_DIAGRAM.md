# 📐 Entity Relationship Diagram (ERD)

The following diagram visualizes the core relationships between entities in the **Kalvi Connect** database.

```mermaid
erDiagram
    UNIVERSITY ||--o{ USER : "has"
    UNIVERSITY ||--o{ NOTE : "contains"
    
    USER ||--o{ NOTE : "uploads"
    USER ||--o{ PLACEMENT_POST : "shares"
    USER ||--o{ HACKATHON : "creates"
    USER ||--o{ ANNOUNCEMENT : "posts (if Campus Manager)"
    USER ||--o{ UPVOTE : "gives"
    USER ||--o{ BOOKMARK : "saves"
    USER ||--o{ DISCUSSION_THREAD : "starts"
    USER ||--o{ DISCUSSION_REPLY : "replies"
    
    NOTE ||--o{ NOTETAG : "labeled_by"
    TAG ||--o{ NOTETAG : "applied_to"
    
    DISCUSSION_THREAD ||--o{ THREADTAG : "labeled_by"
    TAG ||--o{ THREADTAG : "applied_to"
    
    DISCUSSION_THREAD ||--o{ DISCUSSION_REPLY : "contains"
    
    NOTE ||--o{ UPVOTE : "upvoted_by"
    PLACEMENT_POST ||--o{ UPVOTE : "upvoted_by"
    DISCUSSION_REPLY ||--o{ UPVOTE : "upvoted_by"

    NOTE ||--o{ BOOKMARK : "bookmarked_by"
    PLACEMENT_POST ||--o{ BOOKMARK : "bookmarked_by"
    HACKATHON ||--o{ BOOKMARK : "bookmarked_by"
```

### 📋 Model Breakdown

- **Core Objects**: `User`, `University`, `Note`, `PlacementPost`, `Hackathon`, `Announcement`.
- **Identity & Relations**: `Auth`, `Role`.
- **Engagement Modules**: `Upvote`, `Bookmark`, `DiscussionThread`, `DiscussionReply`.
- **Categorization**: `Tag`, `NoteTag`, `ThreadTag`.

---

> [!NOTE]
> Junction tables (`NoteTag`, `ThreadTag`) are used to maintain 3NF for multi-tagging categorization without duplicating long strings.
