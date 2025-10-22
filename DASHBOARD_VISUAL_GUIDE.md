# 🎨 SPORTSY Dashboard - Visual Guide

## 🖥️ Desktop Layout (> 1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚽ SPORTSY      [📅 Bookings] [💬 Chat] [👤 Profile]          [👤 A] │ ← Header
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Hi Aman 👋                                                          │ ← Greeting
│  Ready to play?                                                      │
│                                                                       │
│  ┌────────────────────────────────────────────┐                     │
│  │  🔍  Search Turf...                        │                     │ ← Search
│  └────────────────────────────────────────────┘                     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ⚡ UPCOMING                                                  │   │
│  │  Upcoming Match                          [View Details] →    │   │ ← Match Card
│  │  📅 Friday, October 25, 2025 • 6:00 PM                      │   │
│  │  📍 Champions Arena Sports Complex                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐     │
│  │ ⚡           │  │ 📅           │  │ 🏆                    │     │
│  │ Match        │  │ My           │  │ Gamification          │     │ ← Feature Cards
│  │ Organizer    │  │ Bookings     │  │                       │     │   (3 columns)
│  │              │  │              │  │                       │     │
│  │[Create Match]│  │[View Booking]│  │[Leaderboard]          │     │
│  └──────────────┘  └──────────────┘  └──────────────────────┘     │
│                                                                       │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                               │
│  │ 12  │  │  8  │  │ 450 │  │ #15 │                               │ ← Stats Grid
│  │Books│  │Match│  │Pts  │  │Rank │                               │   (4 columns)
│  └─────┘  └─────┘  └─────┘  └─────┘                               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 📱 Mobile Layout (< 768px)

```
┌──────────────────────────────┐
│  ⚽ SPORTSY      [☰]    [👤 A] │ ← Header with Hamburger
├──────────────────────────────┤
│                              │
│  Hi Aman 👋                  │ ← Greeting
│  Ready to play?              │
│                              │
│  ┌─────────────────────────┐│
│  │ 🔍 Search Turf...       ││ ← Search
│  └─────────────────────────┘│
│                              │
│  ┌─────────────────────────┐│
│  │ ⚡ UPCOMING             ││
│  │ Upcoming Match          ││ ← Match Card
│  │ 📅 Oct 25 • 6PM        ││   (Stacked)
│  │ 📍 Champions Arena     ││
│  │ [View Details] →        ││
│  └─────────────────────────┘│
│                              │
│  ┌─────────────────────────┐│
│  │ ⚡ Match Organizer      ││ ← Feature Cards
│  │ [Create Match]          ││   (Single Column)
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 📅 My Bookings         ││
│  │ [View Bookings]         ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 🏆 Gamification        ││
│  │ [Leaderboard]           ││
│  └─────────────────────────┘│
│                              │
│  ┌───────┐   ┌───────┐     │
│  │  12   │   │   8   │     │ ← Stats
│  │ Books │   │ Match │     │   (2x2 Grid)
│  └───────┘   └───────┘     │
│  ┌───────┐   ┌───────┐     │
│  │  450  │   │  #15  │     │
│  │  Pts  │   │ Rank  │     │
│  └───────┘   └───────┘     │
│                              │
└──────────────────────────────┘
```

## 🎯 Avatar Dropdown Interaction

### Closed State
```
┌──────────────────────────┐
│  SPORTSY      [👤 A]     │ ← Click avatar
└──────────────────────────┘
```

### Open State
```
┌──────────────────────────┐
│  SPORTSY      [👤 A]     │
│                    ↓      │
│              ┌──────────────────┐
│              │  ┌──┐            │
│              │  │A │  Aman      │ ← User Info
│              │  └──┘  user@...  │
│              │                   │
│              │  🆔 ID: USR-XYZ   │ ← User ID
│              │                   │
│              │  [🚪 Logout]      │ ← Logout Button
│              └──────────────────┘
└──────────────────────────┘
```

## 📱 Mobile Menu Interaction

### Closed State
```
┌──────────────────────────┐
│  ⚽ SPORTSY  [☰]  [👤 A] │ ← Click hamburger
└──────────────────────────┘
```

### Open State
```
┌──────────────────────────┐
│  ⚽ SPORTSY  [✕]  [👤 A] │
├──────────────────────────┤
│  [📅 Bookings]           │ ← Active (cyan)
│  [💬 Chat]               │
│  [👤 Profile]            │
└──────────────────────────┘
```

## 🎨 Animation Flow

### Page Load Sequence (Staggered)

```
Time:  0ms    100ms   200ms   300ms   400ms   500ms
       │      │       │       │       │       │
       ▼      ▼       ▼       ▼       ▼       ▼
    Greeting  Match   Card1   Card2   Card3   Stats
    & Search  Card

Effect: ↑ Slide Up + Fade In
        opacity: 0 → 1
        translateY: 4px → 0px
```

### Hover Animation States

```
CARDS (Feature Cards)
─────────────────────────
Rest State:
  • Border: dim glow
  • Position: normal
  • Shadow: small

Hover State:
  • Border: bright glow
  • Position: -translate-y-1
  • Shadow: large + colored glow
  • Icon: scale 110%
  • Duration: 300ms
```

```
BUTTONS (All CTA Buttons)
─────────────────────────
Rest State:
  • Gradient: direction 1
  • Shadow: medium glow
  • Scale: 100%

Hover State:
  • Gradient: overlays reverse
  • Shadow: intense glow
  • Scale: 105%
  • Duration: 300ms
```

## 🎯 Color System

### Gradient Map
```
Element              Start Color    End Color
─────────────────────────────────────────────
Background           #0a0f1f        #111a2f
Logo Text            #06b6d4        #3b82f6
Avatar Border        #06b6d4        #8b5cf6
Username Text        #06b6d4        #8b5cf6
Match Organizer      #06b6d4        #3b82f6
My Bookings          #3b82f6        #8b5cf6
Gamification         #8b5cf6        #ec4899
Logout Button        #f87171        #ef4444
```

### Border Glow Colors
```
Element              Color          Opacity
─────────────────────────────────────────
Search (focus)       cyan-500       20% → 40%
Match Card           cyan-500       20% → 40%
Match Organizer      cyan-500       20% → 50%
My Bookings          blue-500       20% → 50%
Gamification         purple-500     20% → 50%
Stats                respective     20% → 40%
```

## 🔲 Spacing & Sizing

### Container Widths
```
Max Width: 1280px (7xl)
Padding:   1rem (mobile) → 2rem (desktop)
Gap:       1rem (mobile) → 1.5rem (desktop)
```

### Card Padding
```
Mobile:    p-6 (1.5rem)
Tablet:    p-6 (1.5rem)
Desktop:   p-8 (2rem)
```

### Border Radius
```
Small Items:  rounded-xl  (0.75rem)
Cards:        rounded-2xl (1rem)
Large Cards:  rounded-3xl (1.5rem)
Avatar:       rounded-full
```

### Icon Sizes
```
Small Icons:   w-4 h-4  (1rem)
Medium Icons:  w-5 h-5  (1.25rem)
Large Icons:   w-6 h-6  (1.5rem)
Feature Icons: w-16 h-16 (4rem)
Avatar:        w-11 h-11 (2.75rem)
```

## 📊 Typography Scale

```
Level          Size Class      Pixel Size   Usage
───────────────────────────────────────────────────
Hero           text-5xl        48px         Main heading
Title          text-3xl        30px         Card titles
Subtitle       text-xl         20px         Descriptions
Body           text-base       16px         Normal text
Small          text-sm         14px         Labels
Tiny           text-xs         12px         Metadata
```

### Font Weights
```
Regular        400             Body text
Medium         500             Subtitles
Semibold       600             Nav links
Bold           700             Buttons
Extrabold      800             Section titles
Black          900             Hero text
```

---

## 🎬 User Flow Diagram

```
┌─────────────┐
│   Sign In   │
└──────┬──────┘
       │ JWT Token stored
       ▼
┌─────────────┐
│  Dashboard  │◄── Token decoded
└──────┬──────┘    Username extracted
       │
       ├──► 👤 Avatar (shows first letter)
       │    └─► Click → Dropdown
       │         ├─ Username
       │         ├─ Email
       │         ├─ User ID
       │         └─ Logout → Sign In
       │
       ├──► 🔍 Search Turf
       │    └─► Type query (controlled)
       │
       ├──► 📅 Upcoming Match
       │    └─► View Details (future link)
       │
       ├──► ⚡ Match Organizer
       │    └─► Create Match (future link)
       │
       ├──► 📅 My Bookings
       │    └─► View Bookings (future link)
       │
       ├──► 🏆 Gamification
       │    └─► Leaderboard (future link)
       │
       └──► 📊 Stats Display (read-only)
```

---

**Visual Guide Version:** 1.0  
**For:** SPORTSY Dashboard v2.0  
**Date:** October 18, 2025
