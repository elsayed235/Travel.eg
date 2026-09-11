import { DayGiResponse } from '../../types';

/**
 * Chat message type for DayGI conversation.
 * Extracted from DayGiConciergeView to reduce file size and enable reuse.
 */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'daygi';
  text: string;
  timestamp: string;
  responsePayload?: DayGiResponse;
  liked?: boolean;
  disliked?: boolean;
  actionExecuted?: boolean;
  executionResult?: any;
}