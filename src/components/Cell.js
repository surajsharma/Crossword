import React, { Component } from "react";
import "../styles/cell.css";

export default class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = { editing: false, value: props.value, inputVal: "" };
    }

    handleFocus = () => {
        console.log("click");
        this.setState({ editing: !this.state.editing, value: "" });
    };

    handleBlur = () => {
        console.log("click");
        this.setState({ editing: !this.state.editing });
    };

    handleChange = (e) => {
        console.log(e.target.value);
        this.setState({ value: e.target.value });
    };

    render() {
        const style = this.state.editing
            ? "rgb(200,200,0)"
            : this.state.value === ""
            ? "rgb(10, 10, 10)"
            : this.state.editing
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

        return (
            <svg>
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
                    <text x={x + 1} y={y + 2} className="small">
                        {this.props.number}
                    </text>
                    <text
                        x={x + 5}
                        y={y + 5.5}
                        className="heavy"
                        dominantBaseline="middle"
                        textAnchor="middle"
                    >
                        {this.state.value}
                    </text>
                </g>
                <foreignObject x={x} y={y} width="9" height="9">
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        <input
                            maxLength="1"
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            className="input"
                            value={this.state.inputVal}
                        />
                    </div>
                </foreignObject>
            </svg>
        );
    }
}
