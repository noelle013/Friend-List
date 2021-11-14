const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const userList = JSON.parse(localStorage.getItem('bestFriendsList'));
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const nameInput = document.querySelector("#name-input");

// get userlist
function renderList(data) {
  let rawHTML = "";
  data.forEach((user) => {
    rawHTML += `
    <div class="usercard m-1" style="width: 12rem ">
      <img src="${user.avatar}" class="card-img-top" alt="..." data-toggle="modal" data-target="#user-modal" data-id="${user.id}">
      <div class="card-body ">
        <h6 class="card-title text-center">${user.name} <i class="fas fa-star fa-1x" data-id="${user.id}"></i></h6>
      </div>
    </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}


// modal function
function userModal(id) {
  const modalTitle = document.querySelector(".modal-title");
  const modalAvatar = document.querySelector(".modal-avatar");
  const userInfo = document.querySelector(".modal-info");

  // 避免出現前一次點擊資料的殘影
  modalTitle.textContent = "";
  modalAvatar.src = "";
  userInfo.textContent = "";

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalTitle.innerText = `${data.name}  ${data.surname}`;
    modalAvatar.src = `${data.avatar}`;
    userInfo.innerHTML = `
      <p>email:${data.email}<br>
         gender:${data.gender}<br>
         age:${data.age}<br>
         birthday:${data.birthday}
      </p>`;
  });
}

function removeBestFriends(id) {
  if (!userList || !userList.length) return

  let userIndex = userList.findIndex(user => user.id === id)
  //if (userIndex === -1) return
  userList.splice(userIndex, 1)
  localStorage.setItem("bestFriendsList", JSON.stringify(userList))
  renderList(userList)
}
// modal event
dataPanel.addEventListener("click", function onPanelClick(event) {
  if (event.target.matches(".card-img-top")) {
    userModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".fas")) {
    event.target.classList.add("far");
    event.target.classList.remove("fas");
    removeBestFriends(Number(event.target.dataset.id));
  }
});

renderList(userList);


