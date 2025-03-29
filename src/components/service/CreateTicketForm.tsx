
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  priority: z.string(),
  ticketType: z.string(),
  customerEmail: z.string().email().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTicketForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      description: '',
      priority: 'medium',
      ticketType: 'support',
      customerEmail: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to create a ticket',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use a raw query since we can't modify the types.ts file
      const { data, error } = await supabase.rpc('create_ticket', {
        p_subject: values.subject,
        p_description: values.description,
        p_priority: values.priority,
        p_type: values.ticketType,
        p_customer_email: values.customerEmail || null,
        p_status: 'open'
      });
      
      if (error) throw error;
      
      toast({
        title: 'Ticket created',
        description: 'Your ticket has been submitted successfully',
      });
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Failed to create ticket',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Brief description of the issue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ticketType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="role">Role Change</SelectItem>
                    <SelectItem value="general">General Question</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Email (optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="If creating on behalf of a customer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of the issue or request" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateTicketForm;
