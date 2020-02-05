import React, { Component } from "react";
import Cell from "./Cell";
import "../styles/cell.css";

import Word from "./Word";

//use content loader
export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            currentWord: null
        };
    }

    populate() {
        let width = this.props.data.width;
        let height = this.props.data.height;
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

    componentDidMount() {
        this.populate();
    }

    classNames = (props) =>
        Object.keys(props)
            .filter((f) => props[f] === true)
            .join(" ");

    handleWordClick = () => {};

    render() {
        const dim =
            "0 0 " +
            (10 * this.props.data.width + 3) +
            " " +
            (10 * this.props.data.height + 3);

        const words = this.props.data.wordList.map((word, index) => {
            return (
                <Word
                    number={index}
                    word={word.word}
                    x={word.x}
                    y={word.y}
                    orientation={word.orientation}
                    key={Math.random()}
                    onClick={this.handleWordClick}
                />
            );
        });

        return (
            <div>
                <svg
                    viewBox={dim}
                    xmlns="http://www.w3.org/2000/svg"
                    className={this.classNames({
                        crossword__grid: true
                        // "crossword__grid--focussed": !! props.focussedCell
                        // How did props get here?
                    })}
                >
                    {this.state.grid}
                    {words.reverse()}
                </svg>
            </div>
        );
    }
}
