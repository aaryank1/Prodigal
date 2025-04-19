export const getProfanityRegex = () => profanityRegex;

// src/utils/privacyDetector.js
/**
 * Utility functions for detecting privacy violations in call transcripts
 */

// Sensitive information patterns
const sensitiveInfoRegex = /\b(balance|account|owe|payment|due|amount)\b.*?\$?\d+/i;

// Identity verification patterns
const verificationRegex = /\b(date of birth|dob|ssn|social security|address|verify|verification)\b/i;

/**
 * Detects privacy violations (sharing sensitive info without verification)
 * @param {Array} callTranscript - The call transcript data
 * @returns {Array} Instances of privacy violations
 */
export function detectPrivacyViolations(callTranscript) {
  const violations = [];
  let verificationPerformed = false;
  
  // First pass - check if verification was performed in the call
  for (const segment of callTranscript) {
    if (segment.speaker === "Agent" && verificationRegex.test(segment.text)) {
      verificationPerformed = true;
      break;
    }
  }
  
  // If no verification was performed, check for sensitive info sharing
  if (!verificationPerformed) {
    callTranscript.forEach((segment, index) => {
      if (segment.speaker === "Agent" && sensitiveInfoRegex.test(segment.text)) {
        violations.push({
          segmentIndex: index,
          text: segment.text,
          sensitiveInfo: segment.text.match(sensitiveInfoRegex)[0],
          time: `${segment.stime} - ${segment.etime}`
        });
      }
    });
  }
  
  return violations;
}

// Export the regex patterns for testing or external use
export const getSensitiveInfoRegex = () => sensitiveInfoRegex;
export const getVerificationRegex = () => verificationRegex;
