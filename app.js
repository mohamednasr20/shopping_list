const StorageCtrl = (function () {
  return {
    storeItem(item) {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);

        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);

        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsFromStorage() {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },

    editItemFromStorage(index, name, quantity) {
      let items = JSON.parse(localStorage.getItem("items"));

      items[index].name = name;
      items[index].quantity = quantity;

      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemFromStorage(index) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.splice(index, 1);

      localStorage.setItem("items", JSON.stringify(items));
    },

    clearAllItemsFromStorage() {
      let items = JSON.parse(localStorage.getItem("items"));
      items.splice(0);

      localStorage.setItem("items", JSON.stringify(items));
    },
  };
})();

const ItemCtrl = (function () {
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
  };

  return {
    getItems() {
      return data.items;
    },

    addItem(newItem) {
      data.items.push(newItem);
    },

    editItem(index, name, quantity) {
      data.items[index].name = name;
      data.items[index].quantity = quantity;
    },

    deleteItem(index) {
      data.items.splice(index, 1);
    },

    clearAllItems() {
      data.items.splice(0);
    },
  };
})();

const UICtrl = (function () {
  const items = ItemCtrl.getItems();

  const UISelectors = {
    itemName: "#item-name",
    itemQuantity: "#item-quantity",
    updateState: "#update-state",
    clearBtn: "#clear-btn",
    addBtn: "#add-btn",
    backBtn: "#back-btn",
    editBtn: "#edit-btn",
    deleteBtn: "#delete-btn",
    listGroup: ".list-group",
    listGroupItems: ".list-group-item",
  };

  const addBtn = document.querySelector(UISelectors.addBtn);
  const groupList = document.querySelector(UISelectors.listGroup);

  const updateState = document.querySelector(UISelectors.updateState);
  const itemName = document.querySelector(UISelectors.itemName);
  const itemQuantity = document.querySelector(UISelectors.itemQuantity);

  return {
    populateItemList(items) {
      let html = "";

      items.forEach((item, idx) => {
        html += ` <li
                class="list-group-item d-flex justify-content-between align-items-center"
                data-index="${idx}"
              >
                ${item.name} :  (${item.quantity})
                <i class="btn fas fa-pencil-alt text-info update"></i>
              </li>`;
      });
      document.querySelector(UISelectors.listGroup).innerHTML = html;
    },

    getSelectors() {
      return UISelectors;
    },

    clearInput() {
      itemName.value = "";
      itemQuantity.value = "";
    },

    showEditState(e) {
      if (e.target.classList.contains("update")) {
        const listItem = e.target.parentNode.dataset.index;
        groupList.dataset.index = listItem;
        addBtn.classList.add("d-none");
        updateState.classList.remove("d-none");
        currentItem = listItem;
        itemName.value = items[currentItem].name;
        itemQuantity.value = items[currentItem].quantity;
      }
    },

    clearEditState() {
      updateState.classList.add("d-none");
      addBtn.classList.remove("d-none");
      groupList.dataset.index = "";
    },
  };
})();

const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  let items = ItemCtrl.getItems();
  const UISelectors = UICtrl.getSelectors();
  const itemName = document.querySelector(UISelectors.itemName);
  const itemQuantity = document.querySelector(UISelectors.itemQuantity);
  const listGroup = document.querySelector(UISelectors.listGroup);
  const loadEventListeners = function () {
    UICtrl.populateItemList(items);

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", (e) => {
        e.preventDefault();
        const newItem = { name: itemName.value, quantity: itemQuantity.value };
        if (!newItem.name) return;
        ItemCtrl.addItem(newItem);
        StorageCtrl.storeItem(newItem);
        UICtrl.populateItemList(items);
        UICtrl.clearInput(itemName, itemQuantity);
      });

    document
      .querySelector(UISelectors.listGroup)
      .addEventListener("click", (e) => {
        UICtrl.showEditState(e);
      });

    document
      .querySelector(UISelectors.editBtn)
      .addEventListener("click", (e) => {
        e.preventDefault();
        const index = listGroup.dataset.index;
        const name = itemName.value;
        const quantity = itemQuantity.value;

        ItemCtrl.editItem(index, name, quantity);
        StorageCtrl.editItemFromStorage(index, name, quantity);
        UICtrl.populateItemList(items);
        UICtrl.clearInput();
        UICtrl.clearEditState();
      });

    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", (e) => {
        e.preventDefault();
        UICtrl.clearInput();
        UICtrl.clearEditState();
      });

    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", (e) => {
        let index = listGroup.dataset.index;
        e.preventDefault();
        ItemCtrl.deleteItem(index);
        StorageCtrl.deleteItemFromStorage(index);
        UICtrl.populateItemList(items);
        UICtrl.clearInput();
        UICtrl.clearEditState();
      });

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", () => {
        ItemCtrl.clearAllItems();
        StorageCtrl.clearAllItemsFromStorage();
        UICtrl.populateItemList(items);
        UICtrl.clearInput();
        UICtrl.clearEditState();
      });
  };
  return {
    init() {
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
