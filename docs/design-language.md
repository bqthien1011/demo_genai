# Design Language: Jewelry Chat Interface

This document outlines the design language for the Jewelry Chat Interface, derived from the `feature-improve-chatbox-ui.md` design document and the `ChatBox.tsx` implementation. It serves as a reference for applying consistent styling, colors, and interactions across components, ensuring a cohesive and premium user experience.

## Core Principles

- **Glassmorphism**: Use semi-transparent backgrounds with backdrop blur for a modern, layered effect. Applies to panels, input bars, and overlays.
- **Neumorphic Elements**: Subtle shadows and gradients on cards/bubbles to create depth without harsh borders, conveying a tactile, premium feel.
- **Motion and Feedback**: Smooth transitions (150-200ms for entries, 100ms for hovers) and interactive animations (e.g., ping on clicks) to enhance responsiveness.
- **Desktop-First Responsive**: Prioritize desktop layouts with breakpoints for mobile degradation.
- **Accessibility**: High contrast ratios, focus-visible rings, and ARIA labels for inclusive design.

## Color Palette

- **Primary Accent (Gold)**: `#b97a2b` to `#d3a955` gradient. Used for CTA buttons, highlights, and interactive states (e.g., send button, hover brightness-110).
- **User Messages**: Radial gradient `circle_at_top_left` from `rgba(32,80,150,0.9)` to `rgba(16,54,115,0.95)`, with white text.
- **Assistant Messages**: `bg-white/80` with `text-slate-900`.
- **Backgrounds and Surfaces**:
  - Main chat background: Radial gradient `circle_at_top` from `#fbfcff` to `#f2f4ff` to `#ece8ff`.
  - Glass panels: `bg-white/70` with `backdrop-blur-2xl`, `border-white/50`.
  - Overlays: `bg-gradient-to-br from-[#f6f8ff]/80 via-[#ffffff]/70 to-[#f9f5ff]/80`.
- **Neutrals**: Slate grays for text (`text-slate-900`, `text-slate-400`), subtle borders (`border-white/60`), and shadows (`shadow-[0_18px_40px_-20px_rgba(32,79,150,0.35)]`).
- **Highlights**: `text-[#b97a2b]` for emphasis.

## Typography

- **Base Font**: System font stack (default Tailwind).
- **Sizes**: `text-base` for body text, `text-xs` for labels/captions.
- **Weights**: `font-semibold` for headers, normal for body.
- **Colors**: `text-slate-900` for primary, `text-slate-400` for secondary, `text-white` for user bubbles.
- **Styles**: Uppercase with `tracking-[0.28em]` for section headers (e.g., "Prompt suggestions").
- **Placeholders**: `placeholder:text-slate-400` for input fields.

## Spacing and Layout

- **Border Radius**: `rounded-full` for input bars/buttons, `rounded-3xl` for bubbles/cards, `rounded-2xl` for panels.
- **Shadows**: Soft, colored shadows like `shadow-[0_24px_60px_-20px_rgba(36,57,133,0.35)]` for depth.
- **Gaps and Padding**: `gap-3` for inline elements, `px-4 py-2` for input padding, `px-6 py-8` for message areas.
- **Flexbox**: Predominant layout with `flex items-center justify-between` for horizontal alignment.
- **Responsive**: `md:basis-1/2 lg:basis-1/3` for carousel items, `h-screen` for full-height containers.

## Components Styles

- **ChatLayout**: Full-height container with radial background, glass panels for messages/prompts, and composer at bottom.
- **MessageBubble**: User: Gradient background with white text, subtle shadow. Assistant: White/85 with slate text, animate-pulse for typing.
- **PromptCard**: White/80 background, hover translate-y-1, gradient overlay on hover, rounded-2xl.
- **Input Composer**: Glass panel with inline upload/input/send buttons, rounded-full container.
- **Buttons**: Accent buttons with gold gradient, hover brightness. Upload button with ping animation on click.
- **Carousel**: ShadCN Carousel with shadow-lg arrows, basis classes for responsive sizing.

## Animations and Interactions

- **Entry Transitions**: Fade/slide for new messages (150-200ms).
- **Hover Effects**: 100ms transitions on cards/buttons (e.g., hover:bg-slate-200/90).
- **Click Feedback**: Scale-95 and ping animation for upload button (500ms duration).
- **Typing Indicator**: animate-pulse on assistant bubble.
- **Scroll**: Smooth scroll to bottom on new messages.

## Implementation Guidelines

- **Theme Tokens**: Use `src/lib/theme/chatbox.ts` for consistency. Extend with new tokens as needed.
- **Tailwind Classes**: Audit for reuse; use `cn` helper for conditional classes.
- **Performance**: Prefer CSS transitions; lazy load if bundle grows.
- **Future Extensions**: Apply this language to new components (e.g., modals, tooltips) by mirroring glass/neumorphic styles and gold accents.

This design language ensures the interface feels modern, premium, and intuitive, aligning with the jewelry theme while maintaining usability.
