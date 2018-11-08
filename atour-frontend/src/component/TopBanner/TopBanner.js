import React from "react";
import { connect } from "react-redux";
import "./styles.css";
import { Link } from "react-router-dom";
import RegisterModal from "../RegisterModal/RegisterModal";
import { loginModal, registerModal } from "../../action/ModalAction";
import { logout } from "../../action/ApplicationAction";
import LoginModal from "../LoginModal/LoginModal";
import logo from "../../image/Atour-logo.jpg";
import autobind from "react-autobind";
import ClickOutSide from "react-click-outside";

class TopBanner extends React.Component {
  constructor() {
    super();
    this.state = { isClickedDropdown: false };
    autobind(this, "renderNotSignIn", "renderSignIn");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userInfo.username !== this.props.userInfo.username) {
      this.setState({ isClickedDropdown: false });
    }
  }
  renderNotSignIn() {
    return (
      <div className="topbanner-user-container">
        <LoginModal />
        <RegisterModal />
        <div className="topbanner-right" onClick={this.props.openRegisterModal}>
          Sign up
        </div>
        <div className="topbanner-right" onClick={this.props.openLoginModal}>
          Login
        </div>
      </div>
    );
  }

  renderSignIn() {
    const dropDown = this.state.isClickedDropdown ? (
      <ClickOutSide
        onClickOutside={() => this.setState({ isClickedDropdown: false })}
      >
        <div className="topbanner-login-dropdown">
          {this.props.userInfo.role === "Customer" ? (
            <Link className="topbanner-link" to="/bookedHistory">
              <div className="dropdown-item">
                <i className="fa fa-calendar topbanner-icon" />
                Booked History
              </div>
            </Link>
          ) : (
            <Link to="/publishedTour" className="topbanner-link">
              <div className="dropdown-item">
                <i className="fa fa-calendar topbanner-icon" />
                Published Tour
              </div>
            </Link>
          )}
          <Link to="/editProfile" className="topbanner-link">
            <div className="dropdown-item">
              <i className="fa fa-cog topbanner-icon" />
              Edit Profile
            </div>
          </Link>
          <Link to="/" className="topbanner-link">
            <div className="dropdown-item" onClick={() => this.props.logout()}>
              <i className="fa fa-sign-out topbanner-icon" />
              Log out
            </div>
          </Link>
        </div>
      </ClickOutSide>
    ) : null;
    return (
      <div className="topbanner-login-container">
        <div
          className="topbanner-login-banner"
          onClick={() => this.setState({ isClickedDropdown: true })}
        >
          <div className="topbanner-role">{this.props.userInfo.role}</div>
          <div className="topbanner-as-username">
            {this.props.userInfo.username.substring(0, 8)}
          </div>
          <i className="fa fa-arrow-circle-down topbanner-dropdown-arrow" />
        </div>
        {dropDown}
      </div>
    );
  }

  render() {
    const renderSignIn = this.props.userInfo.username
      ? this.renderSignIn()
      : this.renderNotSignIn();
    return (
      <div>
        <div className="topbanner-banner">
          <Link to="/">
            <div className="topbanner-logo">
              <img
                className="topbanner-logo-img"
                src={logo}
                alt="topbanner-logo"
              />
            </div>
          </Link>
          <div className="topbanner-right-container">
            <div className="topbanner-right">Search for Tour</div>
            <div className="topbanner-right">Search for Guide</div>
            {renderSignIn}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.user
});

const mapDispatchToProps = dispatch => ({
  openRegisterModal: () => dispatch(registerModal(true)),
  openLoginModal: () => dispatch(loginModal(true)),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBanner);