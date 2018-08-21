import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Textarea from "react-textarea-autosize";
import validator from "validator";

import { createProfile } from "../actions/profile";

class CreateProfile extends Component {
  state = {
    photo: "",
    bio: "",
    errors: {}
  };

  onPhotoChange = e => {
    const photo = e.target.value;
    this.setState(prevState => ({
      photo,
      errors: {
        ...prevState.errors,
        photo: ""
      }
    }));
  };

  onBioChange = e => {
    const bio = e.target.value;
    this.setState(prevState => ({
      bio,
      errors: {
        ...prevState.errors,
        bio: ""
      }
    }));
  };

  onSubmit = e => {
    e.preventDefault();

    if (!(this.state.photo === "" && this.state.bio === "")) {
      this.props.createProfile(this.state, this.props.token).then(() => {
        if (this.props.actionStatus === "Action successful") {
          this.props.history.push(`/`);
        } else {
          this.setState(prevState => ({
            errors: {
              ...prevState.errors,
              action: "An error occured while creating your profile."
            }
          }));
        }
      });
    } else {
      const errors = {};
      if (this.state.photo === "" || !validator.isURL(this.state.photo)) {
        errors.photo = "Please provide a link to valid image URL";
      }
      if (this.state.bio === "") {
        errors.bio = "Your bio cannot be blank";
      }
      this.setState(() => ({ errors }));
    }
  };

  render() {
    return (
      <div className="form">
        <form onSubmit={this.onSubmit} className="uk-form-stacked">
          <h1 className="form__title">Complete your profile</h1>
          {this.state.errors.action && (
            <p className="form__error">{this.state.errors.action}</p>
          )}
          <label htmlFor="photo" className="form__label">
            Photo:{" "}
          </label>
          {this.state.errors.photo && (
            <p className="form__error">{this.state.errors.photo}</p>
          )}
          <input
            type="text"
            name="photo"
            value={this.state.photo}
            onChange={this.onPhotoChange}
            placeholder="Image URL"
            className="uk-input uk-form-blank form__input"
          />
          <label htmlFor="bio" className="form__label">
            Bio:{" "}
          </label>
          {this.state.errors.bio && (
            <p className="form__error">{this.state.errors.bio}</p>
          )}
          <Textarea
            name="bio"
            onChange={this.onBioChange}
            value={this.state.bio}
            placeholder="Tell us more about yourself..."
            className="uk-textarea uk-form-blank form__textarea"
          />
          <button
            type="submit"
            className="uk-button uk-button-default button"
            disabled={this.props.actionStatus === "Action in progress"}
          >
            {this.props.actionStatus === "Action in progress" ? (
              <Fragment>
                <span>Creating </span> <FontAwesomeIcon icon={faSpinner} spin />
              </Fragment>
            ) : (
              "Create Profile"
            )}
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  actionStatus: state.status.status,
  token: state.auth.token
});

const mapDispatchToProps = dispatch => ({
  createProfile: (details, token) => dispatch(createProfile(details, token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProfile);
