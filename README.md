# OBS Performance Widget

***Stack: Python • Flask • HTML • CSS • JavaScript***

A real-time hardware monitoring widget. The application collects system performance metrics and exposes them through a REST API which can be used as an OBS browser source.

<p align="center">
<img alt="image" src="https://github.com/user-attachments/assets/9a2721b9-5c09-4375-85d2-1f5185f461a0" width="45%"/>
<img width="45%" alt="panel5" src="https://github.com/user-attachments/assets/57d5092e-f89f-4e09-94b5-dc1c81db256e" />
</p>

<p align="center">
<img width="45%" alt="panel2" src="https://github.com/user-attachments/assets/faff8567-7ed7-40a3-87dd-66431722fa95" />
<img width="45%" alt="panel3" src="https://github.com/user-attachments/assets/e48221e9-373e-4271-ad1b-ce639a58e54e" />
</p>

<p align="center">
  <img width="45%" alt="panel4" src="https://github.com/user-attachments/assets/0c4169be-4335-4a75-8d0a-594a0e7d6bab" />
</p>

## Gif demo

<p align="center">
<img src="assets/demo.gif" alt="demo" width="50%">
</p>

## API endpoints

### Get system statistics
```
GET /stats
```
### Example response:

```json
{
  "cpu": {
    "cores": [60.6, 60.7, 63.2, 58.6, 66.9, 66.2],
    "percent": 75.8
  },
  "disks": [
    {
      "free": 51.93,
      "name": "C:\\",
      "percent": 71,
      "total": 179.16,
      "used": 127.23
    },
    {
      "free": 199.14,
      "name": "D:\\",
      "percent": 32.9,
      "total": 296.92,
      "used": 97.78
    },
    {
      "free": 326.73,
      "name": "E:\\",
      "percent": 64.9,
      "total": 931.51,
      "used": 604.78
    },
    {
      "free": 117.79,
      "name": "F:\\",
      "percent": 0.1,
      "total": 117.89,
      "used": 0.09
    }
  ],
  "network": {
    "download": 3.94,
    "total_download": 33.94,
    "total_upload": 1.03,
    "upload": 0.4
  },
  "nvidia_gpu": {
    "fan_speed": 35,
    "gpu_load": 14,
    "memory_free": 1.99,
    "memory_total": 3,
    "memory_used": 1.01,
    "name": "NVIDIA GeForce GTX 1060 3GB",
    "power": 25.3,
    "temperature": 50
  },
  "ram": {
    "free": 5.05,
    "modules": [
      {
        "size": 8,
        "speed": 2666
      },
      {
        "size": 8,
        "speed": 2133
      }
    ],
    "percent": 68.3,
    "used": 10.87
  }
}
```

### Widget UI

The widget UI is available at the root endpoint.
```
GET /
```

