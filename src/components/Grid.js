import React, { Component } from "react";
import Cell from "./Cell";
import "../styles/cell.css";
import Word from "./Word";

//use content loader

export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: []
        };
    }

    componentDidMount() {
        const width = this.props.data.width;
        const height = this.props.data.height;

        let newGrid = [];

        for (let i = 1; i < width; i++) {
            for (let j = 1; j < height; j++) {
                newGrid.push(
                    <Cell x={i} y={j} value={""} key={Math.random()} />
                );
            }
        }
        this.setState({ grid: newGrid });
    }

    classNames = (props) =>
        Object.keys(props)
            .filter((f) => props[f] === true)
            .join(" ");

    render() {
        const words = this.props.data.wordList.map((word, index) => {
            return (
                <Word
                    word={word.word}
                    x={word.x}
                    y={word.y}
                    orientation={word.orientation}
                    key={index}
                />
            );
        });
        return <div className="grid">{words}</div>;
    }
}
