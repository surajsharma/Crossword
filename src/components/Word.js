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
            value: " ",
            currentWord: null,
            show: false
        };
    }

    componentDidMount() {
        let cells = [];
        const splitWord = this.props.word.split("");
        let show = this.props.revealedWords.includes(this.props.number);

        splitWord.forEach((element, index) => {
            cells.push(
                <React.Fragment key={this.props.word + index}>
                    <Cell
                        currentWord={this.props.currentWord}
                        answer={this.props.word[index]}
                        value={this.state.value}
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
                        show={show}
                    />
                </React.Fragment>
            );
        });

        this.setState({ cells: cells, currentWord: this.props.currentWord });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            let cells = [];
            const splitWord = this.props.word.split("");
            let show = this.props.revealedWords.includes(this.props.number);
            console.log(show);
            splitWord.forEach((element, index) => {
                cells.push(
                    <React.Fragment key={this.props.word + index}>
                        <Cell
                            currentWord={this.props.currentWord}
                            answer={this.props.word[index]}
                            value={this.state.tuples}
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
                            show={show}
                            clearNext={this.props.clearNext}
                        />
                    </React.Fragment>
                );
            });

            this.setState({
                cells: cells,
                currentWord: this.props.currentWord,
                show: show
            });
        }
        //is called for each word on re render
        const { solved, solution } = this.state;
        let show = this.props.revealedWords.includes(this.props.number);

        // console.log(solved, solution);

        if (this.state.solved.length === solution.length) {
            this.props.wordChange(
                {
                    value: solved,
                    number: this.props.number,
                    currentWord: this.props.currentWord,
                    show: show
                }
                // console.log("WcDu -->", this.props.currentWord)
            );
        }
    }

    clearWord = (number) => {};

    addToRefs = (ref) => {
        //called by Cell cDm
        this.props.addToRefs(ref);
    };

    handleWordChange = (tuple) => {
        //called by Cell handleChange
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
                { tuples: tuples, solved: solved }
                // console.log("index edited", tuples[edit])
            );
        }
        this.props.moveToNextCell();
    };

    render() {
        return this.state.cells;
    }
}
