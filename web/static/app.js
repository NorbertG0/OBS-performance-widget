let cpuCores = [];
let cpuCorePage = 0;

const coresPerPage = 4;
let coresAnimating = false;

function animateNumber(element, newValue, suffix = "") {

    const oldValue = parseFloat(element.innerText) || 0;

    const duration = 800;
    const startTime = performance.now();

    function update(currentTime) {

        const progress = Math.min(
            (currentTime - startTime) / duration,
            1
        );

        const value =
            oldValue + (newValue - oldValue) * progress;

        element.innerText =
            value.toFixed(1) + suffix;

        if(progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

async function updateStats() {

    try {
        const response = await fetch("/stats");
        const data = await response.json();

        // CPU
        animateNumber(document.getElementById("cpu"), data.cpu.percent, "%");

        document.getElementById("cpu-bar").style.width =
            data.cpu.percent + "%";

        cpuCores = data.cpu.cores;

        // RAM

        animateNumber(document.getElementById("ram"), data.ram.percent, "%");

        document.getElementById("ram-bar").style.width =
            data.ram.percent + "%";

        animateNumber(document.getElementById("ram-used"), data.ram.used, "GB");

        animateNumber(document.getElementById("ram-free"), data.ram.free, "GB");

        document.getElementById("module1-size").innerText =
            data.ram.modules[0].size + " GB";

        document.getElementById("module1-speed").innerText =
            data.ram.modules[0].speed + " MHz";

        document.getElementById("module2-size").innerText =
            data.ram.modules[1].size + " GB";

        document.getElementById("module2-speed").innerText =
            data.ram.modules[1].speed + " MHz";

        // GPU
        if(data.nvidia_gpu) {

            document.getElementById("name").innerText =
                data.nvidia_gpu.name;

            animateNumber(document.getElementById("gpu"), data.nvidia_gpu.gpu_load, "%");

            document.getElementById("gpu-bar").style.width =
                data.nvidia_gpu.gpu_load + "%";

            document.getElementById("temp").innerText =
                data.nvidia_gpu.temperature + "°C";

            document.getElementById("power").innerText =
                data.nvidia_gpu.power + " W";

            document.getElementById("fan_speed").innerText =
                data.nvidia_gpu.fan_speed + "%";

            const memoryUsed = Number(data.nvidia_gpu.memory_used);
                const memoryTotal = Number(data.nvidia_gpu.memory_total);

             document.getElementById("memory_used").innerText =
               `${memoryUsed.toFixed(1)} / ${memoryTotal.toFixed(1)} GB`;

            const memoryPercent = (memoryUsed / memoryTotal) * 100;

            document.getElementById("memory_used-bar").style.width =
                memoryPercent + "%";
        }

        // NETWORK
        animateNumber(document.getElementById("download"), data.network.download, "Mbps");

        animateNumber(document.getElementById("upload"), data.network.upload, "Mbps");

        document.getElementById("total_download").innerText =
            data.network.total_download + " GB";


        document.getElementById("total_upload").innerText =
            data.network.total_upload + " GB";
    }

    catch(error){

        console.error(
            "Stats error:",
            error
        );

    }

}


// CPU CORES
function renderCpuCores(){

    const container =
        document.getElementById("cpu-cores");

    if(!container || coresAnimating)
        return;

    coresAnimating = true;

    // fade out
    container.classList.add("fade-out");

    setTimeout(()=>{
        container.innerHTML = "";
        const start =
            cpuCorePage * coresPerPage;

        const end =
            start + coresPerPage;

        const cores =
            cpuCores.slice(start,end);

        cores.forEach((usage,index)=>{

            const coreNumber =
                start + index + 1;

            container.innerHTML += `

                <div class="core">
                    <div class="core-header">
                        <span>
                            Core ${coreNumber}
                        </span>

                        <span>
                            ${usage}%
                        </span>

                    </div>

                    <div class="bar">
                        <div
                            class="fill"
                            style="width:${usage}%">
                        </div>
                    </div>
                </div>
            `;
        });

        container.classList.remove("fade-out");
        coresAnimating = false;
    },400);
}

function switchCpuCores(){

    if(cpuCores.length <= coresPerPage)
        return;

    const pages =
        Math.ceil(
            cpuCores.length / coresPerPage
        );

    cpuCorePage++;

    if(cpuCorePage >= pages){
        cpuCorePage = 0;
    }

    renderCpuCores();
}

// WIDGET PAGES
const pages = [
    "cpu-page",
    "gpu-page",
    "ram-page",
    "network-page"
];

let currentPage = 0;

function switchPage(){
    document
        .querySelectorAll(".page")
        .forEach(page=>{
            page.classList.remove("active");
        });

    document
        .getElementById(pages[currentPage])
        .classList.add("active");

    currentPage++;

    if(currentPage >= pages.length){
        currentPage = 0;
    }
}

updateStats();

setInterval(updateStats, 1000);

setInterval(switchCpuCores, 5000);

setInterval(switchPage, 6000);

renderCpuCores();

switchPage();

lucide.createIcons();