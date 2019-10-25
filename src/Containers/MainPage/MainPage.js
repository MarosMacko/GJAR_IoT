import React, {Component} from 'react';
import Boxes from '../../Components/Boxes/Boxes';
import Graph from '../../Components/Graph/Graph';
import classes from './MainPage.module.css';

class MainPage extends Component {

    render() {
        return (
            <div className={classes.MainPage}>
                <Boxes 
                    temperature={this.props.values.temperature[this.props.values.temperature.length - 1]}
                    humidity={this.props.values.humidity[this.props.values.humidity.length - 1]}
                    brightness={this.props.values.brightness[this.props.values.brightness.length - 1]}
                />
                <Graph
                    temperature={this.props.values.temperature}
                    humidity={this.props.values.humidity}
                    brightness={this.props.values.brightness}
                    time={this.props.values.times}
                />
            </div>
        )
    }
}


export default MainPage;

