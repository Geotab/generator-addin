import React from "react";
import { Banner } from "@geotab/zenith";

export const Tab1Content = () => {
    return <>
        <Banner type="warning" size="XL" icon={true}>Banner text</Banner>
        <div className="zda-app__sections">
            <section className="zda-section">
                <h3 className="zda-section__header heading-02-mobile-drive">Section heading</h3>
                <p className="zda-section__content body-02-short-mobile-drive">Section content</p>
            </section>

            <section className="zda-section">
                <h3 className="zda-section__header heading-02-mobile-drive">Section heading</h3>
                <p className="zda-section__content body-02-short-mobile-drive">Section content</p>
            </section>

            <section className="zda-section">
                <h3 className="zda-section__header heading-02-mobile-drive">Section heading</h3>
                <p className="zda-section__content body-02-short-mobile-drive">Section content</p>
            </section>
        </div>
    </>;
};