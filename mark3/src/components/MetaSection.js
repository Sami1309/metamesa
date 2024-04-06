import { h } from 'preact';
import { useState } from 'preact/hooks';
import '../styles/metaMesaContainerStyle.css';

const MetaSuggestion = ({ text, onAccept, onDelete, isLoading,  suggestionsActive }) => {
  const [accepted, setAccepted] = useState(false);

  const suggestionClass = `suggestion ${accepted ? 'accepted' : ''} ${isLoading ? 'loading' : ''}`;


  const handleAccept = () => {
    const newAcceptedState = !accepted;
    setAccepted(newAcceptedState);
    if (newAcceptedState) {
      onAccept();
    }
  };
  return (
    <div className={suggestionClass} onClick={isLoading ? null : handleAccept}>
      {text}
      {!isLoading && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>🗑️</button>
      )}
    </div>
  );
};

const MetaSection = ({ suggestions, acceptedSuggestions, onDelete, onAccept, isLoading, suggestionsActive  }) => {
    
    console.log("meta suggestions in the file are", suggestions)

    return (
        <div className={`metaMesaContainer ${suggestionsActive ? 'active' : ''}`}>
        {acceptedSuggestions.map((suggestion, index) => (
          <div key={index} className="suggestion accepted">{suggestion}</div>
        ))}
        {isLoading && !acceptedSuggestions.length
          ? Array(3).fill(0).map((_, index) => (
            <MetaSuggestion key={index} text="..." isLoading={true} />
          ))
          : suggestions.map((suggestion, index) => (
            <MetaSuggestion
              key={index}
              text={suggestion}
              onAccept={() => onAccept(suggestion)}
              onDelete={() => onDelete(index)}
              isLoading={false}
            />
          ))
        }
      </div>
    );
    
}

export default MetaSection;
