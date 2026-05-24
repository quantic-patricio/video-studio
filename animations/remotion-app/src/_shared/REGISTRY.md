# Shared Components Registry

Catalogue of shared components in `_shared/`.
Claude reads this file **before building each scene** to suggest existing
components and avoid duplication.

## How to use this file

1. **Before each scene** — read this registry.
2. **Suggest** existing components that apply to the scene.
3. **If a new pattern is needed** — ask the user if it should be shared.
4. **When creating a new `_shared/` component** — add its entry here immediately.
5. **When modifying props or behavior** — update the corresponding entry.

## Entry format

```
### ComponentName
- **Path**: `_shared/ComponentName.tsx`
- **Description**: what it does and when to use it.
- **Props**: list of props with type and default.
- **Variants**: typical usage contexts.
- **Preview**: registered in Root.tsx as `<Composition id="Shared-ComponentName">`.
```

---

## Components

> No shared components yet. They are created as episodes are built and
> reusable patterns are extracted (2+ usages or user approval).
