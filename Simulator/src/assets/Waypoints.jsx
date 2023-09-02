import { P5 as p5 } from "../App";

class PointsHandler {
    Points = [
        {
            x: 50,
            y: 50,
            isNear: false,
            distance: 0,
            speed: 1.5,
            lookAheadDistance: 30,
        },
    ];

    JSX;
    callNumber = 1;

    mapPointsValuesToSetJSXValue() {
        // this.Points.length >= 3 && console.log("Before: ", this.Points[2].x);

        this.JSX = this.Points.map((object, index) => {
            index === 1 && console.log(this.Points[index].x);
            return (
                <div key={index} className="bg-[#2f343c] p-4 rounded-3xl">
                    <h2 className="my-auto mb-5">Point {index + 1}</h2>
                    <label htmlFor="x" className="text-xl">
                        X Coordinate
                    </label>
                    <input
                        id="x"
                        min={30}
                        max={834}
                        type="range"
                        value={this.Points[index].x}
                        className="range range-sm mt-3"
                        onChange={(e) => {
                            // console.log("X Before: ", this.Points[index].x);
                            this.Points[index].x = Number(e.target.value);
                            s;
                            object.x = Number(e.target.value);
                            // console.log("X After: ", this.Points[index].x);
                            // console.log(this.Points);
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
                        defaultValue={this.Points[index].y}
                        className="range range-sm mt-3"
                        onChange={(e) => {
                            this.Points[index].y = Number(e.target.value);
                            object.y = Number(e.target.value);
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
                        defaultValue={this.Points[index].speed}
                        className="range range-sm mt-3"
                        onChange={(e) => {
                            this.Points[index].speed = Number(e.target.value);
                            object.speed = Number(e.target.value);
                        }}
                    />
                </div>
            );
        });

        // this.Points.length >= 3 && console.log("After: ", this.Points[2].x);
        // console.log("\n\n\n");
    }

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
        this.mapPointsValuesToSetJSXValue();
    }

    removePoint(index) {
        this.Points.splice(index, 1);
        this.mapPointsValuesToSetJSXValue();
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
