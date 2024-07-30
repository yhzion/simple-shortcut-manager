// showMessage.test.ts 파일
import { showMessage } from "../MessageUtils";

describe("showMessage", () => {
  let messageDiv: HTMLDivElement;

  beforeAll(() => {
    // JSDOM을 이용해 테스트를 위한 DOM 요소를 추가합니다.
    messageDiv = document.createElement("div");
    messageDiv.id = "message";
    document.body.appendChild(messageDiv);
  });

  afterAll(() => {
    // 테스트가 끝난 후 DOM 요소를 정리합니다.
    document.body.removeChild(messageDiv);
  });

  it("should display the message with correct content", () => {
    const name = "Test Name";
    const description = "Test Description";
    const trigger = "Test Trigger";

    showMessage(name, description, trigger);

    expect(messageDiv.innerHTML).toBe(
      `<strong>${name}</strong><br>Description: ${description}<br>Triggered: ${trigger}`
    );
    expect(messageDiv.style.display).toBe("block");
  });

  it("should hide the message after 3 seconds", () => {
    jest.useFakeTimers();
    const name = "Test Name";
    const description = "Test Description";
    const trigger = "Test Trigger";

    showMessage(name, description, trigger);

    // 3초 경과 전에는 메시지가 표시되어야 합니다.
    expect(messageDiv.style.display).toBe("block");

    // 3초가 경과한 후에 메시지가 숨겨져야 합니다.
    jest.advanceTimersByTime(3000);
    expect(messageDiv.style.display).toBe("none");

    jest.useRealTimers();
  });
});
