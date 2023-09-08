import { lookAheadDistance } from "../App";
import { x as currentX } from "../App";
import { y as currentY } from "../App";

export let theWayPointBeingFollowed = null;

class FindGoalPoint {
    // This function just returns either 1 or -1 based on whether or not the number is positive or negative
    sgn(x) {
        if (x >= 0) return 1;
        else return -1;
    }

    // This function just finds all the of the points on the path that the robot is intersecting with
    findIntersectionPoints(pointsHandler) {
        let goalPt = null;
        let sol1 = goalPt;
        let sol2 = goalPt;

        for (let i = 0; i < pointsHandler.Points.length - 1; ++i) {
            let pointOne = pointsHandler.Points[i];
            let pointTwo = pointsHandler.Points[i + 1];

            theWayPointBeingFollowed = pointTwo;

            // This variables store the x and y values for both points (we are storing them in these variables to improve the readability of the code)
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

            // This checks if the number of points is greater than 0 which means there is an end point
            if (pointsHandler.Points.length > 0) {
                // Since there is an end point get the coordinates of the last point in the array
                let endX =
                    pointsHandler.Points[pointsHandler.Points.length - 1].x;
                let endY =
                    pointsHandler.Points[pointsHandler.Points.length - 1].y;

                if (currentX === endX && currentY === endY) return false;

                if (
                    Math.sqrt(
                        (endX - currentX) * (endX - currentX) +
                            (endY - currentY) * (endY - currentY)
                    ) <=
                    lookAheadDistance -
                        (pointsHandler.Points[pointsHandler.Points.length - 1]
                            .speed > 4.5
                            ? lookAheadDistance - 2
                            : lookAheadDistance - 1)
                )
                    return false;

                // Check if the distance to the end point is less than or equal to the look ahead distance
                if (
                    Math.sqrt(
                        (endX - currentX) * (endX - currentX) +
                            (endY - currentY) * (endY - currentY)
                    ) <= lookAheadDistance
                )
                    return { x: endX, y: endY }; // If it is then return the coordinates of the last point
            }
        }

        return goalPt;
    }
}

export default FindGoalPoint;
