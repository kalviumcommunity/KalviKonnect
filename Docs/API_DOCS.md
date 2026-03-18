# 🔌 API Documentation

## Authentication
| Method | Path | Auth | Request Body | Response | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/auth/register` | No | `{ email, password, role, universityId }` | User + Token | 201, 400, 409 |
| POST | `/auth/login` | No | `{ email, password }` | User + Token | 200, 401 |
| GET | `/auth/me` | Yes | - | User Object | 200, 401 |

## Academic Notes
| Method | Path | Auth | Request Body/Query | Response | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/notes` | Yes | `{ title, content, semester, universityId, tags[] }` | Created Note | 201, 401 |
| GET | `/notes` | No | `?page=n&limit=m&tag=X&universityId=Y` | Paginated Notes | 200 (Cached) |
| GET | `/notes/:id` | No | - | Full Note | 200, 404 |
| PUT | `/notes/:id` | Yes | `{ title, content, ... }` | Updated Note | 200, 403, 404 |
| DELETE | `/notes/:id` | Yes | - | - | 204, 403, 404 |

## Placement Experiences
| Method | Path | Auth | Request Body/Query | Response | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/placements` | Yes | `{ company, role, content, rounds }` | Created Post | 201, 401 |
| GET | `/placements` | Yes | `?page=n&limit=m&company=G` | Paginated Posts | 200 |
| GET | `/placements/:id` | Yes | - | Full Post | 200, 404 |

## Hackathons
| Method | Path | Auth | Request Body/Query | Response | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/hackathons` | Yes | `{ title, description, deadline }` | Created Hackathon | 201 |
| GET | `/hackathons` | Yes | `?page=n&limit=m&status=open` | Paginated List | 200 |
| PATCH | `/hackathons/:id/status`| Yes| `{ status: 'CLOSED' }` | Updated Hackathon | 200, 403 |
| POST | `/hackathons/:id/apply` | Yes | - | Success Msg | 200 |

## Discussions & Community
| Method | Path | Auth | Request Body/Query | Response | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/discussions` | Yes | `{ title, content, tags[] }` | Created Thread | 201 |
| GET | `/discussions` | Yes | `?page=n&limit=m&tag=career` | Paginated List | 200 |
| POST | `/discussions/:id/reply`| Yes| `{ content }` | Created Reply | 201 |

## Social Actions
| Method | Path | Auth | Request Body | Response | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/upvotes` | Yes | `{ noteId OR placementId OR replyId }` | Created Upvote | 201, 400 |
| POST | `/bookmarks` | Yes | `{ noteId OR placementId OR hackathonId }` | Created Bookmark | 201 |
| GET | `/bookmarks` | Yes | `?page=n&limit=m` | Paginated List | 200 (ETag) |
| DELETE | `/bookmarks/:id` | Yes | - | - | 204 |

## Announcements
| Method | Path | Auth | Request Body | Response | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/announcements` | Manager | `{ title, content, isSticky }` | Created Announcement| 201, 403 |
| GET | `/announcements` | No | - | List | 200 |
