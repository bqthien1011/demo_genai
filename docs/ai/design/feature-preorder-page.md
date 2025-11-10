---
title: "Feature Design Template"
feature: "preorder-page"
status: "draft"
---

# System Architecture

```mermaid
graph TD
    A[User] --> B[PreorderPage /preorder/[productId]]
    B --> C[ProductInfoSection]
    B --> D[CustomerInfoSection]
    B --> E[ShippingSection]
    B --> F[PaymentSection]
    B --> G[PromotionsSection]
    B --> H[PolicySection]
    B --> I[OrderNotesSection]

    C --> J[GET /api/products/[productId]]
    D --> K[Form Validation]
    E --> L[GET /api/locations/provinces]
    E --> M[GET /api/locations/districts/[provinceId]]
    E --> N[GET /api/locations/wards/[districtId]]

    I --> O[POST /api/preorders]

    J --> P[Mock Product Data]
    L --> Q[Mock HCM Location Data]
    M --> Q
    N --> Q
    O --> R[Mock Preorder Submission]

    P --> S[Product Service]
    Q --> T[Location Service]
    R --> U[Preorder Service]
```

**Architecture Flow**:

- User accesses preorder page with productId parameter
- Page loads product data and renders form sections
- Form collects customer, shipping, payment, and promotion data
- Location data is lazy-loaded based on user selections (HCM only)
- Form submission sends preorder data to mock service
- Success/error states handled with user feedback

**Note**: Backend APIs will be implemented later. Current implementation uses mock data services for development and testing.

# Data Models

```typescript
interface PreorderData {
  productId: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    birthDate?: string;
    notifications: boolean;
  };
  shipping: {
    method: "delivery" | "pickup";
    address?: {
      province: string;
      district: string;
      ward: string;
      street: string;
    };
    storeId?: string; // For pickup method
  };
  payment: {
    method: "bank_transfer" | "digital_wallet";
  };
  promotions: {
    discountCode?: string;
    appliedOffers: string[];
  };
  notes?: string;
  quantity: number;
}

interface Store {
  id: string;
  name: string;
  address: string;
  district: string;
}

interface Location {
  id: string;
  name: string;
}
```

# API Endpoints

**Note**: Backend APIs will be implemented later. Current implementation uses mock data services.

## Product APIs

- `GET /api/products/[productId]` - Lấy thông tin sản phẩm
  - **Mock Data**: Returns Gen AI generated product with image, name, description, estimated price, release date
  - **Response**: `{ id, name, description, imageUrl, estimatedPrice, releaseDate, quantity: 1 }`

## Location APIs (HCM Only)

- `GET /api/locations/provinces` - Danh sách tỉnh/thành
  - **Mock Data**: Returns only `[{ id: "hcm", name: "Thành phố Hồ Chí Minh" }]`
- `GET /api/locations/districts/[provinceId]` - Danh sách quận/huyện
  - **Mock Data**: Returns HCM districts: Quận 1, Quận 3, Quận 7, Quận Bình Thạnh, Quận Tân Bình, etc.
- `GET /api/locations/wards/[districtId]` - Danh sách phường/xã
  - **Mock Data**: Returns wards for selected district (e.g., for Quận 1: Bến Nghé, Bến Thành, Cô Giang, etc.)

## Store APIs (PNJ Stores in HCM)

- `GET /api/stores` - Danh sách cửa hàng PNJ tại HCM
  - **Mock Data**: Returns PNJ store locations:
    ```json
    [
      {
        "id": "pnj_diamond_plaza",
        "name": "PNJ Diamond Plaza",
        "address": "Lô T2-03, Tầng Trệt, TTTM Diamond Plaza, 34 Lê Duẩn, Quận 1",
        "district": "Quận 1"
      },
      {
        "id": "pnj_paragon",
        "name": "PNJ Paragon",
        "address": "Tầng 1, TTTM Paragon, 3 Nguyễn Lương Bằng, Quận 7",
        "district": "Quận 7"
      },
      {
        "id": "pnj_go_vap",
        "name": "PNJ Gò Vấp",
        "address": "456 Quang Trung, Phường 10, Gò Vấp",
        "district": "Gò Vấp"
      }
    ]
    ```

## Preorder APIs

- `POST /api/preorders` - Tạo preorder mới
  - **Mock Implementation**: Validates form data, simulates API delay (2s), returns success/error
  - **Request**: Full PreorderData interface
  - **Response**: `{ success: true, orderId: "PRE-{timestamp}", message: "Preorder created successfully" }`

# Components

1. **PreorderPage** - Main page component with route `/preorder/[productId]`
2. **ProductInfoSection** - Displays product image, name, description, estimated price, release date, quantity selector
3. **CustomerInfoSection** - Form for name, phone, email, birth date, notification preferences
4. **ShippingSection** - Radio buttons for delivery vs pickup
   - **Delivery**: Cascading dropdowns for province (HCM only) → district → ward → street input
   - **Pickup**: Dropdown selection of PNJ stores in HCM with store details display
5. **PaymentSection** - Radio buttons for bank transfer or digital wallet with payment instructions
6. **PromotionsSection** - Discount code input and display of applied offers
7. **PolicySection** - Pre-order terms in collapsible accordion/modal
8. **OrderNotesSection** - Order notes textarea and submit button with loading states

## Mock Data Implementation

**Location Data (HCM Only)**:

- Provinces: Single entry for "Thành phố Hồ Chí Minh"
- Districts: Major HCM districts (Quận 1, 3, 7, Bình Thạnh, Tân Bình, Gò Vấp, etc.)
- Wards: Realistic ward names for each district

**Store Data (PNJ Locations)**:

- 5-7 major PNJ store locations across HCM districts
- Include store name, full address, and district for filtering

**Product Data**:

- Mock Gen AI product with realistic jewelry attributes
- Include estimated price range, release timeline, product images

# Design Decisions

- Sử dụng vertical layout với các section riêng biệt
- Form validation với react-hook-form + zod
- Responsive design với Tailwind CSS
- Loading states và error handling cho UX tốt
- Modal/accordion cho policy section để không chiếm nhiều không gian

# Security Considerations

- Validate input data phía client và server
- Sanitize user input để tránh XSS
- Rate limiting cho API endpoints
- Không lưu trữ thông tin thanh toán nhạy cảm

# Performance Considerations

- Lazy load location data khi user chọn
- Optimize images với Next.js Image component
- Debounce form validation
- Cache product data nếu có thể
