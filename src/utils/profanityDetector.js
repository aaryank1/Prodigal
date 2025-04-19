const profanityRegex = /\b(fuck|shit|damn|ass|bitch|crap|hell|bastard|dick)\b/i;

export function detectProfanity(callTranscript) {
  const results = {
    agentProfanity: [],
    borrowerProfanity: []
  };

  callTranscript.forEach((segment, index) => {
    if (profanityRegex.test(segment.text)) {
      const profaneWords = segment.text.match(profanityRegex);
      
      const violationInfo = {
        segmentIndex: index,
        text: segment.text,
        profaneWords: profaneWords[0],
        time: `${segment.stime} - ${segment.etime}`
      };

      if (segment.speaker === "Agent") {
        results.agentProfanity.push(violationInfo);
      } else {
        results.borrowerProfanity.push(violationInfo);
      }
    }
  });

  return results;
}

// Export the regex pattern for testing or external use
export const getProfanityRegex = () => profanityRegex;