
import React from "react";
import "../../styles/zenithSummary.css";

export const ZenithSummary = () => {
    return <div className="za-zenith-summary">

        <div className="za-zenith-summary__row">
            <span className="body-04 za-zenith-summary__label">Current version</span>
            <span className="body-02-short za-zenith-summary__value">1.15.0</span>
        </div>

        <div className="za-zenith-summary__row">
            <span className="body-04 za-zenith-summary__label">Amount of components</span>
            <span className="body-02-short za-zenith-summary__value">24</span>
        </div>

        <div className="za-zenith-summary__row">
            <span className="body-04 za-zenith-summary__label">Release date</span>
            <span className="body-02-short za-zenith-summary__value">February 25, 2025</span>
        </div>

        <div className="za-zenith-summary__row">
            <span className="body-04 za-zenith-summary__label">Documentation</span>
            <span className="body-02-short za-zenith-summary__value">
                <a href="https://developers.geotab.com/zenith-storybook/" target="_blank">Storybook</a>
            </span>
        </div>
    </div>;
};