import React from "react";
import { shallow } from "enzyme";
import _ from "lodash";

import { RegistrationPage } from "../../components/RegistrationPage";
import users from "../seed/users";

let wrapper, register;

beforeEach(() => {
  register = jest.fn();
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
