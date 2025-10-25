# Match Organizer Feature

## Overview
The Match Organizer is a comprehensive page for users who want to host and manage sports matches on Sportsy.

## Route
`/organizer` (Protected - requires authentication)

## Components Structure

### Main Page
- **Location**: `client/src/pages/Organizer.jsx`
- **Purpose**: Main container that orchestrates all organizer components
- **Features**:
  - Sticky header with back navigation
  - Full-width stats section
  - Two-column responsive layout
  - Info banner for first-time users
  - Footer with links

### Sub-Components (in `client/src/components/Organizer/`)

#### 1. CreateMatchForm.jsx
Creates new matches with the following fields:
- **Sport Type** (dropdown): Football, Cricket, Basketball, Badminton, Tennis, Volleyball
- **Date & Time** (pickers): Match scheduling
- **Turf Selector** (text input): Location/turf search
- **Max Players** (range slider): 2-30 players
- **Match Type** (toggle): Open Match vs Invite-Only
- **Submit Button**: Calls mock API (ready for backend integration)

#### 2. InvitePlayers.jsx
Invite and share match with players:
- **Shareable Link**: Copy match URL to clipboard
- **Invite Methods**: Username or Email
- **Social Sharing**: WhatsApp and Twitter integration
- **Status Indicator**: Shows when match is created

#### 3. MatchControls.jsx
Manage active matches:
- **Match ID & QR Code**: Display/hide QR for easy sharing
- **Match Status Badge**: Open/Locked indicator
- **Player Count**: Current/Max display
- **Player Lists**: 
  - Joined Players (with remove option)
  - Pending Invites
- **Control Buttons**:
  - Lock/Unlock Match
  - Cancel Match (with confirmation)

#### 4. MatchStats.jsx
Gamification and host statistics:
- **Host Badge**: Gold Captain badge with tier
- **Stats Grid**: 
  - Total matches hosted
  - Active matches
  - Total players
  - Points earned
- **Points Progress**: Visual progress bar to next milestone
- **Achievements**: Unlocked badges and accomplishments
- **Recent Activity**: Latest match actions with points
- **Leaderboard**: Regional rank preview

## Features

### ✅ Completed (Frontend)
- Responsive design for mobile, tablet, desktop
- Dark theme with yellow accents (matching Sportsy brand)
- Form validation
- Mock data and handlers
- Smooth animations and transitions
- QR code generation
- Social sharing integration
- Gamification elements

### 🔄 Ready for Backend Integration
All components use mock handlers that log data to console. Ready API endpoints:

1. **POST** `/api/organizer/matches` - Create match
   ```javascript
   {
     sportType: string,
     date: string,
     time: string,
     turf: string,
     maxPlayers: number,
     matchType: 'open' | 'invite-only'
   }
   ```

2. **POST** `/api/organizer/matches/:id/invite` - Send invite
3. **PATCH** `/api/organizer/matches/:id/lock` - Lock/unlock match
4. **DELETE** `/api/organizer/matches/:id` - Cancel match
5. **DELETE** `/api/organizer/matches/:id/players/:playerId` - Remove player
6. **GET** `/api/organizer/stats` - Get host statistics

## Navigation

### Access Points
1. **From Dashboard**: Profile dropdown → "Create Match" button
2. **Direct URL**: `/organizer`
3. **Header**: Back arrow returns to Dashboard

### Route Protection
- Requires authentication
- Redirects to `/signin` if not logged in
- Preserves intended destination after login

## Theme & Design
- **Colors**: Dark slate background with yellow/orange gradient accents
- **Typography**: Bold headings, clean sans-serif body text
- **Components**: Rounded corners (xl), subtle borders, gradient buttons
- **Animations**: Smooth transitions, hover effects, scale transforms
- **Icons**: SVG icons for actions and stats
- **Responsive**: Mobile-first approach with breakpoints at 640px, 768px, 1024px

## Dependencies
- `react` - Core framework
- `react-router-dom` - Routing and navigation
- `react-qr-code` - QR code generation
- `framer-motion` - (already installed, can be used for future animations)

## Testing Workflow
1. Sign in to Sportsy
2. Navigate to Dashboard
3. Click profile dropdown → "Create Match"
4. Fill out match creation form
5. Submit to see match ID generated
6. Test invite features (copy link, send invites)
7. View QR code
8. Test match controls (lock/unlock, cancel)
9. Review stats and achievements section

## Future Enhancements
- Real-time player join notifications (Socket.io)
- Match chat functionality
- Advanced filtering for match history
- Export match data (PDF/CSV)
- Push notifications for match updates
- Payment integration for turf booking
- Google Maps integration for turf locations
- Photo uploads for match results
- Rating system for hosts
- Advanced analytics dashboard

## Notes
- All mock data can be replaced with real API calls
- Console logs are in place for debugging
- Alert dialogs are temporary - replace with toast notifications
- Form data structure matches expected backend schema
