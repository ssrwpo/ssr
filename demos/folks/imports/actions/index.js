
export const RECEIVE_STORIES = 'RECEIVE_STORIES';
export const RECEIVE_INTL = 'RECEIVE_INTL';

export function receiveStories(stories) {
  return {
    type: RECEIVE_STORIES,
    stories,
    receivedAt: Date.now(),
  };
}

export function fetchStories() {

}

export function receiveIntl(intl) {
  return {
    type: 'RECEIVE_INTL',
    intl,
    receivedAt: Date.now(),
  };
}
