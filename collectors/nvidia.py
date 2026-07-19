from pynvml import *

def get_nvidia():
    nvmlInit()

    handle = nvmlDeviceGetHandleByIndex(0)

    gpu = nvmlDeviceGetMemoryInfo(handle)


    return {
        "name": nvmlDeviceGetName(handle),
        "temperature": nvmlDeviceGetTemperature(handle, 0),
        "gpu_load": nvmlDeviceGetUtilizationRates(handle).gpu,
        "memory_total": gpu.total / 1024**3,
        "memory_used": gpu.used / 1024**3,
        "memory_free": gpu.free / 1024**3,
        "power": nvmlDeviceGetPowerUsage(handle) / 1000,
        "fan_speed": nvmlDeviceGetFanSpeed(handle)
    }