Build or enhance the marketing automation system in the LLFG portal (index.html). This skill covers the Marketing Agent, content creation, campaign management, social media scheduling, lead generation, and ad copy.

## Architecture

### Marketing Agent: `LLFG_MarketingAgent`
- **ID**: `marketing`
- **Location**: Inside index.html, after the AI Content Agent class (~line 14873+)
- **Registration**: In `LLFG_Brain.init()` (~line 13008): `this.register(new LLFG_MarketingAgent());`
- **Storage**: localStorage keys prefixed `llfg_mkt_`

### Integration Points
- **Email Agent** (`LLFG_Brain.agents.email`) — send campaign emails, drip sequences
- **AI Content Agent** (`LLFG_Brain.agents.aicontent`) — generate images for social posts, brochures
- **Recruiting Agent** (`LLFG_Brain.agents.recruiting`) — auto-nurture leads from recruiting pipeline
- **Event Bus** (`LLFG_EventBus`) — listen to `recruiting:stageChanged`, `sales:dealClosed`; emit `marketing:contentPublished`, `marketing:campaignSent`

### Data Models

#### Campaign
```javascript
{
  id: 'mkt_camp_123',
  name: 'Spring Recruiting Push',
  type: 'email' | 'social' | 'multi-channel',
  channels: ['email', 'linkedin', 'facebook'],
  status: 'draft' | 'active' | 'paused' | 'completed',
  audience: 'prospects' | 'agents' | 'clients' | 'custom',
  steps: [
    { type:'email', templateId:'tpl_1', delayHours:0 },
    { type:'social', platform:'linkedin', content:'...', delayHours:24 },
    { type:'email', templateId:'tpl_2', delayHours:72 }
  ],
  metrics: { sent:0, opened:0, clicked:0, converted:0 },
  createdAt: timestamp
}
```

#### Content Item
```javascript
{
  id: 'mkt_content_123',
  type: 'social_post' | 'brochure' | 'ad_copy' | 'email_blast' | 'flyer',
  platform: 'linkedin' | 'facebook' | 'instagram' | 'email' | 'print',
  title: 'Join LLFG — $10K First Month',
  body: 'Full text content...',
  imageUrl: null, // AI-generated via Pollinations
  status: 'draft' | 'scheduled' | 'published',
  scheduledAt: timestamp,
  createdAt: timestamp
}
```

### Agent Capabilities

#### 1. Content Creation
- **Social Media Posts**: LinkedIn recruiting posts, Facebook ads, Instagram stories
- **Email Campaigns**: Multi-step drip sequences for prospects, agents, clients
- **Brochures/Flyers**: Text + AI-generated images for print or digital distribution
- **Ad Copy**: Meta/Facebook ad copy with headline, body, CTA variations

#### 2. Campaign Automation
- **Drip Campaigns**: Multi-step email sequences triggered by recruiting pipeline stage
- **Social Scheduler**: Queue posts for LinkedIn, Facebook, Instagram with date/time
- **A/B Variants**: Generate multiple headline/body variations for testing
- **Auto-Nurture**: Listen to recruiting events, auto-enroll prospects in nurture sequences

#### 3. Lead Generation
- **LinkedIn Templates**: Connection request messages, InMail templates, post templates
- **Referral Campaigns**: Agent-to-agent referral tracking
- **Landing Page Copy**: Generate persuasive copy for LLFG landing pages
- **Ad Audiences**: Define target audiences for Meta/Facebook campaigns

#### 4. Analytics
- **Campaign Performance**: Sent, opened, clicked, converted metrics
- **Content Library**: Track all created content with status
- **Channel ROI**: Which platform drives most leads
- **Pipeline Attribution**: Which campaign sourced which recruit

### UI Sections (Command Center)

#### Marketing Dashboard Card
Shows in Command Center alongside other agent cards:
- Active campaigns count
- Content in queue
- Leads generated this month
- Top performing campaign

#### Marketing Tab Content
Rendered when Marketing Agent card is expanded or a dedicated section:
1. **Campaign Manager** — create, edit, activate campaigns
2. **Content Studio** — create social posts, emails, brochures with AI assist
3. **Social Scheduler** — calendar view of scheduled posts
4. **Lead Nurture** — view/manage drip sequences
5. **Templates** — reusable marketing templates library
6. **Analytics** — performance metrics dashboard

### Template Library (Built-in)
Pre-loaded marketing templates:
- LinkedIn Connection Request (recruiting)
- LinkedIn Post: Income Opportunity
- LinkedIn Post: Success Story
- Facebook Ad: Join Our Team
- Facebook Ad: Financial Freedom
- Email: Cold Outreach to Prospect
- Email: Warm Follow-Up
- Email: Success Testimonial
- Brochure: LLFG Overview
- Brochure: Compensation Plan
- Flyer: Local Recruiting Event

### Scheduled Tasks
```javascript
this.schedule(() => this._processContentQueue(), 60000);    // Publish scheduled content
this.schedule(() => this._checkCampaignProgress(), 120000);  // Advance drip campaigns
this.schedule(() => this._updateAnalytics(), 300000);        // Refresh metrics
```

## Implementation Order
1. Define `LLFG_MarketingAgent` class with data models and core methods
2. Register in `LLFG_Brain.init()`
3. Add built-in marketing templates (MKT_TEMPLATES array)
4. Build Command Center UI section for marketing
5. Wire up Event Bus integrations
6. Add content creation forms (social post composer, email builder, brochure designer)
7. Add campaign wizard (multi-step setup flow)
8. Add analytics dashboard

## External Automation Integration (n8n + Mautic)

### n8n Webhook Workflows (via Netlify Functions)
n8n is a workflow automation platform with 400+ integrations. It cannot run on Netlify, but connects via webhooks through Netlify Functions as a secure proxy.

#### Architecture
```
Portal (index.html) → Netlify Function → n8n Webhook → Automation Workflow
```

#### Key Workflow Patterns
1. **Lead Routing**: Form submit → Netlify Function → n8n webhook → score lead → route to CRM + assign agent + send welcome email
2. **Drip Campaign Orchestration**: Recruiting stage change → n8n webhook → multi-step sequence (email day 0, SMS day 3, follow-up day 7)
3. **Social Scheduling**: Content Studio publish → n8n webhook → post to LinkedIn API + Facebook API + schedule follow-up
4. **Event-Driven Nurture**: `recruiting:stageChanged` event → Netlify Function → n8n → auto-enroll in nurture sequence via SendGrid/Mailchimp

#### Netlify Function Proxy Pattern
```javascript
// netlify/functions/marketing-webhook.js
exports.handler = async (event) => {
  const payload = JSON.parse(event.body);
  const response = await fetch('https://your-n8n.example.com/webhook/marketing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
```

### Mautic Integration (Marketing Automation API)
Mautic provides contact management, lead scoring, campaign automation, and email marketing via REST API (OAuth2).

#### Mautic JS Tracking (Drop-in)
Add visitor tracking to the landing page with zero build step:
```html
<script>(function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
a=d.createElement(t);m=d.getElementsByTagName(t)[0];
a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://your-mautic.example.com/mtc.js','mt');
mt('send','pageview');</script>
```

#### Mautic API Calls (via Netlify Function proxy)
- `POST /api/contacts/new` — Create lead from portal form
- `POST /api/campaigns/{id}/contact/{contactId}/add` — Enroll in drip campaign
- `GET /api/contacts/{id}` — Pull lead score and engagement history
- `POST /api/emails/{id}/send/lead/{contactId}` — Trigger email from campaign

### Integration Priority
1. **Start with n8n** — one webhook can replace dozens of manual onboarding/lead routing steps
2. **Add Mautic later** — for lead scoring, advanced segmentation, and multi-channel campaign orchestration
3. **Keep API keys server-side** — all external calls route through Netlify Functions, NEVER from client

## Validation
- Agent registers and starts without errors
- Campaigns persist in localStorage across sessions
- Email sending works via Email Agent integration
- Content queue processes on schedule
- Event Bus listeners fire correctly
- UI renders in Command Center
- Mobile-responsive layout
- External webhook integrations route through Netlify Functions (no API keys in index.html)
