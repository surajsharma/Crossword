import React, { Component } from "react";
import Grid from "./Grid";
import axios from "axios";
import Swal from "sweetalert2";

export default class Crossword extends Component {
    constructor(props) {
        // console.log("CW-constructor");
        super(props);
        this.state = {
            data: {
                height: 13,
                width: 13,
                wordList: [],
                clues: [],
                answers: [],
                attempts: [],
                refs: [],
                revealedWords: [],
                currentFocus: 0,
                numberOfWords: 0,
                currentWord: null,
                clearNext: null,
                clearAll: false
            },
            debug: false
        };
    }

    handleKeyPress = (event) => {
        // console.log("CW-handleKeyPress");
        const { currentWord, numberOfWords } = this.state.data;

        if (event.key === "Escape") {
            // console.log(event.key);
            this.setState({ debug: !this.state.debug });
        }

        if (event.key === "Backspace") {
            this.moveToNextCell(true);
        }

        if (event.key === "Tab") {
            event.preventDefault();
            this.handleClueClick(
                event,
                currentWord === numberOfWords - 1 ? 0 : currentWord + 1
            );
        }
    };

    componentDidUpdate(prevProps) {}

    componentDidMount() {
        // console.log("CW-componentDidMount");
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

    deleteClearedWord = (word) => {
        // console.log("CW-deleteClearedWord", word);
        let newAttempts = [];
        if (word === null) {
            this.setState((prevState) => ({
                data: {
                    ...this.state.data,
                    clearAll: false
                }
            }));
        } else {
            newAttempts = this.state.data.attempts.filter(
                (attempt) => word !== attempt.number
            );
        }

        this.setState(
            (prevState) => ({
                data: {
                    ...this.state.data,
                    attempts: newAttempts,
                    clearNext: null,
                    clearAll: false
                }
            })
            // console.log("DCW")
        );
    };

    addSolvedWord = (tuple) => {
        // console.log("CW-addSolvedWord", tuple);
        let { attempts } = this.state.data;
        let answeredIndices = [];

        tuple.word = tuple.word.toLowerCase();

        //prepare a list of indices already answered
        for (let i = 0; i < attempts.length; i++) {
            answeredIndices.push(attempts[i].number);
        }

        if (attempts.length !== 0) {
            if (answeredIndices.includes(tuple.number)) {
                //[0,2,3], tuple.number===2
                attempts[answeredIndices.indexOf(tuple.number)].word =
                    tuple.word;

                this.setState(
                    (prevState) => ({
                        data: {
                            ...this.state.data,
                            attempts: attempts
                        }
                    })
                    // console.log("Edited attempt ", tuple)
                );
            } else {
                //add an attempt
                if (!this.state.data.clearAll) {
                    this.setState(
                        (prevState) => ({
                            data: {
                                ...this.state.data,
                                attempts: [...this.state.data.attempts, tuple]
                            }
                        })
                        // console.log("Added attempt 1  ", tuple)
                    );
                }
            }
        } else {
            //add an attempt, check if word hasn't already been cleared

            if (!this.state.data.clearAll) {
                this.setState(
                    (prevState) => ({
                        data: {
                            ...this.state.data,
                            attempts: [...this.state.data.attempts, tuple]
                        }
                    })
                    // console.log("Added attempt 2", tuple)
                );
            }
        }
    };

    checkAnswers = () => {
        // console.log("CW-checkAnswers");
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

    clearEverything = (reset) => {
        // console.log("CW-clearEverything");
        //first clear all revealed words, if any
        let { revealedWords, attempts } = this.state.data;

        if (revealedWords.length) {
            const len = revealedWords.length;
            for (let index = 0; index < len; index++) {
                revealedWords.pop();
            }
            this.setState((prevState) => ({
                data: {
                    ...this.state.data,
                    revealedWords: revealedWords,
                    clearNext: Math.random()
                }
            }));
        }

        //then clear all attempts
        if (attempts.length) {
            const len = attempts.length;

            for (let index = 0; index <= len; index++) {
                attempts.pop();
            }
            this.setState((prevState) => ({
                data: {
                    ...this.state.data,
                    attempts: attempts,
                    clearAll: true
                }
            }));
        }
    };

    checkThis = () => {
        // console.log("CW-checkthis");
        const { currentWord, attempts, answers } = this.state.data;

        if (attempts.length) {
            let solvedWord =
                null ||
                attempts.filter((a) => a.number === currentWord)[0].word;
            let answerWord =
                null || answers.filter((a) => a.number === currentWord)[0].word;

            if (solvedWord && answerWord && solvedWord === answerWord) {
                Swal.fire("Correct");
            } else {
                Swal.fire("Incorrect");
            }
        }
    };

    revealThis = (all) => {
        // console.log("CW-revealThis");
        let newRevealedWords = [];
        const { revealedWords } = this.state.data;

        if (all === true && !revealedWords.length) {
            this.state.data.wordList.forEach((data, index) =>
                newRevealedWords.push(index)
            );

            this.setState((prevState) => ({
                data: {
                    ...this.state.data,
                    revealedWords: newRevealedWords
                }
            }));
        } else {
            if (
                this.state.data.currentWord !== null &&
                this.state.data.revealedWords.indexOf(
                    this.state.data.currentWord
                ) === -1
            ) {
                // console.log("reveal this", this.state.data.currentWord);
                newRevealedWords.push(this.state.data.currentWord);

                this.setState((prevState) => ({
                    data: {
                        ...this.state.data,
                        revealedWords: [
                            ...this.state.data.revealedWords,
                            this.state.data.currentWord
                        ]
                    }
                }));
            }
        }
    };

    clearThis = () => {
        // console.log("CW-clearThis", currentWord);
        const { revealedWords, currentWord } = this.state.data;

        //currentWord is revealed
        if (revealedWords.includes(currentWord)) {
            let newRevealedWords = revealedWords.filter(
                (r) => r !== currentWord
            );

            this.setState((prevState) => ({
                data: {
                    ...this.state.data,
                    revealedWords: newRevealedWords,
                    clearNext: currentWord
                }
            }));
        } else {
            this.setState(
                (prevState) => ({
                    data: {
                        ...this.state.data,
                        clearNext: currentWord
                    }
                })
                // console.log("set clear word")
            );
        }
    };

    revealAll = () => {
        // console.log("CW-revealAll");
        this.revealThis(true);
    };

    handleClueClick = (e, index) => {
        // console.log("CW-handleClueClick");
        let startingCell = 0;

        for (let i = 0; i < index; i++) {
            startingCell =
                index === 0
                    ? 0
                    : (startingCell += this.state.data.wordList[i].word.length);
        }

        this.setState(
            { currentFocus: startingCell, currentWord: index },
            this.state.data.refs[startingCell].current.focus()
        );
    };

    moveToNextCell = (backwards) => {
        // console.log("CW-moveToNextCell");
        //all the cell change logic is in changeActiveCell
        //here we will just call changeActiveCell with parameters in a
        //loop

        const { currentFocus, refs } = this.state.data;
        let nextCell = 0;

        if (currentFocus < refs.length - 1) {
            if (backwards === true) {
                // console.log(currentFocus);
                nextCell = currentFocus === 0 ? 0 : currentFocus - 1;
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
        // console.log("CW-changeActiveCell");
        let newActiveCell = 0,
            allPrevWords = 0,
            allCurWordChars = activeCell.index;

        for (let i = 0; i < activeCell.wordNum; i++) {
            allPrevWords += this.state.data.wordList[i].length;
        }

        newActiveCell = allPrevWords + allCurWordChars;

        this.setState((prevState) => ({
            data: {
                ...this.state.data,
                currentFocus: newActiveCell,
                currentWord: activeCell.wordNum
            }
        }));
    };

    addToRefs = (ref) => {
        // console.log("CW-addToRefs");
        const { data } = this.state;
        this.setState((prevState) => ({
            data: {
                ...data,
                refs: prevState.data.refs.concat(ref)
            }
        }));
    };

    handleNewCurrentWord = (neWord) => {
        // console.log("CW-handleNewCurrentWord");
        this.setState((prevState) => ({
            data: {
                ...this.state.data,
                currentWord: neWord
            }
        }));
    };

    dumpDebugData = (e) => {
        // console.log("CW-dumpDebugData");
        e.preventDefault();
        const d = e.target.innerHTML;
        console.log(`=${d}=`, this.state.data[d]);
    };

    render() {
        // console.log("CW-render");
        if (this.state.data.wordList.length > 0) {
            return (
                <div className="CW-container" onKeyDown={this.handleKeyPress}>
                    <Grid
                        className="grid"
                        data={this.state.data}
                        addSolvedWord={this.addSolvedWord}
                        deleteClearedWord={this.deleteClearedWord}
                        addToRefs={this.addToRefs}
                        moveToNextCell={this.moveToNextCell}
                        changeActiveCell={this.changeActiveCell}
                        currentWord={this.state.data.currentWord}
                        handleNewCurrentWord={this.handleNewCurrentWord}
                        revealCurrentWord={this.revealThis}
                        checkCurrentWord={this.checkThis}
                        clearCurrentWord={this.clearThis}
                        revealAllWords={this.revealAll}
                        clearAllWords={this.clearEverything}
                        resetClearAllFlag={this.resetClearAllFlag}
                        resetAttempts={this.resetAttempts}
                    ></Grid>
                    <div className="clues">
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
                                        {clue}&nbsp;(
                                        {this.state.data.wordList[index].length}
                                        )
                                    </li>
                                </div>
                            );
                        })}
                    </div>
                    <div className="buttons">
                        <button className="button" onClick={this.checkThis}>
                            Check This
                        </button>
                        <button className="button" onClick={this.revealThis}>
                            Reveal This
                        </button>
                        <button className="button" onClick={this.clearThis}>
                            Clear This
                        </button>
                        <button
                            className="button check-all"
                            onClick={this.checkAnswers}
                        >
                            Check All
                        </button>
                        <button className="button" onClick={this.revealAll}>
                            Reveal All
                        </button>
                        <button
                            className="button clear-all"
                            onClick={this.clearEverything}
                        >
                            Clear All
                        </button>
                    </div>
                    <div
                        id="debugger"
                        className={this.state.debug ? "debugger" : "hide"}
                    >
                        <div id="mydivheader">[Debugger]</div>
                        <button
                            className="dbg-button"
                            onClick={this.dumpDebugData}
                        >
                            revealedWords
                        </button>
                        <button
                            className="dbg-button"
                            onClick={this.dumpDebugData}
                        >
                            attempts
                        </button>
                        <button
                            className="dbg-button"
                            onClick={this.dumpDebugData}
                        >
                            currentFocus
                        </button>
                        <button
                            className="dbg-button"
                            onClick={this.dumpDebugData}
                        >
                            currentWord
                        </button>
                    </div>
                </div>
            );
        } else {
            return <div>Loading...</div>;
        }
    }
}
