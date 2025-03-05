import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, RefreshCw } from 'lucide-react';
import { StatItemProps } from './types';
import { TimeOption } from './types';

const commonWords: string[] = [
  'play', 'home', 'see', 'if', 'think', 'run', 'might', 'between', 'must', 'in',
  'also', 'turn', 'little', 'become', 'out', 'few', 'between', 'off', 'group',
  'need', 'day', 'by', 'write', 'however', 'of', 'right', 'system', 'fact', 'now',
  'end', 'much', 'there', 'want', 'same', 'go', 'it', 'program', 'that', 'small',
  'part', 'begin', 'present', 'around', 'same', 'course', 'such', 'help', 'each', 'write',
  'of', 'they', 'large', 'eye', 'run', 'thing', 'can', 'how', 'take', 'it', 'write', 
  'mean', 'child', 'each', 'early', 'public', 'only', 'part', 'end', 'general', 'such',
  'new', 'good', 'become', 'through'
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
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  
  const timeOptions: TimeOption[] = [
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
    { value: 60, label: '60s' },
    { value: 120, label: '120s' }
  ];

  // Define words per line constant
  const WORDS_PER_LINE = 11;

  // Generate random text from wordlist
  const generateRandomText = useCallback((): string => {
    // Shuffle the array to get random words
    const shuffled = [...commonWords].sort(() => 0.5 - Math.random());
    // Take a subset to ensure we get different words each time
    return shuffled.slice(0, 100).join(' ');
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
    const newText = generateRandomText();
    setText(newText);
    setCurrentInput('');
    setWordCount(0);
    setAccuracy(100);
    setTotalErrors(0);
    setStarted(false);
    setFinished(false);
    setTimeRemaining(timeLimit);
    setTotalKeystrokes(0);
    setActiveWordIndex(0);
    setTypedWords([]);
    setCurrentLineIndex(0);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectTimeOption = (index: number): void => {
    setSelectedTimeOption(index);
    setTimeLimit(timeOptions[index].value);
    resetTest();
  };

  // Count completed words (correctly typed)
  const countCorrectWords = (): number => {
    if (typedWords.length === 0) return 0;
    
    const textWords = text.split(' ');
    let correctCount = 0;
    
    for (let i = 0; i < typedWords.length; i++) {
      if (i < textWords.length && typedWords[i] === textWords[i]) {
        correctCount++;
      }
    }
    
    return correctCount;
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const inputValue = e.target.value;
    const textWords = text.split(' ');
    
    // Ignore space at beginning when no input
    if (currentInput === '' && inputValue === ' ') {
      return;
    }
    
    if (!started && inputValue.length > 0) {
      setStarted(true);
    }

    // Handle space key (completing a word)
    if (inputValue.endsWith(' ') && currentInput !== '') {
      const completedWord = currentInput.trim();
      setTypedWords([...typedWords, completedWord]);
      const nextWordIndex = activeWordIndex + 1;
      setActiveWordIndex(nextWordIndex);
      setCurrentInput('');
      
      // Calculate errors
      const nextTotalErrors = [...typedWords, completedWord].reduce((count, word, idx) => {
        return count + (word !== textWords[idx] ? 1 : 0);
      }, 0);
      
      setTotalErrors(nextTotalErrors);
      
      // Recalculate accuracy
      const nextAccuracy = nextWordIndex > 0 
        ? (((nextWordIndex) - nextTotalErrors) / (nextWordIndex)) * 100
        : 100;
      setAccuracy(Math.max(0, Math.min(100, nextAccuracy)));
      
      // Calculate WPM
      const correctWordCount = countCorrectWords() + (completedWord === textWords[activeWordIndex] ? 1 : 0);
      const minutes = (timeLimit - timeRemaining) / 60;
      if (minutes > 0) {
        setWordCount(Math.round(correctWordCount / minutes));
      }
      
      // Update line index if needed
      const nextLine = Math.floor(nextWordIndex / WORDS_PER_LINE);
      if (nextLine > currentLineIndex) {
        setCurrentLineIndex(nextLine);
      }
      
      return;
    }
    
    // Update current input for the active word
    setCurrentInput(inputValue);
    setTotalKeystrokes((prev) => prev + 1);
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

  // Get word status class
  const getWordClass = (wordIndex: number, isActive: boolean): string => {
    // Base classes
    let classes = `word word-${wordIndex} inline-block px-1 `;
    
    // Not yet reached
    if (wordIndex > activeWordIndex) {
      classes += 'text-[#646669]';
      return classes;
    }
    
    // Active word
    if (isActive) {
      classes += 'active bg-[#2c2e31] ';
      return classes;
    }
    
    // Already typed word
    if (wordIndex < typedWords.length) {
      const isCorrect = typedWords[wordIndex] === text.split(' ')[wordIndex];
      classes += isCorrect ? 'text-[#9cdb43]' : 'text-[#ca4754]';
    }
    
    return classes;
  };

  // Render text with three-line view
  const renderText = () => {
    const textWords = text.split(' ');
    const currentLineNum = Math.floor(activeWordIndex / WORDS_PER_LINE);
    
    // Calculate which three lines to show
    let linesToShow = [];
    
    // Determine which lines to show based on current progress
    if (currentLineNum === 0) {
      // Starting position: just show the first 3 lines
      linesToShow = [0, 1, 2];
    } else {
      // Normal position: show previous, current, and next line
      linesToShow = [currentLineNum - 1, currentLineNum, currentLineNum + 1];
    }
    
    return (
      <div className="flex flex-col items-center justify-center space-y-8 w-full transition-all duration-300">
        {linesToShow.map((lineNum, idx) => {
          // Get words for this line
          const startWordIndex = lineNum * WORDS_PER_LINE;
          const lineWords = textWords.slice(startWordIndex, startWordIndex + WORDS_PER_LINE);
          
          // Skip if no words for this line
          if (lineWords.length === 0) return null;
          
          // Determine line status
          const isCurrentLine = lineNum === currentLineNum;
          const isPreviousLine = lineNum < currentLineNum;
          const isNextLine = lineNum > currentLineNum;
          
          // Set line style based on its status
          let lineClass = "flex flex-wrap space-x-1 h-12 w-full transition-opacity duration-300 ";
          
          if (isPreviousLine) {
            lineClass += "text-opacity-70 "; // Dimmed for completed line
          } else if (isNextLine) {
            lineClass += "text-opacity-50 "; // More dimmed for future line
          }
          
          return (
            <div key={lineNum} className={lineClass}>
              {lineWords.map((word, idx) => {
                const wordIndex = startWordIndex + idx;
                const isActiveWord = wordIndex === activeWordIndex;
                
                // For standard words that aren't active
                if (!isActiveWord) {
                  return (
                    <span key={wordIndex} className={getWordClass(wordIndex, false)}>
                      {word}
                    </span>
                  );
                }
                
                // For the active word, render with character highlighting
                return (
                  <span 
                    key={wordIndex} 
                    ref={activeWordRef}
                    className={getWordClass(wordIndex, true)}
                  >
                    {word.split('').map((char, charIndex) => {
                      let charClass = 'text-[#646669]'; // Default
                      
                      if (charIndex < currentInput.length) {
                        charClass = currentInput[charIndex] === char 
                          ? 'text-[#9cdb43]'  // Correct character (green)
                          : 'text-[#ca4754]'; // Incorrect character (red)
                      }
                      
                      return (
                        <span key={charIndex} className={charClass}>
                          {char}
                        </span>
                      );
                    })}
                    
                    {/* Extra chars typed beyond word length */}
                    {currentInput.length > word.length && (
                      <span className="text-[#ca4754]">
                        {currentInput.substring(word.length)}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

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
        <div className="max-w-6xl mx-auto mt-24 px-4">
          <div 
            ref={textDisplayRef}
            className="relative font-mono text-3xl font-bold leading-relaxed min-h-64 cursor-text bg-[#323437] p-8 rounded flex flex-col items-center justify-center"
          >
            {renderText()}
            
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