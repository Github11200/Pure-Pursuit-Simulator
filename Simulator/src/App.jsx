import "./App.css";
import Sketch from 'react-p5';

function P5Sketch() {
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(500, 400).parent(canvasParentRef);
    }

    const draw = (p5) => {
        p5.background(255, 120, 20);
        p5.ellipse(100, 100, 100);
    }

    return (
        <Sketch setup={setup} draw={draw} />
    )
}

function App() {
    return (
        <>
            <h1>
                <P5Sketch />
            </h1>
        </>
    );
}

export default App;
