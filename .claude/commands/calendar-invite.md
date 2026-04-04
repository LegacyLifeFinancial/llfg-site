Build or enhance calendar invite and scheduling functionality in the LLFG portal (index.html). This skill connects the existing calendar system to real calendar services and adds team scheduling features.

## Current State
- `renderPortalCal()` (~lines 8234-8262) renders a calendar grid view
- `addPortalCalEvent()` (~lines 8269-8334) creates events locally
- `renderPortalCalUpcoming()` (~lines 8336-8358) shows upcoming events
- `renderCalendar()` (~lines 6359-6386) admin calendar event list
- `addCalEvent()` (~lines 6388-6422) admin event creation
- Event types: Interview, Call, Onboarding, upline_call, downline_call, team_meeting, client_call, training_session, follow_up
- `PC_COLORS` object (~lines 8218-8226) for event type color coding
- `CAL_TPL_DATA` (~lines 8361-8420+) email templates for calendar events
- Google Calendar links generated via web redirect (not API)
- `portalCalEvents = []` and `calEvents = []` — local arrays only, no persistence
- No recurring events, no conflict detection, no iCal export

## 1. Google Calendar API Integration
To enable real two-way sync:

### Option A: Google Calendar Web Links (Current — Enhance)
The portal currently creates Google Calendar links. Enhance by:
- Pre-filling all fields: title, description, location, guests, reminders
- Adding proper URL encoding for special characters
- Format: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=TITLE&dates=START/END&details=DESC&location=LOC&add=GUEST_EMAILS`

### Option B: Google Calendar API (Full Integration)
If user wants full sync, implement via Netlify Function:
- Create `/netlify/functions/calendar-sync.js`
- Use Google Calendar API v3 with OAuth 2.0
- Endpoints needed: list events, create event, update event, delete event
- Store OAuth tokens securely (NOT in client-side code)
- Add a "Sync Calendar" button that calls the Netlify function

**Default to Option A** unless the user specifically requests API integration.

## 2. Calendar Invite Generation
Enhance `addPortalCalEvent()` to generate proper invites:

### Email Invite
```javascript
function sendCalendarInvite(event) {
  const icsContent = generateICS(event);
  // Open mailto: with .ics attachment or
  // Use email template from CAL_TPL_DATA
  const tpl = CAL_TPL_DATA[event.type];
  // Fill template variables and open email client
}
```

### ICS File Generation
```javascript
function generateICS(event) {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LLFG Portal//EN
BEGIN:VEVENT
DTSTART:${formatICSDate(event.date, event.time)}
DTEND:${formatICSDate(event.date, event.endTime)}
SUMMARY:${event.title}
DESCRIPTION:${event.notes}
LOCATION:${event.location}
ORGANIZER:mailto:${currentUser.email}
ATTENDEE:mailto:${event.guestEmail}
END:VEVENT
END:VCALENDAR`;
}
```
- Allow downloading `.ics` files for Outlook/Apple Calendar compatibility
- Include RSVP request in the invite

## 3. Team Scheduling Features
Add team-aware scheduling:
- **Availability view**: Show when team members are free (based on their events)
- **Conflict detection**: Warn when booking over an existing event
- **Team meeting scheduler**: Pick a time when all selected team members are available
- **Recurring events**: Add recurrence patterns (daily, weekly, monthly)
  - Store recurrence rule: `{ frequency: 'weekly', interval: 1, until: '2026-12-31' }`
  - Generate instances on-the-fly from the rule

## 4. Event Type Templates
Enhance the existing event type templates:

| Event Type | Auto-populated Fields |
|-----------|---------------------|
| Interview | 30 min, Zoom link, follow-up reminder |
| Onboarding | 60 min, checklist in notes, manager CC'd |
| Team Meeting | 45 min, all team members as guests |
| Client Call | 30 min, client name/policy in notes |
| Training | 60 min, training material links |
| Upline Call | 15 min, upline auto-selected as guest |

## 5. Notification & Reminders
Add reminder functionality:
- Toast notification when an event is approaching (if portal is open)
- Email reminder option (uses existing email template system)
- Configurable reminder times: 15 min, 30 min, 1 hour, 1 day before
- Store reminders in event object: `event.reminders = [{ type: 'toast', before: 15 }]`

## 6. Calendar View Enhancements
Improve the existing calendar grid:
- **Month/Week/Day** toggle views
- **Drag to create** events (click and drag across time slots)
- **Color coding** by event type (use existing `PC_COLORS`)
- **Mini calendar** in sidebar for quick date navigation
- **Today button** to jump back to current date

## 7. Role-Based Calendar Access
- **FA**: Sees own events + team meetings they're invited to
- **Manager**: Sees own + team events + can create team meetings
- **Executive+**: Sees all teams' events + org-wide scheduling
- **Admin**: Full access + can create events as any user

## 8. Data Persistence
Currently events are lost on page refresh. Options:
- **localStorage**: Quick fix, per-browser only
  ```javascript
  localStorage.setItem('llfg_cal_events', JSON.stringify(portalCalEvents));
  ```
- **Netlify Function + DB**: For real persistence across devices
- Default to localStorage unless user requests backend persistence

## 9. Integration Points
- Link calendar events to email templates (already partially done via CAL_TPL_DATA)
- Link to client profiles when event is a client call
- Link to agent profiles when event is a team meeting
- Add calendar widget to the Overview tab (`ptab-overview`) showing next 3 events

## 10. Div Balance Safety
- All new calendar UI must be inside `ptab-calendar`
- Count div opens/closes before and after changes
- Verify agentDash balance

## Output
After implementation:
1. List of calendar features added or enhanced
2. Confirm ICS generation works
3. Show the Google Calendar link format being used
4. Verify div balance
5. Note any role-based restrictions applied
6. Confirm event persistence method chosen