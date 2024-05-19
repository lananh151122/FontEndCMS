import React, { useEffect, useState } from 'react';
import { ImClock } from 'react-icons/im';

interface CountdownTimerProps {
  initialTime: number; // Thời gian ban đầu tính bằng milliseconds
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => Math.max(prevTime - 1000, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); 

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className='flex items-center'>
        <ImClock color='primary' className='mr-5'/>
      <p>{formatTime(timeRemaining)}</p>
    </div>
  );
};

export default CountdownTimer;
