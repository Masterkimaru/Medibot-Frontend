// src/components/MessageList.tsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import { Message } from '../types/Message';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface MessageListProps {
  messages: Message[];
}

const markdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900 border-b-2 border-[#c8e6c9] pb-2" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className={`text-xl font-bold mt-6 mb-3 text-gray-800 px-4 py-2 rounded-t-lg ${
      props.children?.toString().includes('EMERGENCY') ? 'bg-red-100' : 'bg-[#c8e6c9]'
    }`} {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className={`text-lg font-semibold mt-4 mb-2 text-gray-700 border-l-4 pl-3 py-1 ${
      props.children?.toString().includes('Critical') ? 'border-red-500' : 'border-[#81c784]'
    }`} {...props} />
  ),
  h4: ({ node, ...props }: any) => (
    <h4 className="text-md font-medium mt-3 mb-1 text-gray-700" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc ml-6 mb-4 space-y-2 p-4 rounded-lg bg-[#f8faf9]" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal ml-6 mb-4 space-y-2 p-4 rounded-lg bg-[#f8faf9]" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li className="pl-2 text-gray-700 leading-relaxed" {...props} />
  ),
  strong: ({ node, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  em: ({ node, ...props }: any) => (
    <em className="italic text-gray-700" {...props} />
  ),
  p: ({ node, ...props }: any) => {
    const text = props.children?.toString() || '';
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = text.match(youtubeRegex);

    if (match) {
      return (
        <div className="my-4">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${match[1]}`}
              width="100%"
              height="100%"
              controls
              config={{
                youtube: {
                  playerVars: { modestbranding: 1, rel: 0 }
                }
              }}
            />
          </div>
          <p className="mt-2 text-gray-500 text-sm">Related instructional video</p>
        </div>
      );
    }
    return <p className="mb-4 text-gray-700 leading-normal" {...props} />;
  },
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 pl-4 py-3 pr-2 rounded-r my-4 text-sm bg-[#e8f5e9] border-[#81c784]" {...props} />
  ),
  a: ({ node, ...props }: any) => (
    <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  hr: ({ node, ...props }: any) => (
    <hr className="my-6 border-t-2 border-[#e8f5e9]" {...props} />
  ),
  code: ({ node, ...props }: any) => (
    <code className="bg-[#ffecb3] px-2 py-1 rounded text-sm" {...props} />
  )
};

// 🧠 New: Mental Health Text Processor
const processMentalHealthText = (text: string) => {
  let formatted = '## MENTAL HEALTH ASSESSMENT\n\n';

  const [questionsPart, copingPart] = text.split(/Coping Strategies/i);

  if (questionsPart) {
    formatted += '### PHQ-2 Screening\n\n';
    formatted += questionsPart
      .trim()
      .replace(/\n?\d\.\s+/g, '\n1. ')
      .replace(/1\.\s+Over/g, '\n1. Over')
      .replace(/2\.\s+/g, '\n2. ');
  }

  if (copingPart) {
    formatted += '\n\n### Coping Strategies\n\n';
    formatted += copingPart
      .trim()
      .replace(/\n?\d\.\s+/g, '\n1. ')
      .replace(/2\.\s+/g, '\n2. ')
      .replace(/3\.\s+/g, '\n3. ')
      .replace(/4\.\s+/g, '\n4. ');
  }

  return formatted.trim();
};

const formatNumberedList = (text: string, prefix: string) => {
  return text
    .replace(new RegExp(`${prefix}\\s*\\n\\n(\\d\\.)`, 'g'), `${prefix}\n\n$1`)
    .replace(/(\d\..*?)(?=\d\.|$)/gs, (match) => {
      const trimmed = match.trim();
      return `${trimmed}\n\n`;
    })
    .replace(/\n{3,}/g, '\n\n');
};

const processEmergencyText = (text: string) => {
  const sections = text.split(/(Critical Actions|Possible Emergency Causes|Danger Signs|Do Not|When to Call|Disclaimer:)/g);
  let processedText = '## EMERGENCY RESPONSE\n\n';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    switch (section) {
      case 'Critical Actions':
      case 'Possible Emergency Causes':
        processedText += `### ${section}\n\n`;
        processedText += formatNumberedList(sections[++i].trim(), `### ${section}`);
        break;
      case 'Danger Signs':
      case 'Do Not':
      case 'When to Call':
        processedText += `### ${section}\n\n`;
        processedText += sections[++i].trim().replace(/-\s*(.*)/g, '- $1\n');
        break;
      case 'Disclaimer:':
        processedText += '\n---\n\n> **Disclaimer:** ';
        processedText += sections[++i].trim();
        break;
      default:
        if (i === 0) processedText += section;
        break;
    }
  }

  return processedText.replace(/(🚑|🩹|⏱️|🤔|✋|🤜)/g, ' **$1** ').trim();
};

const processMedicalText = (text: string) => {
  const sections = text.split(/(Follow-up Questions|Possible Conditions|Recommended Actions|Medication & Treatment|Disclaimer:)/g);
  let processedText = '';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    if (/Follow-up Questions/i.test(section)) {
      processedText += '\n### Follow-up Questions\n\n';
      processedText += formatNumberedList(sections[++i].trim(), '### Follow-up Questions');
    } else if (/Possible Conditions/i.test(section)) {
      processedText += '\n---\n\n### Possible Conditions\n\n';
      processedText += formatNumberedList(sections[++i].trim(), '### Possible Conditions')
        .replace(/(\d\.)(.*?)(—)/g, '$1 **$2**$3');
    } else if (/Recommended Actions/i.test(section)) {
      processedText += '\n### Recommended Actions\n\n';
      processedText += formatNumberedList(sections[++i].trim(), '### Recommended Actions');
    } else if (/Medication & Treatment/i.test(section)) {
      processedText += '\n---\n\n### Medication & Treatment\n\n';
      processedText += formatNumberedList(sections[++i].trim(), '### Medication & Treatment')
        .replace(/(\d\.)(.*?)(—)/g, '$1 **$2**$3')
        .replace(/ as prescribed/g, '*as prescribed*');
    } else if (/Disclaimer:/i.test(section)) {
      processedText += '\n---\n\n> Disclaimer: ';
      processedText += sections[++i].trim();
    } else if (/MEDICAL ASSESSMENT:/i.test(section)) {
      processedText += `## ${section}\n\n`;
    } else if (i === 0) {
      processedText += section;
    }
  }

  return processedText.replace(/\n{3,}/g, '\n\n').trim();
};

const processBotResponse = (text: string) => {
  if (text.startsWith('EMERGENCY RESPONSE:')) {
    return processEmergencyText(text);
  }
  if (text.includes('MENTAL HEALTH ASSESSMENT') || text.includes('PHQ-2')) {
    return processMentalHealthText(text);
  }
  return processMedicalText(text);
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  const speak = (id: number, text: string) => {
    const synth = window.speechSynthesis;
    const processedText = text.replace(/\*\*/g, '').replace(/\*/g, '');

    if (synth.speaking && speakingId === id) {
      synth.cancel();
      setSpeakingId(null);
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(processedText);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      synth.cancel();
      synth.speak(utterance);
    } else {
      alert('Text-to-speech not supported in this browser.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 flex flex-col px-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`
            relative
            max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-3xl
            p-4 rounded-2xl
            ${msg.sender === 'user'
              ? 'bg-blue-600 text-white self-end'
              : 'bg-white self-start border border-[#e8f5e9] shadow-sm'}
          `}
          style={{
            borderTopRightRadius: msg.sender === 'user' ? '0.5rem' : '2rem',
            borderTopLeftRadius: msg.sender === 'bot' ? '0.5rem' : '2rem',
          }}
        >
          {msg.sender === 'bot' ? (
            <div className="max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {processBotResponse(msg.text)}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{msg.text}</p>
          )}

          {msg.sender === 'bot' && (
            <button
              onClick={() => speak(msg.id, msg.text)}
              className="absolute -right-8 top-2 text-gray-500 hover:text-gray-700"
              title="Toggle speech"
              aria-label="Text-to-speech"
            >
              {speakingId === msg.id ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
