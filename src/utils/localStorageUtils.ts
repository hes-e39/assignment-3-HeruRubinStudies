import type { TimerSequenceItem } from "../hooks/useTimer";

export const saveToLocalStorage = (key: string, data: TimerSequenceItem[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};