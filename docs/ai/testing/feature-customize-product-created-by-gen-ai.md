---
title: "Feature Testing Template"
feature: "customize-product-created-by-gen-ai"
status: "implemented"
---

# Unit Tests

- **MaterialSelector**: Test option rendering, selection state, click handler.
- **StoneSelector**: Test option rendering, selection state, click handler.
- **ColorSelector**: Test option rendering, selection state, click handler.
- **customizationService**: Test mock API delay, response structure.
- **ProductContext**: Test customization state updates.

# Integration Tests

- **Customization Flow**: Test full page load → selection → regeneration → image update.
- **Context Integration**: Test selections persist across component updates.
- **Error Handling**: Test failed regeneration displays error message.

# Manual Testing Steps

1. Generate AI products via chatbot.
2. Click "Tùy chỉnh" on an AI product card.
3. Verify customization page loads with product image.
4. Change material, stone, color selections.
5. Click "Tạo lại ảnh" and observe loading state.
6. Verify new image appears after ~1.5 seconds.
7. Test error by simulating network failure (if possible).
8. Navigate back and verify context persistence.

# Test Code

```typescript
// Unit test for MaterialSelector
import { render, screen, fireEvent } from "@testing-library/react";
import { MaterialSelector } from "@/components/MaterialSelector";

test("renders and handles selection", () => {
  const mockOnChange = jest.fn();
  const options = [{ id: "gold-14k", name: "Vàng 14K", karat: 14 }];

  render(
    <MaterialSelector
      options={options}
      selected="gold-14k"
      onChange={mockOnChange}
    />
  );

  expect(screen.getByText("Vàng 14K (14K)")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Vàng 14K (14K)"));
  expect(mockOnChange).toHaveBeenCalledWith("gold-14k");
});
```

```typescript
// Integration test for customization page
import { render, waitFor, screen } from "@testing-library/react";
import CustomizationPage from "@/app/customize/[productId]/page";

test("completes customization flow", async () => {
  // Mock context and params
  render(<CustomizationPage params={{ productId: "test-id" }} />);

  // Select options
  fireEvent.click(screen.getByText("Vàng 18K"));
  fireEvent.click(screen.getByText("Sapphire"));
  fireEvent.click(screen.getByText("Vàng hồng"));

  // Click regenerate
  fireEvent.click(screen.getByText("Tạo lại ảnh"));

  // Check loading
  expect(screen.getByText("Đang tạo...")).toBeInTheDocument();

  // Wait for completion
  await waitFor(() => {
    expect(screen.queryByText("Đang tạo...")).not.toBeInTheDocument();
  });
});
```

# Unit Tests

- Test MaterialSelector renders options and handles selection.
- Test StoneSelector updates state on change.
- Test ColorSelector validates required fields.
- Test CustomizationPage loads product data correctly.
- Test mock service returns expected image URL after delay.

# Integration Tests

- Test full customization flow: Select options → Submit → Regenerate image → Display new image.
- Test navigation from product card to customization page.
- Test context updates persist across page reloads.
- Test error handling when mock service fails.

# Manual Testing Steps

1. Navigate to AI-generated products in the app.
2. Click "Customize" on a product card.
3. Verify customization page loads with product image.
4. Select different material, stone, color options.
5. Click "Regenerate" and wait for loading.
6. Verify new image appears.
7. Test back navigation to product list.
8. Test on mobile/responsive design.

# Test Code

Example unit test for MaterialSelector:

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import MaterialSelector from "@/components/MaterialSelector";

test("selects material option", () => {
  const mockOnChange = jest.fn();
  render(<MaterialSelector selected="gold-14k" onChange={mockOnChange} />);

  const option = screen.getByText("Vàng 18K");
  fireEvent.click(option);

  expect(mockOnChange).toHaveBeenCalledWith("gold-18k");
});
```

Example integration test:

```typescript
import { render, waitFor } from "@testing-library/react";
import CustomizationPage from "@/app/customize/[productId]/page";

test("regenerates image on submit", async () => {
  render(<CustomizationPage params={{ productId: "1" }} />);

  // Select options...
  // Click submit...

  await waitFor(() => {
    expect(screen.getByAltText("Regenerated product")).toBeInTheDocument();
  });
});
```
