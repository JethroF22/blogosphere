import React from "react";
import { shallow } from "enzyme";
import _ from "lodash";

import { RegistrationPage } from "../../components/RegistrationPage";
import users from "../seed/users";

let wrapper, register;

beforeEach(() => {
  const token = "token";
  register = jest.fn().mockResolvedValueOnce(token);
  wrapper = shallow(<RegistrationPage register={register} />);
});

test("Should render component correctly", () => {
  expect(wrapper).toMatchSnapshot();
});

test("Should submit form with valid data", () => {
  wrapper.setState({ ...users[0] });
  wrapper.find("form").simulate("submit", { preventDefault: () => {} });
  expect(register).toHaveBeenLastCalledWith(
    _.pick(users[0], ["email", "password", "username"])
  );
});

test("Should not submit form with invalid data", () => {
  wrapper.setState({ ...users[1] });
  wrapper.find("form").simulate("submit", { preventDefault: () => {} });
  expect(wrapper.state("errors")).toMatchObject({
    confirmPassword: "Passwords do not match",
    email: "Not a valid email"
  });
});

test("Should set username on input change", () => {
  const value = "user";
  wrapper
    .find("input")
    .at(0)
    .simulate("change", {
      target: {
        value
      }
    });
  expect(wrapper.state("username")).toBe(value);
});

test("Should set email on input change", () => {
  const value = "test@gmail.com";
  wrapper
    .find("input")
    .at(1)
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
    .at(2)
    .simulate("change", {
      target: {
        value
      }
    });
  expect(wrapper.state("password")).toBe(value);
});

test("Should set confirmPassword on input change", () => {
  const value = "password";
  wrapper
    .find("input")
    .at(3)
    .simulate("change", {
      target: {
        value
      }
    });
  expect(wrapper.state("confirmPassword")).toBe(value);
});
