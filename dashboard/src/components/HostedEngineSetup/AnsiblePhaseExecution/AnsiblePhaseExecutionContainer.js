import PropTypes from 'prop-types';
import React, { Component } from 'react'
import { deploymentStatus as status } from '../constants';
import AnsiblePhaseExecutor from "../../../helpers/HostedEngineSetup/AnsiblePhaseExecutor";
import AnsiblePhaseExecution from './AnsiblePhaseExecution'

class AnsiblePhaseExecutionContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phaseExecutionStatus: status.RUNNING,
            output: {lines: []},
            terminated: false
        };

        this.parseOutput = this.parseOutput.bind(this);
        this.processExit = this.processExit.bind(this);
        this.resetState = this.resetState.bind(this);
        this.restart = this.restart.bind(this);

        this.phaseExecutor = new AnsiblePhaseExecutor(this.props.abortCallBack, this.props.heSetupModel);
    }

    componentWillMount() {
        this.phaseExecutor.startSetup(this.props.phase, this.parseOutput, this.processExit);
    }

    restart() {
        this.resetState();
        this.phaseExecutor.startSetup(this.props.phase, this.parseOutput, this.processExit);
    }

    resetState() {
        this.setState({
            phaseExecutionStatus: status.RUNNING,
            terminated: false,
            output: {lines: []}
        });
    }

    processExit(executionStatus) {
        const newState = {};
        newState.phaseExecutionStatus = executionStatus === status.SUCCESS ? status.SUCCESS : status.FAILURE;
        newState.terminated = true;
        this.setState(newState);
        this.props.terminationCallBack(newState.phaseExecutionStatus, this.restart);
    }

    parseOutput(data) {
        let output = this.state.output;
        output.lines = output.lines.concat(data.lines);
        this.setState({ output });
    }

    render() {
        return <AnsiblePhaseExecution phaseExecutionStatus={this.state.phaseExecutionStatus}
                                      isLastStep={this.props.isLastStep}
                                      output={this.state.output} />
    }
}

AnsiblePhaseExecutionContainer.propTypes = {
    abortCallBack: PropTypes.func.isRequired,
    heSetupModel: PropTypes.object.isRequired,
    phase: PropTypes.string.isRequired
};

export default AnsiblePhaseExecutionContainer;