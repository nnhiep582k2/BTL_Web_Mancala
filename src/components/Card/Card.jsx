import React from 'react';
import Ufo from '../SVG/Ufo';

export default function Square(props) {
    let renderMoon = props.data.pointArr.map((p) => (
        <div className="moon" key={p + 'moon'}>
            <div className="craters"></div>
        </div>
    ));

    let renderArrow = (leftArrow) => {
        if (leftArrow) {
            return (
                <img
                    className="arrow-left"
                    src="/src/assets/images/arrow-left.png"
                    alt="Arrow Left"
                />
            );
        } else {
            return (
                <img
                    className="arrow-right"
                    src="/src/assets/images/arrow-right.png"
                    alt="Arrow Right"
                />
            );
        }
    };

    return (
        <>
            {props.data.isUFO ? (
                <div
                    className={`card ${
                        props.data.isGreen ? 'locateShadow' : ''
                    }`}
                    onClick={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.clickArrow
                            : null
                    }
                    onMouseEnter={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.hoverArrow
                            : null
                    }
                    onMouseLeave={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.leaveArrow
                            : null
                    }
                >
                    <div className="card-content">
                        {!props.data.displayLeftArrow &&
                        !props.data.displayRightArrow ? (
                            <Ufo point={props.data.point} isUFO={props.data.isUFO}/>
                        ) : (
                            renderArrow(props.data.displayLeftArrow)
                        )}
                    </div>
                </div>
            ) : props.data.id >= 2 && props.data.id <= 6 ? (
                // Player 1 Cards
                <div
                    className={`card ${
                        props.data.isChoosen ? 'choosing-state' : ''
                    } ${props.isPlayerTwoNext ? 'not-allowed' : ''}  ${
                        props.data.isGreen ? 'locateShadow' : ''
                    } `}
                    onClick={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.clickArrow
                            : props.isPlayerTwoNext
                            ? null
                            : props.cardClick
                    }
                    onMouseEnter={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.hoverArrow
                            : null
                    }
                    onMouseLeave={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.leaveArrow
                            : null
                    }
                >
                    <div
                        className={`card-content ${
                            props.isPlayerTwoNext ? 'new-moon' : ''
                        }`}
                    >
                        {!props.data.displayLeftArrow &&
                        !props.data.displayRightArrow
                            ? renderMoon
                            : renderArrow(props.data.displayLeftArrow)}
                    </div>
                </div>
            ) : (
                // Player 2 Cards
                <div
                    className={`card ${
                        props.data.isChoosen ? 'choosing-state' : ''
                    } ${props.isPlayerTwoNext ? '' : 'not-allowed'} ${
                        props.data.isGreen ? 'locateShadow' : ''
                    }`}
                    onClick={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.clickArrow
                            : props.isPlayerTwoNext
                            ? props.cardClick
                            : null
                    }
                    onMouseEnter={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.hoverArrow
                            : null
                    }
                    onMouseLeave={
                        props.data.displayLeftArrow ||
                        props.data.displayRightArrow
                            ? props.leaveArrow
                            : null
                    }
                >
                    <div
                        className={`card-content ${
                            props.isPlayerTwoNext ? '' : 'new-moon'
                        }`}
                    >
                        {!props.data.displayLeftArrow &&
                        !props.data.displayRightArrow
                            ? renderMoon
                            : renderArrow(props.data.displayLeftArrow)}
                    </div>
                </div>
            )}
        </>
    );
}
