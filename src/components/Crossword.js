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
                currentWord: null
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
                resp.data.wordList.forEach((word, index) => {
                    this.setState((prevState) => ({
                        data: {
                            ...data,
                            wordList: this.state.data.wordList.concat(word),
                            clues: this.state.data.clues.concat(word.clue),
                            numberOfWords: resp.data.wordList.length,
                            answers: this.state.data.answers.concat({
                                word: word.word,
                                number: index
                            })
                        }
                    }));
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addSolvedWord = (tuple) => {
        let { attempts, numberOfWords } = this.state.data;

        if (attempts.length < numberOfWords) {
            this.setState(
                (prevState) => ({
                    data: {
                        ...this.state.data,
                        attempts: [...this.state.data.attempts, tuple]
                    }
                }),
                console.log("Added attempt ", tuple)
            );
        } else {
            //check if tuple.number exists in attempt
            attempts[tuple.number].word = tuple.word;
            this.setState(
                (prevState) => ({
                    data: {
                        ...this.state.data,
                        attempts: attempts
                    }
                }),
                console.log("Edited attempt ", tuple)
            );
        }
    };

    checkAnswers = () => {
        const { attempts, answers } = this.state.data;

        // sortedAnswers
        let sa = attempts.slice(0);

        sa.sort((a, b) => {
            return a.number - b.number;
        });

        let score = 0;
        let newAttempts = sa;

        if (newAttempts.length === answers.length) {
            newAttempts.forEach((attempt, index) => {
                if (
                    answers[attempt.number].word === attempt.word &&
                    answers[index].number === attempt.number
                ) {
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
                        currentWord={this.state.data.currentWord}
                    ></Grid>
                    {this.state.data.clues.map((clue, index) => {
                        return (
                            <div
                                className={
                                    this.state.data.currentWord === index
                                        ? "clue editing"
                                        : "clue "
                                }
                                key={clue}
                            >
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
