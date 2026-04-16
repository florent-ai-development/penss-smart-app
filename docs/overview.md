# PENSS — App Overview

## Purpose

PENSS is a mental health companion app based on Cognitive Behavioral Therapy (CBT) principles. It helps users:

1. **Log stress-triggering events** through a structured 5-step journaling flow (situation → emotions → automatic thoughts → rational thoughts → re-evaluation).
2. **Evaluate their daily stress level** on a 0–10 scale and track it over time.
3. **Review statistics** on their events and emotions over different time periods.

The app is entirely in **French** and targets French-speaking users seeking self-guided CBT support.

---

## Screen Inventory

| Screen | File reference | Description |
|---|---|---|
| Home | `first-page.png` | App entry point, navigation hub |
| New Event – Step 1/5 | `new-event-1.png` | Describe triggering situation |
| New Event – Step 2/5 | `new-event-2.png` | Select felt emotion(s) |
| New Event – Step 3/5 | `new-event-3.png` | Describe automatic thoughts + belief level |
| New Event – Step 4/5 | `new-event-4.png` | Identify cognitive biases + rational thoughts |
| New Event – Step 5/5 | `new-event-5.png` | Re-evaluate emotion intensity after reflection |
| My Events | `my-events.png` | List of active events |
| My Events (empty state) | `my-events-empty.png` | Empty state for My Events |
| My Events – Archived | `my-events-archived.png` | List of archived events |
| Event Detail | `my-event-detail.png` | Read-only detail + archive/delete actions |
| Stress Evaluation | `stress-evaluation.png` | Daily stress input (slider + emoji) |
| Stress History | `stress-history.png` | Past stress entries list |
| Statistics – Week | `statistics-day.png` | Stats filtered by current week (filename is misleading; content shows "Semaine" tab) |
| Statistics – Month | `statistics-month.png` | Stats filtered by current month |
| Statistics – Year | `statistics-year.png` | Stats filtered by current year |

---

## Recommended Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 52+) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Local storage | AsyncStorage + custom repository layer |
| Charts | `react-native-gifted-charts` (bar + donut support, lightweight) |
| Animations | React Native Reanimated 3 |
| Gradient | `expo-linear-gradient` |
| UUID generation | `expo-crypto` (`randomUUID()`) |
| Styling | StyleSheet (no Tailwind; keep it native) |
| Date handling | `date-fns` with `fr` locale |

> All data is stored **locally on device** — no backend, no auth, no network calls.

---

## App Language

All UI strings are in **French**. No i18n library is required; strings can be hardcoded in French.
