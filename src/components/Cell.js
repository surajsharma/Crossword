import React, { Component } from "react";
import "../styles/cell.css";

export default class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            inputVal: "",
            solved: false
        };
    }

    handleFocus = () => {
        this.setState({ editing: !this.state.editing });
    };

    handleBlur = () => {
        this.setState({ editing: !this.state.editing });
        if (this.props.value === "") {
            this.setState({ value: this.props.value, solved: false });
        }
    };

    handleChange = (e) => {
        if (e.target.value !== "") {
            this.setState({ solved: true }, this.props.onClick(e.target.value));
        }
    };

    render() {
        const style = this.state.editing
            ? "rgb(200,200,0)"
            : this.props.value === ""
            ? "rgb(10, 10, 10)"
            : this.props.editing
            ? "rgb(200,200,0)"
            : "rgb(200, 200, 200)";

        const x =
            this.props.x === 1
                ? this.props.x
                : this.props.x + 10 * (this.props.x - 1);

        const y =
            this.props.y === 1
                ? this.props.y
                : this.props.y + 10 * (this.props.y - 1);

        const input = (
            <foreignObject
                x={x}
                y={y}
                width="9"
                height="9"
                className={this.state.editing ? "input current" : "input"}
            >
                <div>
                    <input
                        ref={this.props.value}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        value={this.state.inputVal}
                        className={
                            this.state.editing ? "input current" : "input"
                        }
                        maxLength="1"
                    />
                </div>
            </foreignObject>
        );
        return (
            <svg className="cell">
                <g>
                    <rect
                        x={x}
                        y={y}
                        width={10}
                        height={10}
                        style={{
                            fill: style,
                            strokeWidth: "0.4px",
                            stroke: "black"
                        }}
                    />
                    <text x={x + 0.5} y={y + 2.7} className="small">
                        {this.props.number}
                    </text>
                    <text
                        x={x + 5}
                        y={y + 5.5}
                        className="heavy"
                        dominantBaseline="middle"
                        textAnchor="middle"
                    >
                        {this.props.value}
                    </text>
                </g>
                {this.props.value === "" ? null : input}
            </svg>
        );
    }
}
