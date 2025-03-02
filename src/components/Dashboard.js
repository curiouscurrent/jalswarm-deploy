"use client";
import React, { useState, useEffect } from "react";
import PathPlot from "@/components/PathPlot";
import Stats from "@/components/Stats";
import Controls from "@/components/Controls";
import CameraFeed from "@/components/CameraFeed";

const Dashboard = () => {
  const [robots, setRobots] = useState([
    { id: 1, x: 0, y: 0, path: [], actualPath: [], color: "red", collectedTrash: new Set() },
    { id: 2, x: 5, y: 5, path: [], actualPath: [], color: "blue", collectedTrash: new Set() },
    { id: 3, x: -5, y: -5, path: [], actualPath: [], color: "green", collectedTrash: new Set() }
  ]);

  const [trash, setTrash] = useState([
    { id: 1, x: 3, y: 4, collected: false },
    { id: 2, x: -2, y: 6, collected: false },
    { id: 3, x: 7, y: -1, collected: false },
    { id: 4, x: -6, y: -3, collected: false },
    { id: 5, x: 1, y: -4, collected: false },
    { id: 6, x: -4, y: 2, collected: false },
    { id: 7, x: 6, y: 6, collected: false },
    { id: 8, x: -8, y: -2, collected: false },
    { id: 9, x: 4, y: -6, collected: false },
    { id: 10, x: -3, y: 7, collected: false },
    { id: 11, x: 2, y: -3, collected: false },
    { id: 12, x: 0, y: 5, collected: false },
    { id: 13, x: 9, y: -7, collected: false },
    { id: 14, x: -7, y: 3, collected: false }
  ]);

  const [collected, setCollected] = useState(0);
  const [missed, setMissed] = useState(0);
  const [observedTimes, setObservedTimes] = useState([0, 0, 0]);
  const [expectedTimes, setExpectedTimes] = useState([10, 12, 15]);

  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const getNextTarget = (robot, trash) => {
    const uncollectedTrash = trash.filter(t => !t.collected && !robot.collectedTrash.has(t.id));
    const nearestTrash = uncollectedTrash.reduce((closest, t) => {
      const distance = getDistance(robot.x, robot.y, t.x, t.y);
      if (!closest || distance < closest.distance) {
        return { trash: t, distance };
      }
      return closest;
    }, null);
    return nearestTrash ? nearestTrash.trash : null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRobots(prevRobots =>
        prevRobots.map(robot => {
          const targetTrash = getNextTarget(robot, trash);

          if (!targetTrash) return robot;

          let dx = targetTrash.x - robot.x;
          let dy = targetTrash.y - robot.y;
          let stepSize = 1;
          let distance = Math.sqrt(dx ** 2 + dy ** 2);

          if (distance < stepSize) {
            setTrash(prevTrash =>
              prevTrash.map(t => (t.id === targetTrash.id ? { ...t, collected: true } : t))
            );

            const updatedTrashSet = new Set(robot.collectedTrash);
            updatedTrashSet.add(targetTrash.id);

            return { ...robot, x: targetTrash.x, y: targetTrash.y, collectedTrash: updatedTrashSet };
          } else {
            let newX = robot.x + (dx / distance) * stepSize;
            let newY = robot.y + (dy / distance) * stepSize;
            return {
              ...robot,
              x: newX,
              y: newY,
              path: [...robot.path, { x: newX, y: newY }],
              actualPath: [...robot.actualPath, { x: newX, y: newY }]
            };
          }
        })
      );

      setObservedTimes(prev => prev.map(time => time + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [trash]);

  useEffect(() => {
    let uniqueCollectedTrash = new Set();
    robots.forEach(robot => {
      robot.collectedTrash.forEach(trashId => uniqueCollectedTrash.add(trashId));
    });

    setCollected(uniqueCollectedTrash.size);
    const missedTrashCount = trash.filter(t => !t.collected).length;
    setMissed(missedTrashCount);
  }, [robots, trash]);

  const moveRobot = (robotId, dx, dy) => {
    setRobots(prevRobots =>
      prevRobots.map(robot =>
        robot.id === robotId ? { ...robot, x: robot.x + dx, y: robot.y + dy } : robot
      )
    );
  };

  return (
    <div style={{ position: "relative", padding: "20px", minHeight: "100vh" }}>
      <img
        src="waterfall.jpg" // Replace with your image URL
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1
        }}
      />

      <h2>🗑️ Dashboard</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ flex: "1 1 45%" }}>
          <PathPlot robots={robots} trash={trash} />
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <Stats robots={robots} trash={trash} expectedTimes={expectedTimes} observedTimes={observedTimes} />
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <Controls moveRobot={moveRobot} />
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <CameraFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
