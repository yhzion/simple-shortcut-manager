export const showMessage = (
  name: string,
  description: string,
  trigger: string
) => {
  const messageDiv = document.getElementById("message") as HTMLDivElement;
  messageDiv.innerHTML = `<strong>${name}</strong><br>Description: ${description}<br>Triggered: ${trigger}`;
  (messageDiv as HTMLElement).style.display = "block";
  setTimeout(() => {
    (messageDiv as HTMLElement).style.display = "none";
  }, 3000);
};
