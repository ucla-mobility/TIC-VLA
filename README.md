 # <img src="docs/img/logo.png" width="35" height="35" style="vertical-align: bottom; margin-right: 10px;"> TIC-VLA

[![website](https://img.shields.io/badge/Website-Explore%20Now-blueviolet?style=flat&logo=google-chrome)](https://tic-vla.github.io/)
[![paper](https://img.shields.io/badge/arXiv-Paper-red.svg)]()
[![dataset](https://img.shields.io/badge/Dataset-Coming%20Soon-F9D371.svg)]()
<!-- [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)]() -->

<!-- This is the official implementation for the following paper: -->

**TIC-VLA: A Think-in-Control Vision-Language-Action Model for Robot Navigation in Dynamic Environments**

**[Zhiyu Huang](https://mczhi.github.io/)**<sup>†</sup>, **[Yun Zhang](https://handsomeyun.github.io/)**<sup>†</sup>, [Johnson Liu](https://www.linkedin.com/in/johnsonliu367/), [Rui Song](https://rruisong.github.io/), [Chen Tang](https://chentangmark.github.io/), [Jiaqi Ma](https://mobility-lab.seas.ucla.edu/about/)  


University of California, Los Angeles (UCLA)  
<sup>†</sup> Equal contribution

![overview](docs/img/framework.png)

---

## Overview

Stay tuned for new updates!

TIC-VLA introduces a **latency-aware Think-in-Control (TiC) architecture** for vision-language-action (VLA) navigation in **dynamic, human-centric environments**.  
Unlike prior VLA systems that assume synchronous reasoning and control, TIC-VLA explicitly models and trains for **semantic reasoning delay**, enabling robust and safe navigation under realistic inference latency.

- 🧠 **Think-in-Control Architecture**  
  Decouples slow vision-language reasoning from fast reactive control through an explicit **delayed semantic–control interface**.

- ⏱️ **Latency-Aware Action Generation**  
  Conditions control on current observations, cached VLM hidden states, and explicit delay metadata to mitigate stale semantics.

- 🧪 **Latency-Consistent Training Pipeline**  
  Combines vision-language reasoning distillation, latency-induced imitation learning, and online reinforcement learning.

- 🚶 **Dynamic, Human-Centric Navigation**  
  Evaluated in physics-accurate, photo-realistic environments with dense pedestrian interactions and long-horizon instructions.

---

## Benchmark: DynaNav

We introduce **DynaNav**, a language-conditioned navigation benchmark designed to stress-test VLA systems under realistic delay.

- 85 task configurations across **Hospital**, **Office**, **Warehouse**, and **Outdoor** scenes
- Varying **crowd density**, **navigation distance**, and **scene layout**
- Explicit control of **semantic inference latency (1–5s)**

![benchmark](docs/img/benchmark.png)