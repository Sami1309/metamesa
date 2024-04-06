import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import '../styles/centralTextBoxStyle.css';

const CentralTextBox = ({ onTextChange }) => {
  const [text, setText] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleInput = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Clear the previous timeout (if there is one)
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout
    setTypingTimeout(setTimeout(() => {
      onTextChange(newText); // Call the callback function after a 1-second delay
    }, 1000));
  };

  return (
    <textarea
      className="centralTextBox"
      onInput={handleInput}
      value={text}
      placeholder="Type here..."
    />
  );
};

export default CentralTextBox;
