import { lookAheadDistance } from "../App";
import { x as currentX } from "../App";
import { y as currentY } from "../App";
import { P5 as p5 } from "../App";

class FindGoalPoint {
    // This function just returns either 1 or -1 based on whether or not the number is positive or negative
    sgn(x) {
        if (x >= 0) return 1;
        else return -1;
    }

    lastFoundIndex = 0;

    // This function just finds all the of the points on the path that the robot is intersecting with
    findIntersectionPoints(pointsHandler) {
        let goalPt = null;
        let sol1 = goalPt;
        let sol2 = goalPt;

        let colors = ["purple", "blue", "yellow", "white", "green"];

        for (let i = 0; i < pointsHandler.Points.length - 1; ++i) {
            let pointOne = pointsHandler.Points[i];
            let pointTwo = pointsHandler.Points[i + 1];

            // This variables store the x and y values for both points (we are storing them in these variables to improve the readability of hte code)
            let x1 = pointOne.x - currentX;
            let y1 = pointOne.y - currentY;
            let x2 = pointTwo.x - currentX;
            let y2 = pointTwo.y - currentY;

            // This calculates the variables needed for the line-circle-intersection
            let dx = x2 - x1;
            let dy = y2 - y1;
            let dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let D = x1 * y2 - x2 * y1;

            // This calculates the discriminant
            let discriminant =
                Math.pow(lookAheadDistance, 2) * Math.pow(dr, 2) -
                Math.pow(D, 2);

            console.log(`Discriminant: ${discriminant}`);

            // If the discriminant is less than 0, which means there are no solutions, then just continue in the loop
            if (discriminant < 0 || pointOne == pointTwo) continue;

            // This calculates the solutions for the x and y for both points
            let x1Sol =
                (D * dy + this.sgn(dy) * dx * Math.sqrt(discriminant)) /
                Math.pow(dr, 2);
            let x2Sol =
                (D * dy - this.sgn(dy) * dx * Math.sqrt(discriminant)) /
                Math.pow(dr, 2);
            let y1Sol =
                (-D * dx + Math.abs(dy) * Math.sqrt(discriminant)) /
                Math.pow(dr, 2);
            let y2Sol =
                (-D * dx - Math.abs(dy) * Math.sqrt(discriminant)) /
                Math.pow(dr, 2);

            // These are the solutions after you add the currentX and currentY values back
            sol1 = { x: x1Sol + currentX, y: y1Sol + currentY };
            sol2 = { x: x2Sol + currentX, y: y2Sol + currentY };

            // This finds the minimum and maximum values for the x and y coordinates between the two points which will be used later on for comparisons
            let minX = Math.min(pointOne.x, pointTwo.x);
            let maxX = Math.max(pointOne.x, pointTwo.x);
            let minY = Math.min(pointOne.y, pointTwo.y);
            let maxY = Math.max(pointOne.y, pointTwo.y);

            // Check if either of the solutions are within the min and max x and y values for both the points
            let validPointOne =
                minX <= sol1.x &&
                sol1.x <= maxX &&
                minY <= sol1.y &&
                sol1.y <= maxY;

            let validPointTwo =
                minX <= sol2.x &&
                sol2.x <= maxX &&
                minY <= sol2.y &&
                sol2.y <= maxY;

            // Draw out the rectangles
            p5.fill(colors[i]);
            p5.rect(minX, minY, maxX, maxY);

            // Draw out the circles where the solutions are
            p5.fill(colors[i]);
            p5.ellipse(sol1.x, sol1.y, 15, 15);
            p5.ellipse(sol2.x, sol2.y, 15, 15);

            console.log(`i is: ${i}`);
            console.log(
                `Point one x: ${pointOne.x}, Point one y: ${pointOne.y}`
            );
            console.log(
                `Point two x: ${pointTwo.x}, Point two y: ${pointTwo.y}`
            );

            console.log(`Min x: ${minX}, Max x: ${maxX}`);
            console.log(`Min y: ${minY}, Max y: ${maxY}`);
            console.log(`Solution 1 x: ${sol1.x}, Solution 1 y: ${sol1.y}`);
            console.log(`Solution 2 x: ${sol2.x}, Solution 2 y: ${sol2.y}`);

            // Check if either of the intersection points are valid
            if (validPointOne || validPointTwo) {
                // Check if the first intersection point is valid, if it is then set goal point to the first solution
                if (validPointOne) goalPt = sol1;

                // Check if the second intersection point is valid
                if (validPointTwo) {
                    // Now check which one of the solutions is closer to the second point
                    if (
                        goalPt === null ||
                        Math.abs(x1Sol - x2) > Math.abs(x2Sol - x2) ||
                        Math.abs(y1Sol - y2) > Math.abs(y2Sol - y2)
                    ) {
                        goalPt = sol2;
                    }
                }
            }

            console.log(
                `Goal point x is: ${goalPt.x}, Goal point y is: ${goalPt.y}`
            );
        }

        console.log(
            "////////////////////////////////////////////////////////////\n"
        );

        return goalPt;
    }
}

export default FindGoalPoint;
