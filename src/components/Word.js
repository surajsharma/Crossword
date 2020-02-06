import React, { Component } from "react";
import Cell from "./Cell";

import swal from "sweetalert2";

export default class Word extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solution: this.props.word,
            solved: ""
        };
    }

    componentDidUpdate() {
        if (this.state.solved === this.props.word) {
            swal.fire("Word Solved!");
        }
    }

    handleWordClick = (e) => {
        this.setState({ solved: this.state.solved + e }, () => console.log(e));
    };

    render() {
        const splitWord = this.props.word.split("");
        return splitWord.map((char, index) => {
            return (
                <React.Fragment key={Math.random()}>
                    <Cell
                        orientation={this.props.orientation}
                        number={index === 0 ? this.props.number + 1 : null}
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
                        value={this.state.solved[index]}
                        onClick={this.handleWordClick}
                    />
                </React.Fragment>
            );
        });
    }
}
