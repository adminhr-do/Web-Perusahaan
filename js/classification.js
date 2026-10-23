
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // ELEMENTS
    // =====================================

    const input = document.getElementById("classificationInput");
    const results = document.getElementById("classificationResults");
    const clearButton = document.getElementById("clearClassification");

    const selectedCard = document.getElementById("selectedClassification");
    const selectedLogo = document.getElementById("selectedLogo");
    const selectedName = document.getElementById("selectedName");
    const selectedDescription = document.getElementById("selectedDescription");
    const selectedWebsite = document.getElementById("selectedWebsite");

    const changeButton = document.getElementById("changeClassification");
    const noSelection = document.getElementById("noSelection");

    // Kartu yang sudah ada di HTML
    const societyCards = Array.from(
        document.querySelectorAll(".society-card")
    );

    let selectedItem = null;

    // Nama singkat dan nama alternatif
    const aliases = {
        "abs": ["abs", "american bureau of shipping"],
        "bki": ["bki", "biro klasifikasi indonesia"],
        "btkp": ["btkp", "balai teknik keselamatan pelayaran"],
        "lr": ["lr", "lloyd's register"],
        "lloyds": ["lloyd's register", "lloyds register"]
    };

    // =====================================
    // READ DATA FROM EXISTING CARDS
    // =====================================

    function getCardData(card) {
        const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
        const image = card.querySelector("img");
        const link = card.querySelector('a[href^="http"]');

        const name = heading
            ? heading.textContent.trim()
            : card.textContent.trim().split("\n")[0];

        const descriptionElement = card.querySelector("p");

        return {
            name: name,
            card: card,
            logo: image ? image.getAttribute("src") : "",
            description: descriptionElement
                ? descriptionElement.textContent.trim()
                : "",
            website: link ? link.href : "",
            searchText: card.textContent.toLowerCase() + " " +
                (image ? image.alt.toLowerCase() : "")
        };
    }

    const classifications = societyCards.map(getCardData);

    // =====================================
    // MATCH SEARCH KEYWORD
    // =====================================

    
function matchesSearch(item, keyword) {
    const search = keyword.trim().toLowerCase();

    if (!search) return true;

    const aliases = {
        abs: ["abs", "american bureau of shipping"],
        bki: ["bki", "biro klasifikasi indonesia"],
        btkp: ["btkp", "balai teknik keselamatan pelayaran"],
        lr: ["lr", "lloyd's register"]
    };

    const terms = aliases[search] || [search];

    const card = item.card;
    const image = card.querySelector("img");

    const searchableText = (
        card.textContent + " " +
        (image ? image.alt : "") + " " +
        (image ? image.src : "") + " " +
        card.getAttribute("href")
    ).toLowerCase();

    return terms.some(term => searchableText.includes(term));
}

    // =====================================
    // FILTER EXISTING CARDS
    // =====================================

    function filterSocietyCards(keyword) {
        classifications.forEach(item => {
            item.card.style.display =
                matchesSearch(item, keyword) ? "" : "none";
        });
    }

    // =====================================
    // SEARCH DROPDOWN
    // =====================================

    function renderResults(keyword) {
        results.replaceChildren();

        const search = keyword.trim();

        filterSocietyCards(search);

        if (!search) {
            results.classList.remove("show");
            input.setAttribute("aria-expanded", "false");
            return;
        }

        const matches = classifications.filter(item =>
            matchesSearch(item, search)
        );

        if (matches.length === 0) {
            const empty = document.createElement("div");
            empty.className = "classification-empty";
            empty.textContent = "Classification society not found.";
            results.appendChild(empty);
        } else {
            matches.forEach(item => {
                const option = document.createElement("button");

                option.type = "button";
                option.className = "classification-option";
                option.setAttribute("role", "option");

                const icon = document.createElement("i");
                icon.className = "fas fa-building";

                const label = document.createElement("span");
                label.textContent = item.name;

                option.append(icon, label);

                option.addEventListener("click", function () {
                    selectClassification(item);
                });

                results.appendChild(option);
            });
        }

        results.classList.add("show");
        input.setAttribute("aria-expanded", "true");
    }

    // =====================================
    // SELECT CLASSIFICATION
    // =====================================

    function selectClassification(item) {
        selectedItem = item;

        input.value = item.name;
        input.readOnly = true;

        results.classList.remove("show");
        input.setAttribute("aria-expanded", "false");

        selectedName.textContent = item.name;
        selectedDescription.textContent =
            item.description || "Classification society.";

        if (item.logo) {
            selectedLogo.src = item.logo;
            selectedLogo.alt = item.name + " logo";
            selectedLogo.style.display = "block";
        } else {
            selectedLogo.removeAttribute("src");
            selectedLogo.style.display = "none";
        }

        selectedLogo.onerror = function () {
            this.style.display = "none";
        };

        selectedLogo.onload = function () {
            this.style.display = "block";
        };

        if (item.website) {
            selectedWebsite.href = item.website;
            selectedWebsite.hidden = false;
        } else {
            selectedWebsite.removeAttribute("href");
            selectedWebsite.hidden = true;
        }

        selectedCard.hidden = true;
        noSelection.hidden = true;
        clearButton.style.display = "block";
    }

    // =====================================
    // RESET SEARCH AND SELECTION
    // =====================================

    function resetSelection() {
        selectedItem = null;

        input.value = "";
        input.readOnly = false;

        // Tampilkan semua kartu lagi
        filterSocietyCards("");

        selectedCard.hidden = true;
        noSelection.hidden = true;

        selectedLogo.removeAttribute("src");
        selectedLogo.style.display = "block";

        selectedName.textContent = "";
        selectedDescription.textContent = "";

        selectedWebsite.removeAttribute("href");
        selectedWebsite.hidden = true;

        results.classList.remove("show");
        results.replaceChildren();

        clearButton.style.display = "block";
        input.setAttribute("aria-expanded", "false");

        input.focus();
    }

    // =====================================
    // EVENT LISTENERS
    // =====================================

    input.addEventListener("input", function () {
        selectedItem = null;

        selectedCard.hidden = true;
        noSelection.hidden = true;

        clearButton.style.display =
            this.value ? "block" : "none";

        renderResults(this.value);
    });

    input.addEventListener("focus", function () {
        if (!this.readOnly && this.value.trim()) {
            renderResults(this.value);
        }
    });

    clearButton.addEventListener("click", resetSelection);
    changeButton.addEventListener("click", resetSelection);

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".classification-search")) {
            results.classList.remove("show");
            input.setAttribute("aria-expanded", "false");
        }
    });

    // Kondisi awal: tampilkan semua kartu
    filterSocietyCards("");

});
