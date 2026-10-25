import type { ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, index) => {
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      return <strong key={index} className="font-extrabold text-ink">{chunk.slice(2, -2)}</strong>;
    }
    return <span key={index}>{chunk}</span>;
  });
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split('\n').filter(Boolean);
  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index > 0 ? 'mt-3' : undefined}>
          {renderInline(paragraph)}
        </p>
      ))}
    </div>
  );
}
