import { detectProfanity } from './profanityDetector';
import { detectPrivacyViolations } from './privacyDetector';
import { calculateOvertalk, calculateSilence } from './qualityMetrics';

export function analyzeCall(callTranscript) {
  const profanityResults = detectProfanity(callTranscript);
  const privacyViolations = detectPrivacyViolations(callTranscript);
  const overtalkMetrics = calculateOvertalk(callTranscript);
  const silenceMetrics = calculateSilence(callTranscript);
  
  return {
    profanityDetection: profanityResults,
    privacyViolations: privacyViolations,
    qualityMetrics: {
      overtalk: overtalkMetrics,
      silence: silenceMetrics
    }
  };
}
