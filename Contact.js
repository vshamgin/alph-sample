/**
 * Copyright Vlad Shamgin (c) 2019
 * Alphaux Lightning Hints
 * Contact.js component
 *
 * @summary short description for the file
 * @author Vlad Shamgin <vshamgin@gmail.com>
 */
import React, { Component } from 'react';
import ReactGA from 'react-ga';

import '../styles/Contact.css';

class Contact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitDisabled: false,
            buttonSubmitVisibility: 'button-submit-visible',
            thankYouTextVisibility: 'text-thankyou-hidden'
        };

        this.subjectFormRef = React.createRef();
        this.textFormRef = React.createRef();

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    handleFormSubmit(e) {
        e.preventDefault();
        ReactGA.event({
            category: 'Contact',
            action: 'Submit attempt'
        });
        const gatewayUrl = 'https://myapi';/** */

        if(
            !this.validate(this.subjectFormRef.current.value) || 
            !this.validate(this.textFormRef.current.value)) {
            return;
        }
        const formData = JSON.stringify({
            subject: this.subjectFormRef.current.value,
            message: this.textFormRef.current.value
        });

        this.setState({
            isSubmitDisabled: true
        });
        fetch(gatewayUrl, {
            method: "POST",
            mode: 'no-cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: formData
            }
          ).then((res) => {
            this.disableControls();
          }).then(()=>{
            ReactGA.event({
                category: 'Contact',
                action: 'Submit successful'
            });
          }).catch(error => this.disableControls());
    }

    handleCancel(e) {
        e.preventDefault();
        ReactGA.event({
            category: 'Contact',
            action: 'Cancelled'
        });
        this.props.onCancelCallback();
    }
    disableControls(){
        this.setState({
            buttonSubmitVisibility: 'button-submit-hidden',
            thankYouTextVisibility: 'text-thankyou-visible'
        });
    }
    validate = (str) => {
        if(!str || str === ''){
            return false;
        }
        const trimmedString = str.replace(/^\s+|\s+$/g,'');
        if(trimmedString === '') {
            return false;
        }
        return true;
    }
    render() {
        return (
            <div className="container-content">
                <h2>Contact us</h2>
                <p>To contact us, submit your hint, suggest a new category please use the form below.</p>
                <form onSubmit={this.handleFormSubmit}>
                    <label>Subject / Topic: </label>
                    <input
                        maxLength="512"
                        type="text"
                        ref={this.subjectFormRef}
                        required
                    >
                    </input>
                    <br />
                    <label>
                         Suggest your Hint / Make comment, etc:
                    </label>
                    <textarea maxLength="2000" ref={this.textFormRef} required />
                    <span className={this.state.thankYouTextVisibility}>Thank you! You may close the form now</span>
                    <input
                        disabled={this.state.isSubmitDisabled}
                        className={this.state.buttonSubmitVisibility}
                        type="submit" 
                        value="Submit" />
                    <button className="btn-active" onClick={this.handleCancel}>Close</button>
                </form>
            </div>
        );
    }
}

export default Contact;