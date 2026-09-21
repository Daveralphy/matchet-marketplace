# Matchet Marketplace Database Schema

**Schema Version:** 1.0.0  
**Status:** Approved  
**Last Updated:** 2026-09-14

## 1. Purpose

This document is the canonical database schema contract for Matchet Marketplace. Backend models must follow this document. It defines data structure, relationships, ownership, indexes, integrity rules, media storage, historical-data protection, and migration requirements.

Schema changes must be deliberate and must follow the migration rules below.

## 2. Core Account Architecture

Matchet uses **one user account per person**.

A user does not create separate accounts for buying, providing services, or selling products. The `User` document owns identity and authentication. Provider and Seller capabilities are attached to that existing User through separate profile documents.

A user may be:

- Buyer only
- Buyer + Provider
- Buyer + Seller
- Buyer + Provider + Seller

There are no separate Provider or Seller accounts, passwords, or authentication sessions.

### 2.1 For Providers entry flow

The `/for-providers` screen is an entry and choice screen. It does not automatically check provider or seller status.

The authenticated user first chooses `Become a Provider` or `Become a Seller`. Only after the user selects an option is the corresponding profile checked.

Provider selection:

- ProviderProfile exists and is active -> Provider Dashboard
- ProviderProfile does not exist -> Provider Onboarding
- ProviderProfile exists with draft status -> Provider Onboarding
- ProviderProfile is suspended -> Provider access is restricted

Seller selection follows the same pattern using StoreProfile.

The existing authenticated session is used throughout. No second login or account creation is required.

## 3. Collections

The initial application schema contains these 12 collections/models:

1. User
2. ProviderProfile
3. StoreProfile
4. Product
5. Service
6. Order
7. Booking
8. Message
9. Review
10. Notification
11. SavedItem
12. Cart

## 4. User

The User collection is the single source of truth for account identity and authentication.

| Field | Type | Required | Unique | Notes |
|---|---|---:|---:|---|
| `_id` | ObjectId | Yes | Yes | MongoDB identifier |
| `firstName` | String | Yes | No | First name |
| `lastName` | String | Yes | No | Last name |
| `username` | String | Yes | Yes | Public username, lowercase |
| `email` | String | Yes | Yes | Lowercase account email |
| `passwordHash` | String | Yes | No | Never expose through API |
| `phone` | String | No | No | Optional |
| `avatar` | Object | No | No | Cloudinary image reference |
| `location` | Object | No | No | User location |
| `preferences` | Object | No | No | User preferences |
| `isActive` | Boolean | Yes | No | Defaults to true |
| `lastLoginAt` | Date | No | No | Last successful login |
| `createdAt` | Date | Yes | No | Timestamp |
| `updatedAt` | Date | Yes | No | Timestamp |

### Username rules

- Unique.
- Stored lowercase and trimmed.
- 3 to 30 characters.
- Letters, numbers, underscores, and periods only.
- No spaces.
- Reserved usernames must be rejected.

### Email rules

- Unique.
- Stored lowercase and trimmed.
- Authentication uses the User account only.

## 5. ProviderProfile

Represents the provider capability belonging to an existing User. Each User can have at most one ProviderProfile.

Relationship: `ProviderProfile.userId -> User._id`

`userId` must be unique.

Fields:

- `userId`: ObjectId, required, ref User
- `businessName`: String, required
- `bio`: String, optional
- `skills`: [String], optional
- `categories`: [String], required
- `experience`: String, optional
- `serviceArea`: Object, optional
- `verificationStatus`: `pending | verified | rejected`, default `pending`
- `status`: `draft | active | suspended`, default `draft`
- `ratingAverage`: Number, default 0, range 0 to 5
- `reviewCount`: Number, default 0
- `createdAt`, `updatedAt`: timestamps

## 6. StoreProfile

Represents the seller/store capability belonging to an existing User. Each User can have at most one StoreProfile.

Relationship: `StoreProfile.userId -> User._id`

`userId` must be unique.

Fields:

- `userId`: ObjectId, required, ref User
- `storeName`: String, required
- `slug`: String, required, unique, lowercase
- `description`: String, optional
- `logo`: image object, optional
- `banner`: image object, optional
- `location`: Object, optional
- `contact`: Object, optional
- `status`: `draft | active | suspended`, default `draft`
- `ratingAverage`: Number, default 0, range 0 to 5
- `reviewCount`: Number, default 0
- `createdAt`, `updatedAt`: timestamps

## 7. Product

Represents a product offered by a seller.

Relationship: `Product.sellerId -> User._id`

The backend must verify that the seller has an active StoreProfile before allowing seller product operations.

Fields:

- `sellerId`: ObjectId, required, ref User
- `name`: String, required
- `description`: String, required
- `category`: String, required
- `price`: Number, required
- `images`: array of image objects
- `inventory`: Number, required
- `location`: Object, optional
- `status`: `draft | active | outOfStock | archived`, default `draft`
- `createdAt`, `updatedAt`: timestamps

Product image:

```js
{
  url: String,
  publicId: String,
  isPrimary: Boolean
}
```

## 8. Service

Represents a service offered by a provider.

Relationship: `Service.providerId -> User._id`

The backend must verify that the provider has an active ProviderProfile before allowing provider service operations.

Fields:

- `providerId`: ObjectId, required, ref User
- `title`: String, required
- `description`: String, required
- `category`: String, required
- `pricing`: Object, required
- `images`: array of image objects
- `location`: Object, optional
- `availability`: Object, optional
- `status`: `draft | active | paused | archived`, default `draft`
- `createdAt`, `updatedAt`: timestamps

Pricing:

```js
{
  type: "fixed" | "startingFrom" | "customQuote",
  amount: Number,
  currency: String
}
```

## 9. Order

Represents a marketplace product transaction.

Relationships:

- `Order.buyerId -> User._id`
- `Order.items[].productId -> Product._id`
- `Order.items[].sellerId -> User._id`

Fields:

- `buyerId`: ObjectId, required
- `items`: array, required
- `subtotal`: Number, required
- `deliveryFee`: Number, required
- `total`: Number, required
- `paymentStatus`: `pending | paid | failed | refunded`
- `orderStatus`: `pending | confirmed | processing | shipped | delivered | cancelled`
- `shippingAddress`: Object, required
- `paymentReference`: String, optional
- `createdAt`, `updatedAt`: timestamps

Order item:

```js
{
  productId: ObjectId,
  sellerId: ObjectId,
  nameSnapshot: String,
  priceSnapshot: Number,
  quantity: Number,
  imageSnapshot: String
}
```

Snapshots preserve what the buyer actually purchased even if the Product later changes.

## 10. Booking

Represents a user's booking of a provider service.

Relationships:

- `Booking.buyerId -> User._id`
- `Booking.providerId -> User._id`
- `Booking.serviceId -> Service._id`

The backend must verify that the referenced Service belongs to the referenced Provider.

Fields:

- `buyerId`: ObjectId, required
- `providerId`: ObjectId, required
- `serviceId`: ObjectId, required
- `scheduledDate`: Date, required
- `scheduledTime`: String, required
- `status`: `pending | confirmed | inProgress | completed | cancelled | declined`
- `priceSnapshot`: Number, required
- `notes`: String, optional
- `createdAt`, `updatedAt`: timestamps

## 11. Message

Represents a message between Matchet users.

Relationships:

- `Message.senderId -> User._id`
- `Message.receiverId -> User._id`

Fields:

- `conversationId`: String, required
- `senderId`: ObjectId, required
- `receiverId`: ObjectId, required
- `content`: String, required
- `attachments`: array, optional
- `readAt`: Date, optional
- `createdAt`, `updatedAt`: timestamps

Attachment:

```js
{
  url: String,
  publicId: String,
  type: String,
  name: String
}
```

## 12. Review

A Review belongs to a User and exactly one target: Product or Service.

Fields:

- `reviewerId`: ObjectId, required, ref User
- `productId`: ObjectId, conditional, ref Product
- `serviceId`: ObjectId, conditional, ref Service
- `rating`: Number, required, 1 through 5
- `comment`: String, optional
- `status`: `published | hidden`, default `published`
- `createdAt`, `updatedAt`: timestamps

Exactly one of `productId` and `serviceId` must be populated.

The backend must verify that the reviewer is eligible to review the target.

## 13. Notification

Fields:

- `userId`: ObjectId, required, ref User
- `type`: String, required
- `title`: String, required
- `message`: String, required
- `relatedId`: ObjectId, optional
- `relatedType`: String, optional
- `isRead`: Boolean, default false
- `createdAt`, `updatedAt`: timestamps

Initial types may include `ORDER_CONFIRMED`, `ORDER_SHIPPED`, `ORDER_DELIVERED`, `BOOKING_CONFIRMED`, `BOOKING_CANCELLED`, `NEW_MESSAGE`, `NEW_REVIEW`, and `PAYMENT_SUCCESS`.

## 14. SavedItem

Represents a Product or Service saved by a User.

Fields:

- `userId`: ObjectId, required, ref User
- `itemType`: `product | service`, required
- `productId`: ObjectId, conditional, ref Product
- `serviceId`: ObjectId, conditional, ref Service
- `createdAt`, `updatedAt`: timestamps

Exactly one of `productId` and `serviceId` must be populated. Duplicate saves for the same User and target are prohibited.

### 14.1 SavedItem API

#### Get authenticated user's saved items

**Endpoint:** `GET /api/saved-items`

Returns the saved products and services belonging to the authenticated user.

The backend must derive the user identity from the authenticated session/token and must not accept a client-supplied `userId`.

**Query parameters:**

- `itemType` - optional: `product` or `service`
- `page` - optional page number, default `1`
- `limit` - optional number of items per page

**Success response:**

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalItems": 0,
      "totalPages": 0
    }
  }
}
```

Each saved item should include the SavedItem information and the related Product or Service data required by the frontend to display the saved-item card.

#### Remove a saved item

**Endpoint:** `DELETE /api/saved-items/:id`

Removes the specified saved item belonging to the authenticated user.

The backend must verify that the saved item belongs to the authenticated user.

**Success response:**

```json
{
  "success": true,
  "message": "Saved item removed successfully"
}
```

#### SavedItem API errors

The API should use the project's standard error response format.

Possible errors include:

- `401` - unauthenticated
- `404` - saved item not found
- `403` - saved item does not belong to the authenticated user
- `500` - server error

## 15. Cart

Represents the active shopping cart for a User.

Fields:

- `userId`: ObjectId, required, unique, ref User
- `items`: array
- `createdAt`, `updatedAt`: timestamps

Cart item:

```js
{
  productId: ObjectId,
  quantity: Number
}
```

The Cart does not hold authoritative Product prices. At checkout, the backend fetches current Product data, validates availability and inventory, calculates the current total, and creates the Order.

## 16. Common Location Structure

Where location is supported:

```js
{
  city: String,
  state: String,
  country: String,
  coordinates: {
    type: "Point",
    coordinates: [Number, Number]
  }
}
```

Coordinates use GeoJSON order: `[longitude, latitude]`. Coordinates are optional unless required by a feature.

## 17. Indexes

Required baseline indexes:

- User: unique `email`, unique `username`
- ProviderProfile: unique `userId`
- StoreProfile: unique `userId`, unique `slug`
- Product: `sellerId`, `category`, `status`, `createdAt`
- Service: `providerId`, `category`, `status`, `createdAt`
- Order: `buyerId`, `items.sellerId`, `paymentStatus`, `orderStatus`, `createdAt`
- Booking: `buyerId`, `providerId`, `serviceId`, `status`, `scheduledDate`
- Message: `conversationId`, `createdAt`, `senderId`, `receiverId`
- Review: `productId`, `serviceId`, `reviewerId`
- Notification: `userId`, `isRead`, `createdAt`
- SavedItem: uniqueness across User and the referenced target
- Cart: unique `userId`

Indexes should be reviewed against actual query patterns before adding large numbers of additional indexes.

## 18. Data Integrity Rules

- Email must be unique.
- Username must be unique.
- Password hashes must never be returned through API responses.
- ProviderProfile.userId must be unique.
- StoreProfile.userId must be unique.
- A User needs an active ProviderProfile before managing Services as a provider.
- A User needs an active StoreProfile before managing Products as a seller.
- Sellers may only manage their own Products.
- Providers may only manage their own Services.
- A Booking's Service must belong to its Provider.
- A Review must reference exactly one target.
- A SavedItem must reference exactly one target.
- A User cannot save the same target twice.
- Each User has one active Cart.
- Current Product data must be revalidated at checkout.
- Server-side authorization is authoritative. Frontend visibility alone is not security.

## 19. Historical Data Protection

Historical transaction data must not depend on mutable marketplace data.

Orders store Product name, price, and image snapshots at purchase time. Bookings store the relevant Service price at booking time.

Changing a Product or Service later must not rewrite historical Order or Booking information.

Transactional records must not be deleted simply because a Product, Service, User, or profile changes.

## 20. Deletion and Archiving

Products and Services with existing transactions should generally be archived rather than physically deleted.

Transactional records must not be hard-deleted when doing so would break historical records, reporting, or relationships.

User accounts must not be physically deleted without an approved data-retention and migration process.

The following destructive operations must not be used against shared or production data except as part of an explicitly approved migration:

```text
dropDatabase()
drop()
deleteMany({})
collection deletion
```

## 21. Media Storage

Matchet uses Cloudinary for media storage, transformation, and delivery.

Image and file assets must not be stored directly in MongoDB. MongoDB stores the Cloudinary `url` and `publicId`.

The Cloudinary API secret must remain backend-only.

## 22. Schema Change and Migration Rules

Every database change must be classified as:

1. Additive change
2. Validation change
3. Index change
4. Field rename
5. Data transformation
6. Field or collection removal

Additive optional fields should generally be backward compatible.

New required fields need a migration strategy for existing documents.

Renames must not rely on simply changing the Mongoose model. Existing documents must be migrated deliberately.

Transformations require a tested migration script.

Removals require confirmation that application code no longer depends on the data and that retention requirements are satisfied.

Back up existing data before destructive or transformative migrations.

Never delete the database to resolve a schema mismatch.

## 23. Model Implementation Rules

Mongoose models should define field types, required fields, defaults, enums, references, indexes, and basic schema validation.

Models should not contain large amounts of business logic. Business logic belongs in service files.

Controllers translate HTTP requests into service calls. Routes define endpoint paths and middleware. Validators handle request-level validation. Middleware handles authentication and authorization.

## 24. API and Security Rules

- Never return `passwordHash` to the frontend.
- Never expose Cloudinary API secrets.
- Derive the authenticated user's identity from the authenticated session/token rather than trusting client-supplied ownership IDs.
- Enforce ownership on the backend.
- Client validation does not replace backend validation.
- Follow the project's standardized API success and error response format.

## 25. Schema Change Checklist

- [ ] `DATABASE_SCHEMA.md` updated.
- [ ] Existing data impact assessed.
- [ ] Migration included when required.
- [ ] Migration tested against representative existing data.
- [ ] Relevant indexes reviewed.
- [ ] Existing API behavior checked.
- [ ] No destructive database reset used.
- [ ] No secrets included.
- [ ] Relevant tests run.
- [ ] Pull request explains data impact and migration requirements.

## Schema Version History

### 1.0.0 - 2026-09-14

Initial approved Matchet Marketplace database schema covering User, ProviderProfile, StoreProfile, Product, Service, Order, Booking, Message, Review, Notification, SavedItem, and Cart.

The one-account architecture and Provider/Seller capability model are established as core rules.
