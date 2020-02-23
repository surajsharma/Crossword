import React, { Component } from "react";
import "../styles/cell.css";

export default class Cell extends Component {
    constructor(props) {
        // console.log("Cell-constructor");
        super(props);
        this.state = {
            inputVal: "",
            value: "",
            currentWord: this.props.currentWord
        };

        this.cellRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        // console.log("Cell-componentDidUpdate");
        if (this.props !== prevProps) {
            if (this.props.clear === this.props.wordNum) {
                this.setState({ value: "" });
                this.props.deleteClearedWord(this.props.wordNum);
            }
        }

        if (
            prevProps.currentWord !== this.props.currentWord &&
            this.props.currentWord !== null
        ) {
            this.setState({ currentWord: this.props.currentWord });
        }
    }

    componentDidMount() {
        // console.log("Cell-componentDidMount");

        if (typeof this.props.addToRefs === "function") {
            this.props.addToRefs(this.cellRef);
        }
    }

    handleFocus = () => {
        // console.log("Cell-handleFocus");

        if (this.props.value !== "-") {
            this.setState({ editing: !this.state.editing });
            this.props.changeActiveCell(
                {
                    index: this.props.index,
                    wordNum: this.props.wordNum,
                    currentWord: this.props.wordNum
                },
                console.log()
            );
        }
    };

    handleBlur = () => {
        // console.log("Cell-handleBlur");

        this.setState({ editing: !this.state.editing });
    };

    handleChange = (e) => {
        // console.log("Cell-handleChange");
        let { index, wordNum } = this.props;
        let value = e.target.value;

        if (value !== "") {
            this.setState(
                {
                    value: value
                },
                this.props.onWordChange({ value, index, wordNum })
            );
        }
    };

    render() {
        // console.log("Cell-render", this.props.wordNum, this.props.index);
        const style =
            this.props.value === "-"
                ? "rgba(0, 0, 0, 0.85)"
                : this.props.currentWord === this.props.wordNum
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
            <foreignObject x={x} y={y} width="9" height="9" className={"input"}>
                <div>
                    <input
                        type="text"
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        value={this.state.inputVal}
                        className={"input"}
                        maxLength="1"
                        ref={this.cellRef}
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
                            strokeWidth: "0.1px",
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
                        {this.props.show ? this.props.answer : this.state.value}
                    </text>
                </g>
                {this.props.value === "-" ? null : input}
            </svg>
        );
    }
}
