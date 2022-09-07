const requestURL = 'http://localhost:8080/api/users';
const usersTableNavLink = document.getElementById("horizontal_navigation-users_table");
const allUsersTable = document.querySelector(".all-users-table");

//------------- Таблица со всеми юзерами -------------//

// Генерация кода для заполнения таблицы данными обо всех юзерах

const renderUsers = (users) => {
    if (users.length > 0) {
        let table = '';
        users.forEach((user) => {
            table += `
                <tr>
                    <td> ${user.id} </td>
                    <td> ${user.username} </td>
                    <td> ${user.lastName} </td>
                    <td> ${user.age} </td>
                    <td> ${user.email} </td>
                    <td> ${user.roles.map((role) => role.name === "ROLE_USER" ? " USER" : " ADMIN")} </td>
                    <td> <button type="button" class="btn btn-info" id="btn-edit-modal-call" data-toggle="modal" data-target="modal-edit"
                    data-id="${user.id}">Edit</button></td>
                    <td> <button type="button" class="btn btn-danger" id="btn-delete-modal-call"
                    data-id="${user.id}">Delete</button></td>
                </tr>`
        })
        allUsersTable.innerHTML = table;
    }
}

// Получение данных всех пользователей с помощью fetch и заполнение таблицы с помощью функции renderUsers

function getAllUsers() {
    fetch(requestURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            renderUsers(data);
        })
}

// Вызов функции
getAllUsers();

//------------- Добавление нового юзера -------------//

//Форма добавления юзера
const addUserForm = document.querySelector(".add-user-form");
// Поля формы добавления нового юзера
const addUserFormName = document.getElementById("add-user-form-name");
const addUserFormLastName = document.getElementById("add-user-form-last-name");
const addUserFormAge = document.getElementById("add-user-form-age");
const addUserFormEmail = document.getElementById("add-user-form-email");
const addUserFormPassword = document.getElementById("add-user-form-password");
const addUserFormRoles = document.getElementById("add-user-form-roles");

//Генерация ролей
function getRolesFromAddUserForm() {
    let roles = Array.from(addUserFormRoles.selectedOptions)
        .map(option => option.value);
    let rolesToAdd = [];
    if (roles.includes("2")) {
        let role1 = {
            id: 2,
            name: "ADMIN"
        }
        rolesToAdd.push(role1);
    }
    if (roles.includes("1")) {
        let role2 = {
            id: 1,
            name: "USER"
        }
        rolesToAdd.push(role2);
    }
    return rolesToAdd;
}

addUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch(requestURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: addUserFormName.value,
            lastName: addUserFormLastName.value,
            age: addUserFormAge.value,
            email: addUserFormEmail.value,
            password: addUserFormPassword.value,
            roles: getRolesFromAddUserForm()
        })
    })
        .then(() => getAllUsers())
        .then(() => addUserForm.reset())

    $('.nav-tabs a[href="#usersTable"]').tab('show')
})

//------------- Удаление и изменение юзеров -------------//

const modalEditSubmitBtn = document.getElementById("submit_btn-modal-edit");
const editUsersRoles = document.getElementById("edit-rolesSelect");
const editRoleAdminOption = document.getElementById("edit-role_admin");
const editRoleUserOption = document.getElementById("edit-role_user");

const deleteRoleAdminOption = document.getElementById("delete-role_admin");
const deleteRoleUserOption = document.getElementById("delete-role_user");
const modalDeleteSubmitBtn = document.getElementById("submit_btn-modal-delete");

function getRolesFromEditUserForm() {
    let roles = Array.from(editUsersRoles.selectedOptions)
        .map(option => option.value);
    let rolesToEdit = [];
    if (roles.includes("2")) {
        let role1 = {
            id: 2,
            name: "ADMIN"
        }
        rolesToEdit.push(role1);
    }
    if (roles.includes("1")) {
        let role2 = {
            id: 1,
            name: "USER"
        }
        rolesToEdit.push(role2);
    }
    return rolesToEdit;
}

//Отслеживание нажатий по кнопкам Edit и Delete в таблице юзеров
allUsersTable.addEventListener("click", e => {
    e.preventDefault();
    let delButtonIsPressed = e.target.id === 'btn-delete-modal-call';
    let editButtonIsPressed = e.target.id === 'btn-edit-modal-call';

//------------- Удаление юзеров -------------//

    const deleteUsersId = document.getElementById("delete-id")
    const deleteUsersName = document.getElementById("delete-name")
    const deleteUsersLastName = document.getElementById("delete-lastName")
    const deleteUsersAge = document.getElementById("delete-age")
    const deleteUsersEmail = document.getElementById("delete-email")

    if (delButtonIsPressed) {
        let currentUserId = e.target.dataset.id;
        fetch(requestURL + "/" + currentUserId, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(res => res.json())
            .then(user => {
                deleteUsersId.value = user.id;
                deleteUsersName.value = user.username;
                deleteUsersLastName.value = user.lastName;
                deleteUsersAge.value = user.age;
                deleteUsersEmail.value = user.email;

                let deleteRoles = user.roles.map(i => i.name)
                deleteRoles.forEach(
                    role => {
                        if (role.includes("ROLE_ADMIN")) {
                            deleteRoleAdminOption.setAttribute("selected", "selected");
                        } else if (role.includes("ROLE_USER")) {
                            deleteRoleUserOption.setAttribute("selected", "selected");
                        }
                    })
            })
        $('#modal-delete').modal('show');

        modalDeleteSubmitBtn.addEventListener("click", e => {
            e.preventDefault();
            fetch(`${requestURL}/${currentUserId}`, {
                method: 'DELETE',
            })
                .then(() => getAllUsers())

            $('#modal-delete').modal('hide');

        })
    }

//------------- Изменение юзеров -------------//

    const editUsersId = document.getElementById("edit-id");
    const editUsersName = document.getElementById("edit-name");
    const editUsersLastName = document.getElementById("edit-lastName");
    const editUsersAge = document.getElementById("edit-age");
    const editUsersEmail = document.getElementById("edit-email");
    const editUsersPassword = document.getElementById("edit-password");

    if (editButtonIsPressed) {
        let currentUserId = e.target.dataset.id;
        fetch(requestURL + "/" + currentUserId, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(res => res.json())
            .then(user => {

                editUsersId.value = user.id;
                editUsersName.value = user.username;
                editUsersLastName.value = user.lastName;
                editUsersAge.value = user.age;
                editUsersEmail.value = user.email;
                editUsersPassword.value = user.password;

                let editRoles = user.roles.map(i => i.name)
                editRoles.forEach(
                    role => {
                        if (role.includes("ROLE_ADMIN")) {
                            editRoleAdminOption.setAttribute("selected", "selected");
                        } else if (role.includes("ROLE_USER")) {
                            editRoleUserOption.setAttribute("selected", "selected");
                        }
                    })
            })

        $('#modal-edit').modal('show');

        modalEditSubmitBtn.addEventListener("click", e => {
            e.preventDefault();
            let user = {
                id: editUsersId.value,
                username: editUsersName.value,
                lastName: editUsersLastName.value,
                age: editUsersAge.value,
                email: editUsersEmail.value,
                password: editUsersPassword.value,
                roles: getRolesFromEditUserForm()
            }
            fetch(`${requestURL}/${currentUserId}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(user)
            })
                .then(() => getAllUsers())

            $('#modal-edit').modal('hide');
        })
    }
})

//------------- Заполнение панели юзера -------------//

const userPanelData = document.getElementById("user_panel-data");
const authorisedUserData = document.getElementById("authorised_user-data");

let currentUser = () => {
    fetch("http://localhost:8080/api/user", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(user => {
            if (user != null) {
                userPanelData.innerHTML = `
                    <tr>
                        <td> ${user.id} </td>
                        <td> ${user.username} </td>
                        <td> ${user.lastName} </td>
                        <td> ${user.age} </td>
                        <td> ${user.email} </td>
                        <td> ${user.roles.map((role) => role.name === "ROLE_USER" ? " USER" : " ADMIN")} </td>
                    </tr>
                `
                authorisedUserData.innerHTML = `
                    <a class="d-inline font-weight-bold">${user.email}</a>
                    <a> with role:                    
                     ${user.roles.map((role) => role.name === "ROLE_USER" ? " USER" : " ADMIN")}</a>`
            }
        })
}
currentUser();