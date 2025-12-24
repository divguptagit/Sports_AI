"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Tooltip } from "@/components/ui/Tooltip";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  TableSkeleton,
  CardSkeleton,
  StatCardSkeleton,
  GameCardSkeleton,
} from "@/components/ui/LoadingSkeleton";

export default function UIShowcasePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState("buttons");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          UI Component Showcase
        </h1>
        <p className="text-muted-foreground">
          A comprehensive display of all UI components and their states
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="dialogs">Dialogs</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
        </TabsList>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-8">
          <div>
            <SectionHeader
              title="Buttons"
              description="Various button variants and states"
            />
            <div className="mt-6 space-y-6">
              {/* Variants */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                  <Button variant="secondary">
                    View Details
                    <Activity className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-8">
          <div>
            <SectionHeader
              title="Cards"
              description="Card components including StatCard"
            />
            <div className="mt-6 space-y-8">
              {/* Stat Cards */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Stat Cards</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Total Picks"
                    value="142"
                    delta={{ value: 12.5, label: "from last week" }}
                    icon={<TrendingUp className="h-4 w-4" />}
                  />
                  <StatCard
                    title="Win Rate"
                    value="58.2%"
                    delta={{ value: 3.1 }}
                    icon={<Activity className="h-4 w-4" />}
                  />
                  <StatCard
                    title="ROI"
                    value="+$1,234"
                    delta={{ value: -2.4, label: "from last month" }}
                    icon={<DollarSign className="h-4 w-4" />}
                  />
                  <StatCard
                    title="Active Alerts"
                    value="8"
                    icon={<Users className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Regular Cards */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Regular Cards</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Game Analysis</CardTitle>
                      <CardDescription>
                        Lakers vs Warriors - Tonight 7:30 PM
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Advanced metrics and odds movement analysis for this
                        matchup.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        Featured Pick
                      </CardTitle>
                      <CardDescription>
                        High confidence recommendation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Lakers -3.5 @ -110 with 72% model confidence
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-8">
          <div>
            <SectionHeader
              title="Badges"
              description="Status indicators and labels"
            />
            <div className="mt-6 space-y-6">
              {/* Variants */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Use Cases</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Game Status:</span>
                    <Badge variant="success">Live</Badge>
                    <Badge variant="secondary">Scheduled</Badge>
                    <Badge variant="outline">Final</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Pick Result:</span>
                    <Badge variant="success">Win</Badge>
                    <Badge variant="destructive">Loss</Badge>
                    <Badge variant="warning">Push</Badge>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Confidence:</span>
                    <Badge variant="success">Very High</Badge>
                    <Badge variant="default">High</Badge>
                    <Badge variant="secondary">Medium</Badge>
                    <Badge variant="outline">Low</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Dialogs Tab */}
        <TabsContent value="dialogs" className="space-y-8">
          <div>
            <SectionHeader
              title="Dialogs & Menus"
              description="Modal dialogs, dropdowns, and tooltips"
            />
            <div className="mt-6 space-y-6">
              {/* Dialog */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Dialog</h3>
                <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogContent onClose={() => setDialogOpen(false)}>
                    <DialogHeader>
                      <DialogTitle>Create Simulated Pick</DialogTitle>
                      <DialogDescription>
                        Track your analytical predictions without real money.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm text-muted-foreground">
                        This is a modal dialog for user interactions.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => setDialogOpen(false)}>
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Dropdown Menu */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Dropdown Menu</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Open Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Pick</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tooltips */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Tooltips</h3>
                <div className="flex gap-4">
                  <Tooltip content="This is a tooltip" side="top">
                    <Button variant="outline">Hover (Top)</Button>
                  </Tooltip>
                  <Tooltip content="Information tooltip" side="right">
                    <Button variant="outline">Hover (Right)</Button>
                  </Tooltip>
                  <Tooltip content="Help text here" side="bottom">
                    <Button variant="outline">Hover (Bottom)</Button>
                  </Tooltip>
                  <Tooltip content="More details" side="left">
                    <Button variant="outline">Hover (Left)</Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Loading Tab */}
        <TabsContent value="loading" className="space-y-8">
          <div>
            <SectionHeader
              title="Loading States"
              description="Skeletons and empty states"
            />
            <div className="mt-6 space-y-8">
              {/* Skeleton Loaders */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Skeleton Loaders</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="mb-3 text-sm font-medium">Stat Cards</h4>
                    <StatCardSkeleton count={4} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-medium">Cards</h4>
                    <CardSkeleton count={3} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-medium">Table</h4>
                    <TableSkeleton rows={5} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-medium">Game Cards</h4>
                    <GameCardSkeleton count={3} />
                  </div>
                </div>
              </div>

              {/* Empty States */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Empty States</h3>
                <div className="space-y-6">
                  <EmptyState
                    icon={Calendar}
                    title="No games scheduled"
                    message="There are no games scheduled for today. Check back tomorrow or select a different date."
                  />
                  <EmptyState
                    icon={Activity}
                    title="No picks yet"
                    message="You haven't made any simulated picks. Start tracking your analytical predictions."
                    action={{
                      label: "Create First Pick",
                      onClick: () => alert("Create pick action"),
                    }}
                  />
                  <EmptyState
                    icon={AlertCircle}
                    title="No alerts configured"
                    message="Set up alerts to get notified about odds movements and game updates."
                    action={{
                      label: "Create Alert",
                      onClick: () => alert("Create alert action"),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Color Palette */}
      <div>
        <SectionHeader
          title="Color Palette"
          description="Design system colors"
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Primary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 rounded-md bg-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Success</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 rounded-md bg-success" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 rounded-md bg-warning" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Destructive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 rounded-md bg-destructive" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Typography */}
      <div>
        <SectionHeader
          title="Typography"
          description="Text styles and hierarchy"
        />
        <div className="mt-6 space-y-4">
          <div>
            <h1>Heading 1 - 4xl Bold</h1>
            <h2>Heading 2 - 3xl Semibold</h2>
            <h3>Heading 3 - 2xl Semibold</h3>
            <h4>Heading 4 - xl Semibold</h4>
            <h5>Heading 5 - lg Medium</h5>
            <h6>Heading 6 - base Medium</h6>
          </div>
          <div className="space-y-2">
            <p className="text-base">Body text - Base size</p>
            <p className="text-sm text-muted-foreground">
              Muted text - Small size
            </p>
            <p className="text-xs text-muted-foreground">
              Caption text - Extra small
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
