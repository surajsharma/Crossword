import React, { Component } from "react";
import Cell from "./Cell";

export default class Word extends Component {
    render() {
        const cells = this.props.word.split("").map((char) => {
            return (
                <Cell
                    orientation={this.props.orientation}
                    x={this.props.x}
                    y={this.props.y}
                    value={char}
                    key={Math.random()}
                />
            );
        });

        console.log(cells);
        return <div>{cells}</div>;
    }
}
