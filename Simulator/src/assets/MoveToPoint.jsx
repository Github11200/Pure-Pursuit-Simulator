import { pointToFollow } from "../App";
import { x as currentX } from "../App";
import { y as currentY } from "../App";

class MoveToPoint {
    // This is the speed at which the robot will move
    speed = 1.5;
    theta = 0;

    // This function calculates the increments on the x and y axis
    calculateHowMuchToIncrementXAndYPositionBy(thePointBeingFollowed) {
        // Calculate the errors on the x and y
        let xError = pointToFollow.x - currentX;
        let yError = pointToFollow.y - currentY;

        // Calculate the magnitude of the vector (basically the length which is acquired using the pythagorean theorem)
        let vectorMagnitude = Math.sqrt(
            Math.pow(xError, 2) + Math.pow(yError, 2)
        );

        // Normalize the vector, so figure out the fractions of each side of the triangle
        let normalizedX = xError / vectorMagnitude;
        let normalizedY = yError / vectorMagnitude;

        // If the x and y values are equal to 0 then return null because you can't move the robot
        if (normalizedX == 0 && normalizedY == 0) return null;
        else {
            // Otherwise return the increments by multiplying the normalized vector by the speed
            return {
                xIncrement: normalizedX * thePointBeingFollowed.speed,
                yIncrement: normalizedY * thePointBeingFollowed.speed,
            };
        }
    }
}

export default MoveToPoint;
