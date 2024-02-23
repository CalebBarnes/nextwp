import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

jest.mock("next/headers", () => {
  const MockDraftMode = {
    isEnabled: false,
    // eslint-disable-next-line func-names -- this is a mock
    enable: jest.fn(function () {
      this.isEnabled = true;
    }),
    // eslint-disable-next-line func-names -- this is a mock
    disable: jest.fn(function () {
      this.isEnabled = false;
    }),
  };

  return {
    draftMode: jest.fn(() => MockDraftMode),
  };
});
