import React, {useState} from 'react';
import FileUploader from './components/FileUploader';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeCall } from './utils/callAnalyzer';
import { analyzeThroughGemini } from './utils/geminiAnalyzer';

const App = () => {

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approach, setApproach] = useState('pattern-matching');
  // const [entity, setEntity] = useState('all');

  const handleFileAnalysis = async (fileContent) => {
    try {
      setLoading(true);
      setError(null);
      
      const transcriptData = JSON.parse(fileContent);
      let analysisResults;
      
      if (approach === 'llm') {
        analysisResults = await analyzeThroughGemini(transcriptData);
      } else {
        analysisResults = analyzeCall(transcriptData);
      }
      setResults(analysisResults);
    } catch (err) {
      setError('Error processing file: ' + err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Call Transcript Analyzer</h1>
          <p className="text-gray-600 mt-2">Upload a call transcript JSON file to detect profanity and privacy violations</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          {/* Analysis Options */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="approach" className="block text-sm font-medium text-gray-700 mb-1">
                Analysis Approach
              </label>
              <select
                id="approach"
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pattern-matching">Pattern Matching</option>
                <option value="llm">Google Gemini API</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {approach === 'pattern-matching' && 'Uses regex patterns to identify violations'}
                {approach === 'llm' && 'Uses Google Gemini for context-aware AI analysis'}
              </p>
            </div>
          </div>

          <FileUploader onFileContent={handleFileAnalysis} />
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {results && <ResultsDisplay results={results} />}
        </div>
      </div>
    </div>
  );
}

export default App