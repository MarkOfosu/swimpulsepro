// import React, { useState, useEffect } from 'react';
// import { Input } from '../../../../components/ui/Input';
// import { Button } from '../../../../components/ui/Button';


// interface TimeInputProps {
//   initialValue?: string;
//   onTimeChange: (time: string) => void;
//   onImprove: () => void;
// }

// const TimeInput: React.FC<TimeInputProps> = ({ initialValue = '00:00:00', onTimeChange, onImprove }) => {
//   const [time, setTime] = useState(initialValue);

//   useEffect(() => {
//     setTime(initialValue);
//   }, [initialValue]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value.replace(/[^\d:]/g, '');
//     setTime(value);
//   };

//   const handleBlur = () => {
//     const [minutes, seconds, centiseconds] = time.split(':').map(v => v.padStart(2, '0'));
//     const formattedTime = `${minutes || '00'}:${seconds || '00'}:${centiseconds || '00'}`;
//     setTime(formattedTime);
//     onTimeChange(formattedTime);
//   };

//   return (
//     <div className={styles.timeInputContainer}>
//       <Input
//         type="text"
//         value={time}
//         onChange={handleInputChange}
//         onBlur={handleBlur}
//         placeholder="MM:SS:CC"
//         className={styles.timeInput}
//       />
//       <Button onClick={onImprove}>Improve Time</Button>
//     </div>
//   );
// };

// export default TimeInput;