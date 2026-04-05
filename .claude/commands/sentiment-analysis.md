Analyze communication sentiment in the LLFG portal. Flag negative interactions, track satisfaction trends, alert managers on issues.

## What to Build
1. Simple keyword-based sentiment scoring (positive/neutral/negative word lists)
2. Apply to: email templates sent, chat messages, notes on contacts
3. Contact sentiment score (rolling average of interactions)
4. Manager alert when contact sentiment drops below threshold
5. Team sentiment dashboard with trends over time
6. Sentiment breakdown by communication channel

## Integration Points
- Sentiment Analyzer agent (anal_sent) processes text
- CRM contacts get sentiment score field
- Retention Agent uses sentiment for churn prediction
