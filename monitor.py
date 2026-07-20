import threading
import time

from collectors.disk import get_disks
from collectors.network import get_network
from collectors.nvidia import get_nvidia
from collectors.cpu import get_cpu
from collectors.ram import get_ram

from data.store import stats

def monitor():
    while True:

        stats.update({
            "cpu": get_cpu(),

            "ram": get_ram(),

            "disks": get_disks(),

            "network": get_network(),

            "nvidia_gpu": get_nvidia(),
        })

        time.sleep(1)

def start_monitor():
    threading.Thread(target=monitor, daemon=True).start()


