import psutil
import threading
import time

from collectors.disk import get_disks
from collectors.network import get_network
from collectors.nvidia import get_nvidia

stats = {}

def monitor():
    while True:

        cpu = psutil.cpu_percent(interval=1)
        cpu_cores = psutil.cpu_percent(interval=None, percpu=True)

        ram = psutil.virtual_memory()

        stats.update({
            "cpu": {
                "percent": cpu,
                "cores": cpu_cores
            },

            "ram": {
                "percent": ram.percent,
                "used": round(ram.used / 1024**3, 2),
                "free": round(ram.available / 1024**3, 2)
            },

            "disks": get_disks(),

            "network": get_network(),

            "nvidia_gpu": get_nvidia(),
        })

        time.sleep(1)

def start_monitor():
    threading.Thread(target=monitor, daemon=True).start()


