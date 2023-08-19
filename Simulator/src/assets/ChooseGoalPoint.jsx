import { lastFoundIndex, lookAheadDistance } from "../App";
import { x as currentX } from "../App";
import { y as currentY } from "../App";
import { P5 as p5 } from "../App";

class FindGoalPoint {
    // This function just returns either 1 or -1 based on whether or not the number is positive or negative
    sgn(x) {
        if (x >= 0) return 1;
        else return -1;
    }

    // This function just finds all the of the points on the path that the robot is intersecting with
    findIntersectionPoints(pointsHandler) {
        let pointToFollow = pointsHandler.Points[lastFoundIndex];
        let LastFoundIndex = lastFoundIndex;

        for (let i = LastFoundIndex; i < pointsHandler.Points.length - 1; ++i) {
            let pointOne = pointsHandler.Points[i];
            let pointTwo = pointsHandler.Points[i + 1];

            // These variables are to store the 2 solutions
            let sol1;
            let sol2;

            // This variables store the x and y values for both points (we are storing them in these variables to improve the readability of hte code)
            let x1 = pointOne.x;
            let y1 = pointOne.y;
            let x2 = pointTwo.x;
            let y2 = pointTwo.y;

            // This offsets the points because the line-circle intersection method assumes that the circle is at (0, 0)
            let x1Offset = x1 - currentX;
            let y1Offset = y1 - currentY;
            let x2Offset = x2 - currentX;
            let y2Offset = y2 - currentY;

            // This calculates the variables needed for the line-circle-intersection
            let dx = x2Offset - x1Offset;
            let dy = y2Offset - y1Offset;
            let dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let D = x1Offset * y2Offset - x2Offset * y1Offset;

            // This calculates the discriminant
            let discriminant =
                Math.pow(lookAheadDistance, 2) * Math.pow(dr, 2) -
                Math.pow(D, 2);

            // If the discriminant is greater than or equal to 0 it means that there are solutions, so go ahead and calculate what the solutions are
            if (discriminant >= 0) {
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

                // This stores the solutions and adds back the currentX and currentY because the circle no longer has to be centered at 0
                sol1 = { x: x1Sol + currentX, y: y1Sol + currentY };
                sol2 = { x: x2Sol + currentX, y: y2Sol + currentY };
                p5.fill("yellow");
                p5.ellipse(pointOne.x, pointOne.y, 15, 15);
                p5.ellipse(pointTwo.x, pointTwo.y, 15, 15);

                // This finds the minimum and maximum values for the x and y coordinates between the two points which will be used later on for comparisons
                let minX = Math.min(x1, x2);
                let maxX = Math.max(x1, x2);
                let minY = Math.min(y1, y2);
                let maxY = Math.max(y1, y2);

                // p5.fill("brown");
                // p5.ellipse(minX, minY, 10, 10);
                // p5.ellipse(maxX, maxY, 10, 10);

                // Check if either of the solutions are within the min and max x and y values for both the points
                if (
                    (minX <= sol1.x <= maxX && minY <= sol1.y <= maxY) ||
                    (minX <= sol2.x <= maxX && minY <= sol2.y <= maxY)
                ) {
                    // Check if both solutions are within the min and max x and y values (this means there are two valid intersection points for the circle)
                    if (
                        minX <= sol1.x <= maxX &&
                        minY <= sol1.y <= maxY &&
                        minX <= sol2.x <= maxX &&
                        minY <= sol2.y <= maxY
                    ) {
                        // Now check which one of the solutions is closer to the second point
                        if (
                            p5.dist(sol1.x, sol1.y, pointTwo.x, pointTwo.y) <
                            p5.dist(sol2.x, sol2.y, pointTwo.x, pointTwo.y)
                        )
                            pointToFollow = sol1;
                        else pointToFollow = sol2;
                    } else if (
                        // If either one of the solutions in the above if statement is false, then check which one of them is true and return that solution
                        minX <= sol1.x <= maxX &&
                        minY <= sol1.y <= maxY
                    )
                        pointToFollow = sol1;
                    else if (minX <= sol2.x <= maxX && minY <= sol2.y <= maxY)
                        pointToFollow = sol2;
                } else {
                    pointToFollow = {
                        x: pointsHandler.Points[lastFoundIndex - 1].x,
                        y: pointsHandler.Points[lastFoundIndex - 1].y,
                    };
                }
            }
        }

        return pointToFollow;
    }
}

export default FindGoalPoint;
// console.log(
//     `Distance to next point on x1: ${distanceToNextPointX1}`
// );
// console.log(
//     `Distance to next point on x2: ${distanceToNextPointX2}`
// );
// console.log(
//     `Distance to next point on y1: ${distanceToNextPointY1}`
// );
// console.log(
//     `Distance to next point on y2: ${distanceToNextPointY2}`
// );
// console.log(x1);
// console.log(x2);
// console.log(pointOne);
