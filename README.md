# React Financial Charts

> **Note:** this repo is a fork of [react-stockcharts](https://github.com/rrag/react-stockcharts), renamed, converted to typescript and bug fixes applied due to the original project being unmaintained.

> **Note:** v1 is a fully breaking change with large parts, if not all, rewritten. Do not expect the same API! although the same features should exist.
> 
---
![React](https://img.shields.io/badge/React-16%7C17%7C18%7C19-61DAFB?logo=react&logoColor=white)
![React-DOM](https://img.shields.io/badge/React--DOM-16%7C17%7C18%7C19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.1-F9A03C?logo=chart.js&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-2.9.1-F9A03C?logo=d3.js&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-5.15.10-007FFF?logo=mui&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-9.1.0-764ABC?logo=redux&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux--Toolkit-2.2.1-764ABC?logo=redux&logoColor=white)
![Redux-Saga](https://img.shields.io/badge/Redux--Saga-1.3.0-764ABC)
![MIT License](https://img.shields.io/badge/License-MIT-green)
---

Charts dedicated to finance.

The aim with this project is create financial charts that work out of the box.

## Features

- integrates multiple chart types
- technical indicators and overlays
- drawing objects

### Chart types

- Scatter
- Area
- Line
- Candlestick
- OHLC
- HeikenAshi
- Renko
- Kagi
- Point & Figure

### Indicators

- EMA, SMA, WMA, TMA
- Bollinger band
- SAR
- MACD
- RSI
- ATR
- Stochastic (fast, slow, full)
- ForceIndex
- ElderRay
- Elder Impulse

### Interactive Indicators

- Trendline
- Fibonacci Retracements
- Gann Fan
- Channel
- Linear regression channel

---

## Installation

```sh
npm install react-financial-charts
```

## Documentation

[Stories](https://react-financial.github.io/react-financial-charts/)

## Contributing

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md)

This project is a mono-repo that uses [Lerna](https://lerna.js.org/) to manage dependencies between packages.

To get started run:

```bash
git clone https://github.com/react-financial/react-financial-charts.git
cd react-financial-charts
npm ci
npm run build
```

To start up a development server run:

```bash
npm start
```

## Roadmap

- [x] Convert to typescript
- [x] Bump dependencies to latest
- [x] Remove React 16 warnings
- [x] Add CI
- [x] Fix passive scrolling issues
- [x] Implement PRs from react-stockcharts
- [x] Add all typings
- [x] Move examples to storybook
- [x] Add all series' to storybook
- [x] Split project into multiple packages
- [x] Fix issues with empty datasets
- [x] Correct all class props
- [x] Migrate to new React Context API
- [x] Remove all UNSAFE methods
- [ ] Add documentation to storybook
- [ ] Add full test suite

## LICENSE

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B13613%2Fgit%40github.com%3Areactivemarkets%2Freact-financial-charts.git.svg?type=large)](https://app.fossa.com/projects/custom%2B13613%2Fgit%40github.com%3Areactivemarkets%2Freact-financial-charts.git?ref=badge_large)
