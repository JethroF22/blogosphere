import React from "react";
import { shallow } from "enzyme";
import _ from "lodash";

import { CreatePostPage } from "../../components/CreatePostPage";
import users from "../seed/users";

let wrapper, createPost, history, slug, token;

beforeEach(() => {
  slug = "slug";
  token = "token";
  createPost = jest.fn().mockResolvedValue(slug);
  history = {
    push: jest.fn()
  };
  wrapper = shallow(
    <CreatePostPage
      createPost={createPost}
      history={history}
      token={token}
      actionStatus="Action successful"
    />
  );
});

test("should render correctly", () => {
  expect(wrapper).toMatchSnapshot();
});

test("should submit if no errors exist", () => {
  const state = { body: "body", title: "title", coverPhotoURL: "" };
  wrapper.setState(state);
  wrapper.find("form").simulate("submit", { preventDefault: () => {} });
  expect(createPost).toHaveBeenLastCalledWith(state, token);
});

test("should submit if no errors exist", () => {
  const state = { body: "body", title: "title", coverPhotoURL: "" };
  wrapper.setState(state);
  wrapper.find("form").simulate("submit", { preventDefault: () => {} });
  expect(createPost).toHaveBeenLastCalledWith(state, token);
});

test("create errors if 'title' or 'body' fields are", () => {
  const state = { body: "", title: "", coverPhotoURL: "" };
  const errors = {
    body: '"body" cannot be blank',
    title: '"title" cannot be blank'
  };
  wrapper.setState(state);
  wrapper.find("form").simulate("submit", { preventDefault: () => {} });
  expect(wrapper.state("errors")).toMatchObject(errors);
});
