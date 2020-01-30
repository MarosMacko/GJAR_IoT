import React from 'react';
import classes from './AboutUsPage.module.css';
import wemos from '../../assets/img/wemos.jpg';
import moment from 'moment';

const aboutUsPage = () => (
	<div className={classes.whitebox}>
		<div className={classes.aboutProject}>
			<div className={classes.image}>
				<img src={wemos} alt="wemos" />
			</div>
			<div className={classes.aboutProjectText}>
				<p>
					Cieľom tohto projektu je modernizácia školy. V miestnostiach školy sa bude merať teplota vzduchu,
					osvietenosť a vlkosť.
				</p>
			</div>
		</div>
		<div className={classes.about_us_title}>Na projekte pracovali:</div>
		<div className={classes.about_us}>
			<div>
				<h2>Maroš</h2>
				<p>
					Pracoval som na koncepte tohto projektu a hardware pre Node jednotky. Mám{' '}
					{moment().diff('1999-08-19', 'years')} rokov a som už absolventom Gymnázia Jána Adama Raymana.
					Momentálne študujem odbor Mikroelektronika a technológie na FEKT VUT v Brne.
				</p>
			</div>
			<div>
				<h2>Samo</h2>
				<p>
					Pracoval som na softvéri a správe servera. Mám {moment().diff('1998-11-06', 'years')} rokov a som
					absolventom Gymnázia Jána Adama Raymana. Teraz študujem Informatiku a Fyziku na University of
					Edinburgh.
				</p>
			</div>
			<div>
				<h2>Daniel</h2>
				<p>
					Pracoval som na webstránke. Mám {moment().diff('2002-01-10', 'years')} rokov. Navštevujem Gymnázium
					Jána Adama Raymana v Prešove a som žiakom 3.D triedy.
				</p>
			</div>
			<div>
				<h2>Miro</h2>
				<p>
					Mojou úlohou bolo naprogramovať firmware pre Node. Som absolventom GJAR a mám{' '}
					{moment().diff('2000-01-21', 'years')} rokov.
				</p>
			</div>
		</div>
	</div>
);

export default aboutUsPage;
