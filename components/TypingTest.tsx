// import React, { useState, useEffect, useCallback } from 'react';
// import { Timer, RefreshCw } from 'lucide-react';
// import Navbar from './Navbar';
// import { StatItemProps } from "./types";

// const sampleText = `The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. The best way to predict the future is to invent it. Innovation distinguishes between a leader and a follower. Technology is best when it brings people together.`;

// const StatItem: React.FC<StatItemProps> = ({ value, label, isDarkMode }) => (
//   <div className={`p-4 rounded-2xl border transition-colors duration-300 ${
//     isDarkMode
//       ? 'bg-gray-800 border-gray-700'
//       : 'bg-white border-emerald-100'
//   }`}>
//     <div className={`text-2xl font-bold ${
//       isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
//     }`}>{value}</div>
//     <div className={
//       isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
//     }>{label}</div>
//   </div>
// );

// const TypingTest: React.FC = () => {
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
//   const [timeLimit, setTimeLimit] = useState<number>(60);
//   const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit);
//   const [currentInput, setCurrentInput] = useState<string>('');
//   const [wordCount, setWordCount] = useState<number>(0);
//   const [accuracy, setAccuracy] = useState<number>(100);
//   const [errors, setErrors] = useState<number>(0);
//   const [started, setStarted] = useState<boolean>(false);
//   const [finished, setFinished] = useState<boolean>(false);
//   const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
//   const [totalErrors, setTotalErrors] = useState<number>(0);
//   const [cursorPosition, setCursorPosition] = useState<number>(0);

//   const resetTest = useCallback(() => {
//     setCurrentInput('');
//     setWordCount(0);
//     setAccuracy(100);
//     setErrors(0);
//     setTotalErrors(0);
//     setStarted(false);
//     setFinished(false);
//     setTimeRemaining(timeLimit);
//     setTotalKeystrokes(0);
//     setCursorPosition(0);
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

//   const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const inputValue = e.target.value;
//     const prevInput = currentInput;
    
//     if (!started && inputValue.length === 1) {
//       setStarted(true);
//     }

//     setCurrentInput(inputValue);
//     setCursorPosition(inputValue.length - 1);
//     setTotalKeystrokes((prev) => prev + 1);

//     if (inputValue.length > prevInput.length) {
//       const newChar = inputValue[inputValue.length - 1];
//       const expectedChar = sampleText[inputValue.length - 1];
//       if (newChar !== expectedChar) {
//         setTotalErrors(prev => prev + 1);
//       }
//     }

//     let currentErrors = 0;
//     for (let i = 0; i < inputValue.length; i++) {
//       if (inputValue[i] !== sampleText[i]) {
//         currentErrors++;
//       }
//     }
//     setErrors(currentErrors);

//     const accuracyPercentage = ((totalKeystrokes - totalErrors) / totalKeystrokes) * 100;
//     setAccuracy(Math.max(0, Math.min(100, accuracyPercentage)));

//     const words = inputValue.trim().split(/\s+/).length;
//     const minutes = (timeLimit - timeRemaining) / 60;
//     if (minutes > 0) {
//       setWordCount(Math.round(words / minutes));
//     }
//   };

//   const renderText = () => {
//     return (
//       <div className="relative font-mono">
//         {sampleText.split('').map((char, index) => {
//           let color = isDarkMode ? 'text-gray-400' : 'text-gray-500';
//           if (index < currentInput.length) {
//             color = currentInput[index] === char 
//               ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
//               : (isDarkMode ? 'text-rose-400' : 'text-rose-600');
//           }
//           return (
//             <span
//               key={index}
//               className={`${color} transition-colors duration-150`}
//             >
//               {char}
//               {index === cursorPosition && started && !finished && (
//                 <span className={`absolute w-0.5 h-6 -mt-1 animate-pulse ${
//                   isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'
//                 }`} />
//               )}
//             </span>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${
//       isDarkMode 
//         ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
//         : 'bg-gradient-to-br from-emerald-50 to-rose-50'
//     }`}>
//       <Navbar 
//         isDarkMode={isDarkMode} 
//         toggleTheme={() => setIsDarkMode(!isDarkMode)} 
//       />
//       <div className="pt-24 pb-12 px-4">
//         <div className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-xl space-y-8 transition-colors duration-300 ${
//           isDarkMode 
//             ? 'bg-gray-800/80 backdrop-blur-sm' 
//             : 'bg-white/80 backdrop-blur-sm'
//         }`}>
//           <div className="flex justify-between items-center">
//             <div className="space-x-4">
//               <select
//                 className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
//                   isDarkMode
//                     ? 'bg-gray-700 text-emerald-400 border-gray-600 hover:border-gray-500'
//                     : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-200'
//                 }`}
//                 value={timeLimit}
//                 onChange={(e) => {
//                   setTimeLimit(Number(e.target.value));
//                   resetTest();
//                 }}
//               >
//                 <option value="30">30 seconds</option>
//                 <option value="60">1 minute</option>
//                 <option value="120">2 minutes</option>
//                 <option value="300">5 minutes</option>
//               </select>
//               <button
//                 onClick={resetTest}
//                 className={`px-4 py-2 rounded-xl transition-colors duration-300 flex items-center gap-2 ${
//                   isDarkMode
//                     ? 'bg-gray-700 text-emerald-400 hover:bg-gray-600'
//                     : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
//                 }`}
//               >
//                 <RefreshCw size={16} /> Reset
//               </button>
//             </div>
//             <div className={`flex items-center gap-2 text-lg font-semibold px-4 py-2 rounded-xl transition-colors duration-300 ${
//               isDarkMode
//                 ? 'bg-gray-700 text-rose-400'
//                 : 'bg-rose-50 text-rose-700'
//             }`}>
//               <Timer size={20} />
//               <span>{timeRemaining}s</span>
//             </div>
//           </div>

//           <div className={`relative p-6 rounded-2xl text-lg leading-relaxed shadow-sm transition-colors duration-300 ${
//             isDarkMode
//               ? 'bg-gray-900 border-gray-700'
//               : 'bg-white border-emerald-100'
//           }`}>
//             {renderText()}
//           </div>

//           {finished ? (
//             <div className={`text-center p-8 rounded-2xl border animate-fade-in transition-colors duration-300 ${
//               isDarkMode
//                 ? 'bg-gray-900/50 border-gray-700'
//                 : 'bg-emerald-50/50 border-emerald-100'
//             }`}>
//               <h2 className={`text-3xl font-bold mb-6 ${
//                 isDarkMode ? 'text-emerald-400' : 'text-emerald-800'
//               }`}>Time's Up!</h2>
//               <div className="grid grid-cols-3 gap-6">
//                 {[
//                   { value: wordCount, label: 'Words Per Minute' },
//                   { value: `${accuracy.toFixed(1)}%`, label: 'Accuracy' },
//                   { value: totalErrors, label: 'Total Errors' }
//                 ].map((stat, index) => (
//                   <StatItem
//                     key={index}
//                     value={stat.value}
//                     label={stat.label}
//                     isDarkMode={isDarkMode}
//                   />
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <textarea
//               className={`w-full p-6 rounded-2xl outline-none transition-all duration-300 ${
//                 isDarkMode
//                   ? 'bg-gray-900/80 border-gray-700 focus:border-gray-600 focus:ring-2 focus:ring-gray-700 text-gray-300'
//                   : 'bg-white/80 border-emerald-100 focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100 text-gray-800'
//               }`}
//               value={currentInput}
//               onChange={handleInput}
//               placeholder="Start typing..."
//               disabled={finished}
//               rows={4}
//             />
//           )}

//           {!finished && started && (
//             <div className="grid grid-cols-3 gap-6 opacity-50">
//               {[
//                 { value: wordCount, label: 'WPM' },
//                 { value: `${accuracy.toFixed(1)}%`, label: 'Accuracy' },
//                 { value: totalErrors, label: 'Errors' }
//               ].map((stat, index) => (
//                 <StatItem
//                   key={index}
//                   value={stat.value}
//                   label={stat.label}
//                   isDarkMode={isDarkMode}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TypingTest;

















import React, { useState, useEffect, useCallback } from 'react';
import { Timer, RefreshCw } from 'lucide-react';
import Navbar from './Navbar';
import { StatItemProps } from "./types";

const sampleText = `The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. The best way to predict the future is to invent it. Innovation distinguishes between a leader and a follower. Technology is best when it brings people together.`;

const StatItem: React.FC<StatItemProps> = ({ value, label, isDarkMode }) => (
  <div className={`p-4 rounded-2xl border transition-colors duration-300 ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-emerald-100'
  }`}>
    <div className={`text-2xl font-bold ${
      isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
    }`}>{value}</div>
    <div className={
      isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
    }>{label}</div>
  </div>
);

const TypingTest: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [errors, setErrors] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const resetTest = useCallback(() => {
    setCurrentInput('');
    setWordCount(0);
    setAccuracy(100);
    setErrors(0);
    setTotalErrors(0);
    setStarted(false);
    setFinished(false);
    setTimeRemaining(timeLimit);
    setTotalKeystrokes(0);
    setCursorPosition(0);
  }, [timeLimit]);

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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const prevInput = currentInput;
    
    if (!started && inputValue.length === 1) {
      setStarted(true);
    }

    setCurrentInput(inputValue);
    setCursorPosition(inputValue.length - 1);
    setTotalKeystrokes((prev) => prev + 1);

    if (inputValue.length > prevInput.length) {
      const newChar = inputValue[inputValue.length - 1];
      const expectedChar = sampleText[inputValue.length - 1];
      if (newChar !== expectedChar) {
        setTotalErrors(prev => prev + 1);
      }
    }

    let currentErrors = 0;
    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] !== sampleText[i]) {
        currentErrors++;
      }
    }
    setErrors(currentErrors);

    const accuracyPercentage = ((totalKeystrokes - totalErrors) / totalKeystrokes) * 100;
    setAccuracy(Math.max(0, Math.min(100, accuracyPercentage)));

    const words = inputValue.trim().split(/\s+/).length;
    const minutes = (timeLimit - timeRemaining) / 60;
    if (minutes > 0) {
      setWordCount(Math.round(words / minutes));
    }
  };

  const renderText = () => {
    return (
      <div className="relative font-mono">
        {sampleText.split('').map((char, index) => {
          let color = isDarkMode ? 'text-gray-400' : 'text-gray-500';
          if (index < currentInput.length) {
            color = currentInput[index] === char 
              ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
              : (isDarkMode ? 'text-rose-400' : 'text-rose-600');
          }
          return (
            <span
              key={index}
              className={`${color} transition-colors duration-150`}
            >
              {char}
              {index === cursorPosition && started && !finished && (
                <span className={`absolute w-0.5 h-6 -mt-1 animate-pulse ${
                  isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                }`} />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-emerald-50 to-rose-50'
    }`}>
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />
      <div className="pt-24 pb-12 px-4">
        <div className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-xl space-y-8 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/80 backdrop-blur-sm' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <div className="flex justify-between items-center gap-4">
            {/* Reset Button */}
            <button
              onClick={resetTest}
              className={`w-48 px-4 py-2 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 ${
                isDarkMode
                  ? 'bg-gray-700 text-emerald-400 hover:bg-gray-600'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              <RefreshCw size={16} /> Reset
            </button>

            {/* Time Limit Dropdown */}
            <select
              className={`w-48 px-4 py-2 rounded-xl transition-colors duration-300 text-center appearance-none ${
                isDarkMode
                  ? 'bg-gray-700 text-emerald-400 border-gray-600 hover:border-gray-500'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-200'
              }`}
              value={timeLimit}
              onChange={(e) => {
                setTimeLimit(Number(e.target.value));
                resetTest();
              }}
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="120">2 minutes</option>
              <option value="300">5 minutes</option>
            </select>

            {/* Timer Display */}
            <div className={`w-48 flex items-center justify-center gap-2 text-lg font-semibold px-4 py-2 rounded-xl transition-colors duration-300 ${
              isDarkMode
                ? 'bg-gray-700 text-rose-400'
                : 'bg-rose-50 text-rose-700'
            }`}>
              <Timer size={20} />
              <span>{timeRemaining}s</span>
            </div>
          </div>

          <div className={`relative p-6 rounded-2xl text-lg leading-relaxed shadow-sm transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-900 border-gray-700'
              : 'bg-white border-emerald-100'
          }`}>
            {renderText()}
          </div>

          {finished ? (
            <div className={`text-center p-8 rounded-2xl border animate-fade-in transition-colors duration-300 ${
              isDarkMode
                ? 'bg-gray-900/50 border-gray-700'
                : 'bg-emerald-50/50 border-emerald-100'
            }`}>
              <h2 className={`text-3xl font-bold mb-6 ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-800'
              }`}>Time's Up!</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: wordCount, label: 'Words Per Minute' },
                  { value: `${accuracy.toFixed(1)}%`, label: 'Accuracy' },
                  { value: totalErrors, label: 'Total Errors' }
                ].map((stat, index) => (
                  <StatItem
                    key={index}
                    value={stat.value}
                    label={stat.label}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          ) : (
            <textarea
              className={`w-full p-6 rounded-2xl outline-none transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-900/80 border-gray-700 focus:border-gray-600 focus:ring-2 focus:ring-gray-700 text-gray-300'
                  : 'bg-white/80 border-emerald-100 focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100 text-gray-800'
              }`}
              value={currentInput}
              onChange={handleInput}
              placeholder="Start typing..."
              disabled={finished}
              rows={4}
            />
          )}

          {!finished && started && (
            <div className="grid grid-cols-3 gap-6 opacity-50">
              {[
                { value: wordCount, label: 'WPM' },
                { value: `${accuracy.toFixed(1)}%`, label: 'Accuracy' },
                { value: totalErrors, label: 'Errors' }
              ].map((stat, index) => (
                <StatItem
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;