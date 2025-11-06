---
title: "MVP - Find and suggest product Testing"
feature: "mvp-find-and-suggest-product"
status: "draft"
---

# Test Cases

## Functional Tests

### TC-001: Basic Product Suggestion Flow

**Steps:**

1. User types "I want a gold necklace"
2. AI asks clarifying questions (budget, occasion, style)
3. User answers questions
4. AI suggests products in carousel

**Expected:** Carousel displays relevant gold necklaces

### TC-002: Skip Questions

**Steps:**

1. User provides detailed description upfront
2. AI suggests products without additional questions

**Expected:** Direct product suggestions

### TC-003: No Matching Products

**Steps:**

1. User requests impossible combination (e.g., "free diamond ring")
2. AI responds appropriately

**Expected:** Helpful message, no carousel or alternative suggestions

### TC-004: Carousel Interaction

**Steps:**

1. Products displayed in carousel
2. User scrolls through products
3. User clicks on product

**Expected:** Smooth scrolling, product details (future)

## UI/UX Tests

### TC-005: Mobile Responsiveness

**Steps:** Access on mobile device
**Expected:** Carousel adapts to screen size

### TC-006: Theme Consistency

**Steps:** View in chat interface
**Expected:** Matches existing glassmorphism theme

## Performance Tests

### TC-007: Load Time

**Steps:** Trigger product suggestions
**Expected:** Carousel loads within 2 seconds

### TC-008: Memory Usage

**Steps:** Multiple suggestion flows
**Expected:** No memory leaks

# Test Data

Mock products with varied attributes:

- 5 gold necklaces ($100-500)
- 3 silver bracelets ($50-200)
- 2 diamond earrings ($1000+)
- 4 wedding rings (various materials)
- Tags: gold, silver, diamond, necklace, bracelet, earrings, ring, wedding, casual

# Test Environment

- **Local Development:** Next.js dev server
- **Staging:** Deployed version for UAT
- **Browsers:** Chrome, Safari, Firefox
- **Devices:** Desktop, mobile (iOS/Android)

# Test Results

_To be updated during testing phase_

# Bug Reports

_None reported yet_
