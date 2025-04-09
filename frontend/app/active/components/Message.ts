export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const messageList: Message[] = [
  {
    sender: 'ai',
    text: 'Hi there! How are you doing today?',
  },
  {
    sender: 'user',
    text: 'I’m doing great, thanks! Excited to practice some conversation.',
  },
  {
    sender: 'ai',
    text: 'That’s awesome to hear. What topic would you like to talk about?',
  },
  {
    sender: 'user',
    text: 'How about travel? I love exploring new places.',
  },
  {
    sender: 'ai',
    text: 'Great choice! What’s the most memorable place you’ve visited?',
  },
  {
    sender: 'user',
    text: 'I’d say Kyoto in Japan. The temples and gardens were amazing.',
  },
  {
    sender: 'ai',
    text: 'That sounds beautiful. I’ve heard Kyoto is rich in culture and history.',
  }
];
