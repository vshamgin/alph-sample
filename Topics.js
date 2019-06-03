/**
 * Copyright Vlad Shamgin (c) 2019
 * Alphaux Lightning Hints
 * Topics.js component
 *
 * @summary short description for the file
 * @author Vlad Shamgin <vshamgin@gmail.com>
 */
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import '../styles/Topics.css';

class Topics extends Component {
    constructor(props) {
        super(props);
        this.model = {
            topics:[]
        };
        this.state = {
            currentTopic: {},
            showHideLoadingStatus: 'show-loading-status'
        };
        this.topicsAPIUrl = '/getTopics';
        this.prevSelected = null;
        this.onTopicClick= this.handleTopicClick.bind(this);
        this.loadingStatusText = React.createRef();
    }
    componentDidMount() {
        this.initModel();
    }
    initModel=()=>{
        new Promise((resolve, reject) =>{
            fetch(this.topicsAPIUrl)
            .then(res => res.text())
            .then(res => {
                resolve(res);
            }).catch(err => err) /** todo: load fallback model */
        }).then((modelFromResponse)=>{
            this.model = JSON.parse(modelFromResponse).body;
            this.setState({
                currentTopic: this.model.topics[0], /** set default topic */
                showHideLoadingStatus: 'hide-loading-status'
            });
            this.props.onTopicsMountCallback(this.state.currentTopic);
        }).catch((error)=>{
            /* fallback model */
            this.model = {
                topics:[
                    {
                        id: 'error',
                        name: 'Error',
                        url: ''
                    }
                ]
            }
        });
    }
    handleTopicClick = (e) => {
        e.currentTarget.className = 'topic-button-clicked';
        if(this.prevSelected && this.prevSelected !== e.currentTarget){
            this.prevSelected.className = 'topic-button-default';
        }
        const topicName = e.currentTarget.name;
        let newTopic = {};
        this.model.topics.forEach((value, key)=>{
            if(value.id === topicName){
                Object.assign(newTopic, this.model.topics[key]);
            }
        });
        this.setState({
            currentTopic: newTopic
        });

        this.prevSelected = e.currentTarget;

        ReactGA.event({
            category: 'Topic selected',
            action: topicName
        });
        this.props.onClickCallback(newTopic);
    }
    getButtonClassName = (el) => {
        if(el.id===null) {
            return 'topic-button-disabled';
        } else if (this.state.currentTopic.id === el.id) {
            return 'topic-button-clicked';
        } else {
            return 'topic-button-default';
        }
    }
    createTopicsList = () => {
        const items = [];
        this.model.topics.forEach((value, key)=>{
            items.push(
                <button key={`button-topic-key-${key}`} 
                    name={this.model.topics[key].id} 
                    disabled={(this.model.topics[key].id===null) ? true : false}
                    onClick={this.handleTopicClick}
                    className={this.getButtonClassName(this.model.topics[key])}
                >
                {this.model.topics[key].name}
                </button>
            );
        });
        return items;
    }
    render() {
        return (
            <div className="topics-list-container">
                <span className="topics-selected-text">
                Choose Lightning Hints topic:
                </span>
                <div className="topics-list-content">
                    <span className={this.state.showHideLoadingStatus}>loading..</span>
                    {this.createTopicsList()}
                </div>
            </div>
        );
    }
}

export default Topics;