(function () {
  "use strict";

  const dateEl = document.getElementById("date");
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  const list = document.querySelector(".list");
  if (!list) return;

  function setEditing(item, editing) {
    const title = item.querySelector(".item__title");
    const form = item.querySelector(".item__edit-form");
    const input = item.querySelector(".item__input");
    const editBtn = item.querySelector('[data-action="edit"]');
    const saveBtn = item.querySelector('[data-action="save"]');
    const cancelBtn = item.querySelector('[data-action="cancel"]');

    if (editing) {
      input.value = title.textContent.trim();
      title.hidden = true;
      form.hidden = false;
      editBtn.hidden = true;
      saveBtn.hidden = false;
      cancelBtn.hidden = false;
      item.classList.add("item--editing");
      input.focus();
      input.select();
    } else {
      title.hidden = false;
      form.hidden = true;
      editBtn.hidden = false;
      saveBtn.hidden = true;
      cancelBtn.hidden = true;
      item.classList.remove("item--editing");
    }
  }

  function cancelAll() {
    list.querySelectorAll(".item--editing").forEach(function (item) {
      setEditing(item, false);
    });
  }

  list.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const item = button.closest(".item");
    const action = button.dataset.action;

    if (action === "edit") {
      cancelAll();
      setEditing(item, true);
    } else if (action === "cancel") {
      setEditing(item, false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      cancelAll();
    }
  });

  list.addEventListener("change", function (event) {
    const checkbox = event.target.closest(".item__checkbox");
    if (!checkbox) return;

    const item = checkbox.closest(".item");
    if (item.dataset.submitting) return;

    item.dataset.submitting = "true";
    item.classList.add("item--done");

    window.setTimeout(function () {
      checkbox.closest("form").submit();
    }, 280);
  });
})();
