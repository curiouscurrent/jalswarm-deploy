"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const PathPlot = ({ robots, trash }) => {
  const expectedPathData = {
    datasets: [
      // Expected Path (dotted lines)
      ...robots.map((robot) => ({
        label: `Robot ${robot.id} (Expected Path)`,
        data: robot.path.map((p) => ({ x: p.x, y: p.y })),
        borderColor: `rgba(${parseInt(robot.color.slice(1, 3), 16)}, ${parseInt(robot.color.slice(3, 5), 16)}, ${parseInt(robot.color.slice(5, 7), 16)}, 0.4)`, // Lighter color
        backgroundColor: robot.color,
        showLine: true,
        pointRadius: 3,
        borderDash: [5, 5], // Dotted line for expected path
        borderWidth: 2,
      })),
      // Uncollected Trash (diamond shape)
      {
        label: "Uncollected Trash",
        data: trash.filter((t) => !t.collected).map((t) => ({ x: t.x, y: t.y })),
        borderColor: "black",
        backgroundColor: "black",
        pointStyle: "triangle", // Use triangle shape for trash (rotated to diamond)
        pointRadius: 10, // Size of the diamond
        pointRotation: 45, // Rotate triangle to make it a diamond
        pointHoverRadius: 10,
        hoverBackgroundColor: "red",
        borderWidth: 0, // Remove unwanted borders for trash
      },
    ],
  };

  const observedPathData = {
    datasets: [
      // Observed Path (solid lines)
      ...robots.map((robot) => ({
        label: `Robot ${robot.id} (Observed Path)`,
        data: robot.actualPath ? robot.actualPath.map((p) => ({ x: p.x, y: p.y })) : [], // Fallback to empty array if actualPath is undefined
        borderColor: robot.color, // Keep original color for solid line
        backgroundColor: robot.color,
        showLine: true,
        pointRadius: 3,
        borderDash: [], // Solid line for observed path
      })),
      // Collected Trash (smaller circles)
      {
        label: "Collected Trash",
        data: trash.filter((t) => t.collected).map((t) => ({ x: t.x, y: t.y })),
        borderColor: "gray",
        backgroundColor: "gray",
        pointRadius: 5,
        hoverRadius: 5,
        borderWidth: 0, // Remove unwanted borders for collected trash
      },
    ],
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {/* Graph 1: Expected Path */}
      <div style={{ border: "1px solid black", padding: "10px", height: "400px", width: "48%" }}>
        <h3>📍 Robot Expected Path</h3>
        <Line
          data={expectedPathData}
          options={{
            scales: {
              x: { type: "linear", min: -10, max: 10 },
              y: { type: "linear", min: -10, max: 10 },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  boxWidth: 20,
                  boxHeight: 5,
                  usePointStyle: true,
                },
              },
            },
          }}
        />
      </div>

      {/* Graph 2: Observed Path */}
      <div style={{ border: "1px solid black", padding: "10px", height: "400px", width: "48%" }}>
        <h3>📍 Robot Observed Path</h3>
        <Line
          data={observedPathData}
          options={{
            scales: {
              x: { type: "linear", min: -10, max: 10 },
              y: { type: "linear", min: -10, max: 10 },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  boxWidth: 20,
                  boxHeight: 5,
                  usePointStyle: true,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PathPlot;
