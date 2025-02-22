import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, RefreshCw } from 'lucide-react';
import { StatItemProps } from './types';
import { TimeOption } from './types';

const commonWords: string[] = [
  'play', 'home', 'see', 'if', 'think', 'run', 'might', 'between', 'must', 'in',
  'also', 'turn', 'little', 'become', 'out', 'few', 'between', 'off', 'group',
  'need', 'day', 'by', 'write', 'however', 'of', 'right', 'system', 'fact', 'now',
  'end', 'much', 'there', 'want', 'same', 'go', 'it', 'program', 'that'
];

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className="p-4 rounded-lg bg-[#2c2e31] border border-[#444444]">
    <div className="text-2xl font-bold text-[#d1d0c5]">{value}</div>
    <div className="text-[#a2a39b]">{label}</div>
  </div>
);

const TypingTest: React.FC = () => {
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [selectedTimeOption, setSelectedTimeOption] = useState<number>(1);
  const [text, setText] = useState<string>('');
  
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const timeOptions: TimeOption[] = [
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
    { value: 60, label: '60s' },
    { value: 120, label: '120s' }
  ];

  // Generate random text
  const generateRandomText = useCallback((): string => {
    const shuffled = [...commonWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 75).join(' ');
  }, []);

  useEffect(() => {
    setText(generateRandomText());
  }, [generateRandomText]);

  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setFinished(true);
            setStarted(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, timeRemaining]);

  // Focus input whenever the container is clicked
  useEffect(() => {
    const handleClick = (): void => {
      if (inputRef.current && !finished) {
        inputRef.current.focus();
      }
    };
    
    if (textDisplayRef.current) {
      textDisplayRef.current.addEventListener('click', handleClick);
    }
    
    return () => {
      if (textDisplayRef.current) {
        textDisplayRef.current.removeEventListener('click', handleClick);
      }
    };
  }, [finished]);

  const resetTest = (): void => {
    setText(generateRandomText());
    setCurrentInput('');
    setWordCount(0);
    setAccuracy(100);
    setTotalErrors(0);
    setStarted(false);
    setFinished(false);
    setTimeRemaining(timeLimit);
    setTotalKeystrokes(0);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectTimeOption = (index: number): void => {
    setSelectedTimeOption(index);
    setTimeLimit(timeOptions[index].value);
    resetTest();
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const inputValue = e.target.value;
    const prevInput = currentInput;
    
    if (!started && inputValue.length > 0) {
      setStarted(true);
    }

    setCurrentInput(inputValue);
    setTotalKeystrokes((prev) => prev + 1);

    // Track errors
    if (inputValue.length > prevInput.length) {
      const newChar = inputValue[inputValue.length - 1];
      const expectedChar = text[inputValue.length - 1];
      if (newChar !== expectedChar) {
        setTotalErrors(prev => prev + 1);
      }
    }

    const accuracyPercentage = totalKeystrokes > 0 
      ? ((totalKeystrokes - totalErrors) / totalKeystrokes) * 100
      : 100;
    setAccuracy(Math.max(0, Math.min(100, accuracyPercentage)));

    // Calculate WPM based on characters typed (1 word = 5 characters)
    const typedWords = inputValue.length / 5;
    const minutes = (timeLimit - timeRemaining) / 60;
    if (minutes > 0) {
      setWordCount(Math.round(typedWords / minutes));
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Tab + Enter: restart test
      if (e.key === 'Tab' && e.getModifierState('Enter')) {
        e.preventDefault();
        resetTest();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#323437] text-[#646669]">
      {/* Header with options */}
      <div className="p-4 flex justify-between items-center">
        <div className="text-2xl font-medium text-yellow-400">typemaster</div>
        <div className="flex gap-8">
          {timeOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelectTimeOption(index)}
              className={`text-lg transition-colors duration-200 ${
                selectedTimeOption === index
                  ? 'text-yellow-400'
                  : 'text-[#646669] hover:text-[#a2a39b]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex items-center text-yellow-400 gap-2">
          <Timer size={16} />
          <span>{timeRemaining}s</span>
        </div>
      </div>

      {/* Main typing area */}
      {!finished ? (
        <div className="max-w-3xl mx-auto mt-32 px-4">
          <div 
            ref={textDisplayRef}
            className="relative mb-8 font-mono text-xl leading-relaxed h-32 overflow-hidden cursor-text"
          >
            {text.split('').map((char, index) => {
              let color = 'text-[#646669]';
              if (index < currentInput.length) {
                color = currentInput[index] === char 
                  ? 'text-[#d1d0c5]'
                  : 'text-[#ca4754]';
              }
              
              return (
                <span key={index} className={color}>
                  {char}
                  {index === currentInput.length - 1 && (
                    <span className="absolute inline-block w-0.5 h-6 bg-[#646669] animate-pulse" style={{ 
                      transform: 'translateY(-0.1em)'
                    }}/>
                  )}
                </span>
              );
            })}
            
            {/* Show cursor at the beginning if no input */}
            {currentInput.length === 0 && !finished && (
              <span className="absolute inline-block w-0.5 h-6 bg-[#646669] animate-pulse" style={{ 
                transform: 'translateY(-0.1em)'
              }}/>
            )}
            
            {/* Hidden input that captures keystrokes */}
            <textarea
              ref={inputRef}
              value={currentInput}
              onChange={handleInput}
              className="absolute opacity-0 pointer-events-none h-0 w-0 outline-none"
              autoFocus
              disabled={finished}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto mt-32 px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-[#d1d0c5]">Time Up!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatItem value={wordCount} label="Words Per Minute" />
            <StatItem value={`${accuracy.toFixed(1)}%`} label="Accuracy" />
            <StatItem value={totalErrors} label="Total Errors" />
          </div>
          <button
            onClick={resetTest}
            className="px-6 py-3 rounded-lg transition-colors duration-200 bg-[#2c2e31] text-[#d1d0c5] hover:bg-[#3c3e41] flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-4 left-4 right-4 text-[#646669] text-sm">
        <div className="flex justify-between">
          <div>tab + enter - restart test</div>
          <div>esc or ctrl + shift + p - command line</div>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;