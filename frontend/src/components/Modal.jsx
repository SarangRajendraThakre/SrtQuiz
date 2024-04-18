import React from 'react';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Add your modal content here */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
