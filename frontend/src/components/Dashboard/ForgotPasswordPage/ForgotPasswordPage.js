import React, { Component } from 'react';

import 'components/Dashboard/ForgotPasswordPage/ForgotPasswordPage.css';

class ForgotPasswordPage extends Component {
  state = {
    email: '',
    emailSentSuccessfully: false,
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/email/reset', {
      method: 'POST',
      body: JSON.stringify({email: this.state.email}),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => {
      console.log(res);
      this.setState({emailSentSuccessfully: true});
    }).catch(error => console.error(error));
  }

  render() {
    const { emailSentSuccessfully } = this.state;

    return (
      <div className="ForgotPasswordPage">
        { !emailSentSuccessfully &&
        <div className="ForgotPasswordPage__form-controls">
          <h1> Reset your password </h1>
          <form
            onSubmit={this.handleSubmit}
          >
            <input
              type="text"
              value={this.state.email}
              placeholder="Email"
              onChange={this.handleEmailChange}
            />
            <input type="submit" className="ForgotPasswordPage__submit" value="Send Reset Email" />
          </form>
        </div>
        }
        {
          emailSentSuccessfully && <h1> Email Sent! </h1>
        }
      </div>
    );
  }
}

export default ForgotPasswordPage;
