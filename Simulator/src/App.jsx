/* eslint-disable react-refresh/only-export-components */

/*****************************IMPORTS*****************************/
import "./App.css";
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import Sketch from "react-p5";

import PointsHandler from "./assets/Waypoints";
import FindGoalPoint from "./assets/ChooseGoalPoint";
import MoveToPoint from "./assets/MoveToPoint";
import { theWayPointBeingFollowed } from "./assets/ChooseGoalPoint";

/*****************************INITIALIZE CLASSES*****************************/
let moveToPoint = new MoveToPoint();
let findGoalPoint = new FindGoalPoint();
let pointsHandler = new PointsHandler();

/*****************************EXPORTS*****************************/
export let pointToFollow;
export let lastFoundIndex = 0;
export let P5;
export let lookAheadDistance = 30;
export let x = pointsHandler.Points[0].x;
export let y = pointsHandler.Points[0].y;

/*****************************LOCAL VARIABLES*****************************/
let diameter = lookAheadDistance * 2;
let startSimulation = false;
let simulationEnded = false;
let bg = null;

// THE RATIO OF THE FIELD IN THIS PROGRAM IS 1":16"
function P5Sketch() {
    // This sets up the p5.js for usage and any other classes that will be used
    // It also creates the canvas
    const setup = (p5, canvasParentRef) => {
        P5 = p5;
        P5.createCanvas(1000, 1000).parent(canvasParentRef);
        bg = p5.loadImage(
            "https://www.vexforum.com/uploads/default/optimized/3X/6/b/6bd2a710d5e8f3eb48fc93b338faa8a7dcdc3ff2_2_1000x1000.png"
        );
        P5.background(bg);
        P5.angleMode(P5.DEGREES);
    };

    const draw = (P5) => {
        if (!simulationEnded) P5.background(bg);

        if (startSimulation && !simulationEnded) {
            diameter = lookAheadDistance * 2;

            // Find the point to follow
            pointToFollow = findGoalPoint.findIntersectionPoints(pointsHandler);
            if (!pointToFollow) simulationEnded = true;

            P5.fill("white");

            P5.push();

            if (!simulationEnded) {
                // Figure out how much to increment the values by and increment them by that much
                let incrementValues =
                    moveToPoint.calculateHowMuchToIncrementXAndYPositionBy(
                        theWayPointBeingFollowed
                    );
                if (incrementValues) {
                    x += incrementValues.xIncrement;
                    y += incrementValues.yIncrement;
                }
            }

            // Move the origin of the shapes to the new x and y coordinates
            P5.translate(x, y);

            // Draw the robot
            P5.ellipse(0, 0, diameter, diameter);

            // Draw the line to the point to follow
            P5.line(0, 0, pointToFollow.x - x, pointToFollow.y - y);

            // Draw the circle at the end of the line
            P5.fill("red");
            P5.ellipse(pointToFollow.x - x, pointToFollow.y - y, 10, 10);

            // Draw the black circle at the center of the robot circle
            P5.fill("black");
            P5.ellipse(0, 0, 10, 10);

            P5.pop();
        } else {
            if (!simulationEnded) {
                x = pointsHandler.Points[0].x;
                y = pointsHandler.Points[0].y;
            } else {
                x = pointsHandler.Points[pointsHandler.Points.length - 1].x;
                y = pointsHandler.Points[pointsHandler.Points.length - 1].y;
            }

            diameter = lookAheadDistance * 2;

            // Draws the robot, and the line showing the heading of the robot
            P5.fill("white");

            P5.push();

            // Draw the robot
            P5.translate(x, y);
            P5.ellipse(0, 0, diameter, diameter);

            // Draw the line to the point to follow
            P5.line(0, 0, 0, -lookAheadDistance);

            // Draw the circle at the end of the line
            P5.fill("red");
            P5.ellipse(0, -lookAheadDistance, 10, 10);

            // Draw the black circle at the center of the robot circle
            P5.fill("black");
            P5.ellipse(0, 0, 10, 10);

            P5.pop();
        }

        // Displays the points, creates the hover effects, and sets the closest point which is used when deleting points
        pointsHandler.displayPoints();
    };

    return <Sketch setup={setup} draw={draw} />;
}

function Box({ xValue, yValue, speedValue, index }) {
    const [, setX] = useState(xValue);
    const [, setY] = useState(yValue);
    const [, setSpeed] = useState(speedValue);
    const [display, setDisplay] = useState(false);

    let spans = [];
    for (let i = 0; i < 12; ++i) spans.push(<span key={i}>|</span>);

    return (
        <div className="bg-[#2f343c] p-6 rounded-3xl hover:bg-[#262a30] mx-4 w-[15vw]">
            <button
                onClick={() => setDisplay(display ? false : true)}
                className={display ? "w-full h-full mb-5" : "w-full h-full"}
            >
                <h2 className="my-auto mb-0 text-3xl">Point {index + 1}</h2>
            </button>
            <div className={!display ? "hidden" : ""}>
                <label htmlFor="x" className="text-xl">
                    X Coordinate
                </label>
                <input
                    id="x"
                    min={30}
                    max={834}
                    step={1}
                    type="range"
                    value={pointsHandler.Points[index].x}
                    className="range range-sm range-info mt-3"
                    onChange={(e) => {
                        setX(e.target.value);
                        pointsHandler.Points[index].x = parseInt(
                            e.target.value
                        );
                    }}
                />
                <br />
                <label htmlFor="y" className="text-xl">
                    Y Coordinate
                </label>
                <input
                    id="y"
                    min={30}
                    max={834}
                    type="range"
                    value={pointsHandler.Points[index].y}
                    className="range range-sm range-info  mt-3"
                    onChange={(e) => {
                        setY(pointsHandler.Points[index].y);
                        pointsHandler.Points[index].y = Number(e.target.value);
                    }}
                />
                <br />
                <label htmlFor="speed" className="text-xl">
                    Speed
                </label>
                <input
                    id="speed"
                    min={0}
                    max={6}
                    step={0.5}
                    type="range"
                    value={pointsHandler.Points[index].speed}
                    className="range range-sm range-info mt-3"
                    onChange={(e) => {
                        setSpeed(pointsHandler.Points[index].speed);
                        pointsHandler.Points[index].speed = Number(
                            e.target.value
                        );
                    }}
                />
                <div className="w-full flex justify-between text-xs px-2">
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                </div>
            </div>
        </div>
    );
}

function PointsBoxes({ points }) {
    return (
        <div className="flex flex-wrap col-span-2 justify-center">
            {points.map((object, i) => {
                return (
                    <div key={i}>
                        <Box
                            xValue={object.x}
                            yValue={object.y}
                            speedValue={object.speed}
                            index={i}
                        />
                    </div>
                );
            })}
        </div>
    );
}

function App() {
    // This stores the JSX for each of the sliders for each of the points
    const [points, setPoints] = useState(pointsHandler.Points);

    // This function handles clicks on the webpage
    const clickHandler = (e) => {
        e.preventDefault();

        if (e.target.id !== "button") {
            // Loop through each point, which is a object that contains properties
            for (let i = 0; i < pointsHandler.Points.length; ++i) {
                // If the mouse is near the point (and this property is changed and handled in the Waypoints.jsx file) then it means that the user wants to delete the point
                if (pointsHandler.Points[i].isNear) {
                    // Then you can remove that point in the array
                    pointsHandler.removePoint(i);

                    setPoints([...pointsHandler.Points]);
                    return;
                }
            }
            // If the mouse is not near any of points that means the user wants to add a point so do that
            pointsHandler.addPoint();

            setPoints([...pointsHandler.Points]);
        }
    };

    return (
        <div className="w-screen prose max-w-[100%] grid grid-rows-[0.49fr_2fr] grid-cols-[1.5fr_1fr] scroll-x overflow-x-hidden">
            <h1 className="text-6xl text-center col-span-2 place-self-center my-[5vh]">
                Pure Pursuit Path Planner
            </h1>
            <div
                onClick={(e) => clickHandler(e)}
                draggable="true"
                className="justify-self-end grid grid-rows-[2fr_0.1fr] grid-flow-row mb-16"
            >
                <P5Sketch />
                <button
                    onClick={() => {
                        startSimulation = true;
                    }}
                    id="button"
                    className="btn mx-auto place-self-center"
                >
                    Run Simulation :):):)
                </button>
            </div>
            <div className="justify-self-start ml-[5vw] my-[15vh]">
                <div className="mt-5">
                    <label htmlFor="lookAheadDistance" className="text-xl">
                        Look Ahead Distance
                    </label>
                    <input
                        id="lookAheadDistance"
                        min={10}
                        max={55}
                        type="range"
                        defaultValue={30}
                        className="range range-sm mt-3"
                        onChange={(e) => (lookAheadDistance = e.target.value)}
                    />
                </div>
            </div>
            <PointsBoxes points={points} />
        </div>
    );
}

export default App;
