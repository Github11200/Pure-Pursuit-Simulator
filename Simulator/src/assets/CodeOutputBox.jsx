import React from "react";

export const CodeOutputBox = ({ points }) => {
    return (
        <div className="col-span-2 justify-self-center">
            <h1 className="text-center mb-0 mt-7">Output</h1>
            <br />
            <pre className="w-[30vw] rounded-[30px] text-left px-7 py-9 inline-block text-[1.5em] bg-[hsl(213.33deg 17.65% 20%)] mt-2">
                [
                {points.map((object, index) => {
                    return (
                        <div key={index} className="inline">
                            <br />
                            <p className="rounded-[15px] p-8 inline">
                                {"{"} <br />
                                <span className="w-16 inline-block"></span>
                                int x = {object.x};
                                <br />
                                <span className="w-16 inline-block"></span>
                                int y = {object.y};
                                <br />
                                <span className="w-16 inline-block"></span>
                                double speed = {object.speed};
                                <br />
                                <span className="w-16 inline-block"></span>
                                int lookAheadDistance ={" "}
                                {object.lookAheadDistance};
                                <br />
                                <span className="w-8 inline-block"></span>
                                {"},"}
                            </p>
                        </div>
                    );
                })}
                <br />]
            </pre>
        </div>
    );
};
