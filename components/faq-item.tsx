import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ReactNode } from "react"

export interface FAQItemProps {
  id: string
  question: string
  answer: ReactNode
}

export default function FAQItem({ id, question, answer }: FAQItemProps) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger>{question}</AccordionTrigger>
      <AccordionContent>{answer}</AccordionContent>
    </AccordionItem>
  )
}