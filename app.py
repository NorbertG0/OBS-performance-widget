from flask import Flask, jsonify
import psutil
import threading
import time
from pynvml import *

app = Flask(__name__)

stats = {}

old_recv = 0
old_sent = 0


def get_disks():
    disks = []

    for partition in psutil.disk_partitions():
        try:
            usage = psutil.disk_usage(partition.mountpoint)

            disks.append({
                "name": partition.device,
                "total": round(usage.total / 1024**3, 2),
                "used": round(usage.used / 1024**3, 2),
                "free": round(usage.free / 1024**3, 2),
                "percent": usage.percent
            })

        except PermissionError:
            pass

    return disks

def get_network():
    global old_recv, old_sent

    network = psutil.net_io_counters()

    recv = network.bytes_recv
    sent = network.bytes_sent

    download = (recv - old_recv) * 8 / 1024**2
    upload = (sent - old_sent) * 8 / 1024**2
    total_download = recv / 1024**3
    total_upload = sent / 1024**3

    old_recv = recv
    old_sent = sent

    return {
        "download": round(download, 2),
        "upload": round(upload, 2),
        "total_download": round(total_download, 2),
        "total_upload": round(total_upload, 2),
    }

def get_nvidia():
    nvmlInit()

    handle = nvmlDeviceGetHandleByIndex(0)

    print(nvmlDeviceGetTemperature(handle, 0))
    print(nvmlDeviceGetUtilizationRates(handle).gpu)
    print(nvmlDeviceGetMemoryInfo(handle))

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

            "network": get_network()
        })

        time.sleep(1)


threading.Thread(target=monitor, daemon=True).start()

get_nvidia()


@app.route("/stats")
def get_stats():
    return jsonify(stats)


app.run()