import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import RootLayout from "@/components/RootLayout";
import LandingPage from "@/pages/LandingPage";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCategories from "@/pages/admin/Categories";
import AdminMenuItems from "@/pages/admin/MenuItems";

function Router() {
  return (
    <Switch>
      <Route path="/select-language" component={LandingPage} />
      <Route path="/">
        <RootLayout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/menu" component={MenuPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/categories" component={AdminCategories} />
            <Route path="/admin/menu-items" component={AdminMenuItems} />
            <Route component={NotFound} />
          </Switch>
        </RootLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
