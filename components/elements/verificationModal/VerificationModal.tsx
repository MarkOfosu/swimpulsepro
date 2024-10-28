// // components/verificationModal/VerificationModal.tsx
// import { useState, useEffect } from 'react';
// import { Mail, Check, RefreshCw } from 'lucide-react';
// import styles from '../../styles/VerificationModal.module.css';

// interface VerificationModalProps {
//   email: string;
//   onResendEmail: () => Promise<void>;
// }

// export const VerificationModal: React.FC<VerificationModalProps> = ({
//   email,
//   onResendEmail
// }) => {
//   const [resending, setResending] = useState(false);
//   const [bubbles, setBubbles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

//   useEffect(() => {
//     // Create animated bubbles
//     const newBubbles = Array.from({ length: 10 }, (_, i) => ({
//       id: i,
//       left: Math.random() * 100,
//       delay: Math.random() * 2
//     }));
//     setBubbles(newBubbles);
//   }, []);

//   const handleResend = async () => {
//     setResending(true);
//     await onResendEmail();
//     setResending(false);
//   };

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <div className={styles.bubbles}>
//           {bubbles.map(bubble => (
//             <div
//               key={bubble.id}
//               className={styles.bubble}
//               style={{
//                 left: `${bubble.left}%`,
//                 animationDelay: `${bubble.delay}s`,
//                 width: `${Math.random() * 20 + 10}px`,
//                 height: `${Math.random() * 20 + 10}px`,
//               }}
//             />
//           ))}
//         </div>

//         <div className={styles.emailIcon}>
//           <Mail size={80} color="#0396FF" strokeWidth={1.5} />
//         </div>

//         <h2 className={styles.title}>Check Your Email! 🏊‍♂️</h2>
        
//         <p className={styles.message}>
//           We've sent a verification link to:
//         </p>
        
//         <div className={styles.email}>{email}</div>

//         <div className={styles.steps}>
//           <div className={styles.step}>
//             <span className={styles.stepNumber}>1</span>
//             <span>Check your email inbox</span>
//           </div>
//           <div className={styles.step}>
//             <span className={styles.stepNumber}>2</span>
//             <span>Click the verification link</span>
//           </div>
//           <div className={styles.step}>
//             <span className={styles.stepNumber}>3</span>
//             <span>Jump back in and start swimming! 🏊‍♂️</span>
//           </div>
//         </div>

//         <button 
//           className={styles.button}
//           onClick={() => window.location.reload()}
//         >
//           <Check className="mr-2" /> I've Verified My Email
//         </button>

//         <div 
//           className={styles.resendLink}
//           onClick={handleResend}
//         >
//           {resending ? (
//             <span className="flex items-center justify-center gap-2">
//               <RefreshCw className="animate-spin" size={16} />
//               Resending...
//             </span>
//           ) : (
//             "Didn't receive the email? Send again"
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// components/VerificationModal/VerificationModal.tsx
"use client";

import { useState, useEffect } from 'react';
import { Mail, Check, RefreshCw ,Waves} from 'lucide-react';
import styles from '../../styles/VerificationModal.module.css';

interface VerificationModalProps {
  email: string;
  role: 'coach' | 'swimmer';
  onResendEmail: () => Promise<void>;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  email,
  role,
  onResendEmail
}) => {
  const [resending, setResending] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setBubbles(newBubbles);
  }, []);

  const handleResend = async () => {
    setResending(true);
    await onResendEmail();
    setResending(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.bubbles}>
          {bubbles.map(bubble => (
            <div
              key={bubble.id}
              className={styles.bubble}
              style={{
                left: `${bubble.left}%`,
                animationDelay: `${bubble.delay}s`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
        </div>

        <div className={styles.emailIcon}>
          <Mail size={80} color="#0396FF" strokeWidth={1.5} />
          <Waves
            size={40}
            color="#0396FF"
            className={styles.swimmingIcon}
          />
        </div>

        <h2 className={styles.title}>
          Welcome to SwimPulsePro! 🏊‍♂️
        </h2>
        
        <p className={styles.message}>
          We're excited to have you as a new {role}! Please check your email to verify your account:
        </p>
        
        <div className={styles.email}>{email}</div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <span>Open your email inbox</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <span>Click the verification link we sent you</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <span>Dive into SwimPulsePro! 🏊‍♂️</span>
          </div>
        </div>

        <button 
          className={styles.button}
          onClick={() => window.location.href = '/auth/login'}
        >
          <Check className="mr-2" /> Go to Login
        </button>

        <div 
          className={styles.resendLink}
          onClick={handleResend}
        >
          {resending ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={16} />
              Resending verification email...
            </span>
          ) : (
            "Didn't receive the email? Send again"
          )}
        </div>
      </div>
    </div>
  );
};