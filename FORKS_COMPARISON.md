# Forks Comparison

## Technical comparison

| Feature               | `react-stockcharts` | `react-financial-charts` |                            `@sgonzaloc/react-financial-charts`                             |
| :-------------------- | :------------------ | :----------------------- | :----------------------------------------------------------------------------------------: |
| **React**             | 15 / 16             | 16 / 17                  |                                        **18 / 19**                                         |
| **TypeScript**        | ❌                  | ✅ (4.9.5)               |                                         ✅ (4.9.5)                                         |
| **d3**                | v1.x                | v6                       |                                             v6                                             |
| **Storybook**         | ❌                  | 6.1.20                   |                                         **8.6.14**                                         |
| **Interactive tools** | Basic               | Basic                    | **+ Rectangle, Arrow, Price Range, Marquee Zoom, Freehand Brush, Linear Regression, Text** |
| **Status**            | Unmaintained (2018) | Unmaintained (2023)      |                                         **Active**                                         |

## Version lineage

| Project                                         | Version tags                              | Notes                                   |
| :---------------------------------------------- | :---------------------------------------- | :-------------------------------------- |
| `react-stockcharts` (original)                  | `v0.1.0` → `v0.7.8`                       | Original library.                       |
| `react-financial-charts` (first fork)           | `v0.1.0` → `v1.0.0` (breaking) → `v2.0.1` | Restarted version numbers from v0.1.0.  |
| `@sgonzaloc/react-financial-charts` (this fork) | `v3.0.0` → `v3.x` (current)               | Continues their versioning from v2.0.1. |

> **Breaking change:** `react-financial-charts` broke API at its v1.0.0. This fork (v3.x) continues from their v2.0.1 with no additional breaking changes. Do not expect API compatibility with `react-stockcharts`.

> **Recommendation:** Use this fork for new projects with React 18/19. Use `react-financial-charts` v2 only if stuck on React 17. Avoid `react-stockcharts`.
