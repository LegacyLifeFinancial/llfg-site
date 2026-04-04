Build or enhance the GIF library and emoji reactions in the LLFG portal messaging system (index.html). This skill adds new GIF categories, expands emoji sets, and improves the picker UX.

## Architecture

### GIF System
- **Location**: `GIF_CATEGORIES` object (~line 10912 in index.html)
- **Structure**: `{ 'Category Name': ['url1.gif', 'url2.gif', ...] }`
- **Picker**: `sendMsgGif()` function renders a popup panel from `GIF_CATEGORIES`
- **Send**: `selectGif(url)` pushes `{me:true, type:'gif', src:url, time:...}` to thread
- **Source**: Use Giphy embed URLs format: `https://media.giphy.com/media/{ID}/giphy.gif`

### Emoji System
- **Reaction bar**: Inline emojis in the input toolbar (line ~4912 in HTML)
- **Reaction picker**: `REACTION_EMOJIS` array (~line 10613) — floating picker for message reactions
- **Send**: `sendReaction(emoji)` adds `{emoji, count:1}` to last message's reactions array
- **Display**: Rendered inline under each message bubble

## When Adding GIFs

### Step 1: Identify Categories to Add
Good categories for an insurance/sales team portal:
- **Sales & Hustle** — grinding, closing deals, making money
- **Team Spirit** — high fives, teamwork, group celebrations
- **Congratulations** — trophies, awards, champagne
- **Funny / Reactions** — laughing, facepalm, mind blown
- **Motivation** — never give up, keep going, you got this
- **Thank You** — appreciation, gratitude
- **Good Morning** — coffee, sunrise, energy

### Step 2: Add to GIF_CATEGORIES
Find the `GIF_CATEGORIES` object and add new entries. Use 3-5 GIFs per category. Always use the Giphy embed format.

### Step 3: Improve Picker UX (if requested)
- Add search/filter input at top of GIF panel
- Add tab-style category navigation
- Increase panel width for better grid layout
- Add hover preview enlargement
- Round corners on GIF thumbnails (border-radius: 8px)

## When Adding Emojis

### Step 1: Expand REACTION_EMOJIS
Add more emoji options to the `REACTION_EMOJIS` array for the floating picker.

### Step 2: Update Toolbar Quick-React Bar
The toolbar bar in the input area (id="reactionBar") shows a subset of quick-react emojis. Add or change these to match the most-used reactions.

### Step 3: Add Emoji Categories (if requested)
Group emojis into categories for a richer picker:
- Reactions: 👍 👎 ❤️ 😂 😮 😢 🤔
- Celebration: 🎉 🏆 🥂 💯 🙌 👏
- Business: 💰 📈 🤝 💪 🔥 ⭐
- Fun: 🚀 💎 👑 🎯 ⚡ 🦁

## Validation
After changes:
1. Verify `GIF_CATEGORIES` is valid JS (no trailing comma issues)
2. Verify `REACTION_EMOJIS` array syntax is correct
3. Test that `sendMsgGif()` renders all new categories
4. Test that `showReactionPicker()` shows all new emojis
5. Check mobile layout — picker panels should not overflow viewport