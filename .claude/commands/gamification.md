Build or enhance the gamification system in the LLFG portal (index.html). This skill covers XP, levels, badges, streaks, daily challenges, and leaderboards.

**System architecture:**
- `LLFG_Gamification` — Global engine: XP tracking, levels (1-10), badges (17 types), daily challenges, streak monitoring
- `LLFG_GamificationAgent` — Command Center agent: monitors XP events, alerts on level-ups and badge awards
- XP bar renders on Dashboard (buildPortalOverview) and Training tab (renderTrainingCurriculum)
- All data persisted in localStorage key `llfg_gamification`
- Training progress in localStorage key `llfg_training_progress`

**Key methods:**
- `LLFG_Gamification.awardXP(action, meta)` — Awards XP for an action
- `LLFG_Gamification.awardBadge(badgeId)` — Awards a badge
- `LLFG_Gamification.getLevel()` / `getNextLevel()` / `getLevelProgress()`
- `LLFG_Gamification.getDailyChallenges()` / `completeChallenge(idx)`
- `LLFG_Gamification.completeUnit(unitId)` / `isUnitComplete(unitId)`
- `LLFG_Gamification.getCourseProgress(courseId)` / `getOverallProgress()`
- `LLFG_Gamification.renderXPBar()` — Returns HTML for the XP progress bar

**XP Actions:** complete_unit (50), complete_chapter (200), complete_course (500), log_deal (100), daily_login (25), first_deal_month (250), pass_quiz (75), perfect_quiz (150), referral_submitted (100), streak_7 (200), streak_30 (500), streak_90 (1500)

**Levels:** Rookie → Licensed Agent → Rising Producer → Consistent Closer → Power Producer → Elite Advisor → Senior Advisor → Master Producer → Agency Leader → Legend

**When modifying:** Ensure LLFG_Gamification is defined before TRAINING_CURRICULUM. The engine must be initialized before any render function calls it. Badge IDs must match between BADGES array and awardBadge calls.

Read index.html before making changes. Do not break the existing gamification-training integration.