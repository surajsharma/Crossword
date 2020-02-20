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
            wordsLoaded: false,
            currentWord: null
        };
    }

    componentDidUpdate(prevProps) {
        let words = [];
        if (prevProps.currentWord !== this.state.currentWord) {
            this.setState(
                { currentWord: this.props.currentWord, wordsLoaded: false },
                console.log("GcDu -->", this.props.currentWord)
            );
            // this.props.handleNewCurrentWord(this.props.currentWord); ???
        }

        if (
            !this.state.wordsLoaded &&
            this.props.data.numberOfWords === this.props.data.wordList.length
        ) {
            // console.log("G cdu, mapping wordlist", this.props.currentWord);
            // WORDS are mapped each time CW rerenders?
            words = this.props.data.wordList.map((word, index) => (
                <Word
                    refer={this.props.data.refs[index]}
                    number={index}
                    word={word.word}
                    x={word.x}
                    y={word.y}
                    orientation={word.orientation}
                    key={word.word}
                    wordChange={this.handleWordChange}
                    addToRefs={this.props.addToRefs}
                    moveToNextCell={this.props.moveToNextCell}
                    changeActiveCell={this.props.changeActiveCell}
                    currentWord={this.state.currentWord} // <===== but not when passed
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
        console.log("G cdm", this.props.currentWord);
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

    handleWordChange = (tuple) => {
        //the incoming tuple is an array, needs sorting by tuple.index

        let sorted = tuple.value.slice(0);
        let word = "";

        sorted.sort((a, b) => {
            return a.index - b.index;
        });

        sorted.forEach((e) => (word += e.value));

        // console.log(
        //     `G sending ==> ${word} : ${tuple.number} where words is ${this.state.words}`
        // );

        this.props.addSolvedWord(
            { word: word, number: tuple.number },
            this.props.handleNewCurrentWord(this.props.currentWord)
        );
    };

    render() {
        // console.log(this.props.currentWord);

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
