import type {TimerSequenceItem} from "../hooks/useTimer.tsx";


/*
  Shorthand Format Documentation
  ------------------------------
  We store the entire workout sequence as a single string. Each timer is separated by a "|".

  For each timer, the first value indicates the type:
  - "C" = Countdown
  - "T" = Tabata
  - "S" = Stopwatch
  - "X" = XY

  After the type code, we have a predefined order of fields depending on the timer type:

  1. Countdown (C):
     Format: C;initialTime;description
     Example: C;5000;Stretching

     Decoding:
       - Type: 'countdown'
       - initialTime: numeric (e.g. 5000 ms)
       - description: string (e.g. "Stretching")

  2. Tabata (T):
     Format: T;rounds;workDuration;breakDuration;description
     Example: T;2;2000;1000;Interval

     Decoding:
       - Type: 'tabata'
       - rounds: numeric (e.g. 2)
       - workDuration: numeric (e.g. 2000 ms)
       - breakDuration: numeric (e.g. 1000 ms)
       - description: string (e.g. "Interval")

  3. Stopwatch (S):
     Format: S;initialTime;description
     Example: S;60000;1 Minute Goal

     Decoding:
       - Type: 'stopwatch'
       - initialTime: numeric
       - description: string

  4. XY (X):
     Format: X;rounds;roundMinutes;roundSeconds;description
     Example: X;3;1;20;Jumping Jacks

     Decoding:
       - Type: 'xy'
       - rounds: numeric
       - roundMinutes: numeric
       - roundSeconds: numeric
       - description: string

  Encoding is simply the reverse process: we take the TimerSequenceItem, figure out
  its type, and output the fields in the correct order separated by semicolons.
*/

export function encodeSequence(sequence: TimerSequenceItem[]): string {
    const encodedTimers = sequence.map(timer => {
        switch (timer.type) {
            case 'countdown':
                // C;initialTime;description
                return `C;${timer.initialTime ?? 0};${timer.description ?? ''}`;
            case 'tabata':
                // T;rounds;workDuration;breakDuration;description
                return `T;${timer.rounds ?? 0};${timer.workDuration ?? 0};${timer.breakDuration ?? 0};${timer.description ?? ''}`;
            case 'stopwatch':
                // S;initialTime;description
                return `S;${timer.initialTime ?? 0};${timer.description ?? ''}`;
            case 'xy':
                // X;rounds;roundMinutes;roundSeconds;description
                return `X;${timer.rounds ?? 0};${timer.roundMinutes ?? 0};${timer.roundSeconds ?? 0};${timer.description ?? ''}`;
            default:
                // If unknown type, skip or throw error. Here we skip:
                return '';
        }
    }).filter(s => s !== '');

    return encodedTimers.join('|');
}

export function decodeSequence(encoded: string): TimerSequenceItem[] {
    if (!encoded) return [];

    const timersStr = encoded.split('|');
    const sequence: TimerSequenceItem[] = [];

    for (const timerStr of timersStr) {
        const parts = timerStr.split(';');
        const typeCode = parts[0];

        switch (typeCode) {
            case 'C': {
                // C;initialTime;description
                const initialTime =  Number.parseInt(parts[1], 10);
                const description = parts.slice(2).join(';') || ''; // Join in case description had a semicolon
                sequence.push({
                    type: 'countdown',
                    initialTime,
                    description
                });
                break;
            }
            case 'T': {
                // T;rounds;workDuration;breakDuration;description
                const rounds =  Number.parseInt(parts[1], 10);
                const workDuration =  Number.parseInt(parts[2], 10);
                const breakDuration =  Number.parseInt(parts[3], 10);
                const description = parts.slice(4).join(';') || '';
                sequence.push({
                    type: 'tabata',
                    rounds,
                    workDuration,
                    breakDuration,
                    description
                });
                break;
            }
            case 'S': {
                // S;initialTime;description
                const initialTime =  Number.parseInt(parts[1], 10);
                const description = parts.slice(2).join(';') || '';
                sequence.push({
                    type: 'stopwatch',
                    initialTime,
                    description
                });
                break;
            }
            case 'X': {
                // X;rounds;roundMinutes;roundSeconds;description
                const rounds = Number.parseInt(parts[1], 10);
                const roundMinutes =  Number.parseInt(parts[2], 10);
                const roundSeconds =  Number.parseInt(parts[3], 10);
                const description = parts.slice(4).join(';') || '';
                sequence.push({
                    type: 'xy',
                    rounds,
                    roundMinutes,
                    roundSeconds,
                    description
                });
                break;
            }
            default:
                // Unknown type code, skip
                break;
        }
    }

    return sequence;
}
