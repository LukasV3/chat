import { Outlet, useLocation } from "react-router-dom";
import { FullScreenCard } from "@/components/FullScreenCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const AuthLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <Outlet />
      </FullScreenCard.Body>

      <FullScreenCard.BelowCard>
        <Button variant="link" asChild>
          <Link to={isLoginPage ? "/signup" : "/login"}>
            {isLoginPage ? "Create Account" : "Login"}
          </Link>
        </Button>
      </FullScreenCard.BelowCard>
    </FullScreenCard>
  );
};
