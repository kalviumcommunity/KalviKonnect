# Project KalviKonnect: Strategic Knowledge Exchange Platform

## 1. Project Concept and Strategic Vision
KalviKonnect is an enterprise-grade social collaboration platform engineered specifically for the Kalvium academic ecosystem. The primary objective of the project is to eliminate information fragmentation by providing a unified, secure, and high-performance environment where students, mentors, and campus managers can exchange critical professional and academic intelligence.

In professional environments, knowledge silos are a significant barrier to growth. KalviKonnect addresses this by centralizing high-value data—ranging from curated semester notes to firsthand placement narratives—into a single, searchable repository. This ensures that the collective experience of the community is preserved and leveraged for the benefit of all members.

## 2. Final Deployment Feature Set

| Module | Purpose | Key Functionality |
| :--- | :--- | :--- |
| **Learning Resource Vault** | Centralization of academic materials | Support for multi-link academic bundles (Google Drive integration), semester-based indexing, and peer-to-peer sharing. |
| **Placement Intelligence** | Competitive preparation repository | Archival of interview narratives, round-by-round breaks, and supporting assets with multiple external document links. |
| **Squad Foundation** | Opportunity and Hackathon management | Strategic opportunity creation with teammate recruitment, registration validation (Full Name/GitHub/LinkedIn), and founder approval. |
| **Campus Pulse** | Official Broadcasting | Verified official announcements and priority academic news management with a dedicated high-fidelity bulletin board. |
| **Broadcast Feed** | Unified Network Activity | Real-time feed for network-wide broadcasts, including peer-to-peer technical updates and authoritative deletion controls. |
| **Discussion Framework** | Problem-solving exchange | Threaded technical discussions with blocker status indicators and community-driven solution validation. |

## 3. Personnel Access and Governance
KalviKonnect implements a rigorous Role-Based Access Control (RBAC) model to ensure data integrity and organizational hierarchy.

| Role | Access Level | Responsibilities |
| :--- | :--- | :--- |
| **Campus Manager** | Administrative | Systems oversight, broadcasting of institutional announcements, and opportunity management. |
| **Mentor** | Expert | Professional guidance, content validation, and student mentorship focus. |
| **Student** | Collaborative | Resource contribution, peer-to-peer engagement, and teammate application management. |

## 4. Technical Architecture Specifications

### Frontend Engineering
The user interface is architected for high fidelity and responsiveness:
- **Framework**: React.js 18 (Functional Components).
- **Navigation**: Fixed-viewport Sidebar navigation for persistent access during content interaction.
- **Visual Standards**: Custom CSS implementation following modern typography and high-density information display guidelines.

### Backend Infrastructure
The server-side ecosystem is designed for scalability and transactional reliability:
- **Environment**: Node.js with the Express framework.
- **ORM**: Prisma Object-Relational Mapper.
- **Database Engine**: PostgreSQL (Provisioned via Neon Serverless), optimized for low-latency query execution.
- **Data Model**: Structured PostgreSQL schema with cascaded relations for integrity protection.

## 5. Security and Data Governance
The platform adheres to stringent security protocols to ensure the confidentiality and authenticity of community data:
- **Authentication**: Stateless JSON Web Token (JWT) implementation with secure lifecycle management.
- **Authoritative Deletion**: Implementation of ownership-based authorization, ensuring only the original content creator can perform destructive operations.
- **Resource Integrity**: Shift to a link-based external asset model (e.g., Google Drive) to ensure file availability without compromising local server storage limits.

## 6. Implementation and Deployment Guide

### Environment Configuration
The system requires the following parameters in a standardized `.env` file within the `backend/` directory:
- `DATABASE_URL`: URI for the PostgreSQL production instance.
- `JWT_SECRET`: System-level entropy key for token signing.
- `CORS_ORIGIN`: White-listed origin for frontend-backend cross-communication.

### Initialization Sequence
To deploy the infrastructure:

1. **Database Synchronization**:
   ```bash
   npx prisma db push
   ```

2. **Backend Execution**:
   ```bash
   cd backend
   npm run start
   ```

3. **Frontend Execution**:
   ```bash
   cd frontend
   npm run dev
   ```

---
*Note: This project is maintained as a proprietary knowledge exchange application within the Kalvium ecosystem.*
