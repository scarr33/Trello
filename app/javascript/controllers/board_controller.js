import { Controller } from "@hotwired/stimulus";
import { get, map, isNull } from "lodash-es";
// import axios from "axios";

export default class extends Controller {
  // HEADERS = { ACCEPT: "application/json" };

  // HEADERS = { "Content-Type": "application/json" };

  // buildClassList(classList) {
  //   if (isNull(classList)) {
  //     return "";
  //   }

  //   return classList.split(" ").join(", ");
  // }

  getHeaders() {
    return Array.from(document.querySelectorAll(".kanban-board-header"));
  }

  getHeaderTitles() {
    return Array.from(document.querySelectorAll(".kanban-title-board"));
  }

  cursorifyHeaderTitles() {
    this.getHeaderTitles().forEach((headerTitle) => {
      headerTitle.classList.add("cursor-pointer");
    });
  }

  addLinkToHeaderTitles(boards) {
    this.getHeaderTitles().forEach((headerTitle, index) => {
      headerTitle.addEventListener("click", () => {
        Turbo.visit(
          `${this.element.dataset.boardListsUrl}/${boards[index].id}/edit`
        );
      });
    });
  }

  buildBoardDeleteButton(boardId) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add(
      "kanban-title-button",
      "btn",
      "btn-default",
      "btn-xs",
      "mr-2"
    );
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      fetch(`${this.element.dataset.boardListsUrl}/${boardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        alert("Are you sure?");
        Turbo.visit(window.location.href);
        // location.reload();
      });
    });
    return deleteButton;
  }

  addHeaderDeleteButtons(boards) {
    this.getHeaders().forEach((header, index) => {
      header.appendChild(this.buildBoardDeleteButton(boards[index].id));
    });
  }

  buildItems(items) {
    return map(items, (item) => {
      return {
        id: get(item, "id"),
        title: get(item, "attributes.title"),
      };
    });
  }

  buildBoards(boardsData) {
    return map(boardsData["data"], (board) => {
      return {
        id: get(board, "id"),
        title: get(board, "attributes.title"),
        item: this.buildItems(get(board, "attributes.items.data")),
      };
    });
  }

  populateItemInformation(el) {
    console.log("element", el);
    fetch(`/api/items/${el.dataset.eid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        document.getElementById("show-modal-div").click();
        document.getElementById("item-title").textContent = get(
          data,
          "data.attributes.title"
        );
        document.getElementById("item-description").textContent = get(
          data,
          "data.attributes.description"
        );
        document.getElementById("item-edit-link").href = `/lists/${get(
          data,
          `data.attributes.list_id`
        )}/items/${el.dataset.eid}/edit`;

        document.getElementById("item-delete-link").href = `/lists/${get(
          data,
          `data.attributes.list_id`
        )}/items/${el.dataset.eid}`;

        document.getElementById("item-assign-member-link").href = `/items/${get(
          data,
          `data.id`
        )}/item_members/new`;
      });
  }

  buildKanban(boards) {
    new jKanban({
      element: `#${this.element.id}`,
      boards: boards,
      itemAddOptions: {
        enabled: true, // add a button to board for easy item creation
        content: "+", // text or html content of the board button
      },
      click: (el) => {
        this.populateItemInformation(el);
      },
      buttonClick: function (el, boardId) {
        Turbo.visit(`/lists/${boardId}/items/new`);
      },
    });
  }

  getCurrentBoard() {
    let url = window.location.href;
    url = url.split("/");
    return url[url.length - 1];
  }

  addBottomScrollMargin() {
    this.element.firstElementChild.classList.add("mb-5");
  }

  connect() {
    this.getCurrentBoard();
    fetch(`/api/boards/${this.getCurrentBoard()}/lists`)
      .then((res) => res.json())
      .then((data) => {
        this.buildKanban(this.buildBoards(data));
        this.cursorifyHeaderTitles();
        this.addLinkToHeaderTitles(this.buildBoards(data));
        this.addHeaderDeleteButtons(this.buildBoards(data));
        this.addBottomScrollMargin();
      });
  }
}