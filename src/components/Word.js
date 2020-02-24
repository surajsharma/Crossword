import React, { Component } from "react";
import Cell from "./Cell";

export default class Word extends Component {
    constructor(props) {
        // console.log("Word-constructor");

        super(props);
        this.state = {
            solution: this.props.word,
            solved: [],
            indices: [],
            cells: [],
            currentWord: null,
            show: false
        };
    }

    componentDidMount() {
        // console.log("Word-cdm");

        let cells = [];
        const splitWord = this.props.word.split("");

        let show = this.props.revealedWords.includes(this.props.number);
        let clear = this.props.clearNext;

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
                        clear={clear}
                        deleteClearedWord={this.props.deleteClearedWord}
                    />
                </React.Fragment>
            );
        });
        this.setState({ cells: cells, currentWord: this.props.currentWord });
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("Word-cdu");

        if (prevProps !== this.props) {
            let cells = [];
            const splitWord = this.props.word.split("");
            let show = this.props.revealedWords.includes(this.props.number);
            let clear = this.props.clearNext;

            if (this.props.number === clear) {
                this.setState(
                    { solved: [], indices: [] },
                    this.props.deleteClearedWord(clear)
                );
            }

            splitWord.forEach((element, index) => {
                cells.push(
                    <React.Fragment key={this.props.word + index}>
                        <Cell
                            currentWord={this.props.currentWord}
                            answer={this.props.word[index]}
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
                            clear={clear}
                            deleteClearedWord={this.props.deleteClearedWord}
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

        if (
            this.state.solved.length === solution.length &&
            this.props.currentWord !== this.props.clearNext
        ) {
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

    clearWord = (number) => {
        console.log("Word-clearWord", number);
    };

    addToRefs = (ref) => {
        // console.log("Word-addToRefs");
        //called by Cell cDm
        this.props.addToRefs(ref);
    };

    handleWordChange = (tuple) => {
        // console.log("Word-handleWordChange", tuple);

        //called by Cell handleChange
        let { indices, solved } = this.state;

        if (
            this.state.indices.indexOf(tuple.index) === -1 &&
            this.props.number !== this.props.clearNext
        ) {
            //if incoming indice is empty
            this.setState({
                solved: [...solved, tuple],
                indices: [...indices, tuple.index]
            });
        } else {
            let edit = solved.findIndex((x) => x.index === tuple.index);

            solved[edit] = tuple;

            this.setState(
                { solved: solved }
                // console.log("index edited", tuples[edit])
            );
        }
        this.props.moveToNextCell();
    };

    render() {
        // console.log("Word-render", this.props.number);
        return this.state.cells;
    }
}
