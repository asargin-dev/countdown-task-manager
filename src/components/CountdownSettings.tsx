import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CountdownSettingsProps {
    hours: number;
    minutes: number;
    seconds: number;
    setHours: (value: number) => void;
    setMinutes: (value: number) => void;
    setSeconds: (value: number) => void;
    startCountdown: () => void;
    stopCountdown: () => void;
    resetCountdown: () => void;
    isRunning: boolean;
    remainingTime: number;
}

const CountdownSettings: React.FC<CountdownSettingsProps> = React.memo(({
                                                                            hours, minutes, seconds,
                                                                            setHours, setMinutes, setSeconds,
                                                                            startCountdown, stopCountdown, resetCountdown,
                                                                            isRunning, remainingTime,
                                                                        }) => {
    const formatTime = (time: number): string => {
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-semibold mb-2">Set Countdown</h2>
            <div className="flex space-x-2 mb-4">
                <div>
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                        id="hours"
                        type="number"
                        value={hours || ''}
                        onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                        min="0"
                    />
                </div>
                <div>
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                        id="minutes"
                        type="number"
                        value={minutes || ''}
                        onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                        min="0"
                        max="59"
                    />
                </div>
                <div>
                    <Label htmlFor="seconds">Seconds</Label>
                    <Input
                        id="seconds"
                        type="number"
                        value={seconds || ''}
                        onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                        min="0"
                        max="59"
                    />
                </div>
            </div>
            <div className="flex space-x-2">
                <Button onClick={startCountdown} disabled={isRunning}>
                    Start
                </Button>
                <Button onClick={stopCountdown} disabled={!isRunning}>
                    Stop
                </Button>
                <Button onClick={resetCountdown}>
                    Reset
                </Button>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Remaining Time:</h3>
                <p className="text-3xl font-bold">{formatTime(remainingTime)}</p>
            </div>
        </div>
    );
});

export default CountdownSettings;
