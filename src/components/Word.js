import React, { Component } from "react";
import Cell from "./Cell";

import swal from "sweetalert2";

export default class Word extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solution: this.props.word,
            solved: "",
            editing: false
        };
    }

    componentDidUpdate() {
        if (this.state.solved.length === this.props.word.length) {
            this.props.wordChange(this.state.solved);
        }
    }

    handleWordChange = (e) => {
        this.setState(
            { solved: this.state.solved + e, editing: !this.state.editing },
            () => console.log(e)
        );
    };

    onWordFocus = () => {
        this.setState({ editing: true });
    };

    onWordUnfocus = () => {
        this.setState({ editing: false });
    };

    render() {
        const splitWord = this.props.word.split("");

        return splitWord.map((char, index) => {
            return (
                <React.Fragment key={Math.random()}>
                    <Cell
                        wordEditing={this.state.editing}
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
                        onWordChange={this.handleWordChange}
                        onWordFocus={this.onWordFocus}
                        onWordUnfocus={this.onWordUnfocus}
                    />
                </React.Fragment>
            );
        });
    }
}
