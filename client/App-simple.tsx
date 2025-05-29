import { Switch, Route } from "wouter";
import { queryClient } from "./src/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./src/pages/HomePage";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <HomePage />
      </Route>
      <Route>
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-2xl">Royal Restaurant</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
