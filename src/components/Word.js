import React, { Component } from "react";
import Cell from "./Cell";
import styled from "styled-components";

export default class Word extends Component {
    const;
    render() {
        const word = this.props.word.split("");

        if (this.props.orientation === "down") {
            return (
                <div className="vword xoffset yoffset">
                    {word.map((char) => {
                        return <Cell value={char} key={Math.random()} />;
                    })}
                </div>
            );
        }

        if (this.props.orientation === "across") {
            return (
                <div className="hword xoffset yoffset">
                    {word.map((char) => {
                        return <Cell value={char} key={Math.random()} />;
                    })}
                </div>
            );
        }
    }
}
