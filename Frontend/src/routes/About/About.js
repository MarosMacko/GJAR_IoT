import React, { useState } from "react";
import classes from "./About.module.scss";
import PcMockup from "../../assets/pc_mockup.png";
import AboutUsItem from "./AboutUsItem/AboutUsItem";
import moment from "moment";
import { motion } from "framer-motion";

const aboutUsInfo = [
    {
        name: "Daniel",
        role: "Frontend",
        text: `Pracoval som na webstránke. Mám ${moment().diff(
            "2002-01-10",
            "years"
        )} rokov. Navštevujem Gymnázium Jána Adama Raymana v Prešove a som žiakom 3.D triedy.`,
    },
    {
        name: "Maroš",
        role: "Hardware",
        text: `Pracoval som na koncepte tohto projektu a hardware pre Node jednotky. Mám ${moment().diff(
            "1999-08-19",
            "years"
        )} rokov a som už absolventom Gymnázia Jána Adama Raymana. Momentálne študujem odbor Mikroelektronika a technológie na FEKT VUT v Brne.`,
    },
    {
        name: "Samo",
        role: "Backend",
        text: `Pracoval som na softvéri a správe servera. Mám ${moment().diff(
            "1998-11-06",
            "years"
        )} rokov a som absolventom Gymnázia Jána Adama Raymana. Teraz študujem Informatiku a Fyziku na University of Edinburgh.`,
    },
    {
        name: "Miro",
        role: "Hardware",
        text: `Mojou úlohou bolo naprogramovať firmware pre Node. Som absolventom GJAR a mám ${moment().diff(
            "2000-01-21",
            "years"
        )} rokov. Momentálne som študentom Lancaster University.`,
    },
];

const About = () => {
    const [animate, setCanAnimate] = useState(false);
    return (
        <motion.div initial={{ opacity: 0 }} animate={animate ? { opacity: 1 } : {}} className={classes.Wrapper}>
            <div className={classes.Heading}>
                <h1>O projekte</h1>
            </div>
            <div className={classes.MainContent}>
                <div className={classes.ImageWrapper}>
                    <img onLoad={() => setCanAnimate(true)} onError={() => setCanAnimate(true)} src={PcMockup} alt="pc mockup" />
                </div>
                <div className={classes.InfoWrapper}>
                    <p>
                        Cieľom tohto projektu je modernizácia školy. V miestnostiach školy sa bude merať teplota vzduchu, osvetlenie a
                        vlkosť. Všetok kód je open-sоurce a je dostupný na našom githube.
                    </p>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/MarosMacko/GJAR_IoT"
                        className={classes.GithubButton}
                    >
                        <div>Github</div>
                    </a>
                </div>
            </div>
            <div className={classes.AboutUs}>
                <h1>Kto na projekte pracoval?</h1>
                {aboutUsInfo.map((info, index) => (
                    <AboutUsItem role={info.role} name={info.name} text={info.text} key={index} />
                ))}
            </div>
        </motion.div>
    );
};

export default About;
