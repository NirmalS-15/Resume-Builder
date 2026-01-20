const API = "http://localhost:5000/api";

async function saveResume() {
    const token = localStorage.getItem("token");

    const data = {
        name: document.getElementById("fullname").value,
        skills: document.getElementById("skills").value.split(",")
    };

    const templateId = document.getElementById("template").value;

    const res = await fetch(`${API}/resume/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ data, templateId })
    });

    const result = await res.json();
    alert(result.message);
}
