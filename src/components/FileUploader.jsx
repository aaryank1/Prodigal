import React, {useState, useRef} from 'react'

const FileUploader = ({onFileContent}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
  
    const handleDragLeave = () => {
      setIsDragging(false);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    };
  
    const handleFileChange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    };
  
    const processFile = (file) => {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        onFileContent(event.target.result);
      };
      reader.readAsText(file);
    };
  
    const triggerFileInput = () => {
      fileInputRef.current.click();
    };

    return (
        <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          onChange={handleFileChange}
          accept=".json"
        />
        
        <div className="flex flex-col items-center justify-center">
          <svg 
            className="w-12 h-12 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>

          <p className="mb-2 text-gray-700">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mb-4">JSON files only</p>
          
          <button 
            onClick={triggerFileInput}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Select File
          </button>
          
          {fileName && (
            <p className="mt-4 text-sm text-gray-600">
              Selected file: <span className="font-medium">{fileName}</span>
            </p>
          )}
        </div>
      </div>
    );
}

export default FileUploader