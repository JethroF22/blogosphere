import React from "react";
import { shallow } from "enzyme";

import { EditPostPage } from "../../components/EditPostPage";

let wrapper, getPost, slug;

beforeEach(() => {
  slug = "slug";
  const match = {
    params: {
      slug
    }
  };
  getPost = jest.fn().mockResolvedValueOnce({});
  wrapper = shallow(<EditPostPage getPost={getPost} match={match} />);
});

test("should render component correctly", () => {
  expect(wrapper).toMatchSnapshot();
});

test("should fetch post if no post is passed as prop", () => {
  expect(getPost).toHaveBeenLastCalledWith(slug);
});
