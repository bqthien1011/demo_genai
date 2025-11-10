---
title: "Feature Planning Template"
feature: "preorder-page"
status: "draft"
---

# Task Breakdown

## Frontend Implementation

1. **[x] Create preorder page route** - Set up `/preorder/[productId]` route with basic layout (COMPLETED: Created page.tsx with placeholder sections, route compiles successfully)
2. **[x] Product info section** - Display product image, name, description, price, release date (COMPLETED: Implemented full product display with image, details, price tooltip, release date, and quantity selector)
3. **[x] Customer info form** - Name, phone, email, birth date, notification checkbox (COMPLETED: Implemented form with validation for required fields, Vietnamese phone number regex, email validation, and notification preference)
4. **[x] Shipping options** - Delivery vs pickup selection with address form (COMPLETED: Implemented radio buttons for delivery/pickup, cascading HCM district/ward dropdowns, PNJ store selection with detailed addresses)
5. **[x] Payment methods** - Bank transfer and digital wallet options (COMPLETED: Implemented radio buttons for bank transfer and digital wallet, with detailed payment instructions and preorder-specific notes)
6. **[x] Promotions section** - Discount codes and applied offers (COMPLETED: Implemented discount code input with validation, applied offers display, discount calculation, and available promo codes info)
7. **[x] Policy section** - Pre-order terms in accordion/modal (COMPLETED: Implemented collapsible accordion with comprehensive pre-order terms, payment policies, return policies, and contact information)
8. **[x] Order submission** - Notes textarea and submit button with loading state (COMPLETED: Implemented order notes textarea, comprehensive form validation, submit button with loading states, order summary, success/error feedback with mock order ID generation)
9. **Form validation** - Client-side validation with error messages
10. **Responsive design** - Mobile-first approach with Tailwind CSS

## Backend Integration

11. **API integration** - Connect to product, location, and preorder APIs
12. **Error handling** - Network errors, validation errors, success states
13. **Loading states** - Skeleton loaders and progress indicators

## Testing & Polish

14. **Unit tests** - Test individual components and hooks
15. **Integration tests** - Test form submission and API calls
16. **Manual testing** - Cross-browser and mobile testing
17. **Accessibility** - ARIA labels and keyboard navigation

# Dependencies

- Existing Gen AI product data structure
- Location API for address dropdowns
- Preorder API endpoint
- Form validation library (react-hook-form + zod)
- UI component library consistency

# Effort Estimates

- Frontend components: 3-4 days
- Form validation & state management: 1-2 days
- API integration: 1-2 days
- Testing & polish: 2-3 days
- **Total: 7-11 days** (depending on backend readiness)

# Implementation Order

1. Create basic page structure and routing
2. Implement product info display (easiest first)
3. Build customer info form with validation
4. Add shipping options with conditional address form
5. Implement payment and promotions sections
6. Add policy section and order submission
7. Integrate APIs and error handling
8. Testing and responsive fixes

# Risks and Mitigation

- **Backend APIs not ready**: Start with mock data, implement integration later
- **Complex address validation**: Use existing location APIs, add client-side validation
- **Form UX issues**: User testing early, iterate on validation messages
- **Mobile responsiveness**: Design mobile-first, test on multiple devices
