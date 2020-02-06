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
                clues: []
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
                    this.setState({
                        data: {
                            ...data,
                            wordList: this.state.data.wordList.concat(word),
                            clues: this.state.data.clues.concat(word.clue)
                        }
                    });
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    checkAnswers = () => {
        console.log("check answers");
    };

    render() {
        if (this.state.data.wordList.length > 0) {
            return (
                <React.Fragment>
                    <Grid data={this.state.data}></Grid>
                    {this.state.data.clues.map((clue) => {
                        return (
                            <li key={clue} onClick={this.handleClueClick}>
                                {clue}
                            </li>
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
