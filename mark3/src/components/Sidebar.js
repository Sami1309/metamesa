import { h } from 'preact';
import { useState } from 'preact/hooks';
import '../styles/sidebarStyle.css';

const FileIcon = ({ file, isSelected, onSelect }) => {
    const handleSelect = () => {
      onSelect(file.name);
    };
  
    const iconStyle = {
      fill: 'currentColor',
      width: '24px', // Set the size of your icon
      height: '24px',
      marginRight: '8px',
    };
  
    return (
      <div className={`fileItem ${isSelected ? 'selected' : ''}`} onClick={handleSelect}>
        <svg style={iconStyle} viewBox="0 0 24 24">
          <path d="M14,2H6C4.9,2 4,2.9 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V8L14,2Z" />
        </svg>
        <span>{file.name}</span>
      </div>
    );
  };

const Sidebar = ({ onFileUpload, onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files).map(file => ({
      name: file.name,
      content: `Simulated extracted text from ${file.name}` // Simulated content
    }));

    const newFilesState = [...files, ...uploadedFiles];
    setFiles(newFilesState);
    onFileUpload(newFilesState);
  };

  const toggleFileSelection = (fileName) => {
    setSelectedFiles(prevState => ({
      ...prevState,
      [fileName]: !prevState[fileName]
    }));
  };

  return (
    <div className="sidebar">
      <input type="file" multiple onChange={handleFileChange} />
      {files.map((file) => (
        <FileIcon
          key={file.name}
          file={file}
          isSelected={selectedFiles[file.name]}
          onSelect={toggleFileSelection}
        />
      ))}
    </div>
  );
};

export default Sidebar;
