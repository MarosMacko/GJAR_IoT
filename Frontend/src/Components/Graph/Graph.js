import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import classes from './Graph.module.css';

class Graph extends Component {
    state = {
        chartData: {
            labels: this.props.time,
            datasets: [{
                    label: 'Teplota',
                    data: this.props.temperature,
                    fill: true,
                    backgroundColor: 'rgba(85, 186, 254, .3)',
                    borderWidth: 4,
                    borderColor: '#55D8FE',
                }, {
                    label: 'Vlhkosť',
                    data: this.props.humidity,
                    fill: true,
                    backgroundColor: 'rgba(163, 160, 251, .3)',
                    borderWidth: 4,
                    borderColor: '#A3A0FB',
                },{
                    label: 'Osvietenosť',
                    data: this.props.brightness,
                    fill: true,
                    backgroundColor: 'rgba(94, 226, 160, .3)',
                    borderWidth: 4,
                    borderColor: '#5EE2A0',
            }],
        }
    }

    render() {
        return (
            <div className={classes.Graph}>
                <Line 
                    data={this.state.chartData}
                    options={{ responsive: true, maintainAspectRatio: false, legend: {position: 'bottom'}}}
                />
            </div>
        );
    }
};

export default Graph;