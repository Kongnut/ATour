import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { loginModal, registerModal } from '../../action/ModalAction';
import { login } from '../../action/ApplicationAction';
import { getUserInfo } from '../../action/UserInfoAction';
import classNames from 'classnames';
import autobind from 'react-autobind';
import PopUpModal from '../../component/PopUpModal/PopUpModal';
import './styles.css';
import axios from 'axios';

class LoginModal extends React.Component {
  constructor() {
    super();
    this.state = {
      asCustomer: true,
      userName: '',
      password: '',
      errorMessage: '',
      sendRequest: false
    };
    autobind(this, 'switchToSignUp', 'login');
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.sendRequest && nextProps.isLoginSuccess) {
      this.onCloseLoginModal();
    } else if (this.state.sendRequest && !nextProps.isLoginSuccess) {
      this.setState({
        errorMessage: 'Invalid Username or Password',
        sendRequest: false
      });
    }
  }

  login() {
    const { userName, password, asCustomer } = this.state;
    this.setState({ sendRequest: true });
    this.props.login(userName, password, asCustomer);
  }

  switchToSignUp() {
    this.props.onCloseModal();
    this.props.onOpenRegisterModal();
  }

  onCloseLoginModal() {
    this.setState({
      asCustomer: true,
      userName: '',
      password: '',
      sendRequest: false
    });
    this.props.onCloseModal();
  }

  render() {
    const { asCustomer, userName, password, errorMessage } = this.state;
    return (
      <Modal
        className="modal-container-loginModal"
        style={{
          overlay: {
            overflow: 'auto'
          }
        }}
        isOpen={this.props.isOpen}
        onRequestClose={() => this.onCloseLoginModal()}
        ariaHideApp={false}
      >
        <PopUpModal
          isOpen={errorMessage ? true : false}
          onCloseModal={() => this.setState({ errorMessage: '' })}
          headerText={'Login Fail'}
          bodyText={errorMessage}
          // onConfirm
        />
        <div
          onKeyPress={e => {
            if (e.which === 13) {
              this.login();
            }
          }}
        >
          <div className="loginModal-login">Log in</div>
          <button
            onClick={() => this.setState({ asCustomer: true })}
            className={classNames({
              'btn loginModal-selectiveButton': true,
              'loginModal-selected': asCustomer
            })}
          >
            Customer
          </button>
          <button
            onClick={() => this.setState({ asCustomer: false })}
            className={classNames({
              'btn loginModal-selectiveButton': true,
              'loginModal-selected': !asCustomer
            })}
          >
            Guide
          </button>
          <div className="loginModal-login-label">Username</div>
          <input
            className="loginModal-text-field"
            value={userName}
            onChange={e => this.setState({ userName: e.target.value })}
          />
          <div className="loginModal-login-label">Password</div>
          <input
            className="loginModal-text-field"
            type="password"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button
            onClick={() => this.login()}
            className="btn loginModal-login-btn"
          >
            Login
          </button>
          <div className="loginModal-to-register-container">
            <div className="loginModal-to-register-text">
              Don't have an account ?
            </div>
            <div
              onClick={() => this.switchToSignUp()}
              className="loginModal-to-register-link"
            >
              Sign up
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    isOpen: state.modal.modalName === 'login',
    isLoginSuccess: state.user.isLoginSuccess
  };
};

const mapDispatchToProps = dispatch => ({
  onCloseModal: () => dispatch(loginModal(false)),
  onOpenRegisterModal: () => dispatch(registerModal(true)),
  login: (userName, password, role) =>
    dispatch(login(userName, password, role)),
  getUserInfo: (userName, token) => dispatch(getUserInfo(userName, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
