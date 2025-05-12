
import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-gray-900">404</h1>
      <h2 className="text-2xl font-medium text-gray-600 mt-4 mb-8">Страница не найдена</h2>
      <Link to="/">
        <Button variant="default">На главную</Button>
      </Link>
    </div>
  );
};

export default NotFound;
