document.addEventListener("DOMContentLoaded", () => {
    const liveStatsSection = document.getElementById("liveStats");
    const timeSpan = document.getElementById("statsTime");
    const valueSpan = document.getElementById("statsValue");
    const delaySpan = document.getElementById("statsDelay");

    if (!liveStatsSection || !timeSpan || !valueSpan || !delaySpan) {
        return;
    }

    function runUpdateAnimation() {
        liveStatsSection.classList.remove("is-updating");
        void liveStatsSection.offsetWidth;
        liveStatsSection.classList.add("is-updating");

        [timeSpan, valueSpan, delaySpan].forEach((el) => {
            el.classList.remove("stat-pop");
            void el.offsetWidth;
            el.classList.add("stat-pop");
        });
    }

    async function fetchStats() {
        try {
            const res = await fetch("/api/random-stats", {
                headers: { Accept: "application/json" },
            });

            if (!res.ok) {
                console.warn("Błąd podczas pobierania /api/random-stats");
                return;
            }

            const data = await res.json();

            timeSpan.textContent = new Date(data.generatedAt).toLocaleTimeString();
            valueSpan.textContent = data.value;
            delaySpan.textContent = data.simulatedDelayMs;

            runUpdateAnimation();
        } catch (err) {
            console.error("Błąd sieci przy /api/random-stats:", err);
        }
    }

    fetchStats();
    setInterval(fetchStats, 5000);
});
