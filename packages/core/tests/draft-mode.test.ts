import { draftMode } from "next/headers";

test("mocked draftMode functionality", () => {
  const draftModeInstance = draftMode();
  expect(draftModeInstance.isEnabled).toBe(false);

  draftModeInstance.enable();
  expect(draftModeInstance.isEnabled).toBe(true);

  draftModeInstance.disable();
  expect(draftModeInstance.isEnabled).toBe(false);
});
