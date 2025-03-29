
import { faqData } from './faqData';
import { ingestKnowledgeBase } from '@/services/ai';

export const populateKnowledgeBase = async () => {
  try {
    // Format the data for ingestion
    const entries = faqData.map(item => ({
      title: item.question,
      content: item.answer
    }));
    
    // Ingest the FAQ data
    const result = await ingestKnowledgeBase(entries, 'faq');
    
    return result;
  } catch (error) {
    console.error('Error populating knowledge base:', error);
    throw error;
  }
};
