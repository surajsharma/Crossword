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
            words: [],
            wordsLoaded: false,
            currentWord: this.props.currentWord
        };
    }

    componentDidUpdate(prevProps) {
        let words = [];

        if (prevProps.data.clearNext !== this.props.data.clearNext) {
            console.log("G clear word", this.props.data.clearNext);

            this.setState({ wordsLoaded: false });
        }

        if (prevProps.currentWord !== this.props.currentWord) {
            this.setState({
                currentWord: this.props.currentWord,
                wordsLoaded: false
            });
        }

        if (this.props.data.revealedWords !== prevProps.data.revealedWords) {
            this.setState(
                {
                    revealedWords: this.props.data.revealedWords,
                    wordsLoaded: false
                }
                // console.log(
                //     this.props.data.revealedWords.indexOf(
                //         this.state.currentWord
                //     )
                // )
            );
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
                    key={word.word}
                    wordChange={this.handleWordChange}
                    addToRefs={this.props.addToRefs}
                    moveToNextCell={this.props.moveToNextCell}
                    changeActiveCell={this.props.changeActiveCell}
                    currentWord={this.props.currentWord}
                    clearNext={this.props.data.clearNext}
                    revealedWords={this.props.data.revealedWords}
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
