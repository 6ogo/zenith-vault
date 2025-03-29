
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import ChatInterface from "./ChatInterface";

interface ChatbotButtonProps {
  className?: string;
}

const ChatbotButton = ({ className }: ChatbotButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`rounded-full p-3 h-auto w-auto shadow-lg ${className}`}
        size="icon"
        variant="default"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 h-[90vh]">
          <ChatInterface />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotButton;
