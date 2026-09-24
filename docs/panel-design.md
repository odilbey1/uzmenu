# Panel design reference lock

Target: the existing `/dashboard` design, as requested by the user.
Refero live lookup returned NO_SUBSCRIPTION. Bundled color and craft references supplement the existing product.

| Decision | Source | Role |
| --- | --- | --- |
| Stone-50 canvas, white cards, stone-200 borders, rounded-2xl cards | Existing admin dashboard | Shared surfaces across both roles |
| Orange-600 actions, orange-700 hover, orange-50 active navigation | Dashboard and Refero color guide | Actions and navigation, not decorative backgrounds |
| Shared top navigation, 7xl content, 8-unit vertical padding | Dashboard layout | Same structure on both panels |
| Longest matching route, aria-current, visible text on mobile | Refero craft navigation/accessibility guidance | Identify the current section, including nested restaurant pages |
| Darker semantic green/red text on light backgrounds | Refero color guide | Success and destructive/error states |

Preserve existing Geist type, Uzbek copy, routes, forms and role behavior. No new imagery is needed. Remove the super-admin sidebar, dark surfaces, decorative glow and gradient actions. Both roles use the same shell component to prevent future drift.
