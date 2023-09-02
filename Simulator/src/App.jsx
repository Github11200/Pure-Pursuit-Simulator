/* eslint-disable react-refresh/only-export-components */

/*****************************IMPORTS*****************************/
import "./App.css";
import { useState } from "react";
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

// THE RATIO OF THE FIELD IN THIS PROGRAM IS 1":16"
function P5Sketch() {
    // This sets up the p5.js for usage and any other classes that will be used
    // It also creates the canvas
    const setup = (p5, canvasParentRef) => {
        P5 = p5;
        P5.createCanvas(864, 864).parent(canvasParentRef);
        P5.background("orange");
        P5.angleMode(P5.DEGREES);
    };

    const draw = (P5) => {
        if (!simulationEnded) P5.background("orange");

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
            P5.line(0, 0, lookAheadDistance, 0);

            // Draw the circle at the end of the line
            P5.fill("red");
            P5.ellipse(lookAheadDistance, 0, 10, 10);

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

function getJSX(subtractOne = false, i = null) {
    // Displays the points, creates the hover effects, and sets the closest point which is used when deleting points
    const index = i ? i : pointsHandler.displayPoints();

    // Update the JSX to display the slides for each point
    pointsHandler.mapPointsValuesToSetJSXValue(subtractOne ? index - 1 : index);

    return pointsHandler.JSX;
}

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
                return getJSX(true);
            }
        }
        // If the mouse is not near any of points that means the user wants to add a point so do that
        pointsHandler.addPoint();
    }

    return getJSX();
};

function App() {
    pointsHandler.mapPointsValuesToSetJSXValue();
    // This stores the JSX for each of the sliders for each of the points
    const [pointsJSX, setPointsJSX] = useState(pointsHandler.JSX);

    return (
        <div className="w-screen prose max-w-[100%] grid grid-rows-[0.49fr_2fr] grid-cols-[1.5fr_1fr] scroll-x overflow-x-hidden">
            <h1 className="text-6xl text-center col-span-2 place-self-center my-[5vh]">
                Pure Pursuit Path Planner
            </h1>
            <div
                onClick={(e) => setPointsJSX(clickHandler(e))}
                draggable="true"
                className="justify-self-end grid grid-rows-[2fr_0.4fr] grid-flow-row"
            >
                <P5Sketch setPointsJSX={setPointsJSX} />
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
                {pointsJSX}
                <br />
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
        </div>
    );
}

export default App;
