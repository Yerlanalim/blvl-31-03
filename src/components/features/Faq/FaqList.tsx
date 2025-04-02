"use client";

import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { FAQ } from "@/lib/services/faq-service";
import { FaqItem } from "./FaqItem";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FaqListProps {
  faqs: FAQ[] | undefined;
  isLoading: boolean;
  query: string;
  groupByCategory: boolean;
}

export function FaqList({
  faqs,
  isLoading,
  query,
  groupByCategory,
}: FaqListProps) {
  // Group FAQs by category for display
  const groupedFaqs = useMemo(() => {
    if (!faqs) return {};
    
    // If not grouping by category, return a single group
    if (!groupByCategory) {
      return { "results": faqs };
    }
    
    // Group by category
    return faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, FAQ[]>);
  }, [faqs, groupByCategory]);

  // Create loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Handle empty state
  if (!faqs || faqs.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ничего не найдено</AlertTitle>
        <AlertDescription>
          {query 
            ? `По запросу "${query}" ничего не найдено. Попробуйте изменить запрос.` 
            : "В этой категории нет вопросов. Выберите другую категорию."}
        </AlertDescription>
      </Alert>
    );
  }

  // If not grouping by category, show a flat list
  if (!groupByCategory) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            {query ? `Результаты поиска` : "Вопросы и ответы"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <FaqItem 
                key={faq.id} 
                faq={faq} 
                index={index}
                query={query}
                showCategory={!!query}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    );
  }

  // Otherwise, show grouped by category
  return (
    <div className="space-y-6">
      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <Card key={category}>
          <CardHeader className="pb-2">
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {categoryFaqs.map((faq, index) => (
                <FaqItem 
                  key={faq.id} 
                  faq={faq} 
                  index={index} 
                  query={query}
                  showCategory={false}
                />
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 