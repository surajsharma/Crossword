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
        //the incoming tuple is an array, needs sorting by tuple.index

        //the adding to solvedWords approach should be changed
        //instead of adding any change, modify word in-situ by location

        let sorted = tuple.value.slice(0);
        let word = "";

        sorted.sort((a, b) => {
            return a.index - b.index;
        });

        sorted.forEach((e) => (word += e.value));
        let { solvedWords } = this.state;

        console.log("GhandleWordChange", tuple.number, word);

        this.props.addSolvedWord({ word: word, number: tuple.number });

        // if (solvedWords.length !== 0) {
        //     if (solvedWords[tuple.number]) {
        //         solvedWords[tuple.number] = word;
        //         this.setState({ solvedWords: solvedWords }, () => {
        //             console.log("handleWordChange", solvedWords);
        //             this.props.addSolvedWord({
        //                 words: this.state.solvedWords,
        //                 number: tuple.number
        //             });
        //         });
        //     } else {
        //         this.setState({ solvedWords: [...solvedWords, word] }, () => {
        //             console.log("added to solved words = ", word);
        //             this.props.addSolvedWord({
        //                 words: this.state.solvedWords,
        //                 number: tuple.number
        //             });
        //         });
        //     }
        // } else {
        //     this.setState({ solvedWords: [...solvedWords, word] }, () => {
        //         console.log("added to solved words = ", word);
        //         this.props.addSolvedWord({
        //             words: this.state.solvedWords,
        //             number: tuple.number
        //         });
        //     });
        // }
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
