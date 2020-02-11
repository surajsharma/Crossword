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
            indices: [],
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
                        wordNum={this.props.number}
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

    handleWordChange = (tuple) => {
        let { tuples, solution, indices } = this.state;
        let { number } = this.props;
        let wordToSend = "";
        let allIndicesUnique = [...new Set(this.state.indices)];

        // IF TUPLE.INDEX IS NON EMPTY, CHANGE IT (EDIT STATE.TUPLE)
        tuples.forEach((index) => {
            console.log(
                allIndicesUnique.length,
                solution.length,
                tuples[index],
                this.state.indices.indexOf(tuple.index)
            );
        });
        if (this.state.indices.indexOf(tuple.index) === -1)
            this.setState(
                {
                    tuples: [...tuples, tuple],
                    indices: [...indices, tuple.index]
                },
                console.log(tuple)
            );
        else {
            console.log(
                `replacing ${tuples[tuple.index].value} with ${tuple.value}`
            );
            tuples[tuple.index].value = tuple.value;
            this.setState(
                { tuples: tuples }
                // console.log("index edited", tuples[tuple.index])
            );
        }
    };

    render() {
        return this.state.cells;
    }
}
