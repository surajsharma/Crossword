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
                refs: []
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
                            answers: this.state.data.answers.concat(word.word),
                            refs: this.state.data.refs.concat(React.createRef())
                        }
                    }));
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addSolvedWord = (word) => {
        console.log("here ", word);
        this.setState(
            (prevState) => ({
                data: { ...this.state.data, attempts: word }
            }),
            console.log("Added attempt ", word)
        );
    };

    checkAnswers = () => {
        const { attempts, answers } = this.state.data;
        console.log(attempts, answers);
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

    handleClueClick = (e, index) => {
        this.state.data.refs[index].current.focus();
        console.log(this.state.data.refs);
    };

    render() {
        if (this.state.data.wordList.length > 0) {
            return (
                <React.Fragment>
                    <Grid
                        data={this.state.data}
                        addSolvedWord={this.addSolvedWord}
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
                </React.Fragment>
            );
        } else {
            return <p>Loading...</p>;
        }
    }
}
