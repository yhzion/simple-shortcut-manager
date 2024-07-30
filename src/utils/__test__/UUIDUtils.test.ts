// utils.test.ts 파일
import { generateUUID } from "../UUIDUtils";

describe("generateUUID", () => {
  it("should generate a valid UUID", () => {
    const uuid = generateUUID();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(uuid).toMatch(uuidRegex);
  });

  it("should generate unique UUIDs", () => {
    const uuids = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      uuids.add(generateUUID());
    }

    expect(uuids.size).toBe(1000);
  });
});
