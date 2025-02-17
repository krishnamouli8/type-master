// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Timer, RefreshCw } from 'lucide-react';
// import Navbar from './Navbar';
// import { StatItemProps } from './types';

// // Common English words for the typing test
// const commonWords = [
//   'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 
//   'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
//   'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
//   'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
//   'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
//   'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
//   'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
//   'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
//   'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
//   'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
// ];

// const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
//   <div className="p-4 rounded-2xl border border-gray-700 bg-gray-800">
//     <div className="text-2xl font-bold text-amber-300">{value}</div>
//     <div className="text-amber-200">{label}</div>
//   </div>
// );

// const TypingTest: React.FC = () => {
//   // State for text generation - using useRef to avoid hydration issues
//   const randomTextRef = useRef<string[]>([]);
  
//   const [timeLimit, setTimeLimit] = useState<number>(30); // Default to 30 seconds
//   const [timeRemaining, setTimeRemaining] = useState<number>(30);
//   const [currentInput, setCurrentInput] = useState<string>('');
//   const [wordCount, setWordCount] = useState<number>(0);
//   const [accuracy, setAccuracy] = useState<number>(100);
//   const [errors, setErrors] = useState<number>(0);
//   const [started, setStarted] = useState<boolean>(false);
//   const [finished, setFinished] = useState<boolean>(false);
//   const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
//   const [totalErrors, setTotalErrors] = useState<number>(0);
//   const [cursorPosition, setCursorPosition] = useState<number>(0);
//   const [selectedTimeOption, setSelectedTimeOption] = useState<number>(0);
//   const [displayedLines, setDisplayedLines] = useState<string[]>([]);
//   const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
//   const [wordsTypedInCurrentLine, setWordsTypedInCurrentLine] = useState<number>(0);
  
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLTextAreaElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   const timeOptions = [
//     { value: 30, label: '30s' },
//     { value: 60, label: '1m' },
//     { value: 120, label: '2m' },
//     { value: 300, label: '5m' }
//   ];

//   // Generate random text with specified number of words
//   const generateRandomText = useCallback((wordCount = 100) => {
//     let result = [];
//     for (let i = 0; i < wordCount; i++) {
//       const randomIndex = Math.floor(Math.random() * commonWords.length);
//       result.push(commonWords[randomIndex]);
//     }
//     return result.join(' ');
//   }, []);

//   // Split text into lines for display based on container width
//   const splitIntoLines = useCallback((text: string) => {
//     const words = text.split(' ');
//     const lines: string[] = [];
//     let currentLine: string[] = [];
//     let currentLength = 0;
    
//     // Adjust this value based on container width and font size
//     const TARGET_LENGTH = 45; 
    
//     for (const word of words) {
//       if (currentLength + word.length + 1 > TARGET_LENGTH && currentLine.length > 0) {
//         lines.push(currentLine.join(' '));
//         currentLine = [word];
//         currentLength = word.length;
//       } else {
//         currentLine.push(word);
//         currentLength += word.length + 1;
//       }
//     }
    
//     if (currentLine.length > 0) {
//       lines.push(currentLine.join(' '));
//     }
    
//     return lines;
//   }, []);

//   // Initialize text on client side only to avoid hydration issues
//   useEffect(() => {
//     const text = generateRandomText(200);
//     randomTextRef.current = splitIntoLines(text);
//     setDisplayedLines(randomTextRef.current.slice(0, 3));
//   }, [generateRandomText, splitIntoLines]);

//   const resetTest = useCallback(() => {
//     // Generate new random text on client side
//     const text = generateRandomText(200);
//     randomTextRef.current = splitIntoLines(text);
//     setDisplayedLines(randomTextRef.current.slice(0, 3));
    
//     // Reset to default state
//     setSelectedTimeOption(0);
//     setTimeLimit(30);
//     setTimeRemaining(30);
//     setCurrentInput('');
//     setWordCount(0);
//     setAccuracy(100);
//     setErrors(0);
//     setTotalErrors(0);
//     setStarted(false);
//     setFinished(false);
//     setTotalKeystrokes(0);
//     setCursorPosition(0);
//     setCurrentLineIndex(0);
//     setWordsTypedInCurrentLine(0);
    
//     // Focus the input
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [generateRandomText, splitIntoLines]);

//   useEffect(() => {
//     // Update timeRemaining when timeLimit changes
//     setTimeRemaining(timeLimit);
//   }, [timeLimit]);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (started && timeRemaining > 0) {
//       timer = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 1) {
//             setFinished(true);
//             setStarted(false);
//             clearInterval(timer);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [started, timeRemaining]);
  
//   // Effect to update the slider position
//   useEffect(() => {
//     if (sliderRef.current) {
//       const width = 100 / timeOptions.length;
//       sliderRef.current.style.left = `${selectedTimeOption * width}%`;
//       sliderRef.current.style.width = `${width}%`;
//     }
//   }, [selectedTimeOption]);

//   const handleSelectTimeOption = (index: number) => {
//     setSelectedTimeOption(index);
//     setTimeLimit(timeOptions[index].value);
//     if (started) {
//       // If test is running, reset it with the new time
//       const text = generateRandomText(200);
//       randomTextRef.current = splitIntoLines(text);
//       setDisplayedLines(randomTextRef.current.slice(0, 3));
      
//       setCurrentInput('');
//       setWordCount(0);
//       setAccuracy(100);
//       setErrors(0);
//       setTotalErrors(0);
//       setStarted(false);
//       setFinished(false);
//       setTimeRemaining(timeOptions[index].value);
//       setTotalKeystrokes(0);
//       setCursorPosition(0);
//       setCurrentLineIndex(0);
//       setWordsTypedInCurrentLine(0);
//     } else {
//       // If test hasn't started, just update the time
//       setTimeRemaining(timeOptions[index].value);
//     }
//   };

//   // Get current test text from displayed lines
//   const getCurrentTestText = useCallback(() => {
//     return displayedLines.join(' ');
//   }, [displayedLines]);

//   const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const inputValue = e.target.value;
//     const prevInput = currentInput;
//     const testText = getCurrentTestText();
    
//     if (!started && inputValue.length === 1) {
//       setStarted(true);
//     }

//     setCurrentInput(inputValue);
//     setCursorPosition(inputValue.length - 1);
//     setTotalKeystrokes((prev) => prev + 1);

//     // Count words typed in current line
//     const inputWords = inputValue.trim().split(' ');
//     setWordsTypedInCurrentLine(inputWords.length - 1);

//     // Check if user typed a space and check if we need to advance to next line
//     if (inputValue.endsWith(' ') && prevInput !== inputValue) {
//       const currentLine = displayedLines[0];
//       const wordsInCurrentLine = currentLine.split(' ').length;
      
//       // If we've typed all words in the current line
//       if (wordsTypedInCurrentLine >= wordsInCurrentLine - 1) {
//         // Move to next line
//         setCurrentLineIndex(prev => prev + 1);
//         setWordsTypedInCurrentLine(0);
        
//         // If we have more lines to show
//         if (currentLineIndex + 3 < randomTextRef.current.length) {
//           const newLines = [
//             ...displayedLines.slice(1),
//             randomTextRef.current[currentLineIndex + 3]
//           ];
//           setDisplayedLines(newLines);
//           setCurrentInput('');
//           return;
//         }
//       }
//     }

//     // Track errors
//     if (inputValue.length > prevInput.length) {
//       const newChar = inputValue[inputValue.length - 1];
//       const expectedChar = testText[inputValue.length - 1];
//       if (newChar !== expectedChar) {
//         setTotalErrors(prev => prev + 1);
//       }
//     }

//     let currentErrors = 0;
//     for (let i = 0; i < inputValue.length; i++) {
//       if (inputValue[i] !== testText[i]) {
//         currentErrors++;
//       }
//     }
//     setErrors(currentErrors);

//     const accuracyPercentage = totalKeystrokes > 0 
//       ? ((totalKeystrokes - totalErrors) / totalKeystrokes) * 100
//       : 100;
//     setAccuracy(Math.max(0, Math.min(100, accuracyPercentage)));

//     // Calculate WPM based on characters typed (1 word = 5 characters)
//     const charCount = inputValue.length + (currentLineIndex * displayedLines[0].length);
//     const typedWords = charCount / 5;
//     const minutes = (timeLimit - timeRemaining) / 60;
//     if (minutes > 0) {
//       setWordCount(Math.round(typedWords / minutes));
//     }
//   };

//   const renderText = () => {
//     return (
//       <div className="relative font-mono text-xl font-medium w-full h-full flex flex-col">
//         {displayedLines.map((line, lineIndex) => (
//           <div 
//             key={lineIndex}
//             className={`transition-opacity duration-300 my-1 ${
//               lineIndex === 0 ? 'opacity-100' : 
//               lineIndex === 1 ? 'opacity-70' : 
//               'opacity-50'
//             }`}
//           >
//             {lineIndex === 0 && (
//               <div className="relative">
//                 {line.split('').map((char, index) => {
//                   let color = 'text-gray-500';
//                   if (index < currentInput.length) {
//                     color = currentInput[index] === char 
//                       ? 'text-amber-300'
//                       : 'text-red-500';
//                   }
//                   return (
//                     <span
//                       key={index}
//                       className={`${color} transition-colors duration-150`}
//                     >
//                       {char}
//                       {index === cursorPosition && started && !finished && (
//                         <span className="absolute w-0.5 h-7 -mt-1 animate-pulse bg-amber-400" />
//                       )}
//                     </span>
//                   );
//                 })}
//               </div>
//             )}
//             {lineIndex > 0 && (
//               <div className="text-gray-500">{line}</div>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
//       <Navbar />
//       <div className="pt-24 pb-16 px-4 min-h-screen flex flex-col items-center">
//         {/* Controls container */}
//         <div className="flex justify-center items-center gap-6 mb-12 w-full max-w-4xl">
//           {/* Reset Button */}
//           <button
//             onClick={resetTest}
//             className="w-24 h-12 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 bg-gray-700 text-amber-300 hover:bg-gray-600"
//           >
//             <RefreshCw size={16} /> Reset
//           </button>

//           {/* Custom Time Selector Container with animation */}
//           <div className="flex-grow relative h-12 rounded-xl overflow-hidden border border-amber-200/30 shadow-[0_0_15px_rgba(255,215,0,0.15)] bg-gray-800/50">
//             {/* Animated background slider */}
//             <div
//               ref={sliderRef}
//               className="absolute top-0 h-full bg-amber-500/20 transition-all duration-300 ease-in-out"
//             ></div>
            
//             {/* Time options */}
//             <div className="flex h-full justify-center">
//               {timeOptions.map((option, index) => (
//                 <button
//                   key={option.value}
//                   onClick={() => handleSelectTimeOption(index)}
//                   className={`relative z-10 flex-grow h-full flex items-center justify-center transition-colors duration-300 ${
//                     selectedTimeOption === index
//                       ? 'text-amber-300 font-medium'
//                       : 'text-gray-300 hover:text-amber-200'
//                   }`}
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Timer Display */}
//           <div className="w-24 h-12 flex items-center justify-center gap-2 px-4 rounded-xl bg-gray-700 text-amber-300">
//             <Timer size={18} />
//             <span className="text-lg font-semibold">{timeRemaining}s</span>
//           </div>
//         </div>

//         {/* Main content area */}
//         <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">
//           {!finished ? (
//             <div className="w-full">
//               <div 
//                 ref={containerRef}
//                 className="mb-6 p-6 rounded-2xl bg-gray-900/50 border border-gray-700 h-48 flex items-start justify-start"
//               >
//                 {renderText()}
//               </div>
              
//               <textarea
//                 ref={inputRef}
//                 className="w-full p-6 rounded-2xl outline-none transition-all duration-300 bg-gray-900/80 border border-gray-700 focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/20 text-amber-200 resize-none text-xl"
//                 value={currentInput}
//                 onChange={handleInput}
//                 placeholder="Start typing..."
//                 disabled={finished}
//                 rows={4}
//               />
//             </div>
//           ) : (
//             <div 
//               className="text-center p-8 rounded-2xl border transition-opacity duration-1000 opacity-100 bg-gray-900/50 border-gray-700 w-full"
//             >
//               <h2 className="text-3xl font-bold mb-8 text-amber-300">Time's Up!</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {[
//                   { value: wordCount, label: 'Words Per Minute' },
//                   { value: `${accuracy.toFixed(1)}%`, label: 'Accuracy' },
//                   { value: totalErrors, label: 'Total Errors' }
//                 ].map((stat, index) => (
//                   <StatItem
//                     key={index}
//                     value={stat.value}
//                     label={stat.label}
//                   />
//                 ))}
//               </div>
//               <button
//                 onClick={resetTest}
//                 className="mt-8 px-6 py-3 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 mx-auto"
//               >
//                 <RefreshCw size={16} /> Try Again
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TypingTest;


























// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Timer, RefreshCw } from 'lucide-react';

// const commonWords = [
//   'play', 'home', 'see', 'if', 'think', 'run', 'might', 'between', 'must', 'in',
//   'also', 'turn', 'little', 'become', 'out', 'few', 'between', 'off', 'group',
//   'need', 'day', 'by', 'write', 'however', 'of', 'right', 'system', 'fact', 'now',
//   'end', 'much', 'there', 'want', 'same', 'go', 'it', 'program', 'that'
// ];

// const TypingTest = () => {
//   const [currentInput, setCurrentInput] = useState('');
//   const [started, setStarted] = useState(false);
//   const [text, setText] = useState('');
//   const inputRef = useRef(null);

//   const generateText = useCallback(() => {
//     const shuffled = [...commonWords].sort(() => 0.5 - Math.random());
//     setText(shuffled.slice(0, 40).join(' '));
//   }, []);

//   useEffect(() => {
//     generateText();
//   }, [generateText]);

//   const handleInput = (e: { target: { value: React.SetStateAction<string>; }; }) => {
//     if (!started) setStarted(true);
//     setCurrentInput(e.target.value);
//   };

//   return (
//     <div className="min-h-screen bg-[#323437] text-[#646669]">
//       {/* Header with options */}
//       <div className="p-4 flex justify-between items-center">
//         <div className="text-2xl font-medium text-[#d1d0c5]">monkeytype</div>
//         <div className="flex gap-4">
//           <span className="text-[#646669]">15</span>
//           <span className="text-[#646669]">30</span>
//           <span className="text-[#646669]">60</span>
//           <span className="text-[#646669]">120</span>
//         </div>
//       </div>

//       {/* Main typing area */}
//       <div className="max-w-3xl mx-auto mt-32 px-4">
//         <div className="mb-8 font-mono text-xl leading-relaxed">
//           {text.split('').map((char, index) => {
//             let color = 'text-[#646669]';
//             if (index < currentInput.length) {
//               color = currentInput[index] === char 
//                 ? 'text-[#d1d0c5]'
//                 : 'text-[#ca4754]';
//             }
//             return (
//               <span key={index} className={color}>
//                 {char}
//                 {index === currentInput.length && (
//                   <span className="inline-block w-0.5 h-5 bg-[#d1d0c5] animate-pulse" />
//                 )}
//               </span>
//             );
//           })}
//         </div>

//         <textarea
//           ref={inputRef}
//           value={currentInput}
//           onChange={handleInput}
//           className="w-full h-24 bg-transparent border-none outline-none text-transparent resize-none absolute"
//           autoFocus
//         />
//       </div>

//       {/* Footer */}
//       <div className="fixed bottom-4 left-4 right-4 text-[#646669] text-sm">
//         <div className="flex justify-between">
//           <div>tab + enter - restart test</div>
//           <div>esc or ctrl + shift + p - command line</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TypingTest;





















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
  const [errors, setErrors] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [selectedTimeOption, setSelectedTimeOption] = useState<number>(1); // Default to 30s
  const [text, setText] = useState<string>('');
  
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const timeOptions: TimeOption[] = [
    { value: 15, label: '15' },
    { value: 30, label: '30' },
    { value: 60, label: '60' },
    { value: 120, label: '120' }
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
    setErrors(0);
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

    let currentErrors = 0;
    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] !== text[i]) {
        currentErrors++;
      }
    }
    setErrors(currentErrors);

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
        <div className="text-2xl font-medium text-[#d1d0c5]">typemaster</div>
        <div className="flex gap-4">
          {timeOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelectTimeOption(index)}
              className={`${
                selectedTimeOption === index
                  ? 'text-[#d1d0c5]'
                  : 'text-[#646669] hover:text-[#a2a39b]'
              } transition-colors duration-200`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex items-center text-[#d1d0c5] gap-2">
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
                  {index === currentInput.length && started && (
                    <span className="absolute inline-block w-0.5 h-6 bg-[#d1d0c5] animate-pulse" style={{ 
                      transform: 'translateY(-0.1em)'
                    }}/>
                  )}
                </span>
              );
            })}
            
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
          <h2 className="text-3xl font-bold mb-8 text-[#d1d0c5]">Time's Up!</h2>
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