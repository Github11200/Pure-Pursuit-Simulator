/* eslint-disable react-refresh/only-export-components */
import "./App.css";
import Sketch from "react-p5";

import PointsHandler from "./assets/Waypoints";
import FindGoalPoint from "./assets/ChooseGoalPoint";
import MoveToPoint from "./assets/MoveToPoint";

let pointsHandler;
let findGoalPoint;
let moveToPoint;

export let pointToFollow;
export let lastFoundIndex = 0;
export let P5;
export let lookAheadDistance = 30;
export let x = 50;
export let y = 50;

const diameter = lookAheadDistance * 2;

let startSimulation = false;

// THE RATIO OF THE FIELD IN THIS PROGRAM IS 1":16"
function P5Sketch() {
    // This sets up the p5.js for usage and any other classes that will be used
    // It also creates the canvas
    const setup = (p5, canvasParentRef) => {
        pointsHandler = new PointsHandler(p5);
        moveToPoint = new MoveToPoint();
        findGoalPoint = new FindGoalPoint();

        P5 = p5;
        P5.createCanvas(864, 864).parent(canvasParentRef);
        P5.background("orange");
        P5.angleMode(P5.DEGREES);
    };

    const draw = (P5) => {
        P5.background("orange");

        if (startSimulation) {
            // Find the point to follow
            pointToFollow = findGoalPoint.findIntersectionPoints(pointsHandler);

            P5.fill("white");

            P5.push();

            let incrementValues =
                moveToPoint.calculateHowMuchToIncrementXAndYPositionBy();
            if (incrementValues) {
                x += incrementValues.xIncrement;
                y += incrementValues.yIncrement;
            }

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
            // Draws the robot, and the line showing the heading of the robot
            P5.fill("white");

            P5.push();

            // Draw the robot
            P5.translate(x, y);
            P5.ellipse(0, 0, diameter, diameter);

            // Draw the line to the point to follow
            P5.line(0, 0, 30, 0);

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

// This function handles clicks on the webpage
const clickHandler = (e) => {
    e.preventDefault();

    if (e.target.id !== "button") {
        // Loop through each point, which is a object that contains properties
        for (let i = 0; i < pointsHandler.Points.length; ++i) {
            // If the mouse is near the point (and this property is changed and handled in the Waypoints.jsx file) then it means that the user wants to delete the point
            if (pointsHandler.Points[i].isNear) {
                // Then you can remove that point in the array;
                pointsHandler.removePoint(i);
                return;
            }
        }
        // If the mouse is not near any of points that means the user wants to add a point so do that
        pointsHandler.addPoint();
    }
};

function App() {
    return (
        <div onClick={clickHandler}>
            <P5Sketch />
            <button
                onClick={() => {
                    startSimulation = true;
                }}
                id="button"
            >
                Run Simulation :):):)
            </button>
        </div>
    );
}

export default App;
