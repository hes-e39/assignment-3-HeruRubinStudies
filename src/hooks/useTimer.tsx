import { useState, useRef, useCallback, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorageUtils';

export type TimerType = 'countdown' | 'tabata' | 'stopwatch' | 'xy';

export type TimerSequenceItem = {
    type: TimerType;
    initialTime?: number;
    rounds?: number;
    workDuration?: number;
    breakDuration?: number;
    roundMinutes?: number;
    roundSeconds?: number;
    label?: string;
    description: string;
};

const LOCAL_STORAGE_KEY = 'timerSequence';

const useTimer = () => {
    const [milliseconds, setMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [sequence, setSequence] = useState<TimerSequenceItem[]>(() => {
        // Load initial state from localStorage
        const savedSequence = loadFromLocalStorage(LOCAL_STORAGE_KEY);
        return savedSequence ?? [];
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSequenceMode, setIsSequenceMode] = useState(false);

    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        // Save sequence to localStorage whenever it changes
        saveToLocalStorage(LOCAL_STORAGE_KEY, sequence);
    }, [sequence]);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            timerRef.current = window.setInterval(() => {
                setMilliseconds((prev) => prev + 10);
            }, 10);
        }
    }, [isRunning]);

    const pause = useCallback(() => {
        if (isRunning && timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setIsRunning(false);
        }
    }, [isRunning]);

    const reset = useCallback(() => {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setMilliseconds(0);
        setIsRunning(false);
    }, []);

    const setTimerSequence = useCallback(
        (newSequence: TimerSequenceItem[]) => {
            setSequence(newSequence);
            setCurrentIndex(0);
            setIsSequenceMode(true);
            reset();
        },
        [reset]
    );

    const addTimer = useCallback((newTimer: TimerSequenceItem) => {
        setSequence((prev) => [...prev, newTimer]);
    }, []);

    const updateTimer = useCallback(
        (index: number, updatedProperties: Partial<TimerSequenceItem>) => {
            setSequence((prevSequence) =>
                prevSequence.map((timer, i) =>
                    i === index ? { ...timer, ...updatedProperties } : timer
                )
            );
        },
        []
    );

    const deleteTimer = useCallback(
        (index: number) => {
            setSequence((prev) => prev.filter((_, i) => i !== index));
            if (index <= currentIndex && currentIndex > 0) {
                setCurrentIndex((prev) => prev - 1);
            }
        },
        [currentIndex]
    );

    const nextTimer = useCallback(() => {
        if (currentIndex < sequence.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            reset();
        } else {
            setIsSequenceMode(false);
            pause();
        }
    }, [currentIndex, sequence.length, reset, pause]);

    const handleTimerCompletion = useCallback(() => {
        nextTimer();
    }, [nextTimer]);

    const reorderTimers = useCallback(
        (sourceIndex: number, targetIndex: number) => {
            setSequence((prevSequence) => {
                const newSequence = [...prevSequence];
                const [movedItem] = newSequence.splice(sourceIndex, 1);
                newSequence.splice(targetIndex, 0, movedItem);
                return newSequence;
            });
        },
        []
    );


    return {
        milliseconds,
        isRunning,
        start,
        pause,
        reset,
        setTimerSequence,
        updateTimer,
        addTimer,
        deleteTimer,
        nextTimer,
        isSequenceMode,
        currentIndex,
        sequence,
        handleTimerCompletion,
        reorderTimers,
        setCurrentIndex,

    };
};

export default useTimer;
