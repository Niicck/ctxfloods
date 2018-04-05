import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/Shared/Modal';
import ActivateUserModal from 'components/Dashboard/ManageUsersPage/ActivateUserModal';
import ModalErrorMessage from 'components/Shared/Modal/ModalErrorMessage';
import ButtonPrimary from 'components/Shared/Button/ButtonPrimary';
import ButtonSecondary from 'components/Shared/Button/ButtonSecondary';
import userActiveFragment from 'components/Dashboard/ManageUsersPage/queries/userActiveFragment';

class ArchiveUserModal extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      errorMessage: null,
      reactivating: false,
    };
  }

  componentDidCatch(err) {
    console.error(err);
    this.setState({ errorMessage: err.message });
  }

  reactivateUser = () => {
    this.setState({ reactivating: true, errorMessage: null });
    // const password = generator.generate({
    //   length: 30,
    //   numbers: true,
    //   symbols: true,
    //   strict: true,
    // });
    // this.props
    //   .addUserMutation({
    //     variables: {
    //       email: user.email,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       role: user.role,
    //       communityId: user.communityId,
    //       jobTitle: user.jobTitle,
    //       phoneNumber: user.phoneNumber,
    //       password: password,
    //     },
    //   })
    //   .then(({ data }) => {
    //     console.log('success', data);
    //     this.setState({ userAdded: true });
    //     this.sendEmail(user);
    //   })
    //   .catch(error => {
    //     console.log('there was an error sending the query', error);
    //     this.setState({ errorMessage: error.message });
    //   });
  };

  sendEmail = user => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/email/reset`, {
      method: 'POST',
      body: JSON.stringify({ email: user.email }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(res => {
        if (res.status === 204) {
          this.setState({
            emailSent: true,
          });
        } else if (res.status === 400) {
          this.setState({
            emailSent: false,
            errorMessage: 'Email failed to send',
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          emailSent: false,
          errorMessage: error.message,
        });
      });
  };


  deactivateUser = () => {
    this.props
      .deactivateUserMutation({
        variables: {
          userId: this.props.user.id,
        },
        update: (store, { data: { deactivateUser } }) => {
          const deactivatedUser = deactivateUser.user;
          store.writeFragment({
            id: 'User:' + deactivatedUser.id,
            fragment: userActiveFragment,
            data: deactivatedUser,
          });
        },
      })
      .then(({ data }) => {
        this.props.onClose();
      })
      .catch(err => {
        console.error(err);
        this.setState({ errorMessage: err.message });
      });
  };

  render() {
    const { user } = this.props;

    if(this.state.reactivating) {
      return (
        <ActivateUserModal
          onClose={this.props.onClose}
          userActivated={false}
          emailSent={false}
          errorMessage={this.state.errorMessage}
        />
      )
    }

    return (
      <Modal
        title={user.active ? "Deactivate User" : "Reactivate User"}
        isOpen
        onClose={this.props.onClose}
        footer={
          <div>
            <ButtonPrimary
              className="ArchiveUserModal__primary-button"
              onClick={user.active ? this.deactivateUser : this.reactivateUser}
            >
              {user.active ? "Deactivate" : "Reactivate"}
            </ButtonPrimary>
            <ButtonSecondary onClick={this.props.onClose}>
              Cancel
            </ButtonSecondary>
          </div>
        }
      >
        <p>This will {user.active ? "deactivate" : "reactivate"} {user.firstName} {user.lastName}.</p>
        <p>Do you want to continue?</p>
        {this.state.errorMessage && (
          <ModalErrorMessage>{this.state.errorMessage}</ModalErrorMessage>
        )}
      </Modal>
    );
  }
}

const deactivateUserMutation = gql`
  mutation($userId:Int!) {
    deactivateUser(input: {userId: $userId}) {
      user {
        ...userActive
      }
    }
  }
  ${userActiveFragment}
`;

const reactivateUserMutation = gql`
  mutation($userId:Int!) {
    deactivateUser(input: {userId: $userId}) {
      user {
        ...userActive
      }
    }
  }
  ${userActiveFragment}
`;

export default compose(
  graphql(deactivateUserMutation, {
    name: 'deactivateUserMutation',
  }),
  graphql(reactivateUserMutation, {
    name: 'reactivateUserMutation',
  }),
)(ArchiveUserModal);
