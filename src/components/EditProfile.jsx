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
          <button type="submit">Edit Profile</button>
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
