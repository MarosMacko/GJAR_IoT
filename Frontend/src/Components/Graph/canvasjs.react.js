import React from "react";
import classes from "./Graph.module.scss";
var CanvasJS = require("./canvasjs.min");
CanvasJS = CanvasJS.Chart ? CanvasJS : window.CanvasJS;

class CanvasJSChart extends React.Component {
    static _cjsContainerId = 0;
    constructor(props) {
        super(props);
        this.options = props.options ? props.options : {};
        this.chartContainerId = "canvasjs-react-chart-container-" + CanvasJSChart._cjsContainerId++;
    }
    componentDidMount() {
        //Create Chart and Render
        this.chart = new CanvasJS.Chart(this.chartContainerId, this.options);
        this.chart.render();

        if (this.props.onRef) this.props.onRef(this.chart);
    }
    shouldComponentUpdate(nextProps, nextState) {
        //Check if Chart-options has changed and determine if component has to be updated
        return !(nextProps.options === this.options);
    }
    componentDidUpdate() {
        //Update Chart Options & Render
        this.chart.options = this.props.options;
        this.chart.render();
    }

    componentWillUnmount() {
        this.chart.destroy();
        if (this.props.onRef) this.props.onRef(undefined);
    }
    render() {
        return <div id={this.chartContainerId} className={classes.ChartContainer} />;
    }
}

var CanvasJSReact = {
    CanvasJSChart: CanvasJSChart,
    CanvasJS: CanvasJS,
};

export default CanvasJSReact;
