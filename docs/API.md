# BuzzInvitly API Documentation

Complete API reference for BuzzInvitly REST API.

**Base URL**: `https://api.buzzinvitly.com/v1`

**Version**: 1.0.0

## Table of Contents

1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [Rate Limiting](#rate-limiting)
4. [Endpoints](#endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#users)
   - [Events](#events)
   - [Templates](#templates)
   - [Guests](#guests)
   - [Invitations](#invitations)
   - [Analytics](#analytics)
   - [Subscriptions](#subscriptions)
   - [Payments](#payments)
5. [Webhooks](#webhooks)
6. [SDKs](#sdks)

## Authentication

All API requests require authentication using JWT tokens.

### Getting an API Token

**BUSINESS plan only** - API access requires BUSINESS subscription.

1. Go to Settings → API Keys
2. Click "Generate New API Key"
3. Copy and save your API key securely

### Using the Token

Include the token in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Example Request

```bash
curl -X GET https://api.buzzinvitly.com/v1/events \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request was invalid or cannot be served",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Request validation failed |
| `UNAUTHORIZED` | Missing or invalid authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INSUFFICIENT_COINS` | Not enough coins for operation |
| `SUBSCRIPTION_REQUIRED` | Feature requires subscription |

## Rate Limiting

API requests are rate limited to prevent abuse.

### Limits

| Plan | Requests/minute | Requests/hour | Requests/day |
|------|-----------------|---------------|--------------|
| BUSINESS | 60 | 1000 | 10,000 |
| Enterprise | 120 | 5000 | 50,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640995200
```

### Handling Rate Limits

When rate limited, you'll receive a `429` response:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 30 seconds.",
    "retryAfter": 30
  }
}
```

## Endpoints

### Authentication Endpoints

#### Register User

Create a new user account.

```http
POST /auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response** (201):
```json
{
  "user": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

Authenticate and get access token.

```http
POST /auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "user": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-16T10:30:00Z"
}
```

#### Refresh Token

Get a new access token using refresh token.

```http
POST /auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-16T10:30:00Z"
}
```

### Users

#### Get Current User

Get authenticated user's profile.

```http
GET /users/me
```

**Response** (200):
```json
{
  "id": "usr_123abc",
  "email": "user@example.com",
  "name": "John Doe",
  "subscriptionTier": "PRO",
  "coinBalance": 150,
  "createdAt": "2024-01-15T10:30:00Z",
  "stats": {
    "totalEvents": 12,
    "totalGuests": 450,
    "averageRSVPRate": 78.5
  }
}
```

#### Update User Profile

Update user information.

```http
PATCH /users/me
```

**Request Body**:
```json
{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

**Response** (200):
```json
{
  "id": "usr_123abc",
  "email": "user@example.com",
  "name": "John Smith",
  "phone": "+1234567890"
}
```

### Events

#### List Events

Get all events for authenticated user.

```http
GET /events
```

**Query Parameters**:
- `status` (optional): Filter by status (`DRAFT`, `PUBLISHED`, `COMPLETED`, `CANCELLED`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)
- `sort` (optional): Sort field (`createdAt`, `eventDate`, `name`)
- `order` (optional): Sort order (`asc`, `desc`)

**Example**:
```http
GET /events?status=PUBLISHED&page=1&limit=10&sort=eventDate&order=desc
```

**Response** (200):
```json
{
  "data": [
    {
      "id": "evt_456def",
      "name": "Sarah's 30th Birthday",
      "eventType": "BIRTHDAY",
      "eventDate": "2024-02-20T19:00:00Z",
      "location": "The Grand Ballroom",
      "status": "PUBLISHED",
      "guestCount": 75,
      "rsvpCount": 62,
      "rsvpRate": 82.7,
      "buzzScore": 85,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "pages": 2
  }
}
```

#### Get Event

Get a specific event by ID.

```http
GET /events/:id
```

**Response** (200):
```json
{
  "id": "evt_456def",
  "name": "Sarah's 30th Birthday",
  "eventType": "BIRTHDAY",
  "eventDate": "2024-02-20T19:00:00Z",
  "eventTime": "19:00",
  "location": "The Grand Ballroom",
  "address": "123 Main St, New York, NY 10001",
  "description": "Join us for an unforgettable celebration!",
  "rsvpDeadline": "2024-02-13T23:59:59Z",
  "status": "PUBLISHED",
  "template": {
    "id": "tpl_789ghi",
    "name": "Golden Birthday"
  },
  "design": {
    "canvasData": { /* Fabric.js canvas JSON */ }
  },
  "stats": {
    "guestCount": 75,
    "invited": 75,
    "rsvpCount": 62,
    "attending": 50,
    "notAttending": 10,
    "maybe": 2,
    "pending": 13,
    "rsvpRate": 82.7,
    "attendanceRate": 66.7,
    "buzzScore": 85
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:22:00Z"
}
```

#### Create Event

Create a new event.

```http
POST /events
```

**Request Body**:
```json
{
  "name": "Summer BBQ Party",
  "eventType": "CASUAL",
  "eventDate": "2024-07-15T17:00:00Z",
  "location": "Backyard",
  "address": "123 Oak Street",
  "description": "Annual summer BBQ with friends and family",
  "rsvpDeadline": "2024-07-08T23:59:59Z",
  "templateId": "tpl_789ghi"
}
```

**Response** (201):
```json
{
  "id": "evt_new123",
  "name": "Summer BBQ Party",
  "status": "DRAFT",
  "createdAt": "2024-01-20T15:00:00Z"
}
```

#### Update Event

Update event details.

```http
PATCH /events/:id
```

**Request Body**:
```json
{
  "name": "Updated Event Name",
  "eventDate": "2024-07-20T17:00:00Z",
  "description": "Updated description"
}
```

**Response** (200):
```json
{
  "id": "evt_456def",
  "name": "Updated Event Name",
  "updatedAt": "2024-01-20T16:00:00Z"
}
```

#### Delete Event

Delete an event.

```http
DELETE /events/:id
```

**Response** (204): No content

### Templates

#### List Templates

Get all available templates.

```http
GET /templates
```

**Query Parameters**:
- `category` (optional): Filter by category
- `isPremium` (optional): Filter by premium status (true/false)
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response** (200):
```json
{
  "data": [
    {
      "id": "tpl_789ghi",
      "name": "Golden Birthday",
      "category": "BIRTHDAY",
      "type": "CARD",
      "isPremium": true,
      "price": 10,
      "previewUrl": "https://cdn.buzzinvitly.com/templates/golden-birthday.jpg",
      "usageCount": 1250
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### Get Template

Get a specific template.

```http
GET /templates/:id
```

**Response** (200):
```json
{
  "id": "tpl_789ghi",
  "name": "Golden Birthday",
  "category": "BIRTHDAY",
  "type": "CARD",
  "isPremium": true,
  "price": 10,
  "description": "Elegant golden-themed birthday invitation",
  "previewUrl": "https://cdn.buzzinvitly.com/templates/golden-birthday.jpg",
  "canvasData": { /* Fabric.js canvas JSON */ },
  "dimensions": {
    "width": 800,
    "height": 1200
  },
  "usageCount": 1250
}
```

### Guests

#### List Guests

Get all guests for an event.

```http
GET /events/:eventId/guests
```

**Query Parameters**:
- `rsvpStatus` (optional): Filter by RSVP status
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response** (200):
```json
{
  "data": [
    {
      "id": "gst_111aaa",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone": "+1234567890",
      "rsvpStatus": "ATTENDING",
      "plusOnes": 2,
      "plusOneNames": ["Bob Johnson", "Charlie Johnson"],
      "invitedAt": "2024-01-15T10:30:00Z",
      "respondedAt": "2024-01-16T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 75,
    "pages": 2
  }
}
```

#### Add Guest

Add a guest to an event.

```http
POST /events/:eventId/guests
```

**Request Body**:
```json
{
  "name": "Bob Smith",
  "email": "bob@example.com",
  "phone": "+1234567891",
  "plusOnes": 1
}
```

**Response** (201):
```json
{
  "id": "gst_222bbb",
  "name": "Bob Smith",
  "email": "bob@example.com",
  "rsvpStatus": "PENDING",
  "createdAt": "2024-01-20T10:00:00Z"
}
```

#### Update Guest

Update guest information.

```http
PATCH /events/:eventId/guests/:guestId
```

**Request Body**:
```json
{
  "name": "Robert Smith",
  "rsvpStatus": "ATTENDING",
  "plusOnes": 2
}
```

**Response** (200):
```json
{
  "id": "gst_222bbb",
  "name": "Robert Smith",
  "rsvpStatus": "ATTENDING",
  "plusOnes": 2,
  "updatedAt": "2024-01-20T11:00:00Z"
}
```

#### Delete Guest

Remove a guest from an event.

```http
DELETE /events/:eventId/guests/:guestId
```

**Response** (204): No content

#### Bulk Import Guests

Import multiple guests via CSV.

```http
POST /events/:eventId/guests/import
```

**Request** (multipart/form-data):
```
file: guests.csv
```

**CSV Format**:
```csv
name,email,phone,plusOnes
John Doe,john@example.com,+1234567890,2
Jane Smith,jane@example.com,+1234567891,0
```

**Response** (200):
```json
{
  "imported": 45,
  "failed": 2,
  "errors": [
    {
      "row": 12,
      "email": "invalid-email",
      "error": "Invalid email format"
    }
  ]
}
```

### Invitations

#### Send Invitations

Send invitations to selected guests.

```http
POST /events/:eventId/invitations/send
```

**Request Body**:
```json
{
  "guestIds": ["gst_111aaa", "gst_222bbb"],
  "methods": ["EMAIL", "SMS"],
  "customMessage": "Looking forward to seeing you!",
  "scheduleAt": "2024-01-21T09:00:00Z"
}
```

**Response** (200):
```json
{
  "sent": {
    "email": 48,
    "sms": 32
  },
  "failed": {
    "email": 2,
    "sms": 1
  },
  "coinsUsed": 112,
  "scheduledAt": "2024-01-21T09:00:00Z"
}
```

#### Get Invitation Status

Check invitation delivery status.

```http
GET /events/:eventId/invitations/:guestId/status
```

**Response** (200):
```json
{
  "guestId": "gst_111aaa",
  "email": {
    "sent": true,
    "sentAt": "2024-01-15T10:30:00Z",
    "opened": true,
    "openedAt": "2024-01-15T14:20:00Z",
    "clicked": true,
    "clickedAt": "2024-01-15T14:22:00Z"
  },
  "sms": {
    "sent": true,
    "sentAt": "2024-01-15T10:30:00Z",
    "delivered": true,
    "deliveredAt": "2024-01-15T10:31:00Z"
  }
}
```

### Analytics

#### Get Event Analytics

Get analytics for a specific event.

```http
GET /events/:eventId/analytics
```

**Response** (200):
```json
{
  "summary": {
    "totalGuests": 75,
    "invited": 75,
    "rsvpCount": 62,
    "attending": 50,
    "notAttending": 10,
    "maybe": 2,
    "pending": 13,
    "rsvpRate": 82.7,
    "attendanceRate": 66.7,
    "buzzScore": 85
  },
  "timeline": [
    {
      "date": "2024-01-15",
      "rsvps": 12,
      "cumulative": 12
    },
    {
      "date": "2024-01-16",
      "rsvps": 18,
      "cumulative": 30
    }
  ],
  "engagement": {
    "emailOpenRate": 92.5,
    "emailClickRate": 78.3,
    "smsDeliveryRate": 98.7,
    "averageResponseTime": "2.3 days"
  },
  "demographics": {
    "byRSVP": {
      "attending": 50,
      "notAttending": 10,
      "maybe": 2,
      "pending": 13
    },
    "plusOnes": {
      "totalPlusOnes": 35,
      "averagePerGuest": 0.47
    }
  }
}
```

#### Export Analytics

Export analytics as CSV or PDF.

```http
GET /events/:eventId/analytics/export
```

**Query Parameters**:
- `format`: `csv` or `pdf`

**Response** (200):
```
Content-Type: application/csv
Content-Disposition: attachment; filename="event-analytics.csv"

[CSV data]
```

### Subscriptions

#### Get Subscription

Get current subscription details.

```http
GET /subscriptions/current
```

**Response** (200):
```json
{
  "tier": "PRO",
  "status": "ACTIVE",
  "currentPeriodStart": "2024-01-01T00:00:00Z",
  "currentPeriodEnd": "2024-02-01T00:00:00Z",
  "cancelAtPeriodEnd": false,
  "features": {
    "maxEvents": -1,
    "maxGuestsPerEvent": 500,
    "premiumTemplates": true,
    "advancedAnalytics": true,
    "customBranding": false,
    "apiAccess": false
  },
  "usage": {
    "eventsThisMonth": 8,
    "emailsSent": 450,
    "coinsUsed": 120
  }
}
```

#### Upgrade Subscription

Upgrade to a higher tier.

```http
POST /subscriptions/upgrade
```

**Request Body**:
```json
{
  "tier": "BUSINESS"
}
```

**Response** (200):
```json
{
  "tier": "BUSINESS",
  "status": "ACTIVE",
  "effectiveDate": "2024-01-21T00:00:00Z"
}
```

### Payments

#### Purchase Coins

Buy coin packages.

```http
POST /payments/coins/purchase
```

**Request Body**:
```json
{
  "packageId": "pkg_250",
  "paymentMethodId": "pm_xxxxx"
}
```

**Response** (200):
```json
{
  "id": "txn_abc123",
  "amount": 2500,
  "coins": 275,
  "bonus": 25,
  "status": "COMPLETED",
  "createdAt": "2024-01-20T10:00:00Z"
}
```

#### Get Transaction History

List all transactions.

```http
GET /payments/transactions
```

**Query Parameters**:
- `type` (optional): Filter by type (`COIN_PURCHASE`, `SUBSCRIPTION`, `REFUND`)
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response** (200):
```json
{
  "data": [
    {
      "id": "txn_abc123",
      "type": "COIN_PURCHASE",
      "amount": 2500,
      "coins": 275,
      "status": "COMPLETED",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

## Webhooks

Receive real-time notifications for events.

### Setting Up Webhooks

1. Go to Settings → Webhooks
2. Click "Add Webhook"
3. Enter webhook URL
4. Select events to subscribe to
5. Save webhook

### Webhook Events

| Event | Description |
|-------|-------------|
| `event.created` | New event created |
| `event.updated` | Event details changed |
| `event.deleted` | Event deleted |
| `guest.added` | Guest added to event |
| `guest.updated` | Guest information changed |
| `rsvp.received` | Guest RSVP received |
| `invitation.sent` | Invitation sent |
| `invitation.opened` | Invitation opened |
| `payment.completed` | Payment processed |
| `subscription.updated` | Subscription changed |

### Webhook Payload

```json
{
  "id": "evt_webhook_123",
  "type": "rsvp.received",
  "createdAt": "2024-01-20T10:00:00Z",
  "data": {
    "eventId": "evt_456def",
    "guestId": "gst_111aaa",
    "rsvpStatus": "ATTENDING",
    "respondedAt": "2024-01-20T10:00:00Z"
  }
}
```

### Verifying Webhooks

Webhooks include a signature in the `X-Webhook-Signature` header:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

## SDKs

Official SDKs for popular languages:

### JavaScript/TypeScript

```bash
npm install buzzinvitly
```

```javascript
import { BuzzInvitly } from 'buzzinvitly';

const client = new BuzzInvitly({
  apiKey: 'YOUR_API_KEY'
});

// List events
const events = await client.events.list();

// Create event
const event = await client.events.create({
  name: 'My Event',
  eventType: 'BIRTHDAY',
  eventDate: '2024-07-15T17:00:00Z'
});

// Send invitations
await client.invitations.send(event.id, {
  guestIds: ['gst_111aaa'],
  methods: ['EMAIL']
});
```

### Python

```bash
pip install buzzinvitly
```

```python
from buzzinvitly import BuzzInvitly

client = BuzzInvitly(api_key='YOUR_API_KEY')

# List events
events = client.events.list()

# Create event
event = client.events.create(
    name='My Event',
    event_type='BIRTHDAY',
    event_date='2024-07-15T17:00:00Z'
)

# Send invitations
client.invitations.send(
    event_id=event.id,
    guest_ids=['gst_111aaa'],
    methods=['EMAIL']
)
```

### Ruby

```bash
gem install buzzinvitly
```

```ruby
require 'buzzinvitly'

client = BuzzInvitly::Client.new(api_key: 'YOUR_API_KEY')

# List events
events = client.events.list

# Create event
event = client.events.create(
  name: 'My Event',
  event_type: 'BIRTHDAY',
  event_date: '2024-07-15T17:00:00Z'
)

# Send invitations
client.invitations.send(
  event_id: event.id,
  guest_ids: ['gst_111aaa'],
  methods: ['EMAIL']
)
```

## Support

- **API Status**: status.buzzinvitly.com
- **Email**: api@buzzinvitly.com
- **Documentation**: docs.buzzinvitly.com/api
- **Changelog**: docs.buzzinvitly.com/api/changelog

---

**API Version**: 1.0.0
**Last Updated**: January 2024
