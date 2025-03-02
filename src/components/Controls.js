"use client";
import React, { useState } from "react";

const Controls = ({ robots, setRobots, trash, setTrash }) => {
  const [selectedRobot, setSelectedRobot] = useState(1); // Default to Robot 1

  // Function to handle robot movement
  const moveRobot = (robotId, dx, dy) => {
    setRobots(prevRobots =>
      prevRobots.map(robot => {
        if (robot.id === robotId) {
          const targetTrash = trash.find(t => !t.collected && !robot.collectedTrash.has(t.id));
          if (!targetTrash) return robot; // If no uncollected trash left for the robot

          // Calculate new position for robot
          let newX = robot.x + dx;
          let newY = robot.y + dy;

          // If the robot is close enough to the trash, collect it
          const distanceToTrash = Math.sqrt(
            (newX - targetTrash.x) ** 2 + (newY - targetTrash.y) ** 2
          );
          if (distanceToTrash < 1) {
            setTrash(prevTrash =>
              prevTrash.map(t =>
                t.id === targetTrash.id ? { ...t, collected: true } : t
              )
            );

            // Add to collectedTrash Set
            const updatedTrashSet = new Set(robot.collectedTrash);
            updatedTrashSet.add(targetTrash.id);
            return { ...robot, x: targetTrash.x, y: targetTrash.y, collectedTrash: updatedTrashSet };
          }

          return { ...robot, x: newX, y: newY }; // Move robot
        }
        return robot; // Return other robots unchanged
      })
    );
  };

  return (
    <div style={{ border: "1px solid black", padding: "10px", marginTop: "50px" }}>
      <h3>🎮 Controls</h3>
      <div style={{ marginBottom: "10px" }}>
        <p>Select Robot:</p>
        <select onChange={(e) => setSelectedRobot(parseInt(e.target.value))} value={selectedRobot}>
          {[1, 2, 3].map((robotId) => (
            <option key={robotId} value={robotId}>
              🤖 Robot {robotId}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "50px" }}>
        <p>Control Robot {selectedRobot}</p>
        <button onClick={() => moveRobot(selectedRobot, 0, 1)}>⬆️</button>
        <button onClick={() => moveRobot(selectedRobot, 0, -1)}>⬇️</button>
        <button onClick={() => moveRobot(selectedRobot, -1, 0)}>⬅️</button>
        <button onClick={() => moveRobot(selectedRobot, 1, 0)}>➡️</button>
      </div>
    </div>
  );
};

export default Controls;
