import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import AuthBox from "./AuthBox";
import { useGlobalContext } from "../context/GlobalContext";

const Layout = () => {
  const { fetchingUser } = useGlobalContext();

  return fetchingUser ? (
    <div>
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    </div>
  ) : (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route exact path="/" element={<AuthBox />} />
        <Route path={"/register"} element={<AuthBox register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Layout;
