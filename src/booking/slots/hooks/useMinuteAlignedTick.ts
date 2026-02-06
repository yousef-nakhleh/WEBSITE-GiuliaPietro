import { useEffect, useRef, useState } from 'react';

const calcDelayToNextMinute = () => {
  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  return Math.max(msUntilNextMinute, 0);
};

export default function useMinuteAlignedTick() {
  const [tick, setTick] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = calcDelayToNextMinute();
      timeoutRef.current = window.setTimeout(() => {
        setTick((prev) => prev + 1);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return tick;
}
