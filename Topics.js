/**
 * Copyright Vlad Shamgin (c) 2019
 * Alphaux Lightning Hints
 * Topics.js component
 *
 * @summary short description for the file
 * @author Vlad Shamgin <vshamgin@gmail.com>
 *
 * Created at     : 2019-05-27
 */
import React, { Component } from 'react';
import '../styles/Topics.css';

class Topics extends Component {
    constructor(props) {
        super(props);
        this.model = {
            topics:[
                {
                    id: 'alph4t2',
                    name: 'JavaScript',
                    url: '/alph4t2'
                },
                {
                    id: 'alph4t1',
                    name: 'Excuses from Work :)',
                    url: '/alph4t2'
                },
                {
                    id: null,
                    name: 'More is coming soon!',
                    url: ''
                }
            ]
        };
        this.state = {
            currentTopic: this.model.topics[0] /** set default topic */
        };
        this.prevSelected = null;
        this.onTopicClick= this.handleTopicClick.bind(this);
    }
    componentDidMount() {
        this.props.onTopicsMountCallback(this.getDefaultTopic());
    }
    getDefaultTopic = () => {
        return this.state.currentTopic;
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
                Choose Hints Category:
                </span>
                <div>
                    {this.createTopicsList()}
                </div>
            </div>
        );
    }
}

export default Topics;