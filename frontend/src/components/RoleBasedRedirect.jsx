import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRedirect = ({ component: Component, requiredRole, ...rest }) => {
  const { authData } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authData) {
          // If not authenticated, redirect to login page
          return <Redirect to="/login" />;
        }

        if (authData.role !== requiredRole) {
          // If the user doesn't have the required role, redirect to their respective dashboard
          return <Redirect to={`/${authData.role}/dashboard`} />;
        }

        // If everything is okay, render the requested component
        return <Component {...props} />;
      }}
    />
  );
};

export default RoleBasedRedirect;
