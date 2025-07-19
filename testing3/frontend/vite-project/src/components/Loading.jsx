import React from 'react'


export default function Loading({ message = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "150px",
        color: "#6366f1",
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: 1,
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        style={{ marginBottom: 14, animation: "spin 1s linear infinite" }}
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="#6366f1"
          strokeWidth="5"
          strokeDasharray="80"
          strokeDashoffset="50"
        />
        <style>
          {`
            @keyframes spin {
              100% { transform: rotate(360deg); }
            }
            svg { display: block; }
          `}
        </style>
      </svg>
      {message}
    </div>
  );
}