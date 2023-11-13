import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="main">
            <div className="wrap__option">
                <Link to={'/machine'} className="btn__option">
                    Chơi với máy
                </Link>
                <Link to={'/people'} className="btn__option">
                    Chơi 2 người
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
