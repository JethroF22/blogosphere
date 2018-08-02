import React, { Component } from "react";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";

import { editProfile, getProfile } from "../actions/profile";

class EditProfile extends Component {
  state = {
    photo: "",
    bio: "",
    errors: {}
  };

  componentDidMount() {
    if (!this.props.photo && !this.props.bio) {
      this.props.getProfile(this.props.username).then(() => {
        if (this.props.actionStatus === "Action successful") {
          this.setState(() => ({
            photo: this.props.photo,
            bio: this.props.bio
          }));
        } else {
          console.log("Error");
        }
      });
    }
  }

  onPhotoChange = e => {
    const photo = e.target.value;
    this.setState(() => ({
      photo
    }));
  };

  onBioChange = e => {
    const bio = e.target.value;
    this.setState(() => ({
      bio
    }));
  };

  onSubmit = e => {
    e.preventDefault();

    if (!(this.state.photo === "" && this.state.bio === "")) {
      this.props
        .editProfile(
          { photo: this.state.photo, bio: this.state.bio },
          this.props.token
        )
        .then(() => {
          if (this.props.actionStatus === "Action successful") {
            this.props.history.push(`/profile/view/${this.props.username}`);
          } else {
            this.setState(prevState => ({
              errors: {
                ...prevState.errors,
                action: "An error occured while updating your profile."
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
          <h1 className="form__title">Update your profile</h1>
          {this.state.errors.action && (
            <p className="form__error">{this.state.errors.action}</p>
          )}
          <label htmlFor="photo" className="form__label">
            Photo:{" "}
          </label>
          <input
            type="text"
            name="photo"
            value={this.state.photo}
            onChange={this.onPhotoChange}
            placeholder="Image URL"
            className={`uk-input form__input ${
              this.state.errors.bio ? "uk-form-danger" : "uk-form-blank"
            }`}
          />
          {this.state.errors.photo && (
            <p className="form__error">{this.state.errors.photo}</p>
          )}

          <label htmlFor="bio" className="form__label">
            Bio:{" "}
          </label>
          <Textarea
            name="bio"
            onChange={this.onBioChange}
            value={this.state.bio}
            placeholder="Tell us more about yourself..."
            className={`uk-textarea form__textarea ${
              this.state.errors.bio ? "uk-form-danger" : "uk-form-blank"
            }`}
          />
          {this.state.errors.bio && (
            <p className="form__error">{this.state.errors.bio}</p>
          )}
          <button type="submit" className="uk-button uk-button-default button">
            Edit Profile
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  actionStatus: state.status.status,
  token: state.auth.token,
  photo: state.profile.photo,
  bio: state.profile.bio,
  username: state.auth.username
});

const mapDispatchToProps = dispatch => ({
  editProfile: (details, token) => dispatch(editProfile(details, token)),
  getProfile: username => dispatch(getProfile(username))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);
