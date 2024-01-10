import { Controller } from "@hotwired/stimulus";
import { get, map, isNull } from "lodash-es";
import axios from "axios";

export default class extends Controller {
  HEADERS = { ACCEPT: "application/json" };

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
        "list-id": get(item, "attributes.list_id"),
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

  buildImage(imageUrl) {
    const imgElement = document.getElementById("item-image");
    if (imageUrl) {
      imgElement.src = imageUrl;
      imgElement.style.display = "block"; // Show the image element
    } else {
      imgElement.style.display = "none"; // Hide the image element if no image URL
    }
  }

  populateItemInformation(el) {
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

        document.getElementById("add-child-issue-link").href = `/items/${get(
          data,
          `data.id`
        )}/child_issues/new`;

        document.getElementById("child-issue-edit-link").href = `/items/${get(
          data,
          `data.id`
        )}/child_issues/18/edit`;

        const membersList = map(
          get(data, "data.attributes.members.data"),
          (memberData) => {
            const listItem = document.createElement("li");
            listItem.textContent = memberData.attributes.email;
            listItem.classList.add("text-sm");
            return listItem;
          }
        );

        document.getElementById("item-members-list").innerHTML = null;

        if (membersList.length > 0) {
          membersList.forEach((memberData) => {
            document
              .getElementById("item-members-list")
              .appendChild(memberData);
          });
          document
            .getElementById("item-members-section")
            .classList.add("block");
        } else {
          document
            .getElementById("item-members-section")
            .classList.add("hidden");
        }

        const childIssuesList = map(
          get(data, "data.attributes.child_issues"),
          (childIssue) => {
            const childIssueItem = document.createElement("ul");
            const childIssueTitle = document.createElement("li");
            const childIssueDesc = document.createElement("li");
            childIssueTitle.textContent = childIssue.title;
            childIssueTitle.dataset.eid = childIssue.id;
            childIssueDesc.textContent = childIssue.description;
            childIssueDesc.classList.add("text-xs");
            childIssueItem.appendChild(childIssueTitle);
            childIssueItem.appendChild(childIssueDesc);
            return childIssueItem;
          }
        );

        document.getElementById("item-child-issues-list").innerHTML = null;

        if (childIssuesList.length > 0) {
          childIssuesList.forEach((childIssue) => {
            document
              .getElementById("item-child-issues-list")
              .appendChild(childIssue);
          });
          document.getElementById("item-child-issues").classList.add("block");
        } else {
          document.getElementById("item-child-issues").classList.add("hidden");
        }

        const imageUrl = get(data, "data.attributes.image_url");

        this.buildImage(imageUrl);
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
        event.preventDefault();

        // Check if the modal is already open
        if (
          !document.getElementById("show-modal-div").classList.contains("show")
        ) {
          this.populateItemInformation(el);
        }
      },
      buttonClick: function (el, boardId) {
        Turbo.visit(`/lists/${boardId}/items/new`);
      },
      dropEl: (el, target, source, sibling) => {
        const targetItems = Array.from(
          target.getElementsByClassName("kanban-item")
        );
        const sourceItems = Array.from(
          source.getElementsByClassName("kanban-item")
        );

        targetItems.forEach((item, index) => {
          item.dataset.position = index;
          item.dataset.listId = target.closest(".kanban-board").dataset.id;
        });

        sourceItems.forEach((item, index) => {
          item.dataset.position = index;
          item.dataset.listId = source.closest(".kanban-board").dataset.id;
        });

        const targetItemData = map(targetItems, (item) => {
          return {
            id: item.dataset.eid,
            position: item.dataset.position,
            list_id: item.dataset.listId,
          };
        });

        const sourceItemData = map(sourceItems, (item) => {
          return {
            id: item.dataset.eid,
            position: item.dataset.position,
            list_id: item.dataset.listId,
          };
        });

        fetch(this.element.dataset.itemPositionsApiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: targetItemData,
          }),
        });

        fetch(this.element.dataset.itemPositionsApiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: sourceItemData,
          }),
        });
      },
      dragendBoard: (el) => {
        fetch(`${this.element.dataset.apiUrl}/${el.dataset.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: el.dataset.order - 1,
          }),
        }).then((res) => console.log(res));
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
    if (!this.element.dataset.boardInitialized) {
      this.element.dataset.boardInitialized = true;
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
}
