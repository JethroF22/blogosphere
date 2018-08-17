import React from "react";
import { shallow } from "enzyme";
import _ from "lodash";

import { LoginPage } from "../../components/LoginPage";
import users from "../seed/users";

let wrapper, login, token, userCredentials;

beforeEach(() => {
  userCredentials = _.pick(users[0], ["email", "password"]);
  token = "token";
  login = jest.fn().mockResolvedValue(token);
  wrapper = shallow(<LoginPage login={login} />);
  wrapper.setState({ ...userCredentials });
});

test("Should render component correctly", () => {
  expect(wrapper).toMatchSnapshot();
});

test("Should handle login", () => {
  wrapper.find("form").simulate("submit", { preventDefault: () => {} });
  expect(login).toHaveBeenLastCalledWith(userCredentials);
});

test("Should set email on input change", () => {
  const value = "test@gmail.com";
  wrapper
    .find("input")
    .at(0)
    .simulate("change", {
      target: {
        value
      }
    });
  expect(wrapper.state("email")).toBe(value);
});

test("Should set password on input change", () => {
  const value = "password";
  wrapper
    .find("input")
    .at(1)
    .simulate("change", {
      target: {
        value
      }
    });
  expect(wrapper.state("password")).toBe(value);
});
