import psutil
import wmi

def get_ram_info():
    c = wmi.WMI()
    modules = []

    for ram in c.Win32_PhysicalMemory():

        modules.append({
            "size": round(int(ram.Capacity) / 1024**3, 2),
            "speed": ram.Speed
        })

    return modules

ram_modules = get_ram_info()

def get_ram():
    ram = psutil.virtual_memory()

    return {
        "percent": ram.percent,
        "used": round(ram.used / 1024**3, 2),
        "free": round(ram.available / 1024**3, 2),
        "modules": ram_modules
    }