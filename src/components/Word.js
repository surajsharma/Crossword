import React, { Component } from "react";
import Cell from "./Cell";

export default class Word extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solution: this.props.word,
            solved: [],
            tuples: [],
            indices: [],
            cells: [],
            editing: this.props.currentWord === this.props.index,
            value: "",
            currentWord: 0
        };
    }

    // static getDerivedStateFromProps() {
    //     console.log("Static method called");
    //     return null;
    // }

    componentDidMount() {
        let cells = [];
        const splitWord = this.props.word.split("");

        splitWord.forEach((element, index) => {
            cells.push(
                <React.Fragment key={this.props.word + index}>
                    <Cell
                        index={index}
                        number={index === 0 ? this.props.number + 1 : null}
                        wordNum={this.props.number}
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
                        addToRefs={this.props.addToRefs}
                        moveToNextCell={this.props.moveToNextCell}
                        changeActiveCell={this.props.changeActiveCell}
                    />
                </React.Fragment>
            );
        });

        this.setState({ cells: cells, currentWord: this.props.currentWord });
    }

    componentDidUpdate() {
        const { solved, solution } = this.state;

        if (this.state.solved.length === solution.length) {
            this.props.wordChange(
                {
                    value: solved,
                    number: this.props.number,
                    currentWord: this.props.currentWord
                },
                console.log(
                    "WCDU -->",
                    this.props.currentWord === this.props.number,
                    this.props.currentWord,
                    this.props.number
                )
            );
        }
    }

    addToRefs = (ref) => {
        //called by Cell cDm
        this.props.addToRefs(ref);
    };

    handleWordChange = (tuple) => {
        //called by Cell handleChange
        console.log("word handleWordChange", tuple);

        let { tuples, indices, solved } = this.state;

        if (this.state.indices.indexOf(tuple.index) === -1) {
            //if incoming indice is empty

            this.setState(
                {
                    tuples: [...tuples, tuple],
                    indices: [...indices, tuple.index]
                },
                this.setState({
                    solved: [...solved, tuple]
                })
            );
        } else {
            let edit = tuples.findIndex((x) => x.index === tuple.index);

            tuples[edit].value = tuple.value;
            solved[edit] = tuple;

            this.setState(
                { tuples: tuples, solved: solved },
                console.log("index edited", tuples[edit])
            );
        }
        this.props.moveToNextCell();
    };

    render() {
        return this.state.cells;
    }
}
