const express = require("express");
const path = require("path");

const app = express();
const PORT = 7777;

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.requestTime = new Date();
    console.log(`[${req.requestTime.toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, "public")));

function validateContactPayload(payload) {
    const { name, email, age, message } = payload;

    const errors = [];

    const trimmedName = (name || "").trim();
    const trimmedEmail = (email || "").trim();
    const trimmedMessage = (message || "").trim();
    const ageNum = Number.parseInt(age, 10);

    const nameRegex = /^[A-Za-z0-9_-]{3,16}$/;
    if (!nameRegex.test(trimmedName)) {
        errors.push(
            "Imię/Nick musi mieć od 3 do 16 znaków i może zawierać tylko litery, cyfry, myślnik oraz podkreślenie (bez spacji)."
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        errors.push("Podaj poprawny adres e-mail.");
    }

    if (Number.isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        errors.push("Musisz mieć co najmniej 18 lat, aby wysłać formularz. Nie możesz mieć też więcej niż 100 lat");
    }

    if (trimmedMessage.length < 10) {
        errors.push("Wiadomość musi mieć co najmniej 10 znaków.");
    }

    return {
        value: {
            name: trimmedName,
            email: trimmedEmail,
            age: ageNum,
            message: trimmedMessage,
        },
        errors,
    };
}

app.post("/api/contact", (req, res) => {
    const { value, errors } = validateContactPayload(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            ok: false,
            errors,
        });
    }

    const isAdult = value.age >= 18;
    const messageLength = value.message.length;

    return res.json({
        ok: true,
        data: {
            name: value.name,
            email: value.email,
            age: value.age,
            isAdult,
            messageLength,
            receivedAt: req.requestTime.toISOString(),
        },
    });
});

app.get("/api/random-stats", (req, res) => {
    const now = new Date();
    const randomValue = Math.floor(Math.random() * 100) + 1;
    const randomDelayMs = Math.floor(Math.random() * 500);

    res.json({
        generatedAt: now.toISOString(),
        value: randomValue,
        simulatedDelayMs: randomDelayMs,
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
