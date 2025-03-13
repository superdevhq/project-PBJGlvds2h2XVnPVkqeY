
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlusCircle, MinusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  title?: string;
  showIcons?: boolean;
  iconType?: 'chevron' | 'plusMinus';
  allowMultiple?: boolean;
  cardStyle?: 'default' | 'minimal' | 'bordered';
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ 
  items, 
  className = '', 
  title = 'Frequently Asked Questions',
  showIcons = true,
  iconType = 'chevron',
  allowMultiple = false,
  cardStyle = 'default'
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(
        openIndexes.includes(index)
          ? openIndexes.filter(i => i !== index)
          : [...openIndexes, index]
      );
    } else {
      setOpenIndexes(openIndexes.includes(index) ? [] : [index]);
    }
  };

  const isOpen = (index: number) => openIndexes.includes(index);

  // Group FAQs by category if they have categories
  const hasCategories = items.some(item => item.category);
  const groupedItems = hasCategories 
    ? items.reduce((acc, item) => {
        const category = item.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {} as Record<string, FAQItem[]>)
    : { 'All Questions': items };

  const getCardClassName = () => {
    switch (cardStyle) {
      case 'minimal': return 'bg-transparent shadow-none border-none';
      case 'bordered': return 'border-2 shadow-none';
      default: return '';
    }
  };

  const renderIcon = (index: number) => {
    if (!showIcons) return null;
    
    const open = isOpen(index);
    if (iconType === 'plusMinus') {
      return open 
        ? <MinusCircle className="h-5 w-5 text-primary flex-shrink-0" /> 
        : <PlusCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
    }
    
    return open 
      ? <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" /> 
      : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
  };

  return (
    <Card className={`p-6 ${getCardClassName()} ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      {Object.entries(groupedItems).map(([category, categoryItems], categoryIndex) => (
        <div key={categoryIndex} className="mb-8 last:mb-0">
          {hasCategories && Object.keys(groupedItems).length > 1 && (
            <h3 className="text-lg font-medium mb-4 text-primary">{category}</h3>
          )}
          
          <div className="space-y-4">
            {categoryItems.map((item, index) => {
              const itemIndex = hasCategories 
                ? items.findIndex(i => i.question === item.question) 
                : index;
                
              return (
                <div 
                  key={itemIndex} 
                  className="border-b pb-4 last:border-b-0 hover:bg-muted/20 rounded-md transition-colors"
                >
                  <button 
                    className="flex justify-between items-center w-full text-left py-3 px-2 rounded-md"
                    onClick={() => toggleItem(itemIndex)}
                    aria-expanded={isOpen(itemIndex)}
                  >
                    <h3 className="font-medium text-lg">{item.question}</h3>
                    {renderIcon(itemIndex)}
                  </button>
                  
                  <AnimatePresence>
                    {isOpen(itemIndex) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 px-2 pb-2 pr-6 text-muted-foreground">
                          <p>{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default FAQAccordion;
