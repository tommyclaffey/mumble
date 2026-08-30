# Mumble

Voice-first note taking. Capture by speaking; read it back by listening.

**Origin:** dyslexia. That is not a positioning line — it is why read-aloud
states its position as *"Line 4 of 18"* rather than a timeline scrubber, and
why running text has its own type style with looser leading.

## Stack

Vite · React · TypeScript · CSS custom properties. No component library and no
Tailwind — the primitives are the point.

```
src/
├── styles/tokens.css   three tiers: primitive → semantic → component
├── styles/type.css     18 named styles. Body vs Body/Reading matters.
├── data/model.ts       the domain
└── components/         Surface, Chip
```

## The two decisions already made

**1. A note and a meeting are different types.** In the Figma file they render
as the same screen — Transcript Review assumes speakers and diarization, the
Home Feed calls everything "Mumbles", which are solo captures. One type with
optional fields everywhere is how that ambiguity becomes permanent, so `kind`
is a required discriminant.

**2. Correcting a speaker propagates by voiceprint.** Diarization gets a person
wrong *consistently* — it decides turn 1 is "Speaker 2", then matches that
voiceprint forty more times. Fixing one line and leaving thirty-nine wrong
costs more than it saves.

## 🔴 Before anything ships

**The colour primitives in `tokens.css` are provisional.** The real 15-primitive
ramp is in the Mumble Figma file and has not been transcribed yet. They are
referenced exactly once each, by the semantic tier, so replacing them is one
edit to one block. Dark mode is an inversion, not a designed mode.
