import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

interface NewsletterFormProps {
  isFooter?: boolean;
}

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof emailSchema>;

const NewsletterForm = ({ isFooter = false }: NewsletterFormProps) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest("POST", "/api/subscribe", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Subscribed!",
        description: "You've successfully subscribed to our newsletter.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to subscribe: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    subscribeMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className={`text-center p-4 rounded-md ${isFooter ? "bg-white bg-opacity-10" : "bg-white"}`}>
        <p className={`font-accent ${isFooter ? "text-white" : "text-[#1a5276]"}`}>
          Thanks for subscribing! Check your inbox soon for surf updates.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className={isFooter 
                    ? "w-full px-4 py-2 rounded-md border border-transparent bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white font-accent" 
                    : "w-full px-4 py-2 rounded-md border border-transparent bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white font-accent"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage className={isFooter ? "text-white" : ""} />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={subscribeMutation.isPending}
          className={`w-full ${isFooter 
            ? "bg-[#f39c12] hover:bg-opacity-90 text-white" 
            : "bg-[#f39c12] hover:bg-opacity-90 text-white"
          } font-accent font-medium px-4 py-2 rounded-md transition duration-150`}
        >
          {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      <p className="text-white text-opacity-70 text-xs mt-3 font-accent">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </Form>
  );
};

export default NewsletterForm;
