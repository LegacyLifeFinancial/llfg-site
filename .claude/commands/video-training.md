Build video-based training system for the LLFG portal. YouTube/Vimeo embed, progress tracking, quiz after video, completion certificates.

## What to Build
1. Video lesson component (embed YouTube/Vimeo via iframe)
2. Watch progress tracking (% watched, timestamps)
3. Post-video quiz with pass/fail threshold
4. Completion certificate generation (HTML → print/PDF)
5. Video playlist/course structure
6. Resume where you left off

## Integration Points
- Video Training agent (spec_videotrn) tracks progress
- Training Coach agent monitors completion
- Gamification awards XP for video completions
