import React, { Component } from "react";
import Cell from "./Cell";

export default class Word extends Component {
    render() {
        const word = this.props.word.split("");
        return word.map((char, index) => {
            return (
                <Cell
                    orientation={this.props.orientation}
                    x={
                        this.props.orientation === "across"
                            ? this.props.x + index
                            : this.props.x
                    }
                    y={
                        this.props.orientation === "down"
                            ? this.props.y + index
                            : this.props.y
                    }
                    value={char}
                    key={Math.random()}
                />
            );
        });
    }
}
