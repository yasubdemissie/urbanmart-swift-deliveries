import { useEffect, useState } from "react";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { hasVisitedBefore } from "@/lib/visitTracker";
import Landing from "./Landing";
import Home from "./Home";
import LoadingSpinner from "@/components/Custom/LoadingSpinner";

const Index = () => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const [showLanding, setShowLanding] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      setShowLanding(false);
      return;
    }

    setShowLanding(!hasVisitedBefore());
  }, [isAuthenticated, isLoading]);

  if (isLoading || showLanding === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner message="Loading..." type="large" />
      </div>
    );
  }

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />;
  }

  return <Home />;
};

export default Index;
