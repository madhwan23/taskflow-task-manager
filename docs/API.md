# API Documentation

Base URL: `/api`

Authentication uses JWT access tokens:

```http
Authorization: Bearer <access-token>
```

## Auth

### Register

`POST /api/auth/register/`

```json
{
  "username": "neha",
  "email": "neha@example.com",
  "password": "Member@12345",
  "first_name": "Neha",
  "last_name": "Member",
  "role": "member"
}
```

### Login

`POST /api/auth/login/`

```json
{
  "username": "admin",
  "password": "Admin@12345"
}
```

Returns `access`, `refresh`, and `user`.

### Refresh

`POST /api/token/refresh/`

```json
{
  "refresh": "<refresh-token>"
}
```

### Current User

`GET /api/auth/me/`

## Users

- `GET /api/users/`
- `GET /api/users/{id}/`
- `PATCH /api/users/{id}/`
- `POST /api/users/` admin only
- `DELETE /api/users/{id}/` admin only

Members only see their own user record. Admins see all users.

## Projects

- `GET /api/projects/`
- `POST /api/projects/` admin only
- `GET /api/projects/{id}/`
- `PATCH /api/projects/{id}/` admin only
- `DELETE /api/projects/{id}/` admin only

Query params:

- `search=website`
- `status=active`
- `members=2`
- `ordering=deadline`

Payload:

```json
{
  "title": "Website Redesign",
  "description": "Refresh the marketing site.",
  "deadline": "2026-06-30",
  "status": "active",
  "members": [2, 3, 4]
}
```

## Tasks

- `GET /api/tasks/`
- `POST /api/tasks/` admin only
- `GET /api/tasks/{id}/`
- `PATCH /api/tasks/{id}/`
- `DELETE /api/tasks/{id}/` admin only
- `POST /api/tasks/{id}/status/`
- `POST /api/tasks/{id}/attachment/`

Query params:

- `search=api`
- `status=todo`
- `priority=high`
- `project=1`
- `assigned_user=2`
- `ordering=due_date`

Payload:

```json
{
  "title": "Build auth screens",
  "description": "Create login and register UI.",
  "priority": "high",
  "due_date": "2026-06-12",
  "assigned_user": 2,
  "project": 1,
  "status": "todo"
}
```

Status payload:

```json
{
  "status": "completed"
}
```

Attachment upload uses multipart form data with a `file` field.

## Dashboard

`GET /api/dashboard/stats/`

Returns project/task totals, completion rate, status/priority distributions, overdue count, and recent activity.

## Activity

- `GET /api/activities/`
- `GET /api/activities/?project=1`
- `GET /api/activities/?task=3`
