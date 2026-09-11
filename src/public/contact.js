document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const clientErrorsBox = document.getElementById("clientErrors");
    const serverResponseBox = document.getElementById("serverResponse");

    if (!form || !clientErrorsBox || !serverResponseBox) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearBox(clientErrorsBox);
        clearBox(serverResponseBox);

        const formData = new FormData(form);

        const payload = {
            name: (formData.get("name") || "").toString().trim(),
            email: (formData.get("email") || "").toString().trim(),
            age: (formData.get("age") || "").toString().trim(),
            message: (formData.get("message") || "").toString().trim(),
        };

        const clientErrors = validateOnClient(payload);
        if (clientErrors.length > 0) {
            showErrors(clientErrorsBox, clientErrors);
            return;
        }

        serverResponseBox.textContent = "Wysyłanie danych...";
        serverResponseBox.style.color = "#a7b0c0";

        try {
            const body = new URLSearchParams(payload);

            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    Accept: "application/json",
                },
                body,
            });

            const data = await response.json().catch(() => null);

            if (!response.ok || !data) {
                clearBox(serverResponseBox);
                showErrors(clientErrorsBox, [
                    "Nie udało się wysłać danych. Spróbuj ponownie później.",
                ]);
                return;
            }

            if (!data.ok) {
                clearBox(serverResponseBox);
                const errors = Array.isArray(data.errors)
                    ? data.errors
                    : ["Nieznany błąd walidacji."];
                showErrors(clientErrorsBox, errors);
                return;
            }

            renderSuccess(serverResponseBox, data.data);
            form.reset();
        } catch (err) {
            console.error(err);
            clearBox(serverResponseBox);
            showErrors(clientErrorsBox, [
                "Wystąpił błąd sieci. Spróbuj ponownie później.",
            ]);
        }
    });
});

function clearBox(box) {
    if (!box) return;
    box.className = "";
    box.innerHTML = "";
    box.style.color = "";
}

function showErrors(box, errors) {
    if (!box) return;

    box.className = "error-list";
    const ul = document.createElement("ul");

    errors.forEach((err) => {
        const li = document.createElement("li");
        li.textContent = err;
        ul.appendChild(li);
    });

    box.appendChild(ul);
}

function validateOnClient({ name, email, age, message }) {
    const errors = [];

    const nameRegex = /^[A-Za-z0-9_-]{3,16}$/;
    if (!nameRegex.test(name)) {
        errors.push(
            "Imię/Nick musi mieć od 3 do 16 znaków i może zawierać tylko litery, cyfry, myślnik oraz podkreślenie (bez spacji)."
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push("Podaj poprawny adres e-mail.");
    }

    const ageNum = Number.parseInt(age, 10);
    if (Number.isNaN(ageNum) || ageNum < 18 || ageNum >= 100) {
        errors.push("Musisz mieć co najmniej 18 lat, aby wysłać formularz i nie możesz mieć więcej niż 100 lat");
    }

    if (!message || message.length < 10) {
        errors.push("Wiadomość musi mieć co najmniej 10 znaków.");
    }

    return errors;
}

function renderSuccess(box, data) {
    if (!box || !data) return;

    box.className = "server-response";
    box.style.color = "#22c55e";

    const statusText = data.isAdult
        ? "Masz pełnoletni profil (18+)."
        : "Profil niepełnoletni.";

    box.innerHTML = `
    <p><strong>Dane zostały zapisane poprawnie.</strong></p>
    <p>Imię/Nick: <strong>${data.name}</strong></p>
    <p>Email: <strong>${data.email}</strong></p>
    <p>Wiek: <strong>${data.age}</strong> lat</p>
    <p>Status: ${statusText}</p>
    <p>Długość wiadomości: ${data.messageLength} znaków</p>
    <p><em>Odebrano na serwerze: ${new Date(data.receivedAt).toLocaleString()}</em></p>
  `;
}
