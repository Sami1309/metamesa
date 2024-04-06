import { h } from 'preact';
import { useState } from 'preact/hooks';

const SearchComponent = () => {
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:3001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchString }),
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={performSearch} disabled={isSearching}>
        {isSearching ? 'Searching...' : 'Search'}
      </button>
      <div>
        {results.map((result, index) => (
          <div key={index}>
            {/* Render your search result content */}
            {result.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;
