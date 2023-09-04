import { P5 as p5 } from "../App";

class PointsHandler {
    Points = [
        {
            x: 260,
            y: 920,
            isNear: false,
            distance: 0,
            speed: 1.5,
            lookAheadDistance: 30,
        },
    ];

    addPoint() {
        this.Points.push({
            x: p5.mouseX,
            y: p5.mouseY,
            isNear: false,
            distance: p5.dist(
                this.Points[this.Points.length - 1].x,
                this.Points[this.Points.length - 1].y,
                p5.mouseX,
                p5.mouseY
            ),
            speed: 1.5,
            lookAheadDistance: 30,
        });
    }

    removePoint(index) {
        this.Points.splice(index, 1);
    }

    displayPoints() {
        let previousObject = this.Points[0];
        const mouseHoverRadius = 20;

        this.Points.map((object, index) => {
            if (index != 0) {
                if (
                    p5.mouseX >= object.x - mouseHoverRadius &&
                    p5.mouseX <= object.x + mouseHoverRadius &&
                    p5.mouseY <= object.y + mouseHoverRadius &&
                    p5.mouseY >= object.y - mouseHoverRadius
                ) {
                    p5.fill("red");
                    this.Points[index].isNear = true;
                } else {
                    p5.fill("black");
                    this.Points[index].isNear = false;
                }
                p5.ellipse(object.x, object.y, 10, 10);
                p5.line(previousObject.x, previousObject.y, object.x, object.y);
                previousObject = object;
            }
        });
    }
}

export default PointsHandler;
