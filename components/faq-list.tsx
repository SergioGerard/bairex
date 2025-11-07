import { Accordion } from "@/components/ui/accordion"
import FAQItem from "./faq-item"
import { ReactNode } from "react"

export interface FAQData {
  id: string
  question: string
  answer: ReactNode
}

interface FAQListProps {
  faqs: FAQData[]
  className?: string
}

export default function FAQList({ faqs, className = "w-full" }: FAQListProps) {
  return (
    <Accordion type="single" collapsible className={className}>
      {faqs.map((faq) => (
        <FAQItem key={faq.id} id={faq.id} question={faq.question} answer={faq.answer} />
      ))}
    </Accordion>
  )
}