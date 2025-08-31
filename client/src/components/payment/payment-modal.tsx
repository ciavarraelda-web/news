import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ExternalLink } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "ico" | "banner";
}

const icoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  whitepaperUrl: z.string().url().optional().or(z.literal("")),
  targetAmount: z.string().min(1, "Target amount is required"),
  raisedAmount: z.string().default("0"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean().default(true),
});

const bannerSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  targetUrl: z.string().url("Must be a valid URL"),
  duration: z.enum(["3_days", "1_week"]),
  isActive: z.boolean().default(true),
});

export default function PaymentModal({ open, onOpenChange, type }: PaymentModalProps) {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const icoForm = useForm({
    resolver: zodResolver(icoSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      logoUrl: "",
      websiteUrl: "",
      whitepaperUrl: "",
      targetAmount: "",
      raisedAmount: "0",
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });

  const bannerForm = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      targetUrl: "",
      duration: "3_days" as const,
      isActive: true,
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = type === "ico" ? "/api/sponsorship/ico" : "/api/sponsorship/banner";
      const response = await apiRequest("POST", endpoint, data);
      return response.json();
    },
    onSuccess: (data) => {
      setPaymentUrl(data.hostedUrl);
      toast({
        title: "Payment Created",
        description: "Click the button below to complete your payment with Coinbase.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/sponsored-icos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banner-ads"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    createPaymentMutation.mutate(data);
  };

  const handleClose = () => {
    setPaymentUrl(null);
    icoForm.reset();
    bannerForm.reset();
    onOpenChange(false);
  };

  const currentForm = type === "ico" ? icoForm : bannerForm;
  const isLoading = createPaymentMutation.isPending;

  const categories = [
    "DeFi Platform",
    "Gaming/NFT", 
    "Sustainability",
    "Enterprise",
    "Infrastructure",
    "Privacy",
    "Social",
    "Metaverse",
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-payment">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {type === "ico" ? "Sponsor ICO (100 USDC)" : "Buy Banner Ad"}
          </DialogTitle>
        </DialogHeader>

        {paymentUrl ? (
          <div className="text-center space-y-4" data-testid="payment-success-section">
            <h3 className="text-lg font-semibold text-accent">Payment Created Successfully!</h3>
            <p className="text-muted-foreground">
              Complete your payment using Coinbase Commerce. Your sponsorship will be activated automatically after payment confirmation.
            </p>
            <Button 
              onClick={() => window.open(paymentUrl, "_blank")}
              className="w-full bg-primary text-primary-foreground"
              data-testid="button-complete-payment"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Complete Payment with Coinbase
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              Close
            </Button>
          </div>
        ) : (
          <Form {...currentForm}>
            <form onSubmit={currentForm.handleSubmit(handleSubmit)} className="space-y-4">
              {type === "ico" ? (
                <>
                  <FormField
                    control={icoForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ICO Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., DefiMax Protocol" {...field} data-testid="input-ico-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={icoForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-ico-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={icoForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your ICO and its benefits..."
                            className="min-h-[100px]"
                            {...field}
                            data-testid="textarea-ico-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={icoForm.control}
                      name="targetAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Amount (USD)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="5000000" 
                              {...field}
                              data-testid="input-ico-target-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={icoForm.control}
                      name="raisedAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currently Raised (USD)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              data-testid="input-ico-raised-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={icoForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              data-testid="input-ico-start-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={icoForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              data-testid="input-ico-end-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={icoForm.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="url" 
                            placeholder="https://your-ico-website.com" 
                            {...field}
                            data-testid="input-ico-website"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormField
                    control={bannerForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Trade with 0% Fees" {...field} data-testid="input-banner-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bannerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of your offer..."
                            {...field}
                            data-testid="textarea-banner-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bannerForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            type="url" 
                            placeholder="https://example.com/banner-image.jpg" 
                            {...field}
                            data-testid="input-banner-image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bannerForm.control}
                    name="targetUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target URL</FormLabel>
                        <FormControl>
                          <Input 
                            type="url" 
                            placeholder="https://your-website.com" 
                            {...field}
                            data-testid="input-banner-target-url"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bannerForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-banner-duration">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3_days">3 Days (100 USDC)</SelectItem>
                            <SelectItem value="1_week">1 Week (150 USDC)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                  data-testid="button-create-payment"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {type === "ico" ? "Pay 100 USDC" : "Create Payment"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
