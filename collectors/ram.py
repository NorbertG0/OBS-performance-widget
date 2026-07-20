import psutil

def get_ram():
    ram = psutil.virtual_memory()

    return {
        "percent": ram.percent,
        "used": round(ram.used / 1024**3, 2),
        "free": round(ram.available / 1024**3, 2)
    }