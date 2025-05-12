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
import ContactPage from "@/pages/ContactPage";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCategories from "@/pages/admin/Categories";
import AdminMenuItems from "@/pages/admin/MenuItems";
import AdminSettings from "@/pages/admin/Settings";
import AdminSpecialDishes from "@/pages/admin/SpecialDishes";
import { SettingsProvider } from "@/hooks/useSettings";
import { LanguageProvider } from "@/components/LanguageSelector";

function Router() {
  return (
    <Switch>
      <Route path="/select-language">
        <LandingPage />
      </Route>
      <Route path="/menu">
        <RootLayout>
          <MenuPage />
        </RootLayout>
      </Route>

      <Route path="/contact">
        <RootLayout>
          <ContactPage />
        </RootLayout>
      </Route>
      <Route path="/admin/login">
        <RootLayout>
          <AdminLogin />
        </RootLayout>
      </Route>
      <Route path="/admin/categories">
        <RootLayout>
          <AdminCategories />
        </RootLayout>
      </Route>
      <Route path="/admin/menu-items">
        <RootLayout>
          <AdminMenuItems />
        </RootLayout>
      </Route>
      <Route path="/admin/settings">
        <RootLayout>
          <AdminSettings />
        </RootLayout>
      </Route>
      <Route path="/admin">
        <RootLayout>
          <AdminDashboard />
        </RootLayout>
      </Route>
      <Route path="/">
        <RootLayout>
          <HomePage />
        </RootLayout>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
