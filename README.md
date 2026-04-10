# React Financial Charts

> **Note:** This repository is a modern fork of [react-financial-charts](https://github.com/react-financial/react-financial-charts) (which was originally a fork of [react-stockcharts](https://github.com/rrag/react-stockcharts)). The original `react-stockcharts` has been unmaintained for 8+ years, and `react-financial-charts` has not seen updates in over 3 years.

> **Note:** v1 is a fully breaking change with large parts, if not all, rewritten. Do not expect the same API! although the same features should exist.

---

![React](https://img.shields.io/badge/React-16%7C17%7C18%7C19-4B32C3?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-2.9.1-E3FF00?logo=d3.js&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-8.6.18-5B8CD6?logo=storybook&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-8.40.0-61DAFB?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-2.8.8-FDE2C6?logo=prettier&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-C0C0C0)
[![Deploy Storybook](https://github.com/sgonzaloc/react-financial-charts/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/sgonzaloc/react-financial-charts/actions/workflows/gh-pages.yml)

---

🚀 **Want to contribute?**

We welcome collaborators who wish to contribute and help enhance this trading tool. Feel free to reach out to the maintainers to get involved.

---

## About This Fork

This is the **most up-to-date version** of React Financial Charts, featuring:

-   ✅ **Storybook 8** - Latest version with modern UI
-   ✅ **React 19 Ready** - Full compatibility with React 19
-   ✅ **TypeScript** - Fully typed with latest TypeScript 4.9+
-   ✅ **Updated Dependencies** - All dependencies modernized
-   ✅ **New Interactive Tools** - Rectangle and Price Range tools
-   ✅ **Performance Optimizations** - `shouldComponentUpdate` improvements
-   ✅ **Selection Support** - Click to select any interactive object

The original repositories are no longer actively maintained:

-   `react-stockcharts` - No updates for 8+ years
-   `react-financial-charts` - No updates for 3+ years

This fork continues development with modern tooling and new features.

---

Charts dedicated to finance.

The aim with this project is create financial charts that work out of the box.

### Features

-   Multiple chart types (Scatter, Area, Line, Candlestick, OHLC, HeikenAshi, Renko, Kagi, Point & Figure)
-   Technical indicators (EMA, SMA, MACD, RSI, Bollinger Bands, ATR, Stochastic, and more)
-   Interactive drawing tools (Trendline, Fibonacci, Gann Fan, Channel, Rectangle, Price Range)
-   **Selection support** - Click to select any interactive object
-   **Performance optimizations** - `shouldComponentUpdate` prevents unnecessary re-renders
-   **Storybook stories** - Complete interactive documentation

---

### Chart types

-   Scatter
-   Area
-   Line
-   Candlestick
-   OHLC
-   HeikenAshi
-   Renko
-   Kagi
-   Point & Figure

### Indicators

-   EMA, SMA, WMA, TMA
-   Bollinger band
-   SAR
-   MACD
-   RSI
-   ATR
-   Stochastic (fast, slow, full)
-   ForceIndex
-   ElderRay
-   Elder Impulse

### Interactive Drawing Tools

-   **Trendline** - Draw trend lines for support and resistance analysis
-   **Fibonacci Retracement** - Identify potential reversal levels using Fibonacci ratios
-   **Gann Fan** - Gann fan lines based on angular relationships
-   **Equidistant Channel** - Parallel channels for price action analysis
-   **Rectangle** - Draw rectangular shapes for annotations and area highlighting
-   **Price Range** - Measure price differences (absolute change + percentage)

---

## Installation

This package is currently under active development. For now, please clone the repository and use `yalc` for local development:

```bash
git clone https://github.com/sgonzaloc/react-financial-charts.git
cd react-financial-charts
npm ci
npm run build
yalc push
```

## Documentation

[Documentation](https://sgonzaloc.github.io/react-financial-charts)

## Interactive Tools Demo

You can test all interactive drawing tools in the [Storybook](https://sgonzaloc.github.io/react-financial-charts):

-   **Trendline** - Draw and move trend lines
-   **Fibonacci Retracement** - Interactive Fibonacci levels
-   **Gann Fan** - Gann fan angles
-   **Equidistant Channel** - Parallel channel drawing
-   **Rectangle** - Draw and annotate rectangular areas
-   **Price Range** - Measure percentage change between two price points

## Contributing

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md)

This project is a mono-repo that uses [Lerna](https://lerna.js.org/) to manage dependencies between packages.

To get started run:

```bash
git clone https://github.com/sgonzaloc/react-financial-charts.git
cd react-financial-charts
npm ci
npm run build
```

To start up a development server run:

```bash
npm start
```

## Deployment

This project automatically deploys the Storybook documentation to GitHub Pages when changes are pushed to the `main` branch.

## Performance Improvements

Recent updates include:

-   **`shouldComponentUpdate`** implemented on all interactive components to prevent unnecessary re-renders
-   **Throttled canvas drawing** for smoother resize operations
-   **Optimized hover detection** using bounding boxes

## Storybook Stories

Complete Storybook documentation available for all interactive components:

-   Equidistant Channel
-   Fibonacci Retracement
-   Gann Fan
-   Rectangle
-   Price Range
-   Trendline
-   Rays
-   Extended Lines

## Roadmap

-   [x] Convert to typescript
-   [x] Bump dependencies to latest
-   [x] Remove React 16 warnings
-   [x] Add CI
-   [x] Fix passive scrolling issues
-   [x] Implement PRs from react-stockcharts
-   [x] Add all typings
-   [x] Move examples to storybook
-   [x] Add all series' to storybook
-   [x] Split project into multiple packages
-   [x] Fix issues with empty datasets
-   [x] Correct all class props
-   [x] Migrate to new React Context API
-   [x] Remove all UNSAFE methods
-   [x] Allow to select trends
-   [x] Add selection support for all interactive objects
-   [x] Improve performance on renders with shouldComponentUpdate
-   [x] Add Rectangle drawing tool
-   [x] Add Price Range measurement tool
-   [x] Add Storybook stories for all interactive components
-   [x] Upgrade to Storybook 8
-   [x] React 19 compatibility
-   [x] Update all dependencies to latest versions
-   [ ] Add full test suite

## Contributors ✨

Thanks goes to these wonderful people:

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sgonzaloc"><img src="https://avatars.githubusercontent.com/u/6353386?v=4?s=100" width="100px;" alt="gonzalo"/><br /><sub><b>Gonzalo Sanchez Cano</b></sub></a></td>
    </tr>
  </tbody>
</table>

## LICENSE

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B13613%2Fgit%40github.com%3Areactivemarkets%2Freact-financial-charts.git.svg?type=large)](https://app.fossa.com/projects/custom%2B13613%2Fgit%40github.com%3Areactivemarkets%2Freact-financial-charts.git?ref=badge_large)
