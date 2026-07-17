const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw6UokA3WNc57xHd2-lSkhsfti6n0WQhu9OR42YsSrdzRg9arlrwASrGM4dGZGoD5Nm3A/exec";

const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const uploadButton = document.getElementById("uploadButton");
const progress = document.getElementById("progress");
const statusText = document.getElementById("status");

let selectedFiles = [];

fileInput.addEventListener("change", function () {

    preview.innerHTML = "";
    selectedFiles = [...this.files];

    if (selectedFiles.length === 0) return;

    selectedFiles.forEach(file => {

        const reader = new FileReader();

        reader.onload = function (e) {

            const div = document.createElement("div");
            div.className = "preview-item";

            if (file.type.startsWith("image")) {

                div.innerHTML = `<img src="${e.target.result}" alt="">`;

            } else {

                div.innerHTML = `<video src="${e.target.result}" controls></video>`;

            }

            preview.appendChild(div);

        };

        reader.readAsDataURL(file);

    });

});

uploadButton.addEventListener("click", async () => {

    if (selectedFiles.length === 0) {

        alert("Lütfen önce fotoğraf veya video seçin.");

        return;

    }

    uploadButton.disabled = true;

    progress.style.width = "0%";

    statusText.innerHTML = "Yükleme başlıyor...";

    let uploaded = 0;
    try {

        for (const file of selectedFiles) {

            statusText.innerHTML = `${file.name} yükleniyor...`;

            const base64 = await new Promise((resolve, reject) => {

                const reader = new FileReader();

                reader.onload = () => resolve(reader.result.split(",")[1]);

                reader.onerror = reject;

                reader.readAsDataURL(file);

            });

            const response = await fetch(WEB_APP_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: file.name,
                    type: file.type,
                    file: base64

                })

            });

            const result = await response.json();

            if (!result.success) {

                throw new Error(result.error || "Yükleme başarısız.");

            }

            uploaded++;

            const percent = Math.round((uploaded / selectedFiles.length) * 100);

            progress.style.width = percent + "%";

            statusText.innerHTML =
                `${uploaded} / ${selectedFiles
