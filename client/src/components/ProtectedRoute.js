import React from "react";
import { Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (window.localStorage.getItem("userId")) {
          return children;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            ></Redirect>
          );
        }
      }}
    ></Route>
  );
};