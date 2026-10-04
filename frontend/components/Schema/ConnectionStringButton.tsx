"use client";

import { useState } from 'react';
import ConnectionStringModal from './ConnectionStringModal';

export default function ConnectionStringButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary"
        style={{
          border: '1px solid rgba(139, 92, 246, 0.4)',
          background: 'rgba(124, 58, 237, 0.12)',
          color: '#c4b5fd',
          cursor: 'pointer',
        }}
      >
        🔌 Connection String
      </button>

      <ConnectionStringModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
