import React, { Component } from "react";
import Cell from "./Cell";
import Word from "./Word";

export default class Grid extends Component {
    constructor(props) {
        // console.log("Grid-constructor");
        super(props);
        this.state = {
            grid: [],
            words: [],
            wordsLoaded: false,
            currentWord: this.props.currentWord
        };
    }

    componentDidUpdate(prevProps) {
        let words = [];
        // console.log("Grid-cdu");
        if (
            prevProps.currentWord !== this.props.currentWord ||
            this.props.data.revealedWords !== prevProps.data.revealedWords ||
            this.props.data.clearNext !== prevProps.data.clearNext ||
            this.props.data.attempts !== prevProps.data.attempts
        ) {
            this.setState({
                wordsLoaded: false
            });
        }

        if (
            !this.state.wordsLoaded &&
            this.props.data.numberOfWords === this.props.data.wordList.length
        ) {
            // WORDS are mapped each time CW rerenders?
            words = this.props.data.wordList.map((word, index) => (
                <Word
                    refer={this.props.data.refs[index]}
                    number={index}
                    word={word.word}
                    x={word.x}
                    y={word.y}
                    orientation={word.orientation}
                    key={index}
                    wordChange={this.handleWordChange}
                    addToRefs={this.props.addToRefs}
                    moveToNextCell={this.props.moveToNextCell}
                    changeActiveCell={this.props.changeActiveCell}
                    currentWord={this.props.currentWord}
                    clearNext={this.props.data.clearNext}
                    revealedWords={this.props.data.revealedWords}
                    deleteClearedWord={this.props.deleteClearedWord}
                />
            ));
            this.setState({
                wordsLoaded: true,
                words: words,
                currentWord: this.props.currentWord
            });
        }
    }

    // empty cells
    componentDidMount() {
        // console.log("Grid-cdm");

        let width = this.props.data.width;
        let height = this.props.data.height;
        let newGrid = [];

        for (let i = 1; i < width; i++) {
            for (let j = 1; j < height; j++) {
                newGrid.push(
                    <Cell x={i} y={j} value="-" key={Math.random()} />
                );
            }
        }

        this.setState({ grid: newGrid });
    }

    handleWordChange = (tuple) => {
        // console.log("Grid-handleWordChange", tuple);
        //the incoming tuple is an array, needs sorting by tuple.index

        let sorted = tuple.value.slice(0);
        let word = "";
        sorted.sort((a, b) => {
            return a.index - b.index;
        });

        sorted.forEach((e) => (word += e.value));
        this.props.addSolvedWord(
            { word: word, number: tuple.number },
            this.props.handleNewCurrentWord(this.props.currentWord)
        );
    };

    render() {
        // console.log("Grid-render");

        const dim =
            "0 0 " +
            (10 * this.props.data.width + 3) +
            " " +
            (10 * this.props.data.height + 3);
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
