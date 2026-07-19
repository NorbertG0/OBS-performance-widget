import psutil

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