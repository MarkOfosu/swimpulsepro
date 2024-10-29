export const formatTimeInput = (input: string): string => {
    // Remove any non-numeric characters except dots
    const cleanInput = input.replace(/[^\d.]/g, '');
    
    // Split into seconds and milliseconds if there's a decimal point
    const [seconds, milliseconds] = cleanInput.split('.');
    
    // Pad the input to ensure we have enough digits
    const paddedSeconds = seconds.padStart(6, '0');
    
    // Extract hours, minutes, and seconds
    const hours = paddedSeconds.slice(0, 2);
    const minutes = paddedSeconds.slice(2, 4);
    const secs = paddedSeconds.slice(4, 6);
    
    // Format milliseconds (if they exist)
    const ms = milliseconds ? `.${milliseconds.slice(0, 2).padEnd(2, '0')}` : '.00';
    
    return `${hours}:${minutes}:${secs}${ms}`;
  };

  export const isValidTimeFormat = (time: string): boolean => {
    const regex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)(\.\d{1,2})?$/;
    if (!regex.test(time)) return false;
    
    // Split the time string into components
    const [timepart, milliseconds] = time.split('.');
    const [hours, minutes, seconds] = timepart.split(':').map(Number);
    
    // Ensure we have valid numbers
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return false;
    
    // Check if all components are zero
    if (hours === 0 && minutes === 0 && seconds === 0 && (!milliseconds || parseInt(milliseconds) === 0)) {
      return false;
    }
    
    return true;
  };