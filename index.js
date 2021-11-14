const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const userList = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const nameInput = document.querySelector("#name-input");
const user_per_page = 30
const paginator = document.querySelector("#paginator")
let filterFriends = [];

// get userlist
function renderList(data) {
  let rawHTML = "";
  data.forEach((user) => {
    rawHTML += `
    <div class="usercard m-1" style="width: 12rem ">
      <img src="${user.avatar}" class="card-img-top" alt="..." data-toggle="modal" data-target="#user-modal" data-id="${user.id}">
      <div class="card-body ">
        <h6 class="card-title text-center">${user.name} <i class="far fa-star fa-1x" data-id="${user.id}"></i></h6>
      </div>
    </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPage(amount) {
  const numberOfPages = Math.ceil(amount / user_per_page)
  let rawHTML = ""
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item justify-content-center"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}



function getUsersByPage(page) {
  const data = filterFriends.length ? filterFriends : userList
  const startIndex = (page - 1) * user_per_page
  return data.slice(startIndex, startIndex + user_per_page)
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
// best friend function
function bestFriends(id) {
  const list = JSON.parse(localStorage.getItem("bestFriendsList")) || [];
  const user = userList.find((user) => user.id === id);

  if (list.some((user) => user.id === id)) {
    return alert('Already be your best friend.')
  }
  list.push(user);
  localStorage.setItem("bestFriendsList", JSON.stringify(list));
}
// modal event
dataPanel.addEventListener("click", function onPanelClick(event) {
  if (event.target.matches(".card-img-top")) {
    userModal(event.target.dataset.id);
  } else if (event.target.matches(".far")) {
    event.target.classList.add("fas");
    event.target.classList.remove("far");
    bestFriends(Number(event.target.dataset.id));
  }
});

//page event
paginator.addEventListener("click", function onPageClick(event) {
  if (event.target.tagName !== "A") return
  const page = event.target.dataset.page
  renderList(getUsersByPage(page))
})

// search event
searchForm.addEventListener("click", function searchFormClick(event) {
  event.preventDefault();
  const keyword = nameInput.value.trim().toLowerCase();

  filterFriends = userList.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  );
  if (filterFriends.length === 0) {
    return alert("Cannot find your friends by " + keyword);

  }
  //renderList(filterFriends)
  renderList(getUsersByPage(1));
  renderPage(filterFriends.length)
  nameInput.value = ''
});

axios.get(INDEX_URL).then((response) => {
  userList.push(...response.data.results);
  renderList(getUsersByPage(1));
  renderPage(userList.length)
});