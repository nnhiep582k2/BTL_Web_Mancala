import React from "react";
import BoardMachine from "../components/Board/BoardMachine";

const MachinePage = () => {
    return (
        <div className="container-board">
            <div className="game">
                {/* Sound effect */}
                <audio id="arrowClick">
                    <source src="/sound/card.mp3" type="audio/mpeg" />
                </audio>
                <audio id="getPoint">
                    <source src="/sound/get-point.mp3" type="audio/mpeg" />
                </audio>
                <audio id="winnerAu">
                    <source src="/sound/winner.mp3" type="audio/mpeg" />
                </audio>

                {/* Board */}
                <BoardMachine />

                {/* Winning */}
                <div className="sparkle">
                    <div className="fire-flies">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>

            {/* Group information */}
            <div className="group-name">Group 2</div>
        </div>
    );
};

export default MachinePage;
