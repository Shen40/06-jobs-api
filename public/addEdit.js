import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showRuns } from "./runs.js";

let addEditDiv = null;
let Title = null;
let Distance = null;
let Duration = null;
let addingRun = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-run");
  Title = document.getElementById("Title");
  Distance = document.getElementById("Distance");
  Duration = document.getElementById("Duration");
  addingRun = document.getElementById("adding-run");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
  if (inputEnabled && e.target.nodeName === "BUTTON") {
    if (e.target === addingRun) {
  enableInput(false);

  let method = "POST";
  let url = "/api/v1/runs";

  if (addingRun.textContent === "update") {
    method = "PATCH";
    url = `/api/v1/runs/${addEditDiv.dataset.id}`;
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: Title.value,
        distance: Distance.value,
        duration: Duration.value,
      }),
    });

    const data = await response.json();
    if (response.status === 200 || response.status === 201) {
      if (response.status === 200) {
        // a 200 is expected for a successful update
        message.textContent = "The run entry was updated.";
      } else {
        // a 201 is expected for a successful create
        message.textContent = "The run entry was created.";
      }

      Title.value = "";
      Distance.value = "";
      Duration.value = "";
      showRuns();
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
    } else if (e.target === editCancel) {
      message.textContent = "";
      showRuns();
    }
  }
  });
};
export const showAddEdit = async (runId) => {
  if (!runId) {
    Title.value = "";
    Distance.value = "";
    Duration.value = "";
    addingRun.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/runs/${runId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        Title.value = data.run.Title;
        Distance.value = data.run.Distance;
        Duration.value = data.run.Duration;
        addingRun.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = runId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The runs entry was not found";
        showRuns();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showRuns();
    }

    enableInput(true);
  }
};