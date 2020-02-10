import React, { Component } from "react";
import Cell from "./Cell";

// import swal from "sweetalert2";

export default class Word extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solution: this.props.word,
            solved: [],
            editing: false,
            value: "",
            tuples: [],
            cells: []
        };
    }

    componentDidMount() {
        let cells = [];
        const splitWord = this.props.word.split("");

        splitWord.forEach((element, index) => {
            cells.push(
                <React.Fragment key={Math.random()}>
                    <Cell
                        index={index}
                        word={this.props.word}
                        wordEditing={this.state.editing}
                        orientation={this.props.orientation}
                        number={index === 0 ? this.props.number + 1 : null}
                        length={this.props.word.length}
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
                        onWordChange={this.handleWordChange}
                    />
                </React.Fragment>
            );
        });

        this.setState({ cells: cells });
    }

    componentDidUpdate() {
        if (this.state.solved.length === this.props.word.length) {
            console.log("scan word and add to solved here");

            for (let i = 0; i < this.props.word.length; i++) {
                console.log(this.state.solved[i]);
            }
        }
    }

    generateAndAddWord = () => {};

    handleWordChange = (tuple) => {
        let { tuples, solution } = this.state;
        let wordToSend = "";

        if (tuples.length < solution.length) {
            console.log(tuple, tuples.length, solution.length);

            this.setState({ tuples: [...tuples, tuple] }, () => {
                if (tuples.length === solution.length - 1) {
                    this.state.tuples.forEach((char, index) => {
                        wordToSend += char.value;
                    }, console.log("ready to send word"));
                    this.props.wordChange(wordToSend);
                }
            });
        } else {
            var foundIndex = tuples.findIndex((x) => x.index === tuple.index);
            const newTuple = { value: tuple.value, index: tuple.index };
            let newTuples = tuples;
            newTuples[foundIndex] = newTuple;

            this.setState({ tuples: newTuples }, () => {
                this.state.tuples.forEach((char, index) => {
                    wordToSend += char.value;
                }, console.log("ready to send word"));
                this.props.wordChange(wordToSend);
            });
        }
    };

    render() {
        return this.state.cells;
    }
}
