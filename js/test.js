const pano = document.getElementById("pano");
const toolbox = document.getElementById("toolbox");

toolbox.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("tool")) {
        e.dataTransfer.setData("text/plain", e.target.dataset.tool);
    }
});

pano.addEventListener("dragover", (e) => {
    e.preventDefault();
});

pano.addEventListener("drop", (e) => {
    e.preventDefault();
    const selectedTool = e.dataTransfer.getData("text/plain");
    const x = e.clientX - pano.getBoundingClientRect().left;
    const y = e.clientY - pano.getBoundingClientRect().top;

    if (selectedTool === "box") {
        createBox(x, y);
    }
});

function createBox(left, top) {
    const existingBoxes = document.querySelectorAll(".box");
    if (existingBoxes.length >= 10) {
        alert("Maksimum 10 kutu ekleyebilirsiniz.");
        return;
    }

    const box = document.createElement("div");
    box.classList.add("box");
    box.style.left = left + "px";
    box.style.top = top + "px";

    // Kutu başlığı
    const boxTitle = document.createElement("input");
    box.appendChild(boxTitle);

    // Kutu içeriği
    const boxContent = document.createElement("div");
    boxContent.classList.add("box-content");
    box.appendChild(boxContent);

    // Ekleme butonu
    const addButton = document.createElement("button");
    addButton.textContent = "+ Ekle";
    addButton.classList.add("add-button");
    boxContent.appendChild(addButton);

    // Görev kutusu
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    boxContent.appendChild(taskContainer);

    // Görev sayacı
    let taskCount = 0;

    // Ekleme butonu tıklama işlevi
    addButton.addEventListener("click", () => {
        if (taskCount >= 10) {
            alert("Maksimum 10 görev ekleyebilirsiniz.");
            return;
        }
        createTask(taskContainer);
        taskCount++;
        updateBoxHeight(box, taskCount);

        // Eğer görev sayısı 10 ise ekleme butonunu gizle ve kutuyu küçült
        if (taskCount >= 10) {
            addButton.style.display = "none";
            shrinkBox(box);
        }
    });

    pano.appendChild(box);

    // Kutuya sürükleme etkinliği ekle
    box.draggable = true;

    let offsetX, offsetY;

    // Sürükleme başladığında
    box.addEventListener("dragstart", (event) => {
        offsetX = event.clientX - event.target.getBoundingClientRect().left;
        offsetY = event.clientY - event.target.getBoundingClientRect().top;
    });

    // Sürükleme işlemi sırasında
    box.addEventListener("drag", (event) => {
        const x = event.clientX - pano.getBoundingClientRect().left - offsetX;
        const y = event.clientY - pano.getBoundingClientRect().top - offsetY;

        // Pano sınırlarını kontrol et
        const panoWidth = pano.clientWidth;
        const panoHeight = pano.clientHeight;
        const boxWidth = box.clientWidth;
        const boxHeight = box.clientHeight;

        if (x >= 0 && x + boxWidth <= panoWidth && y >= 0 && y + boxHeight <= panoHeight) {
            event.target.style.left = x + "px";
            event.target.style.top = y + "px";
        }
    });
}

function createTask(container) {
    const task = document.createElement("div");
    task.classList.add("task");

    const taskInput = document.createElement("input")
    taskInput.placeholder = "Görevinizi buraya yazın";
    taskInput.classList.add("task-input");
    task.appendChild(taskInput);
    container.appendChild(task);
}

function updateBoxHeight(box, taskCount) {
    // Her görev kutusu için yaklaşık 40px ekleyerek kutunun yüksekliğini güncelle
    const minHeight = 80;
    const additionalHeight = taskCount * 24;
    const newHeight = minHeight + additionalHeight;
    box.style.minHeight = newHeight + "px";
}

function shrinkBox(box) {
    // Kutu yüksekliğini 24px küçült
    const currentHeight = parseInt(box.style.minHeight);
    const newHeight = currentHeight - 24;
    box.style.minHeight = newHeight + "px";
}
