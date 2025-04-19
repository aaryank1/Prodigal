export function calculateOvertalk(callTranscript) {
    if (!callTranscript || callTranscript.length === 0) {
      return { percentage: 0, overtalkSeconds: 0, totalCallDuration: 0, instances: [] };
    }
  
    // Sort segments by start time to ensure chronological order
    const sortedTranscript = [...callTranscript].sort((a, b) => a.stime - b.stime);
    
    // Find total call duration (from start of first segment to end of last segment)
    const callStart = Math.min(...sortedTranscript.map(segment => segment.stime));
    const callEnd = Math.max(...sortedTranscript.map(segment => segment.etime));
    const totalCallDuration = callEnd - callStart;
    
    // Find overlapping segments
    const overtalkInstances = [];
    let totalOvertalkDuration = 0;
    
    for (let i = 0; i < sortedTranscript.length; i++) {
      const currentSegment = sortedTranscript[i];
      
      for (let j = i + 1; j < sortedTranscript.length; j++) {
        const nextSegment = sortedTranscript[j];
        
        // Check if segments overlap
        if (currentSegment.etime > nextSegment.stime && currentSegment.stime < nextSegment.etime) {
          // Calculate overlap duration
          const overlapStart = Math.max(currentSegment.stime, nextSegment.stime);
          const overlapEnd = Math.min(currentSegment.etime, nextSegment.etime);
          const overlapDuration = overlapEnd - overlapStart;
          
          if (overlapDuration > 0) {
            totalOvertalkDuration += overlapDuration;
            
            overtalkInstances.push({
              speakers: [currentSegment.speaker, nextSegment.speaker],
              duration: overlapDuration,
              start: overlapStart,
              end: overlapEnd,
              text: [
                `${currentSegment.speaker}: ${currentSegment.text}`,
                `${nextSegment.speaker}: ${nextSegment.text}`
              ]
            });
          }
        }
      }
    }
    
    // Calculate percentage
    const overtalkPercentage = (totalOvertalkDuration / totalCallDuration) * 100;
    
    return {
      percentage: parseFloat(overtalkPercentage.toFixed(2)),
      overtalkSeconds: parseFloat(totalOvertalkDuration.toFixed(2)),
      totalCallDuration: parseFloat(totalCallDuration.toFixed(2)),
      instances: overtalkInstances
    };
  }
  
  export function calculateSilence(callTranscript) {
    if (!callTranscript || callTranscript.length === 0) {
      return { percentage: 0, silenceSeconds: 0, totalCallDuration: 0, instances: [] };
    }
  
    // Sort segments by start time to ensure chronological order
    const sortedTranscript = [...callTranscript].sort((a, b) => a.stime - b.stime);
    
    // Find total call duration (from start of first segment to end of last segment)
    const callStart = Math.min(...sortedTranscript.map(segment => segment.stime));
    const callEnd = Math.max(...sortedTranscript.map(segment => segment.etime));
    const totalCallDuration = callEnd - callStart;
    
    // Create a timeline of speech
    const speechTimeline = [];
    
    // Add all speech segments to the timeline
    sortedTranscript.forEach(segment => {
      speechTimeline.push({ time: segment.stime, type: 'start' });
      speechTimeline.push({ time: segment.etime, type: 'end' });
    });
    
    // Sort timeline by time
    speechTimeline.sort((a, b) => a.time - b.time);
    
    // Find gaps (silence)
    let activeSpeechCount = 0;
    let silenceStart = callStart;
    const silenceInstances = [];
    let totalSilenceDuration = 0;
    
    speechTimeline.forEach(event => {
      if (event.type === 'start') {
        // Someone started talking
        if (activeSpeechCount === 0 && event.time > silenceStart) {
          // We were in silence, now someone is talking
          const silenceDuration = event.time - silenceStart;
          if (silenceDuration > 0.5) { // Only count silences longer than half a second
            silenceInstances.push({
              start: silenceStart,
              end: event.time,
              duration: silenceDuration
            });
            totalSilenceDuration += silenceDuration;
          }
        }
        activeSpeechCount++;
      } else {
        // Someone stopped talking
        activeSpeechCount--;
        if (activeSpeechCount === 0) {
          // Everyone stopped talking, silence begins
          silenceStart = event.time;
        }
      }
    });
    
    // Check if the call ends with silence
    if (activeSpeechCount === 0 && callEnd > silenceStart) {
      const silenceDuration = callEnd - silenceStart;
      if (silenceDuration > 0.5) {
        silenceInstances.push({
          start: silenceStart,
          end: callEnd,
          duration: silenceDuration
        });
        totalSilenceDuration += silenceDuration;
      }
    }
    
    // Calculate percentage
    const silencePercentage = (totalSilenceDuration / totalCallDuration) * 100;
    
    return {
      percentage: parseFloat(silencePercentage.toFixed(2)),
      silenceSeconds: parseFloat(totalSilenceDuration.toFixed(2)),
      totalCallDuration: parseFloat(totalCallDuration.toFixed(2)),
      instances: silenceInstances
    };
  }