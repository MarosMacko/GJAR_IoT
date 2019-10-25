import React, {Component} from 'react';
import classes from './Box.module.css';
import blueChart from '../../../assets/img/bluechart.svg'
import greenChart from '../../../assets/img/greenchart.svg'
import purpleChart from '../../../assets/img/purplechart.svg'

class Box extends Component {

    render() {
        let graphImage = null;
        let index = null;
        let title =  null;
        if(this.props.type === 'temperature') {
            title = "Aktuálna teplota";
            index = '°C';
            graphImage = <img src={blueChart} alt="chart"/>
        } else if(this.props.type === 'humidity') {
            title = "Aktuálna vlhkosť";
            index = '%';
            graphImage = <img src={purpleChart} alt="chart"/>
        } else if(this.props.type === 'brightness') {
            title = 'Aktuálna osvietenosť';
            index = '%';
            graphImage = <img src={greenChart} alt="chart"/>
        }
        return (
            <div className={classes.Whitebox}>
                <p>{title}</p>
                <h1>{this.props.value}{index}</h1>
                <div className={classes.Icon}>
                    {graphImage}
                </div>
            </div>
        )
    }
}

export default Box;

