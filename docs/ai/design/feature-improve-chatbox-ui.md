---
title: "Feature Design Template"
feature: "improve-chatbox-ui"
status: "draft"
---

# System Architecture

- No changes to backend services or API contracts.
- Frontend updates limited to the `ChatBox` component and shared UI primitives (Buttons, Carousel styling, dialogs).
- Introduce a centralized theme token file (`src/lib/theme/chatbox.ts`) for chat-specific gradients, shadows, and spacing scales.
- Leverage Tailwind/ShadCN composables to build reusable sub-components (message bubble, prompt card) to keep JSX clean.

# Data Models

- Existing `Message` interface remains unchanged.
- Add optional `status` field (e.g., "sent", "delivered") consideration for future iterations but not required in this release.
- Introduce local config object for prompt metadata (title, subtitle, icon) to support richer prompt cards without impacting backend.

# API Endpoints

- No new endpoints required.
- Existing chat request flow remains intact; UI improvements consume same data shape.

# Components

- `ChatBox` (updated): reorganize layout with panels, gradients, and a glassmorphism effect for the input bar.
- `MessageBubble` (new): encapsulate message styling per role (user, AI, system) with props for avatar, timestamp (future-proof).
- `PromptCarousel` (new wrapper): extends ShadCN Carousel to display prompt cards with iconography and hover animations.
- `AttachmentPreview` (enhanced): ensure uploaded images have subtle border radii, overlay actions, and loading shimmer.

# Design Decisions

- Adopt neumorphic-inspired card backgrounds with subtle shadows to convey premium feel while maintaining accessibility.
- Use brand gold accent (#b97a2b) for CTA buttons and highlight states; pair with neutral backgrounds for legibility.
- Apply motion principles: fade/slide transitions (150-200ms) for message entry, 100ms hover animations on prompts.
- Maintain desktop-first layout with responsive breakpoints to degrade gracefully on smaller screens.

# Security Considerations

- Reuse existing sanitization paths; ensure any new rich formatting stays within safe HTML rendered by React.
- Validate that hover/animation additions do not trigger layout shifts that could expose hidden content.

# Performance Considerations

- Lazy load heavy assets (icons, gradients) if they exceed base bundle threshold.
- Favor CSS transitions over JavaScript animations to keep main thread free.
- Audit Tailwind class usage to avoid duplicated utility combinations—consider using `cn` helper with variants.
