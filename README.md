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

## Foundations are real

Transcribed from [the Figma file](https://www.figma.com/design/KKImFpu7qv988QP6CVi9Mz/Mumble-App)
via the plugin API on Aug 30 2026 — 49 variables across three collections and
21 text styles. Not invented, not approximated.

**Light mode only.** The variable collection has one mode. An inverted palette
would be a mode nobody designed.

### 🔴 Three things the design system does not define

Named in one block in `tokens.css` so they are never mistaken for transcribed:

| Gap | Current stand-in |
|---|---|
| **Focus ring** | `accent/base`. Obvious, but it is a code decision that should be pushed back into Figma. |
| **Low-confidence tone** | Already logged in the vault as a defect — the chip is an instance override, not a `Tone` variant. |
| **Border widths** | No variable exists; 1px and 2px are used throughout. |
