import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Textarea from "react-textarea-autosize";

class CreateProfile extends Component {
  state = {
    photo: "",
    bio: ""
  };

  onPhotoChange() {
    const photo = e.target.value;
    this.setState(() => ({
      photo
    }));
  }

  onBioChange() {
    const bio = e.target.value;
    this.setState(() => ({
      bio
    }));
  }

  render() {
    return (
      <div>
        <form>
          <h1>Complete your profile</h1>
          <label htmlFor="photo">Photo: </label>
          <input
            type="text"
            name="photo"
            value={this.state.photo}
            onChange={this.onPhotoChange}
            placeholder="Image URL"
          />
          <label htmlFor="bio">Bio: </label>
          <Textarea
            name="bio"
            onChange={this.onBioChange}
            value={this.state.bio}
            placeholder="Tell us more about yourself..."
          />
        </form>
      </div>
    );
  }
}

export default CreateProfile;
