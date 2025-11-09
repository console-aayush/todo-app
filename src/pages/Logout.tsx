import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LogoutPageProps {
  onLogout: () => void;
}

const LogoutPage: React.FC<LogoutPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout();
    navigate("/login");
  }, []);

  return null;
};

export default LogoutPage;
