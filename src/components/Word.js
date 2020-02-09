import React, { Component } from "react";
import Cell from "./Cell";

import swal from "sweetalert2";

export default class Word extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solution: this.props.word,
            solved: "",
            editing: false,
            value: " ",
            wcCalled: 0,
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
            this.props.wordChange(this.state.solved);
        }
    }

    handleWordChange = (e) => {
        this.setState(
            {
                wcCalled: this.state.wcCalled + 1,
                solved: this.state.solved + e
            },
            () => {
                console.log(
                    "word>hwc",
                    e,
                    "called= " + this.state.wcCalled,
                    "solved= ",
                    this.state.solved
                );
            }
        );
    };

    onWordFocus = () => {
        this.setState({ editing: true });
    };

    onWordUnfocus = () => {
        this.setState({ editing: false });
    };

    render() {
        return this.state.cells;
    }
}
