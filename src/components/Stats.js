"use client";
import React from "react";

const Stats = ({ robots, trash, expectedTimes = [], observedTimes = [] }) => {
  // Check if robotStats is defined
  if (!robots) {
    return (
      <div style={{ border: "1px solid black", padding: "10px", marginTop: "20px" }}>
        <h3>📊 Statistics</h3>
        <p>No robot data available</p>
      </div>
    );
  }

  // Calculate trash collected and missed per robot
  const robotStats = robots.map(robot => {
    const collectedTrashIds = [...robot.collectedTrash]; // Convert collectedTrash Set to Array
    const collected = collectedTrashIds.length;
    
    // Get missed trash by checking if the trash is not collected and not part of the robot's collected trash
    const missedTrashIds = trash
      .filter(t => !t.collected && !collectedTrashIds.includes(t.id))
      .map(t => t.id); // Get missed trash IDs
    const missed = missedTrashIds.length;

    return {
      id: robot.id,
      collectedTrashIds, // Include collected trash IDs
      missedTrashIds, // Include missed trash IDs
      collected,
      missed,
      expectedTime: expectedTimes[robot.id - 1] || "N/A", // Expected time for the robot (assuming indexed by robot id)
      observedTime: observedTimes[robot.id - 1] || "N/A", // Observed time for the robot (assuming indexed by robot id)
      color: robot.color
    };
  });

  return (
    <div style={{ border: "1px solid black", padding: "10px", marginTop: "20px" }}>
      <h3>📊 Statistics</h3>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {robotStats.map(robot => (
          <div key={robot.id} style={{ width: "200px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h4>🤖 Robot {robot.id} - {robot.color}</h4>
            <p>✅ Trash Collected: {robot.collected} (IDs: {robot.collectedTrashIds.join(", ")})</p>
            <p>❌ Trash Missed: {robot.missed} (IDs: {robot.missedTrashIds.join(", ")})</p>
            <p>⏳ Expected Time: {robot.expectedTime} sec</p>
            <p>⏱️ Observed Time: {robot.observedTime} sec</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
