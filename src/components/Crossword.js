import React, { Component } from "react";
import Grid from "./Grid";
export default class Crossword extends Component {
    // {'length': 10,
    // 'breadth': 12,
    // 'wordList': [{'word': 'Word1', 'orientation': 'down', 'x': 3, 'y': 2, 'length': 5}]}

    constructor(props) {
        super(props);

        this.state = {
            data: {
                height: 12,
                width: 12,
                wordList: [
                    {
                        word: "Word1",
                        orientation: "down",
                        x: 2,
                        y: 1,
                        length: 5
                    },
                    {
                        word: "Word2",
                        orientation: "across",
                        x: 1,
                        y: 2,
                        length: 5
                    }
                ]
            }
        };
    }

    render() {
        return (
            <div>
                <Grid data={this.state.data}></Grid>
            </div>
        );
    }
}
