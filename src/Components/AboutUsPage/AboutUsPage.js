import React from 'react';
import classes from './AboutUsPage.module.css';
import wemos from '../../assets/img/wemos.jpg'

const aboutUsPage = () => (
    <div className={classes.whitebox}>
        <div className={classes.aboutProject}>
            <div className={classes.image}>
                <img src={wemos} alt="wemos"/>
            </div>
            <div className={classes.aboutProjectText}>
                <p>Cieľom tohto projektu je modernizácia školy. V miestnostiach školy sa bude merať teplota vzduchu, osvietenosť a vlkosť.</p>
            </div>
        </div>
        <div className={classes.about_us_title}>Na projekte pracovali:</div>
        <div className={classes.about_us} >
            <div>
                <h2>Maroš</h2>
                <p>Pracoval som na koncepte tohto projektu a hardware pre Node jednotky. Mám 19 rokov a som absolvent Gymnázia Jána Adama Raymana.</p>
            </div>
            <div>
                <h2>Samo</h2>
                <p>Pracoval som na softvéri a správe servera. Mám 20 rokov a som absolventom Gymnázia Jána Adama Raymana.</p>
            </div>
            <div>
                <h2>Daniel</h2>
                <p>Pracoval som na webstránke. Mám 17 rokov. Navštevujem Gymnázium Jána Adama Raymana v Prešove a som žiakom 3.D triedy.</p>
            </div>
            <div>
                <h2>Miro</h2>
                <p>Pracoval som na softvéri pre Node. Mám 18 rokov. Navštevujem Gymnázium Jána Adama Raymana v Prešove a som žiakom 4.C triedy.</p>
            </div>
        </div>
    </div>
)

export default aboutUsPage;