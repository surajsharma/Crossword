import React, { Component } from "react";
import Grid from "./Grid";
import axios from "axios";
import Swal from "sweetalert2";

export default class Crossword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                height: 13,
                width: 13,
                wordList: [],
                clues: [],
                answers: [],
                attempts: [],
                numberOfWords: 0,
                refs: [],
                currentFocus: 0,
                currentWord: 0
            }
        };
    }

    componentDidMount() {
        const { data } = this.state;
        axios
            .get(
                "https://www.staging.socratease.in/api/crossword/crossword-id/2"
            )
            .then((resp) => {
                resp.data.wordList.forEach((word) => {
                    this.setState((prevState) => ({
                        data: {
                            ...data,
                            wordList: this.state.data.wordList.concat(word),
                            clues: this.state.data.clues.concat(word.clue),
                            numberOfWords: resp.data.wordList.length,
                            answers: this.state.data.answers.concat(word.word)
                        }
                    }));
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addSolvedWord = (tuple) => {
        // console.log(
        //     tuple.number,
        //     tuple.words[tuple.number]
        //         ? tuple.words[tuple.number]
        //         : tuple.words[0],
        //     tuple.words.length,
        //     tuple
        // );

        let wordToAdd = tuple.words[tuple.number]
            ? tuple.words[tuple.number]
            : tuple.words[0];

        console.log("CWaddSolvedWord", {
            word: wordToAdd,
            number: tuple.number
        });

        // if (tuple.words.length === 1) {
        //     console.log(tuple.number, tuple.words[0], tuple.words.length);
        // } else {
        //     console.log(tuple.number, tuple.words, tuple.words.length);
        // }

        //scan this.state.data.attempts to see if
        //the present index is taken, if yes, edit the word else insert

        // let wordToAdd = {
        //     word: tuple.words[tuple.number] || tuple.words[0],
        //     number: tuple.number
        // };

        // this.setState(
        //     (prevState) => ({
        //         data: {
        //             ...this.state.data,
        //             attempts: [...this.state.data.attempts, wordToAdd]
        //         }
        //     }),
        //     console.log("Added attempt ", wordToAdd)
        // );
    };

    checkAnswers = () => {
        const { attempts, answers } = this.state.data;

        // console.log(attempts, answers);
        let score = 0;

        if (attempts.length === answers.length) {
            attempts.forEach((attempt, index) => {
                if (answers.includes(attempts[index])) {
                    score += 1;
                }
            });

            if (score === answers.length) {
                Swal.fire("Correct!");
            } else {
                Swal.fire("Incorrect!");
            }
        } else {
            Swal.fire(
                "Please answer all " + attempts.length + " of " + answers.length
            );
        }
    };

    clearEverything = () => {
        console.log("clear everything and rerender from scratch");
        // this.setState({ data: null });
    };

    handleClueClick = (e, index) => {
        let startingCell = 0;

        for (let i = 0; i < index; i++) {
            startingCell =
                index === 0
                    ? 0
                    : (startingCell += this.state.data.wordList[i].word.length);
        }

        this.setState(
            { currentFocus: startingCell },
            this.state.data.refs[startingCell].current.focus()
        );
    };

    moveToNextCell = (backwards) => {
        //all the cell change logic is in changeActiveCell
        //here we will just call changeActiveCell with parameters in a
        //loop

        const { currentFocus, refs } = this.state.data;
        let nextCell = 0;

        // console.log(
        //     "move to next cell",
        //     currentWord,
        //     currentFocus,
        //     allPrevWords,
        //     nextCell
        // );

        if (currentFocus < refs.length - 1) {
            if (backwards) {
                nextCell = currentFocus - 1 || 0;
            } else {
                nextCell = currentFocus + 1;
            }

            this.setState(
                { currentFocus: nextCell },
                this.state.data.refs[nextCell].current.focus()
            );
        } else {
            nextCell = 0;
            this.setState(
                { currentFocus: nextCell },
                this.state.data.refs[nextCell].current.focus()
            );
        }
    };

    changeActiveCell = (activeCell) => {
        // activeCell = {index: 0, wordNum: 0}

        // console.log(
        //     "changeActiveCell",
        //     activeCell,
        //     this.state.data.currentWord
        // );

        let newActiveCell = 0,
            allPrevWords = 0,
            allCurWordChars = activeCell.index;

        for (let i = 0; i < activeCell.wordNum; i++) {
            allPrevWords += this.state.data.wordList[i].length;
        }

        newActiveCell = allPrevWords + allCurWordChars;

        this.setState(
            (prevState) => ({
                data: {
                    ...this.state.data,
                    currentFocus: newActiveCell,
                    currentWord: activeCell.wordNum
                }
            }),
            console.log("currentFocus ", newActiveCell)
        );
    };

    addToRefs = (ref) => {
        const { data } = this.state;
        this.setState((prevState) => ({
            data: {
                ...data,
                refs: prevState.data.refs.concat(ref)
            }
        }));
    };

    render() {
        if (this.state.data.wordList.length > 0) {
            return (
                <React.Fragment>
                    <Grid
                        data={this.state.data}
                        addSolvedWord={this.addSolvedWord}
                        addToRefs={this.addToRefs}
                        moveToNextCell={this.moveToNextCell}
                        changeActiveCell={this.changeActiveCell}
                    ></Grid>
                    {this.state.data.clues.map((clue, index) => {
                        return (
                            <div className="clue" key={clue}>
                                <li
                                    onClick={(e) =>
                                        this.handleClueClick(e, index)
                                    }
                                >
                                    {clue}
                                </li>
                            </div>
                        );
                    })}
                    <button onClick={this.checkAnswers}>Check answers</button>
                    <button onClick={this.clearEverything}>Clear</button>
                </React.Fragment>
            );
        } else {
            return <p>Loading...</p>;
        }
    }
}
