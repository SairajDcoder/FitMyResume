import React from 'react';

// In a real app with Framer Motion:
// import { motion } from 'framer-motion';
// const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// Simple version with CSS transitions:
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 50); // a small delay to trigger transition
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    );
};


export default PageWrapper;
