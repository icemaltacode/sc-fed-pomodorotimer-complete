import React, { useState, useRef, useEffect } from 'react'
import Tomato from './ui/Tomato';
import CoffeeCup from './ui/CoffeeCup';

const Timer = ({timerHours, timerMinutes, timerSeconds, completeHandler, graphic }) => {
	// We need ref in this, because we are dealing
	// with JS setInterval to keep track of it and
	// stop it when needed
	const Ref = useRef(null);

	// The state for our timer
	const [timer, setTimer] = useState('00:00:00');
    const [targetTime, setTargetTime] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let deadline = new Date();

		// This is where you need to adjust if
		// you entend to add more time
        const deadlineSeconds = (timerHours*60*60) + (timerMinutes*60) + timerSeconds;
		deadline.setSeconds(deadline.getSeconds() + deadlineSeconds);

        setTimer(`${timerHours > 9 ? timerHours : '0' + timerHours}:${timerMinutes > 9 ? timerMinutes : '0' + timerMinutes}:${timerSeconds > 9 ? timerSeconds : '0' + timerSeconds}`);
        setTargetTime(deadlineSeconds);

		if (Ref.current) clearInterval(Ref.current);
		const id = setInterval(() => {
            const total = Date.parse(deadline) - Date.parse(new Date());
            if (total === 0) {
                clearInterval(Ref.current);
                completeHandler();
            }
            const seconds = Math.floor((total / 1000) % 60);
            const minutes = Math.floor((total / 1000 / 60) % 60);
            const hours = Math.floor((total / 1000 / 60 / 60) % 24);
            if (total >= 0) {

                // update the timer
                // check if less than 10 then we need to
                // add '0' at the beginning of the variable
                setTimer(
                    (hours > 9 ? hours : '0' + hours) + ':' +
                    (minutes > 9 ? minutes : '0' + minutes) + ':'
                    + (seconds > 9 ? seconds : '0' + seconds)
                )

                let remaining = total / 1000;
                let progress = (targetTime - remaining) / targetTime * 100
                setProgress(progress);
            }
		}, 1000)
		Ref.current = id;
    }, [completeHandler, timerHours, timerMinutes, timerSeconds, targetTime])

	return (
		<div className="App">
            {graphic === 'pomodoro' ? <Tomato progress={progress} /> : <CoffeeCup progress={progress} />}
			<h2 className="timerClock">{timer}</h2>
		</div>
	)
}

export default Timer;
