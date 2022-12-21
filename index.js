let inputBox;
let cardList;
let todos = []; //local storage
let allButton=document.querySelector("#all-button")
let container=document.querySelector("#container")
let cardContainer=document.querySelector("#card-container")
let filterButtons=document.querySelector("#filter-buttons")

window.addEventListener("load", () => {
  //declarations
  const add = document.querySelector(".add-button");
  const multiple = document.querySelector(".multi-select-button");
  const remove = document.querySelector(".remove-button");
  const panels = document.querySelector(".panels");
  inputBox = document.querySelector("#input-box");
  cardList = document.querySelector(".card-list");
  let edits = document.querySelectorAll(".edit-button");
  let removes = document.querySelectorAll(".delete-button");
  let statuses = document.querySelectorAll(".status");
  let cboxes;

  if (JSON.parse(localStorage.getItem("todos"))) {
    todos = JSON.parse(localStorage.getItem("todos"));
    todos.forEach((todo) => {
      scrollCards()
      createCard(todo.content, todo.createdAt, todo.status);
    });
    inputBox = document.querySelector("#input-box");
    cardList = document.querySelector(".card-list");
    edits = document.querySelectorAll(".edit-button");
    removes = document.querySelectorAll(".delete-button");
    statuses = document.querySelectorAll(".status");
    cboxes = document.querySelectorAll(".checkbox");
    sortCards();
  }


  //event listeners


  add.addEventListener("click", () => {

    allButton.click()
    let text = inputBox.value;
    let date = new Date();
    let stringDate = setDateTime(date);

    if (text) {
      createCard(text, stringDate, "To-Do");

      //temp solution
      edits = document.querySelectorAll(".edit-button");
      removes = document.querySelectorAll(".delete-button");
      statuses = document.querySelectorAll(".status");
      cboxes = document.querySelectorAll(".checkbox");

      for (let edit of edits) {
        edit.addEventListener("click", editCard);
      }

      for (let remove of removes) {
        remove.addEventListener("click", removeCard);
      }
      for (let status of statuses) {
        status.addEventListener("change", (event) => {
          let card = event.target.closest(".card");
          let text = card.querySelector(".grid").querySelector("label");
          let dateCall = card.querySelector("#date-call");

          let selectedStatus = status.options[status.selectedIndex].value;
          if (selectedStatus === "Completed") {
            text.classList.add("completed");
          }
          todos.forEach((todo) => {
            if (
              todo.content === text.innerText &&
              todo.createdAt === dateCall.innerText
            ) {
              todo.status = selectedStatus;
            }
          });
          localStorage.setItem("todos", JSON.stringify(todos));
          sortCards();

        });
      }

      //checlist event listener - changing icon if any one is selected

      for (let cbox of cboxes) {
        cbox.addEventListener("click", (event) => {
          disablingFilterButtons()
          let target = event.target;
          let card = target.closest(".card");
          let length = 0;
          let checkboxes = document.querySelectorAll(".checkbox");
          // let totalLength=cardList.children.length
          let totalLength=0
    
          for (let card of cardList.children) {
            if (card.style.display!="none"){
              totalLength++
            }
            let checkCard = card.querySelector(".checkbox");
            if (checkCard.checked) {
              length++;
            }
          }
          let multiButton;
          let selectOneButton = document.createElement("button");
          selectOneButton.className = "select-one-button";
          selectOneButton.insertAdjacentHTML(
            "afterbegin",
            `<img src="./images/multiple-one.svg" alt="Multiple One Select button">`
          );
          if (length > 0 && length < totalLength) {
            
            console.log("length > 0 && length < totalLength")
            multiButton = document.querySelector(".multi-select-button");
            let deSelectButton = document.querySelector(".deselect-button");
            if (multiButton) {
              
              console.log("multibutton")
              selectOneButton = document.createElement("button");
              selectOneButton.className = "select-one-button";
              selectOneButton.insertAdjacentHTML(
                "afterbegin",
                `<img src="./images/multiple-one.svg" alt="Multiple One Select button">`
              );
              multiButton.parentNode.replaceChild(selectOneButton, multiButton);
              selectOneButton.addEventListener("click", selectCards);
            } else if (deSelectButton) {
              console.log("deselectButton")
              selectOneButton = document.createElement("button");
              selectOneButton.className = "select-one-button";
              selectOneButton.insertAdjacentHTML(
                "afterbegin",
                `<img src="./images/multiple-one.svg" alt="Multiple One Select button">`
              );
              deSelectButton.parentNode.replaceChild(
                selectOneButton,
                deSelectButton
              );
              selectOneButton.addEventListener("click", selectCards);
            }
          }
          //reseting back to select all button
          else if (length < 1 && document.querySelector(".select-one-button")) {
            console.log(`length < 1 && document.querySelector(".select-one-button")`)
            enablingFilterButtons()
            selectOneButton = document.querySelector(".select-one-button");
            multiButton = document.createElement("button");
            multiButton.classList.add("multi-select-button");
            multiButton.insertAdjacentHTML(
              "afterbegin",
              `<img src="./images/multiple-select.svg" alt="Select multiple button">`
            );
            selectOneButton.parentNode.replaceChild(multiButton, selectOneButton);
            multiButton.addEventListener("click", selectCards);
          } 
          else if (
            length === totalLength &&
            document.querySelector(".select-one-button")
          ) {
           console.log(`length === totalLength &&
           document.querySelector(".select-one-button")`)
            selectOneButton = document.querySelector(".select-one-button");
            let deselectButton = document.createElement("button");
            deselectButton.classList.add("deselect-button");
            deselectButton.insertAdjacentHTML(
              "afterbegin",
              `<img src="./images/deselect.svg" alt="Select multiple button">`
            );
            selectOneButton.parentNode.replaceChild(
              deselectButton,
              selectOneButton
            );
            deselectButton.addEventListener("click", () => {
              multiButton = document.createElement("button");
              multiButton.classList.add("multi-select-button");
              multiButton.insertAdjacentHTML(
                "afterbegin",
                `<img src="./images/multiple-select.svg" alt="Select multiple button">`
              );
              deselectButton.parentNode.replaceChild(multiButton, deselectButton);
              for (let checkbox of checkboxes) {
                checkbox.checked = false;
              }
              multiButton.addEventListener("click", selectCards);
            });
          }
    
        //conditions for single card in filter
          else if(length===1 && totalLength===1){
            console.log("length===1 && totalLength===1")
            multiButton = document.querySelector(".multi-select-button");
            let deselectButton = document.createElement("button");
            deselectButton.classList.add("deselect-button");
            deselectButton.insertAdjacentHTML(
              "afterbegin",
              `<img src="./images/deselect.svg" alt="Select multiple button">`
            );
            multiButton.parentNode.replaceChild(deselectButton, multiButton);
            deselectButton.addEventListener("click", () => {
              enablingFilterButtons()
              multiButton = document.createElement("button");
              multiButton.classList.add("multi-select-button");
              multiButton.insertAdjacentHTML(
                "afterbegin",
                `<img src="./images/multiple-select.svg" alt="Select multiple button">`
              );
              deselectButton.parentNode.replaceChild(multiButton, deselectButton);
              for (let checkbox of checkboxes) {
                checkbox.checked = false;
              }
              multiButton.addEventListener("click", selectCards);
            });
    
          }
          else if(length===0 && totalLength===1){
            enablingFilterButtons()
            console.log("length===0 && totalLength===1")
            let deselectButton = document.querySelector(".deselect-button");
            let multiButton = document.createElement("button");
            multiButton.classList.add("multi-select-button");
            multiButton.insertAdjacentHTML(
              "afterbegin",
              `<img src="./images/multiple-select.svg" alt="Multiple select button">`
            );
            deselectButton.parentNode.replaceChild(multiButton, deselectButton);
          }
        });
      }

      //local storage part

      const todo = {
        content: text,
        status: "To-Do",
        createdAt: stringDate,
      };
      todos.push(todo);
      localStorage.setItem("todos", JSON.stringify(todos));
    } else {
      showAlert(
        document.querySelector(".alert-wrong"),
        "Please enter the task!!!"
      );
    }
    statusCounter()
  });

  inputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      let date = new Date();
      let stringDate = setDateTime(date);
      let text = inputBox.value;

      if (text) {
        createCard(text, stringDate, "To-Do");

        //temp solution
        edits = document.querySelectorAll(".edit-button");
        removes = document.querySelectorAll(".delete-button");
        statuses = document.querySelectorAll(".status");

        for (let edit of edits) {
          edit.addEventListener("click", editCard);
        }

        for (let remove of removes) {
          remove.addEventListener("click", removeCard);
        }
        for (let status of statuses) {
          status.addEventListener("change", (event) => {
            let card = event.target.closest(".card");
            let text = card.querySelector(".grid").querySelector("label");
            let dateCall = card.querySelector("#date-call");

            let selectedStatus = status.options[status.selectedIndex].value;
            if (selectedStatus === "Completed") {
              text.classList.add("completed");
            } else if (
              (selectedStatus === "In Progress" ||
                selectedStatus === "To-Do") &&
              text.classList.contains("completed")
            ) {
              text.classList.remove("completed");
            }
            todos.forEach((todo) => {
              if (
                todo.content === text.innerText &&
                todo.createdAt === dateCall.innerText
              ) {
                todo.status = selectedStatus;
              }
            });
            localStorage.setItem("todos", JSON.stringify(todos));
            sortCards();
          });
        }

        //local storage part

        const todo = {
          content: text,
          status: "To-Do",
          createdAt: stringDate,
        };

        todos.push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
      } else {
        showAlert(
          document.querySelector(".alert-wrong"),
          "Please enter the task!!!"
        );
      }
    }
  });

  for (let edit of edits) {
    edit.addEventListener("click", editCard);
  }

  for (let remove of removes) {
    remove.addEventListener("click", removeCard);
  }

  multiple.addEventListener("click", selectCards);

  remove.addEventListener("click", removeSelectedCards);

    //filter buttons

  // panels.addEventListener("click", filterCards);


  let allButton=document.querySelector("#all-button");
  let todoButton=document.querySelector("#todo-button");
  let progressButton=document.querySelector("#progress-button");
  let completedButton=document.querySelector("#completed-button");
  allButton.addEventListener("click", () =>{
      let panels=document.querySelector(".panels").children
      for (let panel of panels){
          if (panel.classList.contains("active")) {
              panel.classList.remove("active");
            }
      }
      const cards = document.querySelectorAll(".card");
      for (let card of cards) {
          card.style.display = "block";
      }
      allButton.classList.add("active")
  })

  todoButton.addEventListener("click",filterCards)
  progressButton.addEventListener("click",filterCards)
  completedButton.addEventListener("click",filterCards)
  

  //except all button


  for (let status of statuses) {
    status.addEventListener("change", (event) => {
      let card = event.target.closest(".card");
      let text = card.querySelector(".grid").querySelector("label");
      let dateCall = card.querySelector("#date-call");

      let selectedStatus = status.options[status.selectedIndex].value;
      if (selectedStatus === "Completed") {
        text.classList.add("completed");
      } else if (
        (selectedStatus === "In Progress" || selectedStatus === "To-Do") &&
        text.classList.contains("completed")
      ) {
        text.classList.remove("completed");
      }
      todos.forEach((todo) => {
        if (
          todo.content === text.innerText &&
          todo.createdAt === dateCall.innerText
        ) {
          todo.status = selectedStatus;
        }
      });
      localStorage.setItem("todos", JSON.stringify(todos));
      sortCards();
    });
  }

  //change listener for checkboxes

  for (let cbox of cboxes) {
    cbox.addEventListener("click", (event) => {
      disablingFilterButtons()
      let target = event.target;
      let card = target.closest(".card");
      let length = 0;
      let checkboxes = document.querySelectorAll(".checkbox");
      // let totalLength=cardList.children.length
      let totalLength=0

      for (let card of cardList.children) {
        if (card.style.display!="none"){
          totalLength++
        }
        let checkCard = card.querySelector(".checkbox");
        if (checkCard.checked) {
          length++;
        }
      }
      let multiButton;
      let selectOneButton = document.createElement("button");
      selectOneButton.className = "select-one-button";
      selectOneButton.insertAdjacentHTML(
        "afterbegin",
        `<img src="./images/multiple-one.svg" alt="Multiple One Select button">`
      );
      if (length > 0 && length < totalLength) {
        
        console.log("length > 0 && length < totalLength")
        multiButton = document.querySelector(".multi-select-button");
        let deSelectButton = document.querySelector(".deselect-button");
        if (multiButton) {
          
          console.log("multibutton")
          selectOneButton = document.createElement("button");
          selectOneButton.className = "select-one-button";
          selectOneButton.insertAdjacentHTML(
            "afterbegin",
            `<img src="./images/multiple-one.svg" alt="Multiple One Select button">`
          );
          multiButton.parentNode.replaceChild(selectOneButton, multiButton);
          selectOneButton.addEventListener("click", selectCards);
        } else if (deSelectButton) {
          console.log("deselectButton")
          selectOneButton = document.createElement("button");
          selectOneButton.className = "select-one-button";
          selectOneButton.insertAdjacentHTML(
            "afterbegin",
            `<img src="./images/multiple-one.svg" alt="Multiple One Select button">`
          );
          deSelectButton.parentNode.replaceChild(
            selectOneButton,
            deSelectButton
          );
          selectOneButton.addEventListener("click", selectCards);
        }
      }
      //reseting back to select all button
      else if (length < 1 && document.querySelector(".select-one-button")) {
        console.log(`length < 1 && document.querySelector(".select-one-button")`)
        enablingFilterButtons()
        selectOneButton = document.querySelector(".select-one-button");
        multiButton = document.createElement("button");
        multiButton.classList.add("multi-select-button");
        multiButton.insertAdjacentHTML(
          "afterbegin",
          `<img src="./images/multiple-select.svg" alt="Select multiple button">`
        );
        selectOneButton.parentNode.replaceChild(multiButton, selectOneButton);
        multiButton.addEventListener("click", selectCards);
      } 
      else if (
        length === totalLength &&
        document.querySelector(".select-one-button")
      ) {
       console.log(`length === totalLength &&
       document.querySelector(".select-one-button")`)
        selectOneButton = document.querySelector(".select-one-button");
        let deselectButton = document.createElement("button");
        deselectButton.classList.add("deselect-button");
        deselectButton.insertAdjacentHTML(
          "afterbegin",
          `<img src="./images/deselect.svg" alt="Select multiple button">`
        );
        selectOneButton.parentNode.replaceChild(
          deselectButton,
          selectOneButton
        );
        deselectButton.addEventListener("click", () => {
          multiButton = document.createElement("button");
          multiButton.classList.add("multi-select-button");
          multiButton.insertAdjacentHTML(
            "afterbegin",
            `<img src="./images/multiple-select.svg" alt="Select multiple button">`
          );
          deselectButton.parentNode.replaceChild(multiButton, deselectButton);
          for (let checkbox of checkboxes) {
            checkbox.checked = false;
          }
          multiButton.addEventListener("click", selectCards);
        });
      }

    //conditions for single card in filter
      else if(length===1 && totalLength===1){
        console.log("length===1 && totalLength===1")
        multiButton = document.querySelector(".multi-select-button");
        let deselectButton = document.createElement("button");
        deselectButton.classList.add("deselect-button");
        deselectButton.insertAdjacentHTML(
          "afterbegin",
          `<img src="./images/deselect.svg" alt="Select multiple button">`
        );
        multiButton.parentNode.replaceChild(deselectButton, multiButton);
        deselectButton.addEventListener("click", () => {
          enablingFilterButtons()
          multiButton = document.createElement("button");
          multiButton.classList.add("multi-select-button");
          multiButton.insertAdjacentHTML(
            "afterbegin",
            `<img src="./images/multiple-select.svg" alt="Select multiple button">`
          );
          deselectButton.parentNode.replaceChild(multiButton, deselectButton);
          for (let checkbox of checkboxes) {
            checkbox.checked = false;
          }
          multiButton.addEventListener("click", selectCards);
        });

      }
      else if(length===0 && totalLength===1){
        enablingFilterButtons()
        console.log("length===0 && totalLength===1")
        let deselectButton = document.querySelector(".deselect-button");
        let multiButton = document.createElement("button");
        multiButton.classList.add("multi-select-button");
        multiButton.insertAdjacentHTML(
          "afterbegin",
          `<img src="./images/multiple-select.svg" alt="Multiple select button">`
        );
        deselectButton.parentNode.replaceChild(multiButton, deselectButton);
      }
    });
  }

  statusCounter()
  
  

 

});

//status counter

document.onchange=()=>{
  statusCounter()
}

//function
function createCard(text, stringDate, status) {
  let to_do = "";
  let inProgress = "";
  let completed = "";
  let addClass = "";
  if (status === "To-Do") {
    to_do = "selected";
  } else if (status === "In Progress") {
    inProgress = "selected";
  } else if (status === "Completed") {
    completed = "selected";
    addClass = `class="completed"`;
  }
  const div = document.createElement("div");
  div.classList.add("card");
  div.insertAdjacentHTML(
    "afterbegin",
    `<div class="flex-container">
        <label for="status">
            <select name="status" class="status">
                <option value="To-Do" ${to_do}>To-Do</option>
                <option value="In Progress" ${inProgress}>In Progress</option>
                <option value="Completed" ${completed}>Completed</option>
            </select>
            </label>
            <button class="edit-button"><img src="./images/edit.svg" alt="Edit button"></button>
            <button class="delete-button"><img src="./images/delete.svg" alt="Delete button"></button>
    </div>
    <div class="flex-container-2"> <p id="date-call">${stringDate}</p></div>
    <div class="grid">
        <input class="checkbox" type="checkbox">
        <label ${addClass}>${text}</label>`
  );
  inputBox.value = "";
  cardList.insertAdjacentElement("afterbegin", div);
}

function editCard(event) {
  let card = event.target.closest(".card");
  let editGrid = card.querySelector(".grid");
  let text = editGrid.querySelector("label"); //text element
  let dateCall = card.querySelector("#date-call");
  editGrid.remove();

  disablingElements()

  card.insertAdjacentHTML(
    "beforeend",
    `<input class="editable" type="text" value="${text.textContent}"
    maxlength="40">`
  );
  const editable = card.querySelector(".editable");

  //at end of line focussing
  let eol = editable.value.length;
  editable.setSelectionRange(eol, eol);
  editable.focus();

  //change button images

  //check button
  const editButton = card.querySelector(".edit-button");
  const checkButton = document.createElement("button");
  checkButton.className = "check-button";
  checkButton.insertAdjacentHTML(
    "afterbegin",
    `<img src="./images/check.svg" alt="Check button">`
  );
  editButton.parentNode.replaceChild(checkButton, editButton);

  //cancel button
  const deleteButton = card.querySelector(".delete-button");
  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-button";
  cancelButton.insertAdjacentHTML(
    "afterbegin",
    `<img src="./images/cancel.svg" alt="Cancel button">`
  );
  deleteButton.parentNode.replaceChild(cancelButton, deleteButton);
  // document.onclick=function(){
  //     console.log("hell")
  // }

  //check button clicking action
  checkButton.onclick = function () {
    if (editable.value != "") {
      let confirm = document.querySelector(".confirm");
      

      showConfirm(confirm, "Are you sure to save changes?");

      confirm.querySelector(".right-button").onclick = () => {
        confirm.classList.add("hidden");
        hideCover();
        {
          editable.remove();
          todos.forEach((todo) => {
            if (
              todo.content === text.innerText &&
              todo.createdAt === dateCall.innerText
            ) {
              todo.content = editable.value;
            }
          });
          localStorage.setItem("todos", JSON.stringify(todos));
          text.innerText = editable.value;
          card.insertAdjacentElement("beforeend", editGrid);
          checkButton.parentNode.replaceChild(editButton, checkButton);
          cancelButton.parentNode.replaceChild(deleteButton, cancelButton);
        }
        enablingElements()
      };

      confirm.querySelector(".wrong-button").onclick = () => {
        confirm.classList.add("hidden");
        hideCover();
        editable.focus();
        enablingElements()
      };
    } else {
      showAlert(document.querySelector(".alert-wrong"), "Enter something!!!");
      editable.focus();

    }
  };

  //cancel button clicking action
  cancelButton.onclick = function () {
    //custom message

    let confirm = document.querySelector(".confirm");

    showConfirm(confirm, "Are you sure you want to cancel changes?");

    confirm.querySelector(".right-button").onclick = () => {
      confirm.classList.add("hidden");
      hideCover();
      {
        editable.remove();
        card.insertAdjacentElement("beforeend", editGrid);
        checkButton.parentNode.replaceChild(editButton, checkButton);
        cancelButton.parentNode.replaceChild(deleteButton, cancelButton);
      }
      enablingElements()
    };

    confirm.querySelector(".wrong-button").onclick = () => {
      confirm.classList.add("hidden");
      hideCover();
      editable.focus();
      enablingElements()
    };
  };
}

function removeCard(event) {
  const card = event.target.closest(".card");
  let dateCall = card.querySelector("#date-call");

  //custom message

  let confirm = document.querySelector(".confirm");

  showConfirm(confirm, "Are you sure you want to delete ?");

  confirm.querySelector(".right-button").onclick = () => {
    confirm.classList.add("hidden");
    hideCover();
    {
      card.remove();
      let newTodos = todos.filter((todo) => {
        // return (
        //   todo.content !=
        //     card.querySelector(".grid").querySelector("label").innerText &&
        //   todo.createdAt != dateCall.innerText
        // );
        return (todo.createdAt != dateCall.innerText); // &&(todo.status!=)
      });
      todos = newTodos;
      localStorage.setItem("todos", JSON.stringify(todos));
    }
    statusCounter()
  };

  confirm.querySelector(".wrong-button").onclick = () => {
    confirm.classList.add("hidden");
    hideCover();
  };
  
}

function selectCards() {
  disablingFilterButtons()
  const checkboxes = document.querySelectorAll(".checkbox");
  let length=0
  for (let checkbox of checkboxes){
    let card=checkbox.closest(".card")
    if((card.style.display!="none")){
      length++
    }
  }
  if(length===0){
    showAlert(
      document.querySelector(".alert-wrong"),
      "Nothing selected to be selected"
    );
    return
  }
  //changing to deselect button
  const multiButton =
    document.querySelector(".multi-select-button") ||
    document.querySelector(".select-one-button");
  const deselectButton = document.createElement("button");
  deselectButton.className = "deselect-button";
  deselectButton.insertAdjacentHTML(
    "afterbegin",
    `<img src="./images/deselect.svg" alt="Deselect button">`
  );
  multiButton.parentNode.replaceChild(deselectButton, multiButton);

  //selecting all check boxes

  for (let checkbox of checkboxes) {
    let card=checkbox.closest(".card")
    if((card.style.display!="none")){
    checkbox.checked = true;
    checkbox.setAttribute("multiple-selected", "true");
  }
  

    // if(!checkbox.checked){
    //     checkbox.checked=true
    //     checkbox.setAttribute("multiple-selected","true")
    // }
    // else if((checkbox.checked)&&(checkbox.getAttribute("multiple-selected"))){
    //     checkbox.checked=false
    //     checkbox.removeAttribute("multiple-selected")
    // }
    // else
    //     checkbox.checked=false
  }

  deselectButton.addEventListener("click", () => {
    enablingFilterButtons()
    let multiButton = document.createElement("button");
    multiButton.classList.add("multi-select-button");
    multiButton.insertAdjacentHTML(
      "afterbegin",
      `<img src="./images/multiple-select.svg" alt="Select multiple button">`
    );
    deselectButton.parentNode.replaceChild(multiButton, deselectButton);
    for (let checkbox of checkboxes) {
      checkbox.checked = false;
    }
    multiButton.addEventListener("click", selectCards);
  });
}

function removeSelectedCards() {
  console.log("hello")
  const cards = document.querySelectorAll(".card");
  const checkboxes = document.querySelectorAll(".checkbox");
  let count = 0;
  //not checked condition

  for (let cb of checkboxes) {
    if (!cb.checked) {
      count++;
    } else {
      break;
    }
    if (count === checkboxes.length) {
      showAlert(
        document.querySelector(".alert-wrong"),
        "Nothing selected to be deleted"
      );
    }
  }
  let totLength=0
  let length=0
  for(let card of cards){
    if(card.style.display != "none"){
      totLength++
    }
  }
  console.log(totLength)
  for (let cb of checkboxes) {
    if (cb.checked) {
      //custom messages

      let confirm = document.querySelector(".confirm");

      showConfirm(confirm, "Are you sure you want to delete tasks?");

      confirm.querySelector(".right-button").onclick = () => {
        confirm.classList.add("hidden");
        enablingFilterButtons()
        hideCover();
        {
          for (let card of cards) {
            length=0
            let checkbox = card.querySelector(".checkbox");
            if (checkbox.checked && !(card.style.display === "none")) {
              card.remove();
              length++
              let dateCall = card.querySelector("#date-call");
              let i = 0;
              let newTodos = todos.filter((todo) => {
                // return (((todo.content!=card.querySelector(".grid").querySelector("label").innerText)&&(todo.createdAt!=dateCall.innerText)))
                return todo.createdAt != dateCall.innerText;
              });
              todos = newTodos;
              localStorage.setItem("todos", JSON.stringify(todos));
            }
          }
          // break
        }
        console.log(length)
        statusCounter()
        let button = document.querySelector(".deselect-button")|| document.querySelector(".select-one-button");
        if(button){
        let multiButton = document.createElement("button");
        multiButton.classList.add("multi-select-button");
        multiButton.insertAdjacentHTML(
          "afterbegin",
          `<img src="./images/multiple-select.svg" alt="Multiple select button">`
        );
        button.parentNode.replaceChild(multiButton, button);
        multiButton.addEventListener("click",selectCards)
        }

      };

      confirm.querySelector(".wrong-button").onclick = () => {
        console.log("first")
        confirm.classList.add("hidden");
        hideCover();
      };
    }
  }
}

function filterCards(event) {
    if((event.target.innerText==="To-Do")||(event.target.innerText==="In Progress")||(event.target.innerText==="Completed")){
    const cards = document.querySelectorAll(".card");
    // const allButton = document.querySelector("#all-button");
    let panels=document.querySelector(".panels").children
    for (let panel of panels){
        if (panel.classList.contains("active")) {
            panel.classList.remove("active");
          }
    }
    event.target.closest("button").classList.add("active")
    for (let card of cards) {
      card.style.display = "none";
      const select = card.querySelector(".status");
      for (let option of select) {
        if (option.value === event.target.textContent && option.selected) {
          card.style.display = "block";
          break;
        }
      }
    }
  }
  
  }
function sortCards() {
  const cards = document.querySelectorAll(".card");
  const arr = Array.from(cards);
  arr.sort((card1, card2) => {
    return priority(card1) - priority(card2);
  });
  cardList.innerHTML = "";
  for (elem of arr) {
    cardList.insertAdjacentElement("beforeend", elem);
  }
}

function priority(card) {
  const status = card.querySelector(".status");
  for (let option of status) {
    if (option.value === "To-Do" && option.selected) {
      return 1;
    } else if (option.value === "In Progress" && option.selected) {
      return 2;
    } else if (option.value === "Completed" && option.selected) {
      return 3;
    }
  }
}

function setDateTime(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
    let date1 = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    
    (second < 10) ? second='0'+second:  second;
    (minute < 10) ? minute='0'+minute:  minute;
    (hour < 10) ? hour='0'+hour:  hour;
    (date1 < 10) ? date1='0'+date1:  date1;
  const dateString = `${date1} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()} , ${hour} : ${minute} : ${second}`;
  return dateString;
}

// custom messages

//background cover
function showCover() {
  let coverDiv = document.createElement("div");
  coverDiv.classList.add("cover-div");
  document.body.style.overflowY = "hidden";
  document.body.append(coverDiv);
}

//hide cover

function hideCover() {
  document.querySelector(".cover-div").remove();
  document.body.style.overflowY = "";
}

function showAlert(alert, content = "") {
  let flag = true;
  showCover();
  if (content) {
    alert.querySelector("p").innerText = content;
  }
  alert.classList.remove("hidden");
  alert.querySelector(".wrong-button").onclick = () => {
    alert.classList.add("hidden");
    hideCover();
    flag = false;
  };
  if (flag) hideAlert(alert);
}
function hideAlert(alert) {
  setTimeout(() => {
    alert.classList.add("hidden");
    if (document.querySelector(".cover-div")) hideCover();
  }, 1000);
}

function showConfirm(confirm, content = "") {
  showCover();
  if (content) {
    confirm.querySelector("p").innerText = content;
  }
  confirm.classList.remove("hidden");
}

//status counter
function statusCounter(){
  let panels=document.querySelector(".panels")
  let totalLength=0
  for(let panel of panels.children){
    let counter=panel.querySelectorAll("span")[1]
    let text=panel.querySelectorAll("span")[0].textContent
    let length=0
    if(text!="All"){
    for(let card of cardList.children){
      let select=card.querySelector(".status")
      let status
      for(let option of select){
        
        if(option.selected){
          status=option.innerText
        }
      }
      if(text===status){
        length++
      }
    }
    
    // console.log(text)
    counter.textContent=` (${length})`
    totalLength+=length
  }
  }
  document.querySelector("#all-button").querySelectorAll("span")[1].textContent=` (${totalLength})`
}

//disabling elements

function disablingElements(){
  let buttons = container.querySelectorAll("#container button ,#container input");
  for (let button of buttons) { 
    button.disabled = true; }
}

function enablingElements(){
  let buttons = container.querySelectorAll("#container button,#container input");
  for (let button of buttons) { 

    button.disabled = false; }
}

function disablingFilterButtons(){
  let buttons = filterButtons.querySelectorAll("#filter-buttons button");
  for (let button of buttons) { 
    button.disabled = true; }
}

function enablingFilterButtons(){
  let buttons = filterButtons.querySelectorAll("#filter-buttons button");
  for (let button of buttons) { 
    button.disabled = false; }
}
// function scrollCards(){
  
//   if(cardContainer.children.length>4){
//     console.log(cardContainer.children.length)
//     cardContainer.style.height="530"+"px"
//     cardContainer.style.overflow="auto"
//   }
  
// }
function scrollCards(){
  let length=0
  for(let card of cardContainer.children){
    if(card.style.display!="none")
      length++
  }
  if(length>3){
    console.log("first")
    console.log(cardContainer.children.length)
    cardContainer.style.height="536"+"px"
    cardContainer.style.overflow="auto"
  }
  
}


