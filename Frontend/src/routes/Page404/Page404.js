import React from "react";
import "./Page404.scss";
import {NavLink} from 'react-router-dom'

const Page404 = () => {
    return (
        <div className="Wrapper">
            <Ghost></Ghost>
            <h1>Ľutujeme, stránka sa nenašla</h1>
            <p>Stránka, ktorú hľadáte, nie je k dispozícii. Skontrolujte prosím zadanú url.</p>
            <NavLink className="GoBackButton" onClick={() => {}} to={"/"} activeClassName="ActiveGoBackButton">
                <div>Späť na hlavnú stránku</div>
            </NavLink>
        </div>
    );
};

const Ghost = () => (
    <div class="box__ghost">
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>

        <div class="box__ghost-container">
            <div class="box__ghost-eyes">
                <div class="box__eye-left"></div>
                <div class="box__eye-right"></div>
            </div>
            <div class="box__ghost-bottom">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="box__ghost-shadow"></div>
    </div>
);

export default Page404;
