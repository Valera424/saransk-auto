import React from "react";

export default function Container({
                                      children,
                                      className = ""
                                  }: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`w-full max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
}
