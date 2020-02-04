import React, { Component } from "react";
import "../styles/cell.css";

export default class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = { edting: false, value: props.value };
    }

    render() {
        const style =
            this.props.value === "" ? "rgb(10, 10, 10)" : "rgb(200, 200, 200)";

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
                            stroke: "black",
                            margin: "5px"
                        }}
                    />
                    <text x={x + 1} y={y + 2} className="small">
                        {this.props.number}
                    </text>
                    <text x={x + 2} y={y + 8} className="heavy">
                        {this.state.value}
                    </text>
                </g>
                <foreignObject x={x} y={y} width="9" height="9">
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        <input className="input"></input>
                    </div>
                </foreignObject>
            </svg>
        );
    }
}
