import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ 
  text, 
  speed = 30, 
  startDelay = 0,
  className = '',
  onComplete 
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const startTyping = () => {
      setIsTyping(true);
      setDisplayedText('');

      const type = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(type, speed);
        } else {
          setIsTyping(false);
          if (onComplete) {
            onComplete();
          }
        }
      };

      timeoutId = setTimeout(type, startDelay);
    };

    startTyping();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, speed, startDelay, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse opacity-75">|</span>}
    </span>
  );
}

