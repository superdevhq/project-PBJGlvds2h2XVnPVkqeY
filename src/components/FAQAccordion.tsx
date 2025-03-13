
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items, className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <button 
              className="flex justify-between items-center w-full text-left py-2"
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
            >
              <h3 className="font-medium text-lg">{item.question}</h3>
              {openIndex === index ? 
                <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" /> : 
                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              }
            </button>
            {openIndex === index && (
              <div className="mt-2 pr-6 text-muted-foreground animate-fadeIn">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FAQAccordion;
