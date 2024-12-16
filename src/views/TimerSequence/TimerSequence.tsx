import type React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import useTimer from '../../hooks/useTimer';
import Countdown from '../../components/timers/Countdown/Countdown';
import Tabata from '../../components/timers/Tabata/Tabata';
import TimerTracker from '../../components/TimerTracker/TimerTracker';
import Stopwatch from '../../components/timers/Stopwatch/Stopwatch';
import XY from '../../components/timers/XY/XY';
import { loadFromLocalStorage } from '../../utils/localStorageUtils';
import mainStyles from '../../main.module.scss';
import commonStyles from '../../common-styles/common-styles.module.scss';
import Modal from '../../components/generic/Modal/ModalPopUp/Modal';
import TButton from '../../components/generic/Button/TButton';
import { decodeSequence, encodeSequence } from "../../utils/sharing";

const TimerSequence: React.FC = () => {
    const {
        milliseconds,
        isRunning,
        start,
        pause,
        reset,
        setTimerSequence,
        addTimer,
        deleteTimer,
        nextTimer,
        currentIndex,
        setCurrentIndex,
        sequence,
        handleTimerCompletion,
        updateTimer,
        reorderTimers
    } = useTimer();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    const { encoded } = useParams(); // Check for an encoded parameter in the URL

    useEffect(() => {
        // On component mount or if `encoded` changes:
        if (encoded) {
            // Decode from URL parameter
            try {
                const decodedSequence = decodeSequence(decodeURIComponent(encoded));
                setTimerSequence(decodedSequence);
            } catch (e) {
                console.error('Failed to decode sequence from URL:', e);
                // Fallback to local storage or default
                const storedSequence = loadFromLocalStorage('timerSequence');
                if (storedSequence && storedSequence.length > 0) {
                    setTimerSequence(storedSequence);
                } else {
                    setTimerSequence([
                        { type: 'countdown', label: 'Warm Up', initialTime: 2000, description:'' },
                        { type: 'tabata', label: 'Stretch', rounds: 2, workDuration: 2000, breakDuration: 1000, description:'' },
                        { type: 'stopwatch', label: 'Cool Down', initialTime: 2000, description:'' },
                        { type: 'xy', rounds: 3, label: 'Jumping jacks', roundMinutes: 1, roundSeconds: 20, description:'' },
                    ]);
                }
            }
        } else {
            // No encoded parameter: load from storage or default
            const storedSequence = loadFromLocalStorage('timerSequence');
            if (storedSequence && storedSequence.length > 0) {
                setTimerSequence(storedSequence);
            } else {
                setTimerSequence([
                    { type: 'countdown', label: 'Warm Up', initialTime: 2000, description:'' },
                    { type: 'tabata', label: 'Stretch', rounds: 2, workDuration: 2000, breakDuration: 1000, description:'' },
                    { type: 'stopwatch', label: 'Cool Down', initialTime: 2000, description:'' },
                    { type: 'xy', rounds: 3, label: 'Jumping jacks', roundMinutes: 1, roundSeconds: 20, description:'' },
                ]);
            }
        }
    }, [setTimerSequence, encoded]);

    const currentTimer = sequence[currentIndex];

    const handleShareClick = () => {
        // Encode current sequence
        const encodedData = encodeSequence(sequence);
        const baseUrl = window.location.origin;
        // Use route param style: #/sequence/C;5000;...
        const url = `${baseUrl}/#/sequence/${encodeURIComponent(encodedData)}`;
        setShareUrl(url);
        setIsShareModalOpen(true);
    };

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div
            className={`${mainStyles.mainContainer} ${commonStyles.flexVertCenter} ${commonStyles.flexVert} ${commonStyles.flexHorzCenter}`}
        >
            <div className={mainStyles.timerArea}>
                {/* Render only the current timer */}
                {currentTimer?.type === 'countdown' && (
                    <Countdown
                        key={`countdown-${currentIndex}`}
                        index={currentIndex}
                        milliseconds={milliseconds}
                        isRunning={isRunning}
                        initialTime={currentTimer.initialTime ?? 0}
                        updateTimer={updateTimer}
                        reset={reset}
                        pause={pause}
                        start={start}
                        onComplete={nextTimer}
                    />
                )}
                {currentTimer?.type === 'tabata' && (
                    <Tabata
                        key={`tabata-${currentIndex}`}
                        index={currentIndex}
                        totalRoundsExternal={currentTimer.rounds}
                        workDurationExternal={currentTimer.workDuration}
                        breakDurationExternal={currentTimer.breakDuration}
                        milliseconds={milliseconds}
                        isRunning={isRunning}
                        updateTimer={updateTimer}
                        reset={reset}
                        pause={pause}
                        start={start}
                        onComplete={handleTimerCompletion}
                    />
                )}
                {currentTimer?.type === 'stopwatch' && (
                    <Stopwatch
                        key={`stopwatch-${currentIndex}`}
                        index={currentIndex}
                        updateTimer={updateTimer}
                        milliseconds={milliseconds}
                        isRunning={isRunning}
                        start={start}
                        pause={pause}
                        reset={reset}
                    />
                )}
                {currentTimer?.type === 'xy' && (
                    <XY
                        key={`xy-${currentIndex}`}
                        index={currentIndex}
                        updateTimer={updateTimer}
                        milliseconds={milliseconds}
                        isRunning={isRunning}
                        start={start}
                        pause={pause}
                        reset={reset}
                        totalRoundsExternal={currentTimer.rounds}
                        roundMinutesExternal={currentTimer.roundMinutes ?? 0}
                        roundSecondsExternal={currentTimer.roundSeconds ?? 0}
                    />
                )}

                <button className={mainStyles.skip} onClick={nextTimer}>Next</button>
                <button onClick={handleShareClick} className={mainStyles.share}>Share</button>
            </div>
            <TimerTracker
                onReorderTimers={reorderTimers}
                timerSequence={sequence}
                currentTimerIndex={currentIndex}
                elapsedMilliseconds={milliseconds}
                onTimerSelect={(index) => setCurrentIndex(index)}
                onDelete={deleteTimer}
                onAddTimer={addTimer}
            />

            {isShareModalOpen && (
                <Modal closeFunc={() => setIsShareModalOpen(false)} hasCloseBtn title="Share Workout">
                    <p>Copy this link and share it with your friends!</p>
                    <input type="text" readOnly value={shareUrl} style={{ width: '100%' }} />
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <TButton btnType="small-rect" label="Copy" actionFunc={handleCopyClick} />
                        <TButton btnType="small-rect" label="Close" actionFunc={() => setIsShareModalOpen(false)} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TimerSequence;
