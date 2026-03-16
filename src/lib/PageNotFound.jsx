import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#0D5C46]/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-[#0D5C46]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-inter mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-500 font-inter mb-8">
          This page doesn't exist. Let's get you back to memorizing.
        </p>
        <Link
          to="/Home"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D5C46] text-white rounded-xl font-inter font-medium text-sm hover:bg-[#0a4a38] transition-colors"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}