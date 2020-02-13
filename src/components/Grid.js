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
                    refer={this.props.data.refs[index]}
                    number={index}
                    word={word.word}
                    x={word.x}
                    y={word.y}
                    orientation={word.orientation}
                    key={Math.random()}
                    wordChange={this.handleWordChange}
                    addToRefs={this.props.addToRefs}
                    moveToNextCell={this.props.moveToNextCell}
                    changeActiveCell={this.props.changeActiveCell}
                />
            ));

            this.setState({ wordsLoaded: false, words: words });
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
        let { solvedWords } = this.state;

        if (solvedWords.length !== 0) {
            if (solvedWords[tuple.number]) {
                solvedWords[tuple.number] = tuple.value;
                this.setState({ solvedWords: solvedWords }, () => {
                    console.log(solvedWords);
                    this.props.addSolvedWord(this.state.solvedWords);
                });
            } else {
                this.setState(
                    { solvedWords: [...solvedWords, tuple.value] },
                    () => {
                        console.log("added to solved words = ", tuple.value);
                        this.props.addSolvedWord(this.state.solvedWords);
                    }
                );
            }
        } else {
            this.setState(
                { solvedWords: [...solvedWords, tuple.value] },
                () => {
                    console.log("added to solved words = ", tuple.value);
                    this.props.addSolvedWord(this.state.solvedWords);
                }
            );
        }
    };

    render() {
        const dim =
            "0 0 " +
            (13 * this.props.data.width + 3) +
            " " +
            (13 * this.props.data.height + 3);
        return (
            <div className="grid_container">
                <svg viewBox={dim} xmlns="http://www.w3.org/2000/svg">
                    {this.state.grid}
                    {this.state.words}
                </svg>
            </div>
        );
    }
}
