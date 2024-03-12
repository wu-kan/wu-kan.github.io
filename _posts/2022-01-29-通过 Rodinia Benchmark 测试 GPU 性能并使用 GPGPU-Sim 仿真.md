---
title: 通过 Rodinia Benchmark 测试 GPU 性能并使用 GPGPU-Sim 仿真
---

[Rodinia](https://rodinia.cs.virginia.edu/doku.php) Benchmark 是评价 GPU 性能的经典测试集，本文介绍基于 spack 包管理器快速运行该基准测试集的方式，同时给出与 [GPGPU-Sim](https://wu-kan.cn/2022/01/27/%E6%A8%A1%E6%8B%9F%E5%99%A8GPGPU-SIM%E7%9A%84%E4%BD%BF%E7%94%A8%E4%BB%8B%E7%BB%8D/) 模拟器交互的方式。

## 基于 spack 的安装方式

虽然 [spack](https://spack.readthedocs.io/en/stable/) 包管理器已经提供了 Rodinia 的[安装脚本](https://spack.readthedocs.io/en/stable/package_list.html#rodinia)，但不幸的是，该安装脚本：

1. 在 `cuda@11:` 后，编译 cfd 时找不到 `helper_cuda.h` 导致编译错误。
2. 在编译部分测试项时在编译部分测试项时 `libcudart` 有时动态链接，有时静态链接，给测试带来不便。
3. 在编译部分测试项时并没有接受正确的 cuda_arch 参数，这对于基于 PTX 进行仿真的模拟器来说带来干扰。
4. 编译结果不包含数据集，需要自行生成。

我重新写了一个安装脚本，修复了上述问题，并增加选项指定 `libcudart` 的链接方式。通过注释里的代码可引入我的 [repo](https://github.com/SYSU-SCC/sysu-scc-spack-repo) 并安装 gpgpu-sim 模拟器，并一键安装 Rodinia。

```shell
# git clone https://github.com/SYSU-SCC/sysu-scc-spack-repo
# spack repo add --scope=site sysu-scc-spack-repo
# spack install gpgpu-sim%gcc@7.5.0 ^ mesa~llvm ^ cuda@11.0.3

spack install rodinia%gcc@7.5.0 cuda_arch=70 cudart=shared ^ mesa~llvm ^ cuda@11.0.3 # 本机使用的 GPU 是 V100，因此 cuda_arch=70
```

## 运行

此处以运行 gaussian 为例，也可 `ls $(spack location -i rodinia)/bin` 查看其它评测项。

```shell
$ spack load rodinia
$ gaussian -f $(spack location -i rodinia)/data/gaussian/matrix3.txt | head -n 19
WG size of kernel 1 = 512, WG size of kernel 2= 4 X 4
Read file from /GPUFS/sysu_hpcedu_302/admin/env/v5/spack/opt/spack/linux-centos7-skylake_avx512/gcc-7.5.0/rodinia-3.1-7ukl3wapv7tw3rjnymhqpan27cywuhs6/data/gaussian/matrix3.txt 
Matrix m is: 
    0.00     0.00     0.00 
    1.00     0.00     0.00 
    1.00    -0.33     0.00 

Matrix a is: 
    1.00     1.00     1.00 
    0.00    -3.00     1.00 
    0.00    -0.00    -1.67 

Array b is: 
0.00 4.00 3.33 

The final solution is: 
4.00 -2.00 -2.00 


Time total (including memory transfers) 0.537338 sec
Time for CUDA kernels:  0.000157 sec
```

## 使用 GPGPU-Sim 仿真

导入 GPGPU-Sim 的环境。

```shell
spack load rodinia cudart=shared
spack load gcc@7.5.0
spack load gpgpu-sim
cd $(spack location -i gpgpu-sim)/gpgpu-sim_distribution
source setup_environment release
```

可以通过指定环境变量 `LD_PRELOAD`，从而使用 GPGPU-Sim 版本的 `libcudart.so`（请确认这个地址下存在这个库）。

```shell
cp -r $(spack location -i gpgpu-sim)/gpgpu-sim_distribution/configs/tested-cfgs/SM7_QV100 ~
cd ~/SM7_QV100
LD_PRELOAD=$(spack location -i gpgpu-sim)/gpgpu-sim_distribution/lib/release/libcudart.so gaussian -f $(spack location -i rodinia)/data/gaussian/matrix3.txt > simulate.log
```

截取输出的最后 32 行看一下，成功仿真，撒花~

```shell
$ cat simulate.log | tail -n 32
Reply_Network_out_buffer_full_per_cycle =       0.0000
Reply_Network_out_buffer_avg_util =       0.0000
----------------------------END-of-Interconnect-DETAILS-------------------------


gpgpu_simulation_time = 0 days, 0 hrs, 0 min, 12 sec (12 sec)
gpgpu_simulation_rate = 1176 (inst/sec)
gpgpu_simulation_rate = 1942 (cycle/sec)
gpgpu_silicon_slowdown = 582904x
GPGPU-Sim: synchronize waiting for inactive GPU simulation
GPGPU-Sim API: Stream Manager State
GPGPU-Sim: detected inactive GPU simulation thread
Matrix m is: 
    0.00     0.00     0.00 
    1.00     0.00     0.00 
    1.00    -0.33     0.00 

Matrix a is: 
    1.00     1.00     1.00 
    0.00    -3.00     1.00 
    0.00     0.00    -1.67 

Array b is: 
0.00 4.00 3.33 

The final solution is: 
4.00 -2.00 -2.00 


Time total (including memory transfers) 11.100054 sec
Time for CUDA kernels:  11.036677 sec
GPGPU-Sim: *** exit detected ***
```
