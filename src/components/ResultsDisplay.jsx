import React, {useState} from 'react'

const ResultsDisplay = ({ results }) => {
    const [activeTab, setActiveTab] = useState('profanity');

    const { profanityDetection, privacyViolations, qualityMetrics } = results;
    const agentProfanity = profanityDetection.agentProfanity;
    const borrowerProfanity = profanityDetection.borrowerProfanity;

    const hasProfanity = agentProfanity.length > 0 || borrowerProfanity.length > 0;
    const hasPrivacyViolations = privacyViolations.length > 0;
    
    return (
      <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Profanity card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-red-500 text-3xl font-bold">
                {agentProfanity.length + borrowerProfanity.length}
              </span>
            </div>
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-medium">Profanity Instances</h3>
              <p className="text-xs text-gray-400">Agent: {agentProfanity.length} | Customer: {borrowerProfanity.length}</p>
            </div>
          </div>
        </div>
        
        {/* Privacy violations card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-purple-500 text-3xl font-bold">
                {privacyViolations.length}
              </span>
            </div>
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-medium">Privacy Violations</h3>
              <p className="text-xs text-gray-400">Sensitive info without verification</p>
            </div>
          </div>
        </div>
        
        {/* Overtalk card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-blue-500 text-3xl font-bold">
                {qualityMetrics.overtalk.percentage}%
              </span>
            </div>
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-medium">Overtalk</h3>
              <p className="text-xs text-gray-400">{qualityMetrics.overtalk.overtalkSeconds}s of {qualityMetrics.overtalk.totalCallDuration}s</p>
            </div>
          </div>
        </div>
        
        {/* Silence card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-amber-500 text-3xl font-bold">
                {qualityMetrics.silence.percentage}%
              </span>
            </div>
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-medium">Silence</h3>
              <p className="text-xs text-gray-400">{qualityMetrics.silence.silenceSeconds}s of {qualityMetrics.silence.totalCallDuration}s</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('profanity')}
            className={`mr-4 py-2 px-4 font-medium text-sm ${
              activeTab === 'profanity'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profanity Detection
            {hasProfanity && <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">{agentProfanity.length + borrowerProfanity.length}</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('privacy')}
            className={`mr-4 py-2 px-4 font-medium text-sm ${
              activeTab === 'privacy'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Privacy Violations
            {hasPrivacyViolations && <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">{privacyViolations.length}</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('quality')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'quality'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Call Quality Metrics
          </button>
        </nav>
      </div>
      
      {/* Content for Profanity tab */}
      {activeTab === 'profanity' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Agent Profanity</h3>
            {agentProfanity.length > 0 ? (
              <div className="space-y-4">
                {agentProfanity.map((item, index) => (
                  <div key={index} className="bg-red-50 p-4 rounded-md border-l-4 border-red-500">
                    <p className="text-sm text-gray-600 mb-1">Segment: {item.segmentIndex} | Time: {item.time}</p>
                    <p className="mb-2">{item.text}</p>
                    <p className="text-sm font-medium text-red-600">Profane word: "{item.profaneWords}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 bg-green-50 p-3 rounded-md">No agent profanity detected.</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Borrower Profanity</h3>
            {borrowerProfanity.length > 0 ? (
              <div className="space-y-4">
                {borrowerProfanity.map((item, index) => (
                  <div key={index} className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-600 mb-1">Segment: {item.segmentIndex} | Time: {item.time}</p>
                    <p className="mb-2">{item.text}</p>
                    <p className="text-sm font-medium text-yellow-700">Profane word: "{item.profaneWords}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 bg-green-50 p-3 rounded-md">No borrower profanity detected.</p>
            )}
          </div>
        </div>
      )}

      {/* Content for Privacy tab */}
      {activeTab === 'privacy' && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Privacy Violations</h3>
          {privacyViolations.length > 0 ? (
            <div className="space-y-4">
              {privacyViolations.map((item, index) => (
                <div key={index} className="bg-purple-50 p-4 rounded-md border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600 mb-1">Segment: {item.segmentIndex} | Time: {item.time}</p>
                  <p className="mb-2">{item.text}</p>
                  <p className="text-sm font-medium text-purple-700">Sensitive info: "{item.sensitiveInfo}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-600 bg-green-50 p-3 rounded-md">No privacy violations detected.</p>
          )}
        </div>
      )}
      
      {/* Content for Call Quality Metrics tab */}
      {activeTab === 'quality' && (
        <div>
          {/* Overtalk Analysis */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Overtalk Analysis</h3>
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Overtalk Percentage</p>
                  <p className="text-2xl font-bold text-blue-600">{qualityMetrics.overtalk.percentage}%</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2 bg-blue-50 rounded">
                  <p className="text-xs text-gray-500">Overtalk Duration</p>
                  <p className="font-medium">{qualityMetrics.overtalk.overtalkSeconds}s</p>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <p className="text-xs text-gray-500">Total Call Duration</p>
                  <p className="font-medium">{qualityMetrics.overtalk.totalCallDuration}s</p>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <p className="text-xs text-gray-500">Overtalk Instances</p>
                  <p className="font-medium">{qualityMetrics.overtalk.instances.length}</p>
                </div>
              </div>
            </div>
            
            {qualityMetrics.overtalk.instances.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">Overtalk Instances</h4>
                {qualityMetrics.overtalk.instances.map((instance, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">
                      Time: {instance.start.toFixed(1)}s - {instance.end.toFixed(1)}s (Duration: {instance.duration.toFixed(1)}s)
                    </p>
                    <div className="mt-2 space-y-2">
                      {instance.text.map((text, i) => (
                        <p key={i} className="text-sm">{text}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 bg-green-50 p-3 rounded-md">No overtalk instances detected.</p>
            )}
          </div>
          
          {/* Silence Analysis */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Silence Analysis</h3>
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Silence Percentage</p>
                  <p className="text-2xl font-bold text-amber-600">{qualityMetrics.silence.percentage}%</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2 bg-amber-50 rounded">
                  <p className="text-xs text-gray-500">Silence Duration</p>
                  <p className="font-medium">{qualityMetrics.silence.silenceSeconds}s</p>
                </div>
                <div className="p-2 bg-amber-50 rounded">
                  <p className="text-xs text-gray-500">Total Call Duration</p>
                  <p className="font-medium">{qualityMetrics.silence.totalCallDuration}s</p>
                </div>
                <div className="p-2 bg-amber-50 rounded">
                  <p className="text-xs text-gray-500">Silence Instances</p>
                  <p className="font-medium">{qualityMetrics.silence.instances.length}</p>
                </div>
              </div>
            </div>
            
            {qualityMetrics.silence.instances.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">Silence Instances</h4>
                {qualityMetrics.silence.instances.map((instance, index) => (
                  <div key={index} className="bg-amber-50 p-4 rounded-md border-l-4 border-amber-500">
                    <p className="text-sm">
                      Silence at {instance.start.toFixed(1)}s - {instance.end.toFixed(1)}s (Duration: {instance.duration.toFixed(1)}s)
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 bg-green-50 p-3 rounded-md">No significant silence instances detected.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay