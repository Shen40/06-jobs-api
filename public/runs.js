import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let runsDiv = null;
let runsTable = null;
let runsTableHeader = null;

export const handleRuns = () => {
  runsDiv = document.getElementById("runs");
  const logoff = document.getElementById("logoff");
  const addRun = document.getElementById("add-run");
  runsTable = document.getElementById("runs-table");
  runsTableHeader = document.getElementById("runs-table-header");

  runsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addRun) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        runsTable.replaceChildren([runsTableHeader]);

        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        deleteRun(e.target.dataset.id);
      }
    }
  });
};

export const showRuns = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/runs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [runsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        runsTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.runs.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.runs[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.runs[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.runs[i].title}</td>
            <td>${data.runs[i].distance}</td>
            <td>${data.runs[i].duration}</td>
            ${editButton}${deleteButton}`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        runsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(runsDiv);
};

const deleteRun = async (runId) => {
  try {
    enableInput(false);

    const response = await fetch(`/api/v1/runs/${runId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      message.textContent = data.msg;
      showRuns();
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
};
