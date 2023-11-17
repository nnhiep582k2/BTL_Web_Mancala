import {
    handlePointerMove,
    getMovingMap,
    displayArrow,
    validateIndex,
} from "./Board_Function";
import React, { useState, useEffect } from "react";
import gameData from "../../data/InitialData";
import Card from "../Card/Card";
import Point from "../Point/Point";

export default function Board() {
    const [cardsState, setCardsData] = useState(gameData);
    const [gameState, setGamteState] = useState({
        movingLeft: false,
        isPlayerTwoNext: false,
        clickedID: 0,
        lastCardIndex: 0,
        map: [],
        player1Point: 0,
        player2Point: 0,
    });
    const [countdown, setCountdown] = useState(true);
    // Thời gian còn lại (đơn vị: giây) cho mỗi người chơi
    const [timeLeftTwoNext, setTimeLeftTwoNext] = useState({
        timeLeft: 30,
        isPlayerTwoNext: false,
    });

    const handleRePlay = () => {
        setCardsData(gameData);
        setGamteState({
            movingLeft: false,
            isPlayerTwoNext: false,
            clickedID: 0,
            lastCardIndex: 0,
            map: [],
            player1Point: 0,
            player2Point: 0,
        });
    };

    useEffect(() => {
        let timer;
        if (countdown) {
            timer = setInterval(() => {
                setTimeLeftTwoNext((prevTime) => ({
                    ...prevTime,
                    timeLeft: timeLeftTwoNext.timeLeft - 1,
                }));
            }, 1000);
        }

        // Khi thời gian còn lại hết, chuyển qua người chơi tiếp theo
        if (timeLeftTwoNext.timeLeft === 0) {
            setGamteState((prevState) => ({
                ...prevState,
                isPlayerTwoNext: !prevState.isPlayerTwoNext,
            }));
            setTimeLeftTwoNext((prevTime) => ({
                timeLeft: 30,
                isPlayerTwoNext: !prevTime.isPlayerTwoNext,
            }));
            setCountdown(true);
        }

        // Xóa interval khi component bị unmount hoặc khi chuyển người chơi
        return () => clearInterval(timer);
    }, [timeLeftTwoNext.timeLeft]);

    let changeTurn = (isP2) => {
        let sum = 0;
        if (isP2) {
            for (let index = 1; index < 6; index++) {
                sum += cardsState[index].point;
            }
        } else {
            for (let index = 6; index < 11; index++) {
                sum += cardsState[index].point;
            }
        }

        if (sum == 0) {
            setGamteState((prevState) => ({
                ...prevState,
                isPlayerTwoNext: !prevState.isPlayerTwoNext,
            }));
            setTimeLeftTwoNext((prevTime) => ({
                timeLeft: 30,
                isPlayerTwoNext: !prevTime.isPlayerTwoNext,
            }));
            setCountdown(true);
        }
    };

    // manage Game State
    let displayArrowClick = (id) => {
        if (cardsState[id - 1].point == 0) {
            return;
        }
        let newCardsState = displayArrow(id, cardsState);
        setGamteState((prevState) => ({ ...prevState, clickedID: id }));
        setCardsData(() => [...newCardsState]);
    };

    // hover arrow handle
    let hoverArrow = (isLeft) => {
        let newCardsState = cardsState;
        let direct = isLeft ? "backward" : "forward";
        let player = gameState.isPlayerTwoNext ? 2 : 1;
        let gameMap = getMovingMap(direct, player);
        let point = newCardsState[gameState.clickedID - 1].point;
        // get the locate of clicked card and add 'point' step
        let indexOfMap = validateIndex(
            gameMap.findIndex((a) => a == gameState.clickedID) + point
        );
        // get the locate of the final mutated card
        let indexLocate = gameMap[indexOfMap] - 1;
        // make the final mutated card glowing
        newCardsState[indexLocate] = {
            ...newCardsState[indexLocate],
            isGreen: true,
        };

        setGamteState((prevState) => ({
            ...prevState,
            movingLeft: direct,
            map: gameMap,
            lastCardIndex: indexLocate,
        }));
        setCardsData(() => [...newCardsState]);
    };

    // leave arrow handle
    let leaveArrow = () => {
        cardsState[gameState.lastCardIndex] = {
            ...cardsState[gameState.lastCardIndex],
            isGreen: false,
        };
        setCardsData(() => [...cardsState]);
    };

    const renderMoonEachCard = (point, newCardsState) => {
        let movingMap = gameState.map;
        let cardList = document.querySelectorAll(".card");
        let startIndex = movingMap.findIndex((a) => a == gameState.clickedID);

        for (let index = 1; index <= point; index++) {
            setTimeout(() => {
                document.getElementById("arrowClick").play();
                setCardsData(() => [...newCardsState]);

                let indexOfMap = validateIndex(startIndex + index);
                // get the locate of the card
                let indexLocate = movingMap[indexOfMap] - 1;

                // indicate which card is changing point
                cardList[indexLocate].classList.add("movingShadow");
                setTimeout(() => {
                    cardList[indexLocate].classList.remove("movingShadow");
                }, 500);

                // update card
                if (indexLocate == 0 || indexLocate == 11) {
                    newCardsState[indexLocate] = {
                        ...newCardsState[indexLocate],
                        point: newCardsState[indexLocate].point + 1,
                    };
                } else {
                    newCardsState[indexLocate] = {
                        ...newCardsState[indexLocate],
                        point: newCardsState[indexLocate].point + 1,
                        pointArr: [
                            ...newCardsState[indexLocate].pointArr,
                            newCardsState[indexLocate].point + 1,
                        ],
                    };
                }

                if (index == point) {
                    // rải quân tiếp nếu có
                    handleContinueSpread(
                        point,
                        newCardsState,
                        movingMap,
                        startIndex
                    );
                    // handleArrowClick();

                    // let result = turnResult(
                    //     newCardsState,
                    //     movingMap,
                    //     movingMap[validateIndex(startIndex + point + 1)] - 1
                    // );

                    // gameState.isPlayerTwoNext
                    //     ? setGamteState((prevState) => ({
                    //           ...prevState,
                    //           player2Point: prevState.player2Point + result,
                    //       }))
                    //     : setGamteState((prevState) => ({
                    //           ...prevState,
                    //           player1Point: prevState.player1Point + result,
                    //       }));
                }
            }, 500 * index);
        }
        return {};
    };

    // Rải quân tiếp
    const handleContinueSpread = (
        point,
        newCardsState,
        movingMap,
        startIndex
    ) => {
        let theNextId = -1;
        let theAfterNextId = -1;

        if (gameState.movingLeft == "forward") {
            for (let index = 0; index < gameState.map.length; index++) {
                let item = gameState.map[index];
                if (item === gameState.lastCardIndex + 1) {
                    theNextId = gameState.map[index + 1];
                    theAfterNextId = gameState.map[index + 2];
                    break;
                }
            }
            if (theNextId == undefined) {
                theNextId = 1;
                theAfterNextId = 2;
            }
            if (theAfterNextId == undefined && theNextId === 7) {
                theAfterNextId = 1;
            }
        } else {
            for (let index = gameState.map.length - 1; index >= 0; index--) {
                let item = gameState.map[index];
                if (item === gameState.lastCardIndex + 1) {
                    theNextId = gameState.map[index + 1];
                    theAfterNextId = gameState.map[index + 2];
                    break;
                }
            }
            if (theNextId == undefined) {
                theNextId = 7;
                theAfterNextId = 8;
            }
            if (theAfterNextId == undefined && theNextId === 1) {
                theAfterNextId = 7;
            }
        }

        let theNextPoint =
            theNextId &&
            newCardsState.filter((item) => item.id === theNextId)[0].point;
        let theAfterNextPoint =
            theAfterNextId &&
            newCardsState.filter((item) => item.id === theAfterNextId)[0].point;

        if (theNextPoint > 0) {
            // Rải tiếp và đệ quy
            // resetSquare(theNextId, newCardsState);
            // renderMoon(point, theNextId, theNextPoint, newCardsState);
            const gameStateNext = gameState;
            gameState["clickedID"] = theNextId;

            handleArrowClick(newCardsState);
        } else if (theNextPoint === 0 && theAfterNextPoint > 0) {
            // Ăn
            let result = turnResult(
                newCardsState,
                movingMap,
                movingMap[validateIndex(startIndex + point + 1)] - 1
            );
            gameState.isPlayerTwoNext
                ? setGamteState((prevState) => ({
                      ...prevState,
                      player2Point: prevState.player2Point + result,
                      isPlayerTwoNext: true,
                  }))
                : setGamteState((prevState) => ({
                      ...prevState,
                      player1Point: prevState.player1Point + result,
                      isPlayerTwoNext: false,
                  }));
            setTimeLeftTwoNext((prevTime) => ({
                timeLeft: 30,
                isPlayerTwoNext: !prevTime.isPlayerTwoNext,
            }));
            setCountdown(true);
            return;
        } else if (theNextPoint === 0 && theAfterNextPoint === 0) {
            return;
        }
    };

    const renderMoonAfterBorrow = (point, newCardsState) => {
        let movingMap = gameState.map;
        let cardList = document.querySelectorAll(".card");

        for (let index = 1; index < 6; index++) {
            setTimeout(() => {
                document.getElementById("arrowClick").play();
                setCardsData(() => [...newCardsState]);

                let indexOfMap = validateIndex(index);
                // get the locate of the card
                let indexLocate = movingMap[indexOfMap] - 1;

                // indicate which card is changing point
                cardList[indexLocate].classList.add("movingShadow");
                setTimeout(() => {
                    cardList[indexLocate].classList.remove("movingShadow");
                }, 500);

                // update card
                if (indexLocate == 0 || indexLocate == 11) {
                    newCardsState[indexLocate] = {
                        ...newCardsState[indexLocate],
                        point: newCardsState[indexLocate].point + 1,
                    };
                } else {
                    newCardsState[indexLocate] = {
                        ...newCardsState[indexLocate],
                        point: newCardsState[indexLocate].point + 1,
                        pointArr: [
                            ...newCardsState[indexLocate].pointArr,
                            newCardsState[indexLocate].point + 1,
                        ],
                    };
                }

                if (index == point) {
                    let result = turnResult(
                        newCardsState,
                        movingMap,
                        movingMap[validateIndex(1 + point + 1)] - 1
                    );

                    gameState.isPlayerTwoNext
                        ? setGamteState((prevState) => ({
                              ...prevState,
                              player2Point: prevState.player2Point + result,
                          }))
                        : setGamteState((prevState) => ({
                              ...prevState,
                              player1Point: prevState.player1Point + result,
                          }));
                }
            }, 500 * index);
        }
    };

    // Cơ chế rải nếu hết quân - Chưa render lại giao diện
    const borrowPieces = (point, newCardsState) => {
        setTimeout(() => {
            if (!gameState.isPlayerTwoNext) {
                // Player 1
                let isAllEmpty = newCardsState
                    .filter((item) => {
                        if ([2, 3, 4, 5, 6].includes(item.id)) return item;
                    })
                    .every((card) => card.point === 0);
                if (isAllEmpty) {
                    setGamteState((prevState) => ({
                        ...prevState,
                        player1Point: prevState.player1Point - 5,
                    }));
                    let tempState = newCardsState.map((item) => {
                        if ([2, 3, 4, 5, 6].includes(item.id)) {
                            return {
                                ...item,
                                displayLeftArrow: false,
                                displayRightArrow: false,
                                point: item.point + 1,
                            };
                        }
                        return item;
                    });
                    setCardsData(() => [...tempState]);
                    renderMoonAfterBorrow(point, newCardsState);
                }
            } else {
                // Player 2
                let isAllEmpty = newCardsState
                    .filter((item) => {
                        if ([7, 8, 9, 10, 11].includes(item.id)) return item;
                    })
                    .every((card) => card.point === 0);
                if (isAllEmpty) {
                    setGamteState((prevState) => ({
                        ...prevState,
                        player2Point: prevState.player2Point - 5,
                    }));
                    let tempState = newCardsState.map((item) => {
                        if ([7, 8, 9, 10, 11].includes(item.id)) {
                            return {
                                ...item,
                                displayLeftArrow: true,
                                displayRightArrow: true,
                                point: item.point + 1,
                            };
                        }
                        return item;
                    });
                    setCardsData(() => [...tempState]);
                    renderMoonAfterBorrow(point, newCardsState);
                }
            }
        }, 600 * point);
    };

    // arrow click handle
    let arrowClick = (newCardsStateCurrent) => {
        let newCardsState = cardsState;
        let point = newCardsState[gameState.clickedID - 1].point;

        newCardsState[gameState.clickedID - 1] = {
            ...newCardsState[gameState.clickedID - 1],
            point: 0,
            pointArr: [],
        };
        setCountdown(false);
        if (newCardsStateCurrent) {
            newCardsState = newCardsStateCurrent;
            point = newCardsState[gameState.clickedID - 1].point;
        }
        if (
            (gameState.lastCardIndex === 6 &&
                gameState.movingLeft === "forward") ||
            (gameState.lastCardIndex === 5 &&
                gameState.movingLeft === "forward") ||
            (gameState.lastCardIndex === 10 &&
                gameState.movingLeft === "backward") ||
            (gameState.lastCardIndex === 1 &&
                gameState.movingLeft === "backward")
        ) {
            point -= 10;
            newCardsState[gameState.clickedID - 1] = {
                ...newCardsState[gameState.clickedID - 1],
                point: 10,
                pointArr: [0],
            };
        } else {
            newCardsState[gameState.clickedID - 1] = {
                ...newCardsState[gameState.clickedID - 1],
                point: 0,
                pointArr: [],
            };
        }

        newCardsState = newCardsState.map((card) => ({
            ...card,
            isChoosen: false,
            displayLeftArrow: false,
            displayRightArrow: false,
            isGreen: false,
        }));

        renderMoonEachCard(point, newCardsState);

        setTimeout(() => {
            setGamteState((prevState) => ({
                ...prevState,
                isPlayerTwoNext: !prevState.isPlayerTwoNext,
            }));
            changeTurn(gameState.isPlayerTwoNext);
        }, 500 * point);

        borrowPieces(point, newCardsState);
    };

    const handleArrowClick = (newCardsStateCurrent) => {
        let newCardsState = newCardsStateCurrent;
        let direct = gameState.movingLeft;
        let player = gameState.isPlayerTwoNext ? 2 : 1;
        let gameMap = getMovingMap(direct, player);
        let point = newCardsState[gameState.clickedID - 1].point;
        if (
            (gameState.lastCardIndex === 6 &&
                gameState.movingLeft === "forward") ||
            (gameState.lastCardIndex === 5 &&
                gameState.movingLeft === "forward") ||
            (gameState.lastCardIndex === 10 &&
                gameState.movingLeft === "backward") ||
            (gameState.lastCardIndex === 1 &&
                gameState.movingLeft === "backward")
        ) {
            point -= 10;
            debugger;
        }
        // get the locate of clicked card and add 'point' step
        let indexOfMap = validateIndex(
            gameMap.findIndex((a) => a == gameState.clickedID) + point
        );
        // get the locate of the final mutated card
        let indexLocate = gameMap[indexOfMap] - 1;
        // make the final mutated card glowing
        newCardsState[indexLocate] = {
            ...newCardsState[indexLocate],
            isGreen: true,
        };
        const gameStateClone = gameState;
        gameStateClone["movingLeft"] = direct;
        gameStateClone["map"] = gameMap;
        gameStateClone["lastCardIndex"] = indexLocate;
        setGamteState(gameStateClone);
        arrowClick(newCardsStateCurrent);
    };

    let turnResult = (cardState, movingMap, nextCardIndex) => {
        // console.log("cardState turn:", cardState);
        let point = cardState[nextCardIndex].point;
        if (point != 0) {
            return 0;
        } else {
            // Exp :  move from Card 6 -> Card 7 (5,4,3,2,1,7)
            //      check point = Card 8.point == 0 ? getPoint(Card 9) && ++ checkPoint : return (-2-)
            //      while checkPoint == 0 => loop (-2-)
            let checkPoint = 0;
            let cardList = document.querySelectorAll(".card");
            let getPointCardIndex;
            // get which card is next
            let mapIndex = validateIndex(
                movingMap.findIndex((a) => a == nextCardIndex + 1)
            );

            cardState = cardState.map((card) => ({
                ...card,
                isChoosen: false,
                displayLeftArrow: false,
                displayRightArrow: false,
                isGreen: false,
            }));

            while (checkPoint == 0) {
                // know which card of being gotten point
                mapIndex = validateIndex(mapIndex + 1);
                // then get the index of that card
                getPointCardIndex = movingMap[mapIndex] - 1;

                if (cardState[getPointCardIndex].point == 0) {
                    return point;
                }
                point += cardState[getPointCardIndex].point;

                getPointCardIndex == 0 || getPointCardIndex == 11
                    ? (cardState[getPointCardIndex] = {
                          ...cardState[getPointCardIndex],
                          point: 0,
                      })
                    : (cardState[getPointCardIndex] = {
                          ...cardState[getPointCardIndex],
                          point: 0,
                          pointArr: [],
                      });

                // console.log("cardState:", cardState);
                setCardsData(() => [...cardState]);
                document.getElementById("getPoint").play();
                cardList[getPointCardIndex].classList.add("movingShadow");
                setTimeout(() => {
                    cardList[getPointCardIndex].classList.remove(
                        "movingShadow"
                    );
                }, 500);

                // know which card of being gotten point
                mapIndex = validateIndex(mapIndex + 1);
                // then get the index of that card
                getPointCardIndex = movingMap[mapIndex] - 1;
                checkPoint = cardState[getPointCardIndex].point;
            }

            return point;
        }
    };

    let renderCards = cardsState.map((item) => (
        <Card
            key={item.id + "card"}
            data={item}
            isPlayerTwoNext={gameState.isPlayerTwoNext}
            cardClick={() => displayArrowClick(item.id)}
            hoverArrow={() => hoverArrow(item.displayLeftArrow)}
            leaveArrow={() => leaveArrow()}
            clickArrow={() => arrowClick()}
            isPlayMachine={false}
        />
    ));
    const isEndGame =
        (cardsState[0].point === 0 && cardsState[11].point === 0) ||
        gameState.player1Point > 35 ||
        gameState.player2Point > 35;

    class Option {
        position; // vị trí của ô được click (trong khoảng 2->6)
        direct; // hướng đi
        point; // số điểm ăn được
    }

   

    return (
        <>
            {isEndGame && (
                <button onClick={handleRePlay} className="replay">
                    Chơi lại
                </button>
            )}
            <div className="container">
                <Point
                    isPlayerTwoNext={gameState.isPlayerTwoNext}
                    p1Point={gameState.player1Point}
                    p2Point={gameState.player2Point}
                    isEndGame={isEndGame}
                    timeLeft={timeLeftTwoNext.timeLeft}
                    isPlayer={timeLeftTwoNext.isPlayerTwoNext}
                    isPlayMachine={false}
                />
                <div
                    id="board"
                    className={`${isEndGame ? "disable" : ""}`}
                    onPointerMove={(e) => handlePointerMove(e)}
                >
                    {renderCards}
                </div>
                {/* <button id="testBtn" onClick={() => reportPoint()}>
            Get Total Point
        </button> */}
            </div>
        </>
    );
}
