function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function createResume() {
    window.location.href = "resume.html";
}
