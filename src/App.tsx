import { Surface } from './components/Surface/Surface';
import { ChipMeta } from './components/Chip/Chip';
import {
  isLowConfidence, isMeeting, positionLabel, speakerFor, type Capture,
} from './data/model';

/**
 * Foundation check, not a screen.
 *
 * It renders one meeting through the real model and the real tokens so the
 * pieces are proven to fit before any layout is built on them. It gets
 * replaced by the first real screen.
 */

const DEMO: Capture = {
  kind: 'meeting',
  id: 'c1',
  title: 'Q3 planning',
  createdAt: '2026-08-30T09:12:00Z',
  durationSeconds: 1840,
  speakers: [
    { id: 's1', name: 'Speaker 1', voiceprintId: 'v1', colorIndex: 0 },
    { id: 's2', name: 'Dana Whitfield', voiceprintId: 'v2', colorIndex: 1 },
  ],
  attendeeIds: ['s1', 's2'],
  lines: [
    /* Low confidence on the FIRST line on purpose — that is where diarization
       is weakest, before there is a voiceprint to match against. */
    { id: 'l1', speakerId: 's1', text: 'Let us start with the roadmap.', startsAt: 0, confidence: 0.52 },
    { id: 'l2', speakerId: 's2', text: 'I have the numbers from last quarter.', startsAt: 6, confidence: 0.94 },
    { id: 'l3', speakerId: 's1', text: 'Good. Walk me through the misses first.', startsAt: 12, confidence: 0.91 },
  ],
  tasks: [{ id: 't1', text: 'Send the Q2 miss analysis', sourceLineId: 'l3', done: false }],
  summary: 'Roadmap review. Dana to circulate the Q2 miss analysis.',
};

export default function App() {
  const pos = { lineIndex: 1, totalLines: DEMO.lines.length };

  return (
    <main style={{ padding: 'var(--space-32)', maxWidth: '44rem', margin: '0 auto' }}>
      <h1 className="mb-display-page">{DEMO.title}</h1>
      <p className="mb-meta" style={{ color: 'var(--text-secondary)' }}>
        {isMeeting(DEMO) ? `${DEMO.speakers.length} speakers` : 'Solo note'} · {positionLabel(pos)}
      </p>

      <Surface tone="ai" className="mb-stack">
        <p className="mb-label-strong" style={{ color: 'var(--accent-base)' }}>Summary</p>
        <p className="mb-body-reading" style={{ margin: 0 }}>{DEMO.summary}</p>
      </Surface>

      <Surface className="mb-stack">
        {DEMO.lines.map((line) => {
          const speaker = speakerFor(DEMO, line);
          return (
            <p key={line.id} className="mb-body-reading" style={{ margin: '0 0 var(--space-12)' }}>
              <strong className="mb-label-large">{speaker?.name ?? 'You'}</strong>{' '}
              {isLowConfidence(line) && <ChipMeta tone="low-confidence">Low confidence</ChipMeta>}
              <br />
              {line.text}
            </p>
          );
        })}
      </Surface>
    </main>
  );
}
