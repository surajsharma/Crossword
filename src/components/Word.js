import React, { Component } from "react";
import Cell from "./Cell";

export default class Word extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        };
    }
    render() {
        const splitWord = this.props.word.split("");

        return splitWord.map((char, index) => {
            if (this.state.editing) {
                return (
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
                        value={char}
                        key={Math.random()}
                        editing={this.state.editing}
                    />
                );
            } else {
                return (
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
                        value={char}
                        key={Math.random()}
                    />
                );
            }
        });
    }
}
