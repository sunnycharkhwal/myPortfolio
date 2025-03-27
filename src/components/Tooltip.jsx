// components/Tooltip.jsx
import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export const Tooltip = ({children, content, position = 'top'}) => {
  const [show, setShow] = useState(false);

  const tooltipPosition = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{opacity: 0, y: -5}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -5}}
            transition={{duration: 0.2}}
            className={`absolute z-10 whitespace-nowrap bg-black text-white text-sm px-2 py-1 rounded shadow-lg ${tooltipPosition[position]}`}>
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
