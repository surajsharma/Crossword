import React, { Component } from "react";
import "../styles/cell.css";

export default class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = { edting: false, value: props.value };
    }

    render() {
        return (
            <div
                className={this.state.orientation === "down" ? "cell" : "cell"}
            >
                {this.state.value}
            </div>
        );
    }
}
