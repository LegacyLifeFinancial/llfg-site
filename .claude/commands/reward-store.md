Build gamification reward marketplace for the LLFG portal. Agents spend XP on rewards: gift cards, swag, extra leads, PTO, premium features.

## What to Build
1. Reward catalog with items, XP cost, availability
2. XP balance display and transaction history
3. Redemption flow: select reward → confirm → deduct XP → notify manager
4. Reward categories: physical (swag), digital (gift cards), perks (PTO, leads)
5. Manager approval workflow for high-value rewards
6. Featured reward of the month spotlight

## Integration Points
- Reward Store agent (spec_rewards) manages catalog
- Gamification system provides XP balance
- Notifications agent confirms redemptions
