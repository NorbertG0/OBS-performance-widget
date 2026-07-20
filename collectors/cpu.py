import psutil

def get_cpu():
    cpu = psutil.cpu_percent(interval=1)
    cpu_cores = psutil.cpu_percent(interval=None, percpu=True)

    return {
        "percent": cpu,
        "cores": cpu_cores
    }