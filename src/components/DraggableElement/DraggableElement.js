'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box } from '@mantine/core';

export default function DraggableElement({ children, initialPosition = { x: 0, y: 0 }, onClick }) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const hasMoved = useRef(false);
  const elementRef = useRef(null);
  const dragStart = useRef({ elementX: 0, elementY: 0, mouseX: 0, mouseY: 0 });

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragStart.current = {
      elementX: position.x,
      elementY: position.y,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
    
    hasMoved.current = false;
    setIsDragging(true);
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      hasMoved.current = true;
      const newX = dragStart.current.elementX + (e.clientX - dragStart.current.mouseX);
      const newY = dragStart.current.elementY + (e.clientY - dragStart.current.mouseY);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!hasMoved.current && onClick) {
        onClick(e);
      }
      
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, onClick]);

  return (
    <Box
      ref={elementRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 202,
        userSelect: 'none',
      }}
    >
      {children}
    </Box>
  );
} 