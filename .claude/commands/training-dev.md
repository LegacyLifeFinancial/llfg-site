Build or enhance the training system in the LLFG portal (index.html). This skill covers course content, the training renderer, progress tracking, and the Training Coach agent.

**Architecture:**
- `TRAINING_CURRICULUM` array — Contains all courses and role-tier training
- `renderTrainingCurriculum()` — Gamified renderer with XP bar, daily challenges, badges, course cards, progress bars, and expandable modules
- `_renderTrainingSection()` — Renders individual course/tier sections with per-unit completion buttons
- `completeTrainingUnit(unitId, btn)` — Marks a unit complete, awards 50 XP, checks course completion badges
- `LLFG_TrainingCoachAgent` — Command Center agent that monitors progress and recommends courses

**Course structure:**
Each TRAINING_CURRICULUM entry has: `{id, role, roleLabel, icon, color, isCourse (bool), courseTag, description, chapters: [{title, units: [{id, title, icon, duration, content}]}]}`

**Existing courses (isCourse:true):**
1. `100k_blueprint` — $100K Monthly AP Blueprint (PRODUCTION) — 4 modules, 10 units
2. `zero_chargeback` — Zero Chargeback System (RETENTION) — 3 modules, 8 units
3. `compliance_cert` — Compliance Certification (COMPLIANCE) — 4 modules, 8 units

**Role-tier training (isCourse:false):**
1. `fa` — Financial Advisor (foundations, sales mastery, chargebacks, mindset)
2. `manager` — Insurance Manager (team building, recruiting, systems)
3. `executive` — Executive Producer (metrics, forecasting, scaling)
4. `managing_partner` — Managing Partner (business ownership, replication, multi-state)

**Progress tracking:** Uses `LLFG_Gamification.completeUnit()`, `isUnitComplete()`, `getCourseProgress()`. Stored in localStorage `llfg_training_progress`.

**Badge triggers:** course_foundations (all FA units), course_100k, course_chargeback, course_compliance — awarded on 100% course completion.

**When adding courses:** Add to TRAINING_CURRICULUM array before the `];`. Set `isCourse:true` and `courseTag` for specialized courses. Unit IDs must be globally unique. Add corresponding badge to LLFG_Gamification.BADGES if desired.

Read index.html before making changes.
