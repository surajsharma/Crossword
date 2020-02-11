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
        const { solved, solution } = this.state;
        if (this.state.solved.length === solution.length) {
            this.props.wordChange({
                value: solved.join(""),
                number: this.props.number
            });
        }
    }

    handleWordChange = (tuple) => {
        let { tuples, indices, solved } = this.state;

        if (this.state.indices.indexOf(tuple.index) === -1) {
            // console.log(this.state.tuples.length, solution.length);
            this.setState(
                {
                    tuples: [...tuples, tuple],
                    indices: [...indices, tuple.index]
                },
                this.setState({ solved: [...solved, tuple.value] })
            );
        } else {
            // console.log(this.state.tuples.length, solution.length);
            // console.log(
            //     `replacing ${tuples[tuple.index].value} with ${tuple.value}`
            // );

            tuples[tuple.index].value = tuple.value;
            solved[tuple.index] = tuple.value;

            this.setState(
                { tuples: tuples, solved: solved },
                console.log("index edited", tuples[tuple.index])
            );
        }
    };

    render() {
        return this.state.cells;
    }
}
