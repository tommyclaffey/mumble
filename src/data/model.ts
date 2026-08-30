/**
 * Mumble — the domain.
 *
 * Written before any screen, because the design already surfaced one modelling
 * mistake and it is cheaper to fix here than in sixteen screens.
 *
 * ⭐ THE ONE THAT MATTERS: a note and a meeting are NOT the same object.
 *
 * In the Figma file they render as the same screen. Transcript Review assumes
 * a meeting — speakers, attendees, diarization — while the Home Feed calls
 * everything "Mumbles", which are solo captures with none of that. Building
 * one type with optional fields everywhere is how that ambiguity becomes
 * permanent. So `kind` is a required discriminant and the compiler enforces
 * which fields exist.
 */

export type CaptureKind = 'note' | 'meeting';

export interface Speaker {
  id: string;
  /** Editable — diarization guesses, the user corrects. */
  name: string;
  /** The voiceprint this speaker was matched on. */
  voiceprintId: string;
  colorIndex: 0 | 1 | 2 | 3 | 4;
}

/**
 * A line of transcript.
 *
 * ⭐ `confidence` is not decoration. Diarization is least accurate in the first
 * seconds of a recording, before there is enough audio to build a voiceprint —
 * so the earliest turns are the most likely to be attributed to the wrong
 * person, and they are also the ones a reader trusts most because they are at
 * the top. Surfacing the number is the product's transparency claim.
 */
export interface TranscriptLine {
  id: string;
  /** Absent on a note — a solo capture has no speaker to attribute. */
  speakerId?: string;
  text: string;
  /** Seconds from the start of the recording. Drives read-aloud seeking. */
  startsAt: number;
  /** 0–1 from the diarizer. Below LOW_CONFIDENCE the UI must say so. */
  confidence: number;
}

export const LOW_CONFIDENCE = 0.75;

export function isLowConfidence(line: TranscriptLine): boolean {
  return line.speakerId !== undefined && line.confidence < LOW_CONFIDENCE;
}

export interface Task {
  id: string;
  text: string;
  /** The line it was extracted from — every AI claim points at its evidence. */
  sourceLineId: string;
  /** Unassigned is a real state, not a missing value. */
  assigneeId?: string;
  done: boolean;
}

interface CaptureBase {
  id: string;
  title: string;
  createdAt: string;
  durationSeconds: number;
  lines: TranscriptLine[];
  tasks: Task[];
  /** Model-written. Kept separate from lines so it is always separable in UI. */
  summary?: string;
}

/** A solo capture. No speakers, so no diarization and no attendees. */
export interface Note extends CaptureBase {
  kind: 'note';
}

/** Multiple people. Speakers exist, which is what everything else hangs off. */
export interface Meeting extends CaptureBase {
  kind: 'meeting';
  speakers: Speaker[];
  attendeeIds: string[];
}

export type Capture = Note | Meeting;

/** Narrowing helper so screens branch on the type rather than on truthiness. */
export function isMeeting(c: Capture): c is Meeting {
  return c.kind === 'meeting';
}

export function speakerFor(c: Capture, line: TranscriptLine): Speaker | undefined {
  return isMeeting(c) ? c.speakers.find((s) => s.id === line.speakerId) : undefined;
}

/**
 * Correcting a speaker fixes every line that shares the voiceprint, not just
 * the one that was clicked.
 *
 * This is the whole feature. Diarization gets a person wrong consistently —
 * it decided turn 1 was "Speaker 2" and then matched that voiceprint forty
 * more times. Fixing one line and leaving thirty-nine wrong is a correction
 * that costs more than it saves, so the fix propagates by voice.
 */
export function renameSpeaker(meeting: Meeting, speakerId: string, name: string): Meeting {
  const target = meeting.speakers.find((s) => s.id === speakerId);
  if (!target) return meeting;
  return {
    ...meeting,
    speakers: meeting.speakers.map((s) =>
      s.voiceprintId === target.voiceprintId ? { ...s, name } : s),
  };
}

/* ---------------------------------------------------------- read aloud -- */

/**
 * Playback position, stated as a place in the text.
 *
 * "Line 4 of 18" rather than a scrubber at 00:42. Someone who is listening
 * *because* reading is hard cannot use a timeline to find their place in a
 * document — the timeline describes the audio, and what they need described
 * is the text. This is the dyslexia origin story answered in the product,
 * so the position type is text-first and the seconds are derived.
 */
export interface ReadPosition {
  lineIndex: number;
  totalLines: number;
}

export function positionLabel(p: ReadPosition): string {
  return `Line ${p.lineIndex + 1} of ${p.totalLines}`;
}

export function secondsForLine(c: Capture, index: number): number {
  return c.lines[index]?.startsAt ?? 0;
}

/** The line being read at a given moment — the inverse, for seeking by audio. */
export function lineAtSecond(c: Capture, second: number): number {
  let i = 0;
  while (i + 1 < c.lines.length && c.lines[i + 1].startsAt <= second) i += 1;
  return i;
}
