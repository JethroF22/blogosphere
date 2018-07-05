import React, { Component } from "react";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";

import { createProfile } from "../actions/profile";

class CreateProfile extends Component {
  state = {
    photo: "",
    bio: "",
    errors: {}
  };

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

    if (!(this.state.profile === "" && this.state.bio === "")) {
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
      ["photo", "bio"].forEach(field => {
        if (this.state[field] === "") {
          errors[field] = `"${field}" cannot be blank`;
        }
        this.setState(() => ({ errors }));
      });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <h1>Complete your profile</h1>
          {this.state.errors.action && <p>{this.state.errors.action}</p>}
          <label htmlFor="photo">Photo: </label>
          <input
            type="text"
            name="photo"
            value={this.state.photo}
            onChange={this.onPhotoChange}
            placeholder="Image URL"
          />
          {this.state.errors.photo && <p>{this.state.errors.photo}</p>}

          <label htmlFor="bio">Bio: </label>
          <Textarea
            name="bio"
            onChange={this.onBioChange}
            value={this.state.bio}
            placeholder="Tell us more about yourself..."
          />
          {this.state.errors.bio && <p>{this.state.errors.bio}</p>}
          <button type="submit">Create Profile</button>
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
