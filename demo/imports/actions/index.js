export const RECEIVE_STORIES = 'RECEIVE_STORIES';

export function receiveStories(stories) {
  return {
    type: RECEIVE_STORIES,
    stories,
    receivedAt: Date.now(),
  };
}
