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
            solvedWords: [],
            words: [],
            wordsLoaded: true,
            currentWord: null
        };
    }

    componentDidUpdate() {
        if (
            this.state.wordsLoaded &&
            this.props.data.numberOfWords === this.props.data.wordList.length
        ) {
            const words = this.props.data.wordList.map((word, index) => (
                <Word
                    number={index}
                    word={word.word}
                    x={word.x}
                    y={word.y}
                    orientation={word.orientation}
                    key={Math.random()}
                    wordChange={this.handleWordChange}
                />
            ));

            this.setState(
                { wordsLoaded: false, words: words },
                console.log(words)
            );
        }
    }
    componentDidMount() {
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

    classNames = (props) =>
        Object.keys(props)
            .filter((f) => props[f] === true)
            .join(" ");

    handleWordChange = (tuple) => {
        console.log(tuple);
        let { solvedWords } = this.state;
        console.log("add this", tuple.wordToSend, tuple);

        if (solvedWords.length !== 0) {
            console.log(solvedWords[tuple.number]);
            solvedWords[tuple.number] = tuple.wordToSend;
            this.setState(
                { solvedWords: solvedWords },
                console.log("added to solved words = ", solvedWords)
            );
        } else {
            this.setState(
                { solvedWords: [...solvedWords, tuple.wordToSend] },
                console.log("added to solved words = ", tuple.wordToSend)
            );
        }
    };

    render() {
        const dim =
            "0 0 " +
            (10 * this.props.data.width + 3) +
            " " +
            (10 * this.props.data.height + 3);
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
                    {this.state.words}
                </svg>
            </div>
        );
    }
}
