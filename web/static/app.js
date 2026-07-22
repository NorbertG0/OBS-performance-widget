let cpuCores = [];
let cpuCorePage = 0;

let downloadHistory = [];
let uploadHistory = [];

const chartPoints = 30;

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

function drawNetworkChart(){

    const canvas =
        document.getElementById("network-chart");

    if(!canvas)
        return;


    const ctx =
        canvas.getContext("2d");


    canvas.width =
        canvas.clientWidth;

    canvas.height =
        canvas.clientHeight;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    function drawLine(data, color){

        ctx.beginPath();

        data.forEach((value,index)=>{

            const x =
                index *
                (canvas.width / (chartPoints-1));


            const max =
                Math.max(
                    ...downloadHistory,
                    ...uploadHistory,
                    10
                );


            const y =
                canvas.height -
                (value / max) *
                canvas.height;


            if(index===0)
                ctx.moveTo(x,y);
            else
                ctx.lineTo(x,y);

        });


        ctx.strokeStyle=color;
        ctx.lineWidth=2;
        ctx.stroke();
    }


    drawLine(
        downloadHistory,
        "#00ff88"
    );

    drawLine(
        uploadHistory,
        "#00aaff"
    );
}

async function updateStats() {

    try {
        const response = await fetch("/stats");
        const data = await response.json();

        // CPU
        animateNumber(document.getElementById("cpu"), data.cpu.percent, " %");

        document.getElementById("cpu-bar").style.width =
            data.cpu.percent + "%";

        cpuCores = data.cpu.cores;

        // RAM

        animateNumber(document.getElementById("ram"), data.ram.percent, " %");

        document.getElementById("ram-bar").style.width =
            data.ram.percent + "%";

        animateNumber(document.getElementById("ram-used"), data.ram.used, " GB");

        animateNumber(document.getElementById("ram-free"), data.ram.free, " GB");

        if (data.ram.modules[0]) {
            document.getElementById("module1-size").innerText =
                data.ram.modules[0].size + " GB";

            document.getElementById("module1-speed").innerText =
                data.ram.modules[0].speed + " MHz";
        } else {
            document.getElementById("module1-size").innerText = "-";
            document.getElementById("module1-speed").innerText = "-";
        }


        if (data.ram.modules[1]) {
            document.getElementById("module2-size").innerText =
                data.ram.modules[1].size + " GB";

            document.getElementById("module2-speed").innerText =
                data.ram.modules[1].speed + " MHz";
        } else {
            document.getElementById("module2-size").innerText = "-";
            document.getElementById("module2-speed").innerText = "-";
        }

        // GPU
        if(data.nvidia_gpu) {

            document.getElementById("name").innerText =
                data.nvidia_gpu.name;

            animateNumber(document.getElementById("gpu"), data.nvidia_gpu.gpu_load, " %");

            document.getElementById("gpu-bar").style.width =
                data.nvidia_gpu.gpu_load + "%";

            document.getElementById("temp").innerText =
                data.nvidia_gpu.temperature + " °C";

            document.getElementById("power").innerText =
                data.nvidia_gpu.power + " W";

            document.getElementById("fan_speed").innerText =
                data.nvidia_gpu.fan_speed + " %";

            const memoryUsed = Number(data.nvidia_gpu.memory_used);
                const memoryTotal = Number(data.nvidia_gpu.memory_total);

             document.getElementById("memory_used").innerText =
               `${memoryUsed.toFixed(1)} / ${memoryTotal.toFixed(1)} GB`;

            const memoryPercent = (memoryUsed / memoryTotal) * 100;

            document.getElementById("memory_used-bar").style.width =
                memoryPercent + "%";
        }
        else {
            document.getElementById("name").innerText = "-";

            animateNumber(document.getElementById("gpu"), 0, " %");

            document.getElementById("gpu-bar").style.width = "0%";
            document.getElementById("temp").innerText = "-";
            document.getElementById("power").innerText = "-";
            document.getElementById("fan_speed").innerText = "-";
            document.getElementById("memory_used").innerText = "-";
            document.getElementById("memory_used-bar").style.width = "0%";
        }

        // NETWORK
        animateNumber(document.getElementById("download"), data.network.download, " Mbps");

        downloadHistory.push(
                data.network.download
            );

            uploadHistory.push(
                data.network.upload
            );


            if(downloadHistory.length > chartPoints)
                downloadHistory.shift();

            if(uploadHistory.length > chartPoints)
                uploadHistory.shift();


            drawNetworkChart();

        animateNumber(document.getElementById("upload"), data.network.upload, " Mbps");

        document.getElementById("total_download").innerText =
            data.network.total_download + " GB";


        document.getElementById("total_upload").innerText =
            data.network.total_upload + " GB";

        // DISKS
        const disksContainer = document.getElementById("disks");

        const disks = data.disks.slice(0, 5);
       if (disksContainer.children.length !== disks.length) {

            disksContainer.innerHTML = "";

            disks.forEach((disk, index) => {
                disksContainer.innerHTML += `
                    <div class="disk">
                        <div class="disk-row">
                            <span>${disk.name}</span>
                            <span id="disk-percent-${index}"></span>
                        </div>

                        <div class="bar">
                            <div id="disk-bar-${index}" class="fill"></div>
                        </div>
                    </div>
                `;
            });
}

        disks.forEach((disk, index) => {
            animateNumber(
                document.getElementById(`disk-percent-${index}`),
                disk.percent,
                " %"
            );

            document.getElementById(`disk-bar-${index}`).style.width =
                `${disk.percent}%`;
        });
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
                            ${usage} %
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
    "network-page",
    "disks-page"
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

setInterval(switchPage, 15000);

renderCpuCores();

switchPage();

lucide.createIcons();