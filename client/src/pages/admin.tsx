import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Payment, SponsoredIco, BannerAd } from "@/lib/types";

export default function Admin() {
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/admin/payments"],
  });

  const { data: sponsoredContent, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/admin/sponsored-content"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-accent text-accent-foreground">Completed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "expired":
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text" data-testid="text-admin-title">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage payments and sponsored content
          </p>
        </div>

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-admin-navigation">
            <TabsTrigger value="payments" data-testid="tab-payments">Payments</TabsTrigger>
            <TabsTrigger value="icos" data-testid="tab-icos">Sponsored ICOs</TabsTrigger>
            <TabsTrigger value="banners" data-testid="tab-banners">Banner Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-6">
            <Card data-testid="card-payments">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/6" />
                        <Skeleton className="h-4 w-1/6" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : payments?.length > 0 ? (
                  <Table data-testid="table-payments">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Charge ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment: Payment) => (
                        <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                          <TableCell>{formatDate(payment.createdAt)}</TableCell>
                          <TableCell className="capitalize">{payment.sponsorshipType}</TableCell>
                          <TableCell>{payment.amount} {payment.currency}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="font-mono text-sm">{payment.coinbaseChargeId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No payments found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="icos" className="space-y-6">
            <Card data-testid="card-sponsored-icos">
              <CardHeader>
                <CardTitle>Sponsored ICOs</CardTitle>
              </CardHeader>
              <CardContent>
                {contentLoading ? (
                  <div className="grid gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : sponsoredContent?.icos?.length > 0 ? (
                  <div className="grid gap-4">
                    {sponsoredContent.icos.map((ico: SponsoredIco) => (
                      <Card key={ico.id} data-testid={`card-ico-${ico.id}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{ico.name}</h3>
                            <Badge variant={ico.isActive ? "default" : "secondary"}>
                              {ico.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{ico.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Category:</span> {ico.category}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Target:</span> ${ico.targetAmount}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Raised:</span> ${ico.raisedAmount}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sponsorship Ends:</span> {formatDate(ico.sponsorshipEndDate)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No sponsored ICOs found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners" className="space-y-6">
            <Card data-testid="card-banner-ads">
              <CardHeader>
                <CardTitle>Banner Advertisements</CardTitle>
              </CardHeader>
              <CardContent>
                {contentLoading ? (
                  <div className="grid gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : sponsoredContent?.banners?.length > 0 ? (
                  <div className="grid gap-4">
                    {sponsoredContent.banners.map((banner: BannerAd) => (
                      <Card key={banner.id} data-testid={`card-banner-${banner.id}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{banner.title}</h3>
                            <Badge variant={banner.isActive ? "default" : "secondary"}>
                              {banner.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{banner.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Duration:</span> {banner.duration.replace("_", " ")}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Target URL:</span>{" "}
                              <a 
                                href={banner.targetUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View
                              </a>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Start:</span> {formatDate(banner.startDate)}
                            </div>
                            <div>
                              <span className="text-muted-foreground">End:</span> {formatDate(banner.endDate)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No banner ads found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
