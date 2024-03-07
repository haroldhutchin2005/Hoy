// Your client-side JavaScript goes here
document.addEventListener('DOMContentLoaded', async () => {
  const fileListElement = document.getElementById('fileList');
  const response = await fetch('/file-list');
  const { files } = await response.json();

  files.forEach((file) => {
    const listItem = document.createElement('li');
    listItem.textContent = file;
    fileListElement.appendChild(listItem);
  });
});
