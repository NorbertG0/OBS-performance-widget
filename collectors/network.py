import psutil

old_recv = 0
old_sent = 0


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