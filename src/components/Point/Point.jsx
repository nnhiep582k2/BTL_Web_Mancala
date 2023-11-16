import React from "react";

export default function Point({
    isPlayerTwoNext,
    p1Point,
    p2Point,
    isEndGame,
    timeLeft,
    isPlayer,
    isPlayMachine,
}) {
    let congratSound = () => {
        if (isEndGame) {
            setTimeout(() => {
                document.getElementById("winnerAu").play();
            }, 300);
            return isPlayMachine ? (
                <div>
                    <h3>Player {p1Point > p2Point ? "" : "machine"} won</h3>
                    <div className="winner_detail">
                        <h2>Player: {p1Point} points</h2>
                        <h2>Machine: {p2Point} points</h2>
                    </div>
                </div>
            ) : (
                <div>
                    <h3>Player {p1Point > p2Point ? 1 : 2} won</h3>
                    <div className="winner_detail">
                        <h2>Player 1: {p1Point} points</h2>
                        <h2>Player 2: {p2Point} points</h2>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={`gameState ${isEndGame ? "show_winner" : null} `}>
            <div className="playerState">
                <div
                    className={`player ${
                        isPlayerTwoNext ? null : "currentPlayer"
                    }`}
                >
                    {isPlayMachine ? "Player" : "P1"}

                    {!isPlayer && <p className="currentPlayer">{timeLeft}</p>}
                </div>
                <p className="point">{p1Point}</p>
                <h3>vs</h3>
                <p className="point">{p2Point}</p>
                <div
                    className={`player ${
                        isPlayerTwoNext ? "currentPlayer" : null
                    }`}
                >
                    {isPlayMachine ? "Machine" : "P2"}
                    {isPlayer && <p className="currentPlayer">{timeLeft}</p>}
                </div>
            </div>

            <div className="winner_notification">{congratSound()}</div>
        </div>
    );
}
