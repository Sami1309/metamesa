import { h } from 'preact';
import { useState } from 'preact/hooks';
import '../styles/metaMesaContainerStyle.css';

const MesaSuggestion = ({ text, onAccept, onDelete }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    const newAcceptedState = !accepted;
    setAccepted(newAcceptedState);
    if (newAcceptedState) {
      onAccept();
    }
  };

  return (
    <div className={`suggestion ${accepted ? 'accepted' : ''}`} onClick={handleAccept}>
      {text}
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>🗑️</button>
    </div>
  );
};

const MesaSection = ({ suggestions, onDelete, suggestionsActive}) => {

    console.log("mesa's mesa suggestions are", suggestions)
    return (
        <div className={`metaMesaContainer ${suggestionsActive ? 'active' : ''}`}>
          {suggestions.map((suggestion, index) => (
            <MesaSuggestion
              key={index}
              text={suggestion.text}
              onAccept={() => console.log('Accepted: ', suggestion)}
              onDelete={() => onDelete(index)}
            />
          ))}
        </div>
      );
}

export default MesaSection;
