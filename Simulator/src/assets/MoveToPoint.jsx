import { pointToFollow } from "../App";
import { x as currentX } from "../App";
import { y as currentY } from "../App";

class MoveToPoint {
    speed = 0.5;

    calculateHowMuchToIncrementXAndYPositionBy() {
        let xError = pointToFollow.x - currentX;
        let yError = pointToFollow.y - currentY;
        let vectorMagnitude = Math.sqrt(
            Math.pow(xError, 2) + Math.pow(yError, 2)
        );

        let normalizedX = xError / vectorMagnitude;
        let normalizedY = yError / vectorMagnitude;

        if (normalizedX == 0 && normalizedY == 0) return null;
        else {
            return {
                xIncrement: normalizedX * this.speed,
                yIncrement: normalizedY * this.speed,
            };
        }
    }
}

export default MoveToPoint;
