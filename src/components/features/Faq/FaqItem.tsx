"use client";

import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { FAQ } from "@/lib/services/faq-service";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface FaqItemProps {
  faq: FAQ;
  showCategory?: boolean;
  index: number;
  query?: string;
}

export function FaqItem({ 
  faq, 
  showCategory = true, 
  index,
  query = "" 
}: FaqItemProps) {
  const highlightText = (text: string) => {
    if (!query || query.trim() === "") return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <AccordionItem value={faq.id} className="border-b border-border">
      <AccordionTrigger className="hover:no-underline py-5">
        <div className="flex w-full items-start justify-between text-left">
          <div className="flex-1 pr-4">
            <span className="text-base font-medium">
              {highlightText(faq.question)}
            </span>
            {showCategory && (
              <div className="mt-1">
                <Badge variant="outline" className="text-xs font-normal">
                  {faq.category}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>
            {faq.answer}
          </ReactMarkdown>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
} 