---
title: osu-micro-benchmarks
tags:
  - asc
---

## 引言

无意中发现 [spack](https://github.com/spack/spack/releases/tag/v0.16.1) 可以直接安装 [osu-micro-benchmarks](http://mvapich.cse.ohio-state.edu/benchmarks/) 了，顺手写一个脚本横向比较一下一些常见 mpi 在单机上的性能。

## 实验环境

- 个人开发机一台
  - [Intel(R) Xeon(R) Platinum 8260 CPU @ 2.40GHz](https://www.intel.cn/content/www/cn/zh/products/processors/xeon/scalable/platinum-processors/platinum-8260.html)
    - 我的开发机实例只能使用 8 核 16 线程
  - linux-debian9-cascadelake

## 结果分析

log 很多，待分析补充。初步结果：

- openmpi@4.0.5 费拉不堪
- mpich@3.3.2 很顶

## 运行脚本 `run_osu.sh`

```bash
#!/bin/bash
# time ./run_osu.sh > run_osu.log 2>&1

mpis=(
    openmpi@1.10.7%intel@19.0.5.281
    openmpi@2.1.6%intel@19.0.5.281
    openmpi@3.1.6%intel@19.0.5.281
    openmpi@4.0.5%intel@19.0.5.281
    openmpi@1.10.7%gcc@10.2.0
    openmpi@2.1.6%gcc@10.2.0
    openmpi@3.1.6%gcc@10.2.0
    openmpi@4.0.5%gcc@10.2.0
    mpich@3.3.2%gcc@10.2.0
)

osu_startup=(
    osu_hello
    osu_init
)

osu_pt2pt=(
    osu_bibw
    osu_latency
    osu_latency_mt
    osu_multi_lat
    osu_bw
    osu_latency_mp
    osu_mbw_mr
)

osu_collective=(
    osu_allgather
    osu_bcast
    osu_ialltoall
    osu_igatherv
    osu_scatter
    osu_allgatherv
    osu_gather
    osu_ialltoallv
    osu_ireduce
    osu_scatterv
    osu_allreduce
    osu_gatherv
    osu_ialltoallw
    osu_iscatter
    osu_alltoall
    osu_iallgather
    osu_ibarrier
    osu_iscatterv
    osu_alltoallv
    osu_iallgatherv
    osu_ibcast
    osu_reduce
    osu_barrier
    osu_iallreduce
    osu_igather
    osu_reduce_scatter
)

osu_oneSided=(
    osu_acc_latency
    osu_fop_latency
    osu_get_bw
    osu_put_bibw
    osu_put_latency
    osu_cas_latency
    osu_get_acc_latency
    osu_get_latency
    osu_put_bw
)

cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c

for mpi in "${mpis[@]}"; do
    spack unload -a
    spack install osu-micro-benchmarks ^ $mpi
done

for mpi in "${mpis[@]}"; do
    spack unload -a
    spack load osu-micro-benchmarks ^ $mpi
    spack find --loaded
    for benchmark in "${osu_startup[@]}"; do
        echo "$mpi $benchmark"
        mpiexec -n 2 $benchmark
    done
    for benchmark in "${osu_pt2pt[@]}"; do
        echo "$mpi $benchmark"
        mpiexec -n 2 $benchmark
    done
    for benchmark in "${osu_collective[@]}"; do
        echo "$mpi $benchmark"
        mpiexec -n 8 $benchmark
    done
    for benchmark in "${osu_oneSided[@]}"; do
        echo "$mpi $benchmark"
        mpiexec -n 2 $benchmark
    done
done
```

## 运行结果 `run_osu.log`

```bash
      8  Intel(R) Xeon(R) Platinum 8260 CPU @ 2.40GHz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libsigsegv-2.12-r3trcwozyk2v3lalhsjmncp26c2koqzn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/pkgconf-1.7.3-pzvmn24duawmwpx4rf2zcdq3dzvga54v
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/util-macros-1.19.1-z2kbfmkqxvwvdygxi7jvweix5sibk5ee
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libiconv-1.16-d2nsvkkfuq4pv2kzvosj53635vfbxema
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/xz-5.2.5-kwbssn3wsll7firxf7bmum3iezxu6yfd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/zlib-1.2.11-v3uqb2f7txa5dgycabkbbpxscflzxjqy
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/berkeley-db-18.1.40-2snibmpw7eqeowr7qpuszgczav3fapcj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/m4-1.4.18-nbbveg7v7fw7jrnchjgolyr4zikszko7
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/ncurses-6.2-ikon6r6rtuihduraz2ht65yixb55orhz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libxml2-2.9.10-oloe4u365xzmzgoiw2x7pylu6iqs5bhz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libtool-2.4.6-hiijdgc6r4mhtmnuciqgqh6xvjpw756n
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/readline-8.0-ct3r7lca37pwvipcnjmgn67r25ltz2ey
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libpciaccess-0.16-5cjnzd7l4tm4u7shpgdnv7epqpv2fyvm
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/gdbm-1.18.1-oifw6abhztgoqx6jhl6ekuud4g35d2tc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/perl-5.32.0-rudsi7op6rwzgzsqoiya3a7tsrfumprn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/autoconf-2.69-4okdjloy7ew7k7vzajs4dizv433szapy
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/automake-1.16.2-5wdooseikitrp3g3sg65almbetg22mdb
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/numactl-2.0.14-djhfey4odgqq6kpnek4axqgxx6x6sepk
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/hwloc-1.11.11-grb2pwz4kcur725ue3rhbakair7kdy2x
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/openmpi-1.10.7-6ikpb5tdr4bfe327ei63rbofrvipw2ez
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/osu-micro-benchmarks-5.6.3-h5bo6bh4x3jz5f4advxg6ihrpy7e6kgi
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libsigsegv-2.12-r3trcwozyk2v3lalhsjmncp26c2koqzn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/pkgconf-1.7.3-pzvmn24duawmwpx4rf2zcdq3dzvga54v
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/util-macros-1.19.1-z2kbfmkqxvwvdygxi7jvweix5sibk5ee
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libiconv-1.16-d2nsvkkfuq4pv2kzvosj53635vfbxema
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/xz-5.2.5-kwbssn3wsll7firxf7bmum3iezxu6yfd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/zlib-1.2.11-v3uqb2f7txa5dgycabkbbpxscflzxjqy
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/berkeley-db-18.1.40-2snibmpw7eqeowr7qpuszgczav3fapcj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/m4-1.4.18-nbbveg7v7fw7jrnchjgolyr4zikszko7
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/ncurses-6.2-ikon6r6rtuihduraz2ht65yixb55orhz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libxml2-2.9.10-oloe4u365xzmzgoiw2x7pylu6iqs5bhz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libtool-2.4.6-hiijdgc6r4mhtmnuciqgqh6xvjpw756n
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/readline-8.0-ct3r7lca37pwvipcnjmgn67r25ltz2ey
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libpciaccess-0.16-5cjnzd7l4tm4u7shpgdnv7epqpv2fyvm
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/gdbm-1.18.1-oifw6abhztgoqx6jhl6ekuud4g35d2tc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/perl-5.32.0-rudsi7op6rwzgzsqoiya3a7tsrfumprn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/autoconf-2.69-4okdjloy7ew7k7vzajs4dizv433szapy
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/automake-1.16.2-5wdooseikitrp3g3sg65almbetg22mdb
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/numactl-2.0.14-djhfey4odgqq6kpnek4axqgxx6x6sepk
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/hwloc-1.11.11-grb2pwz4kcur725ue3rhbakair7kdy2x
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/openmpi-2.1.6-q5d7vtlfrgekmwlkwkb22ogs523jczfj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/osu-micro-benchmarks-5.6.3-wtzerrmxciy6stq4ydmegohq245uzpf3
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libsigsegv-2.12-r3trcwozyk2v3lalhsjmncp26c2koqzn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/pkgconf-1.7.3-pzvmn24duawmwpx4rf2zcdq3dzvga54v
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/util-macros-1.19.1-z2kbfmkqxvwvdygxi7jvweix5sibk5ee
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libiconv-1.16-d2nsvkkfuq4pv2kzvosj53635vfbxema
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/xz-5.2.5-kwbssn3wsll7firxf7bmum3iezxu6yfd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/zlib-1.2.11-v3uqb2f7txa5dgycabkbbpxscflzxjqy
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/berkeley-db-18.1.40-2snibmpw7eqeowr7qpuszgczav3fapcj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/m4-1.4.18-nbbveg7v7fw7jrnchjgolyr4zikszko7
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/ncurses-6.2-ikon6r6rtuihduraz2ht65yixb55orhz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libxml2-2.9.10-oloe4u365xzmzgoiw2x7pylu6iqs5bhz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libtool-2.4.6-hiijdgc6r4mhtmnuciqgqh6xvjpw756n
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/readline-8.0-ct3r7lca37pwvipcnjmgn67r25ltz2ey
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libpciaccess-0.16-5cjnzd7l4tm4u7shpgdnv7epqpv2fyvm
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/gdbm-1.18.1-oifw6abhztgoqx6jhl6ekuud4g35d2tc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/perl-5.32.0-rudsi7op6rwzgzsqoiya3a7tsrfumprn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/autoconf-2.69-4okdjloy7ew7k7vzajs4dizv433szapy
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/automake-1.16.2-5wdooseikitrp3g3sg65almbetg22mdb
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/numactl-2.0.14-djhfey4odgqq6kpnek4axqgxx6x6sepk
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/hwloc-1.11.11-grb2pwz4kcur725ue3rhbakair7kdy2x
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/openmpi-3.1.6-qpo7jpiiw22n7o5vpwp7sniyqbld4wgc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/osu-micro-benchmarks-5.6.3-5p46zg7fdfs7dvhjwr4ntnzu5ib34jh7
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libsigsegv-2.12-r3trcwozyk2v3lalhsjmncp26c2koqzn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/pkgconf-1.7.3-pzvmn24duawmwpx4rf2zcdq3dzvga54v
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/util-macros-1.19.1-z2kbfmkqxvwvdygxi7jvweix5sibk5ee
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libiconv-1.16-d2nsvkkfuq4pv2kzvosj53635vfbxema
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/xz-5.2.5-kwbssn3wsll7firxf7bmum3iezxu6yfd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/zlib-1.2.11-v3uqb2f7txa5dgycabkbbpxscflzxjqy
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/berkeley-db-18.1.40-2snibmpw7eqeowr7qpuszgczav3fapcj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/m4-1.4.18-nbbveg7v7fw7jrnchjgolyr4zikszko7
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/ncurses-6.2-ikon6r6rtuihduraz2ht65yixb55orhz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libxml2-2.9.10-oloe4u365xzmzgoiw2x7pylu6iqs5bhz
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libtool-2.4.6-hiijdgc6r4mhtmnuciqgqh6xvjpw756n
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/readline-8.0-ct3r7lca37pwvipcnjmgn67r25ltz2ey
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/libpciaccess-0.16-5cjnzd7l4tm4u7shpgdnv7epqpv2fyvm
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/gdbm-1.18.1-oifw6abhztgoqx6jhl6ekuud4g35d2tc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/hwloc-2.2.0-qby26sw44d3h4py2b3xtciaxjtkjb5gp
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/perl-5.32.0-rudsi7op6rwzgzsqoiya3a7tsrfumprn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/autoconf-2.69-4okdjloy7ew7k7vzajs4dizv433szapy
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/automake-1.16.2-5wdooseikitrp3g3sg65almbetg22mdb
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/numactl-2.0.14-djhfey4odgqq6kpnek4axqgxx6x6sepk
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/openmpi-4.0.5-txaw3t3jdubmua2lhalkcoz363k77jbv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/intel-19.0.5.281/osu-micro-benchmarks-5.6.3-xckp2qje7tq7dazshqbk7hgkthji5zpf
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libsigsegv-2.12-revfghrsqkagjs2xadvsrf2iga5fcj6k
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/pkgconf-1.7.3-w463hvpx56ry72lwjblgfkbixzn375tn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/util-macros-1.19.1-myitxdfhruqmh2h2rvzxic6vk7c7evic
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libiconv-1.16-wfcdbcqmdtjuwo7l3j7bcmmhfx5blylj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/xz-5.2.5-speqt5b2xkvwuvkm3cpuwg2l3fwbcfok
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/zlib-1.2.11-vfj3uem6ngffcbvs55jfuq3gjvwhaq4q
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/berkeley-db-18.1.40-uvbl62lsobhamxciclelykwmswoyuf5h
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/m4-1.4.18-j6vmwnc2anbdreog273n7jgcehicq37r
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/ncurses-6.2-szheta7z7xrjst2ogjvzodrsoaip3l2j
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libxml2-2.9.10-6kl5wqn7g76swqsyr5gd6mpfcywpha2i
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libtool-2.4.6-22wvtlj36fltcv2x4goef2rl63f22bqq
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/readline-8.0-qpmephgn35osuuadod2hv3uksunmnqzh
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libpciaccess-0.16-26l4fb7klvyexldxnxtbhtcqmsp5zh2w
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/gdbm-1.18.1-4e2l4ueetcwjqekofilvlq7qlyxanfvd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/perl-5.32.0-t66jap6sniuyncgvv55grfs3p7pofqyc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/autoconf-2.69-4aiqamfnwmgvzo7qwolgmngqbjc5bqdv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/automake-1.16.2-uobg65rv7v2eeskllx7gv6f6x3yovv3p
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/numactl-2.0.14-t4bpx4kxudgjftlpckmo6pnstk6jivme
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/hwloc-1.11.11-hjh3jhuzfhxfo5ubtbl3y44wgb72ktjv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/openmpi-1.10.7-u3vbsyqj2zdrqhcqojj7l3tq4gvoog46
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/osu-micro-benchmarks-5.6.3-xbphx6dnyradx7ksyooz37ynwyznvkic
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libsigsegv-2.12-revfghrsqkagjs2xadvsrf2iga5fcj6k
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/pkgconf-1.7.3-w463hvpx56ry72lwjblgfkbixzn375tn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/util-macros-1.19.1-myitxdfhruqmh2h2rvzxic6vk7c7evic
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libiconv-1.16-wfcdbcqmdtjuwo7l3j7bcmmhfx5blylj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/xz-5.2.5-speqt5b2xkvwuvkm3cpuwg2l3fwbcfok
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/zlib-1.2.11-vfj3uem6ngffcbvs55jfuq3gjvwhaq4q
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/berkeley-db-18.1.40-uvbl62lsobhamxciclelykwmswoyuf5h
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/m4-1.4.18-j6vmwnc2anbdreog273n7jgcehicq37r
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/ncurses-6.2-szheta7z7xrjst2ogjvzodrsoaip3l2j
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libxml2-2.9.10-6kl5wqn7g76swqsyr5gd6mpfcywpha2i
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libtool-2.4.6-22wvtlj36fltcv2x4goef2rl63f22bqq
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/readline-8.0-qpmephgn35osuuadod2hv3uksunmnqzh
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libpciaccess-0.16-26l4fb7klvyexldxnxtbhtcqmsp5zh2w
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/gdbm-1.18.1-4e2l4ueetcwjqekofilvlq7qlyxanfvd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/perl-5.32.0-t66jap6sniuyncgvv55grfs3p7pofqyc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/autoconf-2.69-4aiqamfnwmgvzo7qwolgmngqbjc5bqdv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/automake-1.16.2-uobg65rv7v2eeskllx7gv6f6x3yovv3p
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/numactl-2.0.14-t4bpx4kxudgjftlpckmo6pnstk6jivme
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/hwloc-1.11.11-hjh3jhuzfhxfo5ubtbl3y44wgb72ktjv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/openmpi-2.1.6-p5uipts4jdye5xyjxsww24mg4srwunyx
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/osu-micro-benchmarks-5.6.3-p7xodeq2xiuc5xk53u55ltnu7ot26umf
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libsigsegv-2.12-revfghrsqkagjs2xadvsrf2iga5fcj6k
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/pkgconf-1.7.3-w463hvpx56ry72lwjblgfkbixzn375tn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/util-macros-1.19.1-myitxdfhruqmh2h2rvzxic6vk7c7evic
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libiconv-1.16-wfcdbcqmdtjuwo7l3j7bcmmhfx5blylj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/xz-5.2.5-speqt5b2xkvwuvkm3cpuwg2l3fwbcfok
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/zlib-1.2.11-vfj3uem6ngffcbvs55jfuq3gjvwhaq4q
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/berkeley-db-18.1.40-uvbl62lsobhamxciclelykwmswoyuf5h
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/m4-1.4.18-j6vmwnc2anbdreog273n7jgcehicq37r
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/ncurses-6.2-szheta7z7xrjst2ogjvzodrsoaip3l2j
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libxml2-2.9.10-6kl5wqn7g76swqsyr5gd6mpfcywpha2i
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libtool-2.4.6-22wvtlj36fltcv2x4goef2rl63f22bqq
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/readline-8.0-qpmephgn35osuuadod2hv3uksunmnqzh
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libpciaccess-0.16-26l4fb7klvyexldxnxtbhtcqmsp5zh2w
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/gdbm-1.18.1-4e2l4ueetcwjqekofilvlq7qlyxanfvd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/perl-5.32.0-t66jap6sniuyncgvv55grfs3p7pofqyc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/autoconf-2.69-4aiqamfnwmgvzo7qwolgmngqbjc5bqdv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/automake-1.16.2-uobg65rv7v2eeskllx7gv6f6x3yovv3p
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/numactl-2.0.14-t4bpx4kxudgjftlpckmo6pnstk6jivme
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/hwloc-1.11.11-hjh3jhuzfhxfo5ubtbl3y44wgb72ktjv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/openmpi-3.1.6-hzkz7tjt4rjde65n5vo24rjbq5qpppcs
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/osu-micro-benchmarks-5.6.3-vecfeq3rd7tvjtnwa6esg4q7yqxdhvey
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libsigsegv-2.12-revfghrsqkagjs2xadvsrf2iga5fcj6k
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/pkgconf-1.7.3-w463hvpx56ry72lwjblgfkbixzn375tn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/util-macros-1.19.1-myitxdfhruqmh2h2rvzxic6vk7c7evic
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libiconv-1.16-wfcdbcqmdtjuwo7l3j7bcmmhfx5blylj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/xz-5.2.5-speqt5b2xkvwuvkm3cpuwg2l3fwbcfok
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/zlib-1.2.11-vfj3uem6ngffcbvs55jfuq3gjvwhaq4q
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/berkeley-db-18.1.40-uvbl62lsobhamxciclelykwmswoyuf5h
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/m4-1.4.18-j6vmwnc2anbdreog273n7jgcehicq37r
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/ncurses-6.2-szheta7z7xrjst2ogjvzodrsoaip3l2j
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libxml2-2.9.10-6kl5wqn7g76swqsyr5gd6mpfcywpha2i
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libtool-2.4.6-22wvtlj36fltcv2x4goef2rl63f22bqq
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/readline-8.0-qpmephgn35osuuadod2hv3uksunmnqzh
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libpciaccess-0.16-26l4fb7klvyexldxnxtbhtcqmsp5zh2w
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/gdbm-1.18.1-4e2l4ueetcwjqekofilvlq7qlyxanfvd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/hwloc-2.2.0-mm3sjtd27gfjnuzrx6btdwkdnqmx5tal
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/perl-5.32.0-t66jap6sniuyncgvv55grfs3p7pofqyc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/autoconf-2.69-4aiqamfnwmgvzo7qwolgmngqbjc5bqdv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/automake-1.16.2-uobg65rv7v2eeskllx7gv6f6x3yovv3p
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/numactl-2.0.14-t4bpx4kxudgjftlpckmo6pnstk6jivme
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/openmpi-4.0.5-xwzfomywgk3vthdg77ik5kjr64qpbvau
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/osu-micro-benchmarks-5.6.3-222sfjueqic4u4bravosklinqugztnhk
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libsigsegv-2.12-revfghrsqkagjs2xadvsrf2iga5fcj6k
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/berkeley-db-18.1.40-uvbl62lsobhamxciclelykwmswoyuf5h
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/pkgconf-1.7.3-w463hvpx56ry72lwjblgfkbixzn375tn
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/util-macros-1.19.1-myitxdfhruqmh2h2rvzxic6vk7c7evic
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libiconv-1.16-wfcdbcqmdtjuwo7l3j7bcmmhfx5blylj
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/xz-5.2.5-speqt5b2xkvwuvkm3cpuwg2l3fwbcfok
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/zlib-1.2.11-vfj3uem6ngffcbvs55jfuq3gjvwhaq4q
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/m4-1.4.18-j6vmwnc2anbdreog273n7jgcehicq37r
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/ncurses-6.2-szheta7z7xrjst2ogjvzodrsoaip3l2j
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libxml2-2.9.10-6kl5wqn7g76swqsyr5gd6mpfcywpha2i
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libtool-2.4.6-22wvtlj36fltcv2x4goef2rl63f22bqq
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/readline-8.0-qpmephgn35osuuadod2hv3uksunmnqzh
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/libpciaccess-0.16-26l4fb7klvyexldxnxtbhtcqmsp5zh2w
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/gdbm-1.18.1-4e2l4ueetcwjqekofilvlq7qlyxanfvd
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/hwloc-2.2.0-mm3sjtd27gfjnuzrx6btdwkdnqmx5tal
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/perl-5.32.0-t66jap6sniuyncgvv55grfs3p7pofqyc
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/texinfo-6.5-3fryou4wi7d2zoa7uepcc5xojkeo3bej
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/autoconf-2.69-4aiqamfnwmgvzo7qwolgmngqbjc5bqdv
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/automake-1.16.2-uobg65rv7v2eeskllx7gv6f6x3yovv3p
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/findutils-4.6.0-i6lbkjedtdenw7nb3ozulkco5ngnouv4
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/mpich-3.3.2-mcjsx53qbyta5h4dif4tukljuxkb2wsb
[+] /data00/home/wukan.i/spack-0.16.1/opt/spack/linux-debian9-cascadelake/gcc-10.2.0/osu-micro-benchmarks-5.6.3-tn7hdjei4w7hxthtooucgabxu4asjbvw
-- linux-debian9-cascadelake / intel@19.0.5.281 -----------------
hwloc@1.11.11
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
numactl@2.0.14
openmpi@1.10.7
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
openmpi@1.10.7%intel@19.0.5.281 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
openmpi@1.10.7%intel@19.0.5.281 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 13 ms, max: 14 ms, avg: 13 ms
openmpi@1.10.7%intel@19.0.5.281 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       9.42
2                      20.08
4                      33.78
8                      80.40
16                    150.75
32                    317.69
64                    386.16
128                   532.48
256                   920.94
512                  1698.04
1024                 3041.29
2048                 5283.63
4096                 5660.52
8192                 7977.62
16384                9625.81
32768                9567.82
65536                9906.10
131072              10027.46
262144              10244.80
524288               9908.48
1048576              9974.68
2097152              9676.33
4194304              9145.41
openmpi@1.10.7%intel@19.0.5.281 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.20
1                       0.24
2                       0.23
4                       0.23
8                       0.24
16                      0.24
32                      0.24
64                      0.26
128                     0.31
256                     0.38
512                     0.48
1024                    0.64
2048                    0.88
4096                    1.48
8192                    2.31
16384                   4.54
32768                   7.13
65536                  10.27
131072                 16.56
262144                 29.68
524288                 56.79
1048576               122.20
2097152               250.83
4194304               525.00
openmpi@1.10.7%intel@19.0.5.281 osu_latency_mt
MPI_Init_thread must return MPI_THREAD_MULTIPLE!
-------------------------------------------------------
Primary job  terminated normally, but 1 process returned
a non-zero exit code.. Per user-direction, the job has been aborted.
-------------------------------------------------------
--------------------------------------------------------------------------
mpiexec detected that one or more processes exited with non-zero status, thus causing
the job to be terminated. The first process to do so was:

  Process name: [[153,1],1]
  Exit code:    1
--------------------------------------------------------------------------
openmpi@1.10.7%intel@19.0.5.281 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.21
1                       0.23
2                       0.23
4                       0.23
8                       0.23
16                      0.23
32                      0.23
64                      0.25
128                     0.31
256                     0.38
512                     0.50
1024                    0.65
2048                    0.87
4096                    1.52
8192                    2.32
16384                   4.57
32768                   7.15
65536                  10.36
131072                 16.81
262144                 32.49
524288                 63.74
1048576               121.11
2097152               252.56
4194304               525.35
openmpi@1.10.7%intel@19.0.5.281 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       8.92
2                      16.97
4                      36.88
8                      61.22
16                    144.04
32                    286.43
64                    386.88
128                   520.04
256                   821.23
512                  1409.15
1024                 2758.85
2048                 5420.53
4096                 6085.26
8192                 7845.11
16384                8840.87
32768                9351.03
65536                9649.71
131072               9587.43
262144               9632.31
524288               9584.70
1048576              9614.89
2097152              9322.57
4194304              8921.37
openmpi@1.10.7%intel@19.0.5.281 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.22
1                       0.26
2                       0.25
4                       0.28
8                       0.25
16                      0.25
32                      0.22
64                      0.23
128                     0.29
256                     0.36
512                     0.49
1024                    0.64
2048                    0.87
4096                    1.50
8192                    2.28
16384                   4.50
32768                   7.10
65536                  10.14
131072                 16.44
262144                 29.38
524288                 56.57
1048576               119.65
2097152               248.95
4194304               540.59
openmpi@1.10.7%intel@19.0.5.281 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                       8.35        8346864.13
2                      17.61        8805275.16
4                      29.66        7414667.51
8                      73.66        9207798.75
16                    140.84        8802393.42
32                    274.37        8574203.61
64                    376.18        5877755.78
128                   517.71        4044635.19
256                   749.77        2928774.99
512                  1377.88        2691173.16
1024                 2747.96        2683558.53
2048                 5127.55        2503688.04
4096                 5960.93        1455304.52
8192                 7847.60         957958.64
16384                8476.67         517374.61
32768                9388.72         286521.12
65536                9338.38         142492.41
131072               9676.70          73827.34
262144               9296.05          35461.63
524288               9492.21          18104.96
1048576              9155.79           8731.64
2097152              9513.54           4536.41
4194304              9326.06           2223.51
openmpi@1.10.7%intel@19.0.5.281 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.60
2                       1.62
4                       1.43
8                       1.55
16                      1.51
32                      1.65
64                      4.07
128                     1.98
256                     2.44
512                     3.10
1024                    4.60
2048                    7.10
4096                   11.92
8192                   22.03
16384                  32.21
32768                  57.72
65536                 110.56
131072                205.14
262144                442.67
524288               1134.68
1048576              5576.45
openmpi@1.10.7%intel@19.0.5.281 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.79
2                       0.79
4                       0.79
8                       0.84
16                      0.83
32                      0.86
64                      0.96
128                     0.94
256                     1.06
512                     1.44
1024                    1.84
2048                    2.60
4096                    4.02
8192                    7.83
16384                  14.24
32768                  27.59
65536                  48.60
131072                 86.81
262144                162.66
524288                258.93
1048576               548.23
openmpi@1.10.7%intel@19.0.5.281 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      11.09              6.10              5.18              3.46
2                      10.87              6.04              5.10              5.46
4                       9.98              5.87              4.93             16.62
8                       9.10              4.76              3.97              0.00
16                      9.42              5.01              4.16              0.00
32                      9.71              5.05              4.19              0.00
64                      9.50              5.10              4.23              0.00
128                     9.49              5.07              4.28              0.00
256                    10.33              5.45              4.55              0.00
512                    12.08              6.56              5.53              0.10
1024                   18.75              9.11              7.89              0.00
2048                   21.42             11.35              9.82              0.00
4096                   46.55             21.84             18.72              0.00
8192                   67.48             36.68             31.80              3.13
16384                 106.60             47.54             40.09              0.00
32768                 164.22             79.48             69.15              0.00
65536                 541.73            208.43            157.42              0.00
131072               1267.14            617.06            530.06              0.00
262144               2190.84           1104.64            986.49              0.00
524288               4192.84           2233.96           1987.84              1.46
1048576              8597.34           4389.34           3894.26              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.92              1.58              1.08              0.00
2                       2.91              1.62              1.12              0.00
4                       2.80              1.53              1.04              0.00
8                       2.41              1.36              0.91              0.00
16                      2.32              1.29              0.83              0.00
32                      2.31              1.23              0.80              0.00
64                      2.35              1.25              0.84              0.00
128                     2.49              1.31              0.86              0.00
256                     2.44              1.31              0.91              0.00
512                     2.64              1.36              1.03              0.00
1024                    3.34              1.82              1.41              0.00
2048                    3.95              2.14              1.57              0.00
4096                   18.25              7.39              6.32              0.00
8192                   29.20             13.17             11.38              0.00
16384                  45.61             21.16             18.53              0.00
32768                  62.54             27.95             24.62              0.00
65536                 103.82             44.67             39.54              0.00
131072                212.45             95.59             84.91              0.00
262144                428.28            177.30            158.19              0.00
524288                890.53            435.86            388.23              0.00
1048576              2002.43            965.08            857.64              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.86
2                       0.81
4                       0.84
8                       0.88
16                      0.85
32                      0.84
64                      0.79
128                     0.89
256                     1.07
512                     1.49
1024                    1.70
2048                    3.15
4096                    7.81
8192                   10.94
16384                  22.71
32768                  33.33
65536                  48.98
131072                 90.33
262144                192.49
524288                355.85
1048576               874.89
openmpi@1.10.7%intel@19.0.5.281 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       4.14
2                       4.09
4                       7.65
8                      10.06
16                      4.02
32                      7.18
64                      5.82
128                    17.03
256                    11.77
512                     6.62
1024                    8.48
2048                   23.91
4096                   30.42
8192                   38.63
16384                  32.12
32768                  53.87
65536                 216.94
131072                368.91
262144                712.55
524288               2185.79
1048576              5003.20
openmpi@1.10.7%intel@19.0.5.281 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.40
2                       0.36
4                       0.37
8                       0.35
16                      0.35
32                      0.35
64                      0.35
128                     0.49
256                     0.44
512                     0.59
1024                    0.74
2048                    1.08
4096                    8.83
8192                   12.21
16384                  18.01
32768                  23.68
65536                  35.12
131072                 82.33
262144                135.84
524288                245.08
1048576               542.83
openmpi@1.10.7%intel@19.0.5.281 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      10.54              5.85              4.89              4.31
2                      10.47              5.80              4.95              5.65
4                       9.63              4.88              4.05              0.00
8                       9.39              5.37              4.46              9.80
16                      8.97              4.86              3.94              0.00
32                      9.01              4.83              4.01              0.00
64                      9.26              4.97              4.16              0.00
128                    10.43              5.91              4.94              8.47
256                    10.56              5.29              4.42              0.00
512                    12.34              6.60              5.59              0.00
1024                   17.41              9.14              7.85              0.00
2048                   22.69             12.42             10.25              0.00
4096                   41.66             23.11             20.29              8.59
8192                   60.95             32.72             28.83              2.08
16384                  79.61             43.10             38.14              4.29
32768                 128.40             66.88             59.10              0.00
65536                 576.70            175.08            128.52              0.00
131072               1371.20            739.07            626.76              0.00
262144               1976.58           1212.74           1079.89             29.27
524288               3956.76           2099.62           1871.22              0.75
1048576              8450.06           4305.06           3833.01              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       3.93              2.28              1.73              4.88
8                       3.52              2.10              1.64             13.56
16                      3.41              1.88              1.43              0.00
32                      3.34              1.90              1.44              0.00
64                      3.52              1.99              1.50              0.00
128                     3.77              2.08              1.57              0.00
256                     3.81              2.16              1.68              1.86
512                     4.83              2.69              2.14              0.00
1024                    5.65              3.26              2.57              7.36
2048                    7.52              4.06              3.35              0.00
4096                   17.31              6.78              5.79              0.00
8192                   25.36              9.96              8.52              0.00
16384                  47.09             18.10             15.78              0.00
32768                  76.83             29.18             25.74              0.00
65536                 148.48             46.05             40.78              0.00
131072                257.05             99.04             88.11              0.00
262144                414.28            147.08            131.27              0.00
524288                863.28            311.29            277.12              0.00
1048576              1690.76            618.06            550.07              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.67
2                       0.67
4                       0.70
8                       0.66
16                      0.75
32                      0.73
64                      0.74
128                     0.83
256                     1.04
512                     1.47
1024                    1.73
2048                    2.43
4096                    6.04
8192                   10.92
16384                  21.20
32768                  32.68
65536                  49.43
131072                 99.74
262144                182.58
524288                352.40
1048576               728.52
openmpi@1.10.7%intel@19.0.5.281 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.48
8                       1.40
16                      1.46
32                      1.57
64                      1.56
128                     1.80
256                     2.00
512                     2.79
1024                    4.12
2048                    6.01
4096                   11.00
8192                   17.69
16384                  23.41
32768                  44.13
65536                  72.27
131072                115.26
262144                199.46
524288                356.94
1048576               927.10
openmpi@1.10.7%intel@19.0.5.281 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.30
2                       0.26
4                       0.25
8                       0.27
16                      0.27
32                      0.25
64                      0.27
128                     0.34
256                     0.31
512                     0.47
1024                    0.71
2048                    1.17
4096                    8.73
8192                   14.93
16384                  22.23
32768                  34.56
65536                  49.44
131072                 85.06
262144                160.21
524288                332.43
1048576               671.25
openmpi@1.10.7%intel@19.0.5.281 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      11.19              5.98              5.10              0.00
2                      10.45              5.58              4.76              0.00
4                      10.83              5.75              4.81              0.00
8                       9.98              5.69              4.80             10.61
16                      9.71              5.46              4.50              5.57
32                      8.92              4.75              3.97              0.00
64                      9.41              5.10              4.34              0.66
128                     9.50              5.07              4.25              0.00
256                    10.26              5.40              4.52              0.00
512                    12.38              6.60              5.66              0.00
1024                   17.38              9.26              7.96              0.00
2048                   21.54             11.47              9.94              0.00
4096                   37.92             20.30             17.83              1.15
8192                   57.64             29.87             26.27              0.00
16384                  80.81             42.96             37.94              0.24
32768                 152.10             72.71             64.03              0.00
65536                 260.58            135.93            120.27              0.00
131072                585.59            292.20            260.44              0.00
262144               1756.00            905.42            804.74              0.00
524288               3991.15           2126.31           1892.11              1.44
1048576              8679.36           4677.81           4159.59              3.80
openmpi@1.10.7%intel@19.0.5.281 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.24              2.17              1.69             36.85
2                       3.21              2.13              1.68             35.64
4                       3.21              2.15              1.68             36.78
8                       3.37              2.28              1.72             36.81
16                      3.39              2.31              1.73             37.55
32                      3.43              2.33              1.81             38.87
64                      3.50              2.38              1.85             39.70
128                     3.70              2.58              2.03             44.89
256                     3.86              2.72              2.17             47.03
512                     4.64              3.35              2.67             51.77
1024                    5.09              3.52              2.87             45.54
2048                    6.13              4.39              3.71             52.92
4096                   15.58              8.09              6.97              0.00
8192                   22.74             11.51              9.86              0.00
16384                  35.23             16.38             14.18              0.00
32768                  58.32             26.25             23.14              0.00
65536                 104.35             45.76             40.43              0.00
131072                276.12            137.33            122.27              0.00
262144                577.57            288.41            257.00              0.00
524288               1201.28            623.50            548.46              0.00
1048576              2569.87           1280.91           1143.14              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       2.88
2                       2.90
4                       2.96
8                       2.74
16                      2.32
32                      2.28
64                      2.44
128                     2.53
256                     2.81
512                     3.40
1024                    5.53
2048                    9.58
4096                   18.80
8192                   31.44
16384                  45.51
32768                  71.15
65536                 128.45
131072                355.01
262144                730.43
524288               1976.52
1048576              6609.03
openmpi@1.10.7%intel@19.0.5.281 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      21.44             14.81              9.27             28.47
2                      14.01              9.72              8.28             48.18
4                      17.44              4.89              3.95              0.00
8                      20.47             11.12              7.79              0.00
16                     12.96              6.10              4.13              0.00
32                     19.05             14.78             12.17             64.93
64                      9.40              5.03              4.20              0.00
128                    14.00              9.02              5.44              8.42
256                    28.65             17.04             13.03             10.97
512                    41.97             27.06             17.46             14.64
1024                  156.27             26.04             19.92              0.00
2048                   23.96             13.32             11.34              6.14
4096                  104.90             45.83             36.64              0.00
8192                   95.96             46.13             38.00              0.00
16384                 102.89             45.36             37.85              0.00
32768                 154.73             69.14             61.25              0.00
65536                 389.83            203.02            173.87              0.00
131072                547.34            288.64            255.50              0.00
262144               1088.86            551.14            489.25              0.00
524288               2942.49           1423.03           1271.26              0.00
1048576              6720.63           3545.93           3166.01              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
              8.85              5.04              4.02              5.04
openmpi@1.10.7%intel@19.0.5.281 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.40              2.27              1.72             34.40
2                       3.40              2.27              1.69             33.18
4                       3.58              2.20              1.70             18.76
8                       3.46              2.30              1.71             32.09
16                      3.42              2.27              1.79             35.93
32                      3.69              2.51              1.95             39.83
64                      3.94              2.70              2.16             42.70
128                     3.93              2.70              2.15             42.56
256                     4.34              3.05              2.46             47.48
512                     5.28              3.80              3.10             52.35
1024                    5.52              3.75              3.12             43.14
2048                    6.79              4.71              3.90             46.67
4096                   19.31              9.73              8.37              0.00
8192                   26.74             13.01             11.22              0.00
16384                  41.20             18.62             16.25              0.00
32768                  65.79             28.54             25.16              0.00
65536                 116.63             48.48             42.89              0.00
131072                619.08            192.35            135.33              0.00
262144                566.90            288.15            258.20              0.00
524288               1182.64            605.67            536.85              0.00
1048576              2494.80           1256.44           1121.45              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.43
2                       3.45
4                       3.30
8                       3.31
16                      3.47
32                      3.43
64                      3.52
128                     3.99
256                     4.52
512                     6.18
1024                    8.81
2048                   10.02
4096                   18.91
8192                   32.35
16384                  54.02
32768                  78.67
65536                 138.31
131072                276.91
262144                627.53
524288               1823.79
1048576              3907.04
openmpi@1.10.7%intel@19.0.5.281 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.36              4.94              4.06              0.00
2                      10.59              5.70              4.77              0.00
4                       9.05              4.81              4.01              0.00
8                       9.34              5.06              4.11              0.00
16                      9.19              4.97              4.07              0.00
32                      9.34              5.00              4.13              0.00
64                      9.29              5.01              4.30              0.41
128                     9.50              5.09              4.29              0.00
256                    10.67              5.46              4.60              0.00
512                    11.97              6.55              5.50              1.39
1024                   16.87              9.04              7.77              0.00
2048                   20.76             11.03              9.55              0.00
4096                   37.79             18.66             16.27              0.00
8192                   60.23             31.22             27.55              0.00
16384                  78.70             41.29             36.31              0.00
32768                 126.04             64.48             57.34              0.00
65536                 263.91            124.48            111.12              0.00
131072                521.20            280.37            248.99              3.28
262144               1100.51            550.29            489.63              0.00
524288               2779.00           1401.40           1250.13              0.00
1048576              6813.17           3744.18           3341.08              8.14
openmpi@1.10.7%intel@19.0.5.281 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       4.06              2.42              1.96             16.31
2                       4.16              2.45              1.94             11.97
4                       3.76              2.30              1.76             17.05
8                       3.71              2.26              1.66             12.81
16                      3.51              2.14              1.61             15.17
32                      3.41              2.10              1.62             18.76
64                      3.57              2.21              1.69             20.07
128                     3.67              2.25              1.71             17.31
256                     3.94              2.37              1.84             15.09
512                     5.13              3.44              2.78             39.30
1024                    5.42              3.34              2.64             21.18
2048                    6.32              3.80              3.13             19.26
4096                   10.44              6.67              5.69             33.59
8192                   16.16              9.58              8.24             20.27
16384                  24.13             13.34             11.56              6.62
32768                  38.16             20.31             17.74              0.00
65536                  93.44             51.00             45.05              5.79
131072                175.74             99.85             88.83             14.56
262144                405.91            179.83            160.20              0.00
524288                395.31            221.67            197.01             11.86
1048576               808.97            434.17            385.52              2.78
openmpi@1.10.7%intel@19.0.5.281 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.84
8                       0.83
16                      0.93
32                      0.88
64                      0.97
128                     1.02
256                     1.18
512                     1.45
1024                    1.87
2048                    2.83
4096                    4.49
8192                    8.34
16384                  18.01
32768                  31.46
65536                  79.87
131072                140.44
262144                287.34
524288                494.00
1048576               997.63
openmpi@1.10.7%intel@19.0.5.281 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             1.57
openmpi@1.10.7%intel@19.0.5.281 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       8.77              5.32              4.43             22.08
8                       8.63              4.71              3.90              0.00
16                      8.52              4.90              4.01              9.69
32                      8.14              4.57              3.80              6.11
64                      8.74              4.98              4.12              8.70
128                     9.28              5.19              4.37              6.64
256                    10.58              6.00              5.02              8.59
512                    13.34              7.28              6.12              1.03
1024                   16.55              9.43              8.07             11.78
2048                   20.39             11.57             10.06             12.31
4096                   41.36             21.33             18.71              0.00
8192                   64.53             33.60             29.61              0.00
16384                 116.61             56.62             49.85              0.00
32768                 197.95             97.47             86.49              0.00
65536                 256.98            136.92            121.69              1.34
131072                453.33            236.34            210.62              0.00
262144                828.41            424.46            379.74              0.00
524288               5417.53            833.37            645.58              0.00
1048576              3025.81           1497.11           1332.12              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.47              1.30              0.89              0.00
2                       4.40              1.31              0.88              0.00
4                       6.18              1.91              1.39              0.00
8                       6.92              5.73              3.25             63.37
16                      2.45              1.32              0.88              0.00
32                      3.79              2.31              0.88              0.00
64                      4.26              3.08              0.94              0.00
128                     8.65              1.40              0.96              0.00
256                     2.70              1.45              1.02              0.00
512                     4.51              1.60              1.18              0.00
1024                    9.93              4.23              3.36              0.00
2048                    5.20              2.25              1.65              0.00
4096                   56.25              7.82              6.17              0.00
8192                   54.36             15.58             13.40              0.00
16384                  54.14             23.17             20.11              0.00
32768                  69.23             29.50             25.92              0.00
65536                 335.13            116.53             72.16              0.00
131072                511.88            138.28            122.80              0.00
262144               1133.18            300.25            251.28              0.00
524288               1618.79            595.37            491.50              0.00
1048576              2240.23           1172.50           1039.49              0.00
openmpi@1.10.7%intel@19.0.5.281 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.06
8                       1.18
16                      1.34
32                      2.19
64                      2.22
128                     5.12
256                     2.46
512                     2.57
1024                    3.34
2048                    5.68
4096                    6.02
8192                   11.06
16384                  15.57
32768                  21.34
65536                  34.51
131072                159.98
262144                371.74
524288                255.72
1048576               520.80
openmpi@1.10.7%intel@19.0.5.281 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.04
2                       0.04
4                       0.04
8                       0.05
16                      0.05
32                      0.06
64                      0.11
128                     0.15
256                     0.24
512                     0.42
1024                    0.79
2048                    1.51
4096                    2.97
8192                    5.90
16384                  11.85
32768                  23.86
65536                  48.14
131072                 95.59
262144                188.83
524288                380.11
1048576               759.38
2097152              1508.83
4194304              3008.60
openmpi@1.10.7%intel@19.0.5.281 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.04
openmpi@1.10.7%intel@19.0.5.281 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      32.07
2                      63.40
4                     133.23
8                     271.43
16                    460.17
32                   1092.98
64                   2053.61
128                  4054.78
256                  7256.43
512                 13215.30
1024                22289.26
2048                29023.27
4096                34177.12
8192                21260.35
16384               15027.12
32768               11713.43
65536               10694.92
131072              11272.81
262144               5499.26
524288               4573.08
1048576              4518.88
2097152              4558.19
4194304              4720.81
openmpi@1.10.7%intel@19.0.5.281 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      43.58
2                      89.91
4                     187.85
8                     378.62
16                    729.87
32                   1442.62
64                   3009.62
128                  6039.32
256                 11645.79
512                 18415.66
1024                28604.10
2048                37409.70
4096                52539.34
8192                42739.29
16384               30080.73
32768               24625.49
65536               22238.81
131072              13441.36
262144               9756.95
524288               8483.85
1048576              8956.58
2097152              8457.78
4194304              8805.68
openmpi@1.10.7%intel@19.0.5.281 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.06
2                       0.06
4                       0.07
8                       0.07
16                      0.07
32                      0.07
64                      0.07
128                     0.07
256                     0.07
512                     0.09
1024                    0.09
2048                    0.11
4096                    0.18
8192                    0.31
16384                   0.76
32768                   1.63
65536                   3.00
131072                  5.56
262144                 12.86
524288                 21.05
1048576                69.96
2097152               175.69
4194304               347.49
openmpi@1.10.7%intel@19.0.5.281 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.04
openmpi@1.10.7%intel@19.0.5.281 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       1.83
2                       1.82
4                       1.84
8                       1.84
16                      1.86
32                      1.83
64                      1.97
128                     2.05
256                     2.32
512                     2.64
1024                    3.36
2048                    4.63
4096                    8.18
8192                   13.16
16384                  24.43
32768                  43.41
65536                  76.83
131072                143.85
262144                274.35
524288                571.58
1048576              1134.42
2097152              2144.37
4194304              4497.17
openmpi@1.10.7%intel@19.0.5.281 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.04
2                       0.04
4                       0.05
8                       0.04
16                      0.06
32                      0.06
64                      0.04
128                     0.06
256                     0.06
512                     0.05
1024                    0.06
2048                    0.07
4096                    0.10
8192                    0.13
16384                   0.32
32768                   1.07
65536                   2.80
131072                  5.45
262144                 11.74
524288                 23.52
1048576                62.98
2097152               171.98
4194304               352.69
openmpi@1.10.7%intel@19.0.5.281 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      24.48
2                      52.26
4                     101.90
8                     215.10
16                    429.19
32                    861.04
64                   1664.52
128                  3207.95
256                  5922.20
512                  9309.38
1024                14177.15
2048                19083.45
4096                24157.44
8192                16494.11
16384               10811.86
32768               10470.39
65536               11708.31
131072               9809.97
262144               5310.63
524288               4500.46
1048576              4568.12
2097152              4426.52
4194304              4395.14
-- linux-debian9-cascadelake / intel@19.0.5.281 -----------------
hwloc@1.11.11
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
numactl@2.0.14
openmpi@2.1.6
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
openmpi@2.1.6%intel@19.0.5.281 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
openmpi@2.1.6%intel@19.0.5.281 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 12 ms, max: 12 ms, avg: 12 ms
openmpi@2.1.6%intel@19.0.5.281 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       8.92
2                      16.95
4                      33.52
8                      67.68
16                     88.84
32                    252.95
64                    375.00
128                   535.12
256                   926.33
512                  1802.61
1024                 3361.25
2048                 5382.69
4096                 5140.69
8192                 7955.22
16384               10000.16
32768                9870.20
65536                9896.33
131072               9752.05
262144               9978.75
524288               9615.85
1048576              9410.59
2097152              9158.23
4194304              8470.56
openmpi@2.1.6%intel@19.0.5.281 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.23
1                       0.28
2                       0.27
4                       0.28
8                       0.27
16                      0.29
32                      0.29
64                      0.32
128                     0.37
256                     0.42
512                     0.67
1024                    0.72
2048                    0.89
4096                    1.60
8192                    2.35
16384                   4.49
32768                   6.99
65536                  10.08
131072                 16.29
262144                 29.14
524288                 55.02
1048576               116.52
2097152               244.99
4194304               517.89
openmpi@2.1.6%intel@19.0.5.281 osu_latency_mt
MPI_Init_thread must return MPI_THREAD_MULTIPLE!
-------------------------------------------------------
Primary job  terminated normally, but 1 process returned
a non-zero exit code.. Per user-direction, the job has been aborted.
-------------------------------------------------------
--------------------------------------------------------------------------
mpiexec detected that one or more processes exited with non-zero status, thus causing
the job to be terminated. The first process to do so was:

  Process name: [[1546,1],1]
  Exit code:    1
--------------------------------------------------------------------------
openmpi@2.1.6%intel@19.0.5.281 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.22
1                       0.27
2                       0.27
4                       0.27
8                       0.27
16                      0.30
32                      0.29
64                      0.32
128                     0.36
256                     0.42
512                     0.65
1024                    0.71
2048                    0.88
4096                    1.59
8192                    2.35
16384                   4.40
32768                   8.21
65536                  10.18
131072                 16.71
262144                 29.91
524288                 56.73
1048576               119.68
2097152               247.43
4194304               510.59
openmpi@2.1.6%intel@19.0.5.281 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       8.46
2                      17.72
4                      35.44
8                      70.48
16                    135.27
32                    256.80
64                    361.15
128                   459.85
256                   772.37
512                  1847.95
1024                 3120.92
2048                 5022.12
4096                 5417.52
8192                 7856.87
16384                9188.71
32768                9640.80
65536                9869.41
131072               9556.05
262144               9821.22
524288               9790.17
1048576              9627.09
2097152              8812.62
4194304              7867.53
openmpi@2.1.6%intel@19.0.5.281 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.22
1                       0.28
2                       0.29
4                       0.28
8                       0.28
16                      0.30
32                      0.31
64                      0.34
128                     0.39
256                     0.44
512                     0.67
1024                    0.73
2048                    0.89
4096                    1.64
8192                    2.38
16384                   4.64
32768                   7.20
65536                  10.32
131072                 16.77
262144                 30.12
524288                 56.88
1048576               124.58
2097152               254.43
4194304               529.80
openmpi@2.1.6%intel@19.0.5.281 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                       6.79        6794617.70
2                      11.70        5848829.48
4                      26.91        6726497.67
8                      49.72        6215583.60
16                    105.07        6567018.83
32                    202.71        6334570.24
64                    265.08        4141815.89
128                   385.79        3014005.69
256                   633.87        2476070.15
512                  1404.77        2743685.35
1024                 2504.81        2446101.69
2048                 4215.61        2058403.35
4096                 4438.00        1083495.71
8192                 7293.66         890338.90
16384                9161.62         559180.96
32768                9860.82         300928.19
65536                9961.30         151997.41
131072               9737.62          74292.16
262144               9749.65          37191.98
524288               9696.88          18495.32
1048576              9509.58           9069.04
2097152              8799.16           4195.77
4194304              7825.80           1865.82
openmpi@2.1.6%intel@19.0.5.281 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.47
2                       1.39
4                       3.59
8                       1.54
16                      1.46
32                      1.55
64                      1.66
128                     2.21
256                     2.95
512                     3.52
1024                    5.08
2048                    7.66
4096                   13.43
8192                   23.66
16384                  39.78
32768                  54.31
65536                 102.60
131072                205.14
262144                455.10
524288               1084.47
1048576              3053.25
openmpi@2.1.6%intel@19.0.5.281 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.86
2                       0.82
4                       0.86
8                       0.83
16                      0.89
32                      0.94
64                      3.08
128                     1.75
256                     1.18
512                     1.71
1024                    2.03
2048                    4.02
4096                    6.28
8192                   11.38
16384                  20.80
32768                  39.09
65536                  74.45
131072                143.04
262144                277.11
524288                266.62
1048576               567.44
openmpi@2.1.6%intel@19.0.5.281 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.74              4.66              3.88              0.00
2                       8.73              4.64              3.88              0.00
4                       9.28              4.95              4.12              0.00
8                       8.98              4.96              4.18              4.05
16                      8.82              4.51              3.67              0.00
32                      8.68              4.74              3.97              0.70
64                      8.49              4.56              3.81              0.00
128                     9.17              4.87              4.05              0.00
256                     9.51              5.13              4.24              0.00
512                    15.95              8.17              7.03              0.00
1024                   21.09             10.65              9.23              0.00
2048                   24.63             13.12             11.30              0.00
4096                   41.47             22.79             20.01              6.60
8192                   55.24             28.79             25.33              0.00
16384                  77.59             40.48             35.65              0.00
32768                 125.96             64.72             57.07              0.00
65536                 242.66            126.28            112.33              0.00
131072                581.84            297.07            264.38              0.00
262144               1781.06            881.95            781.04              0.00
524288               3884.13           2077.81           1854.89              2.62
1048576              8740.47           4770.57           4265.86              6.94
openmpi@2.1.6%intel@19.0.5.281 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.42              1.28              0.91              0.00
2                       2.36              1.29              0.87              0.00
4                       2.42              1.29              0.83              0.00
8                       2.31              1.24              0.80              0.00
16                      2.37              1.30              0.84              0.00
32                      2.32              1.24              0.81              0.00
64                      2.27              1.24              0.83              0.00
128                     2.42              1.31              0.90              0.00
256                     2.65              1.53              1.10              0.00
512                     6.75              3.39              2.80              0.00
1024                    8.72              4.28              3.56              0.00
2048                   11.36              5.29              4.36              0.00
4096                   18.86              8.12              6.85              0.00
8192                   29.28             12.67             10.99              0.00
16384                  45.33             21.04             18.51              0.00
32768                  63.58             28.53             25.17              0.00
65536                 103.83             45.31             40.09              0.00
131072                204.28             91.46             80.96              0.00
262144                402.79            187.30            166.97              0.00
524288                848.42            414.02            369.83              0.00
1048576              1917.12            966.54            862.67              0.00
openmpi@2.1.6%intel@19.0.5.281 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.76
2                       0.75
4                       0.83
8                       0.87
16                      0.91
32                      0.82
64                      1.12
128                     1.25
256                     1.32
512                     4.11
1024                    4.40
2048                    5.45
4096                    9.59
8192                   13.85
16384                  20.72
32768                  32.81
65536                  47.93
131072                 91.00
262144                183.65
524288                362.25
1048576               806.97
openmpi@2.1.6%intel@19.0.5.281 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.92
2                       3.90
4                       3.83
8                      14.66
16                      9.05
32                     14.24
64                      7.62
128                     7.52
256                     5.90
512                     6.58
1024                    8.23
2048                   12.94
4096                   25.92
8192                   37.56
16384                  31.67
32768                  54.46
65536                 101.10
131072                306.41
262144                852.55
524288               1914.82
1048576              5890.42
openmpi@2.1.6%intel@19.0.5.281 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.31
2                       0.27
4                       0.29
8                       0.28
16                      0.28
32                      0.30
64                      0.29
128                     0.31
256                     0.35
512                     1.43
1024                    1.96
2048                    2.79
4096                   10.85
8192                   14.11
16384                  17.97
32768                  24.56
65536                  37.59
131072                 82.10
262144                137.80
524288                396.25
1048576               575.67
openmpi@2.1.6%intel@19.0.5.281 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.56              5.12              4.28              0.00
2                       9.53              4.90              4.09              0.00
4                       9.03              4.91              4.13              0.44
8                       8.87              4.83              4.00              0.00
16                      8.71              4.64              3.86              0.00
32                      9.05              4.96              4.09              0.00
64                      9.13              4.84              4.04              0.00
128                     9.80              5.53              4.70              9.19
256                     9.99              5.30              4.39              0.00
512                    15.54              8.42              7.25              1.75
1024                   19.22              9.63              8.28              0.00
2048                   24.37             11.92             10.35              0.00
4096                   45.20             23.28             20.49              0.00
8192                   56.88             29.92             26.28              0.00
16384                  78.77             40.61             35.84              0.00
32768                 127.18             65.81             58.12              0.00
65536                 255.62            136.90            121.48              2.28
131072                593.51            295.17            259.69              0.00
262144               1795.37            934.79            835.66              0.00
524288               4012.79           2177.13           1943.54              5.55
1048576              8819.01           4764.11           4244.19              4.46
openmpi@2.1.6%intel@19.0.5.281 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       3.10              1.69              1.20              0.00
8                       3.09              1.75              1.20              0.00
16                      3.56              1.85              1.38              0.00
32                      3.31              1.86              1.42              0.00
64                      3.32              1.91              1.47              4.45
128                     3.40              1.86              1.42              0.00
256                     3.63              2.02              1.53              0.00
512                     6.83              3.09              2.53              0.00
1024                    8.19              3.59              2.94              0.00
2048                   10.00              4.49              3.78              0.00
4096                   14.14              5.75              4.81              0.00
8192                   20.93              8.01              6.79              0.00
16384                  40.26             15.20             13.26              0.00
32768                  61.48             21.75             19.09              0.00
65536                  95.35             34.09             30.06              0.00
131072                176.18             62.31             55.22              0.00
262144                335.47            116.15            103.29              0.00
524288                661.40            223.22            198.86              0.00
1048576              1396.63            472.27            420.99              0.00
openmpi@2.1.6%intel@19.0.5.281 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.68
2                       0.69
4                       0.69
8                       0.71
16                      0.79
32                      0.79
64                      0.83
128                     0.93
256                     1.09
512                     3.64
1024                    4.00
2048                    4.86
4096                    7.77
8192                   10.91
16384                  20.47
32768                  32.90
65536                  47.81
131072                106.04
262144                196.18
524288                383.50
1048576               727.20
openmpi@2.1.6%intel@19.0.5.281 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.88
8                       1.88
16                      1.88
32                      1.99
64                      2.41
128                     2.27
256                     2.56
512                     4.11
1024                    4.98
2048                    7.53
4096                   14.35
8192                   19.17
16384                  22.82
32768                  52.25
65536                  78.30
131072                155.96
262144                188.91
524288                385.03
1048576               886.70
openmpi@2.1.6%intel@19.0.5.281 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.27
2                       0.26
4                       0.35
8                       0.27
16                      0.29
32                      0.28
64                      0.28
128                     0.31
256                     0.34
512                     1.52
1024                    2.05
2048                    2.81
4096                    9.42
8192                   13.62
16384                  22.82
32768                  34.51
65536                  48.59
131072                 84.68
262144                151.67
524288                342.01
1048576               633.76
openmpi@2.1.6%intel@19.0.5.281 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      12.63              6.76              5.77              0.00
2                      11.42              6.14              5.24              0.00
4                      11.93              6.12              5.20              0.00
8                       9.56              5.34              4.53              6.76
16                      8.86              4.62              3.91              0.00
32                      9.98              4.76              3.99              0.00
64                      8.90              4.75              3.94              0.00
128                     9.32              5.02              4.18              0.00
256                     9.88              5.25              4.37              0.00
512                    15.32              8.11              6.92              0.00
1024                   17.90              9.51              8.18              0.00
2048                   23.37             12.15             10.48              0.00
4096                   40.24             21.40             18.75              0.00
8192                   62.06             34.23             30.21              7.86
16384                  80.80             41.29             36.41              0.00
32768                 124.43             65.55             58.24              0.00
65536                 265.00            138.04            122.76              0.00
131072                619.35            312.52            279.68              0.00
262144               1907.91            995.58            889.49              0.00
524288               3980.96           2063.89           1841.34              0.00
1048576              8659.64           4626.93           4124.62              2.23
openmpi@2.1.6%intel@19.0.5.281 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.65              2.09              1.61              3.35
2                       4.88              3.12              2.46             28.43
4                       3.39              2.17              1.70             28.02
8                       5.22              3.37              1.64              0.00
16                      3.43              2.35              1.85             41.73
32                      4.21              2.18              1.71              0.00
64                      3.31              2.22              1.73             36.73
128                     3.67              2.52              1.93             40.65
256                     4.04              2.82              2.22             45.27
512                     4.53              2.96              2.45             35.92
1024                    5.19              3.50              2.84             40.60
2048                    6.20              4.39              3.61             50.14
4096                   16.36              8.23              7.02              0.00
8192                   33.59             13.70             10.15              0.00
16384                  45.36             19.41             17.02              0.00
32768                  60.72             26.68             23.41              0.00
65536                 134.00             53.34             42.77              0.00
131072                596.35            200.03            164.00              0.00
262144               1022.79            412.41            347.93              0.00
524288               2455.76           1370.18           1148.11              5.45
1048576              4744.13           1892.29           1581.38              0.00
openmpi@2.1.6%intel@19.0.5.281 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       6.68
2                       3.79
4                       3.64
8                       3.59
16                      3.86
32                      3.63
64                      3.90
128                     4.00
256                     4.61
512                     5.23
1024                    6.24
2048                    8.10
4096                   25.53
8192                   33.66
16384                  48.53
32768                  73.15
65536                 135.57
131072                267.67
262144                627.03
524288               1736.35
1048576              3559.36
openmpi@2.1.6%intel@19.0.5.281 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      11.21              6.11              5.11              0.08
2                      11.20              6.26              5.35              7.72
4                      10.59              5.93              5.05              7.65
8                       9.63              5.56              4.64             12.09
16                      8.81              4.72              3.89              0.00
32                      8.93              4.94              4.13              3.36
64                      9.08              4.77              3.94              0.00
128                    10.17              5.59              4.66              1.53
256                    10.08              5.40              4.50              0.00
512                    32.40             13.21             10.66              0.00
1024                   20.77             11.01              9.49              0.00
2048                   23.40             12.28             10.62              0.00
4096                   42.71             21.74             19.00              0.00
8192                   59.48             30.51             26.83              0.00
16384                  81.68             42.18             36.91              0.00
32768                 133.58             69.36             61.70              0.00
65536                 238.83            130.36            115.86              6.38
131072                496.55            261.47            233.09              0.00
262144               1247.36            598.32            534.27              0.00
524288               3502.02           1587.49           1391.83              0.00
1048576              6599.01           3398.23           3034.49              0.00
openmpi@2.1.6%intel@19.0.5.281 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
              8.28              4.99              4.15             20.66
openmpi@2.1.6%intel@19.0.5.281 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.51              2.43              1.84             41.13
2                       3.70              2.25              1.76             17.64
4                       3.45              2.23              1.76             30.30
8                       3.33              2.27              1.77             39.60
16                      3.34              2.26              1.77             38.88
32                      3.40              2.30              1.76             37.79
64                      3.62              2.39              1.84             33.11
128                     3.80              2.63              2.03             42.34
256                     4.53              3.35              2.68             55.95
512                     4.89              3.34              2.69             42.32
1024                    5.32              3.60              2.94             41.65
2048                    7.32              5.02              3.83             39.86
4096                   18.00              8.45              7.27              0.00
8192                   23.36             11.57              9.74              0.00
16384                  35.29             16.51             14.42              0.00
32768                  58.27             26.46             23.36              0.00
65536                 105.58             46.67             41.24              0.00
131072                274.06            138.97            123.75              0.00
262144                577.90            295.17            263.17              0.00
524288               1228.17            634.48            565.51              0.00
1048576              2586.50           1291.26           1151.47              0.00
openmpi@2.1.6%intel@19.0.5.281 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.53
2                       3.40
4                       3.75
8                       3.71
16                      5.26
32                      3.48
64                      4.05
128                     4.33
256                     7.26
512                     8.12
1024                    9.00
2048                   10.44
4096                   22.48
8192                   31.85
16384                  50.66
32768                  72.46
65536                 138.12
131072                271.58
262144                637.95
524288               1776.75
1048576              3654.55
openmpi@2.1.6%intel@19.0.5.281 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.70              5.09              4.21              0.00
2                      10.10              5.59              4.67              3.29
4                      11.91              6.03              5.06              0.00
8                      10.31              5.91              4.97             11.61
16                      9.87              5.36              4.50              0.00
32                     10.54              6.01              4.90              7.54
64                      9.91              5.37              4.56              0.45
128                    10.66              5.91              5.01              5.21
256                    10.79              5.91              4.98              2.08
512                    15.19              8.18              6.99              0.00
1024                   17.72              9.26              7.94              0.00
2048                   22.75             11.66              9.99              0.00
4096                   45.67             20.77             18.19              0.00
8192                   55.78             28.83             25.29              0.00
16384                  90.28             51.42             45.16             13.95
32768                 121.50             65.27             57.91              2.90
65536                 222.15            117.05            104.01              0.00
131072                500.93            245.45            218.55              0.00
262144               1044.94            530.44            472.30              0.00
524288               3009.92           1523.92           1364.11              0.00
1048576             10723.12           5501.16           4904.41              0.00
openmpi@2.1.6%intel@19.0.5.281 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       4.04              2.56              1.95             24.07
2                       3.79              2.23              1.72              9.33
4                       3.58              2.15              1.61             11.58
8                       3.49              2.13              1.59             14.23
16                      3.51              2.19              1.68             21.64
32                      3.36              2.09              1.58             19.68
64                      3.42              2.13              1.69             23.32
128                     4.01              2.40              1.85             13.58
256                     4.09              2.47              1.87             13.17
512                     5.47              3.10              2.52              6.07
1024                    6.05              3.38              2.75              2.86
2048                    7.69              4.52              3.78             16.21
4096                   12.90              7.73              6.36             18.70
8192                   16.88             10.34              8.92             26.62
16384                  33.58             18.94             16.59             11.76
32768                  37.37             20.83             18.28              9.53
65536                  61.88             31.08             27.21              0.00
131072                110.64             69.49             61.41             32.98
262144                210.35            131.03            116.64             32.00
524288                395.93            264.79            235.79             44.39
1048576               919.19            554.86            482.53             24.50
openmpi@2.1.6%intel@19.0.5.281 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.69
8                       0.70
16                      0.73
32                      0.73
64                      0.82
128                     0.88
256                     1.00
512                     1.80
1024                    2.08
2048                    6.07
4096                    8.60
8192                   18.45
16384                  15.86
32768                  41.45
65536                  84.64
131072                116.00
262144                189.83
524288                343.90
1048576               617.75
openmpi@2.1.6%intel@19.0.5.281 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             1.26
openmpi@2.1.6%intel@19.0.5.281 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       7.61              4.18              3.44              0.12
8                      65.90             28.10             22.91              0.00
16                      8.62              4.43              3.57              0.00
32                     18.80              5.62              3.52              0.00
64                     20.46              6.08              3.81              0.00
128                     8.52              4.44              3.70              0.00
256                    12.10              6.33              4.08              0.00
512                    57.62             19.93             14.60              0.00
1024                   15.06              7.72              6.62              0.00
2048                   82.35             18.80             11.93              0.00
4096                   57.99             18.98             15.40              0.00
8192                  139.30             58.29             46.88              0.00
16384                 157.37             56.60             46.70              0.00
32768                 141.31             74.73             66.29              0.00
65536                 166.18             85.87             76.07              0.00
131072                783.04            631.43            559.53             72.91
262144                403.15            210.88            187.63              0.00
524288                711.62            366.80            326.81              0.00
1048576              1586.16            767.29            679.23              0.00
openmpi@2.1.6%intel@19.0.5.281 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.96              1.43              0.95              0.00
2                       2.72              1.53              1.01              0.00
4                       2.64              1.44              0.94              0.00
8                       2.62              1.42              0.96              0.00
16                      2.65              1.46              0.93              0.00
32                      2.63              1.42              0.93              0.00
64                      2.64              1.43              0.95              0.00
128                     2.65              1.41              0.94              0.00
256                     2.78              1.50              1.07              0.00
512                     7.38              3.57              2.90              0.00
1024                    9.31              4.37              3.60              0.00
2048                   11.24              5.59              4.62              0.00
4096                   19.44              8.18              7.02              0.00
8192                   29.12             12.48             10.79              0.00
16384                  44.94             20.58             18.11              0.00
32768                  64.35             28.62             25.16              0.00
65536                 108.03             44.09             39.04              0.00
131072                203.79             90.12             78.93              0.00
262144                425.41            196.00            173.97              0.00
524288                856.05            414.31            367.19              0.00
1048576              2071.75            957.75            851.23              0.00
openmpi@2.1.6%intel@19.0.5.281 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.00
8                       1.10
16                      1.31
32                      1.88
64                      1.89
128                     1.94
256                     2.06
512                     3.22
1024                    4.64
2048                    4.52
4096                    5.82
8192                    9.98
16384                  15.10
32768                  20.52
65536                  31.28
131072                167.39
262144                364.61
524288                307.90
1048576               566.18
openmpi@2.1.6%intel@19.0.5.281 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.04
2                       0.04
4                       0.06
8                       0.04
16                      0.05
32                      0.06
64                      0.09
128                     0.13
256                     0.24
512                     0.42
1024                    0.80
2048                    1.54
4096                    2.97
8192                    5.86
16384                  11.78
32768                  23.35
65536                  46.67
131072                 96.43
262144                189.12
524288                382.19
1048576               760.70
2097152              1518.62
4194304              3042.18
openmpi@2.1.6%intel@19.0.5.281 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.05
openmpi@2.1.6%intel@19.0.5.281 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      29.46
2                      64.64
4                     136.82
8                     225.84
16                    443.51
32                    943.59
64                   2061.50
128                  3510.71
256                  8464.47
512                 12072.76
1024                22191.97
2048                28954.60
4096                31731.87
8192                22829.70
16384               13665.80
32768               11874.46
65536               10402.65
131072               9908.09
262144               4976.74
524288               4552.14
1048576              4526.48
2097152              4411.96
4194304              4550.30
openmpi@2.1.6%intel@19.0.5.281 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      38.40
2                      87.21
4                     174.88
8                     360.10
16                    596.21
32                    910.65
64                   2791.47
128                  5553.26
256                 10832.43
512                 18718.10
1024                28528.83
2048                36663.55
4096                40292.44
8192                40415.26
16384               31497.54
32768               24328.16
65536               20821.22
131072              12802.37
262144               8810.24
524288               8966.17
1048576              9152.86
2097152              8450.97
4194304              9032.01
openmpi@2.1.6%intel@19.0.5.281 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.05
2                       0.05
4                       0.05
8                       0.06
16                      0.06
32                      0.06
64                      0.06
128                     0.06
256                     0.06
512                     0.07
1024                    0.08
2048                    0.10
4096                    0.19
8192                    0.31
16384                   0.77
32768                   1.67
65536                   3.00
131072                  6.03
262144                 12.44
524288                 25.16
1048576                61.98
2097152               168.64
4194304               345.60
openmpi@2.1.6%intel@19.0.5.281 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.04
openmpi@2.1.6%intel@19.0.5.281 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       3.39
2                       3.78
4                       3.47
8                       3.38
16                      3.38
32                      3.38
64                      3.43
128                     3.61
256                     3.81
512                     4.07
1024                    4.92
2048                    6.22
4096                    9.58
8192                   14.01
16384                  24.87
32768                  43.28
65536                  77.25
131072                146.51
262144                276.28
524288                557.65
1048576              1135.87
2097152              2190.09
4194304              4432.57
openmpi@2.1.6%intel@19.0.5.281 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.04
4                       0.03
8                       0.04
16                      0.03
32                      0.04
64                      0.04
128                     0.04
256                     0.04
512                     0.04
1024                    0.04
2048                    0.05
4096                    0.08
8192                    0.13
16384                   0.41
32768                   1.48
65536                   2.79
131072                  6.53
262144                  7.13
524288                 21.65
1048576                64.58
2097152               169.95
4194304               350.33
openmpi@2.1.6%intel@19.0.5.281 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      34.63
2                      69.30
4                     131.81
8                     276.97
16                    428.39
32                   1107.91
64                   2200.66
128                  4265.56
256                  8474.06
512                 12759.13
1024                16738.52
2048                18843.34
4096                24683.39
8192                22171.23
16384               15268.09
32768               12247.81
65536               11328.61
131072              10885.45
262144               5275.34
524288               4605.30
1048576              4423.61
2097152              4610.65
4194304              4620.09
-- linux-debian9-cascadelake / intel@19.0.5.281 -----------------
hwloc@1.11.11
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
numactl@2.0.14
openmpi@3.1.6
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
openmpi@3.1.6%intel@19.0.5.281 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
openmpi@3.1.6%intel@19.0.5.281 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 10 ms, max: 13 ms, avg: 11 ms
openmpi@3.1.6%intel@19.0.5.281 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       9.62
2                      19.35
4                      38.70
8                      71.39
16                    115.76
32                    305.12
64                    374.66
128                   556.87
256                   918.72
512                  1942.17
1024                 3264.54
2048                 5506.34
4096                 5189.28
8192                 8016.92
16384                9748.94
32768                9698.25
65536                9890.45
131072               9741.49
262144               9901.64
524288               9734.14
1048576              9683.57
2097152              8922.22
4194304              8294.01
openmpi@3.1.6%intel@19.0.5.281 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.22
1                       0.28
2                       0.28
4                       0.30
8                       0.27
16                      0.29
32                      0.30
64                      0.33
128                     0.37
256                     0.43
512                     0.64
1024                    0.71
2048                    0.92
4096                    1.63
8192                    2.30
16384                   4.56
32768                   7.09
65536                  10.34
131072                 16.82
262144                 29.93
524288                 57.27
1048576               123.99
2097152               253.78
4194304               518.71
openmpi@3.1.6%intel@19.0.5.281 osu_latency_mt
# Number of Sender threads: 1
# Number of Receiver threads: 2
# OSU MPI Multi-threaded Latency Test v5.6.3
# Size          Latency (us)
0                       0.38
1                       0.44
2                       0.44
4                       0.44
8                       0.45
16                      0.45
32                      0.45
64                      0.47
128                     0.53
256                     0.59
512                     0.99
1024                    1.04
2048                    1.20
4096                    4.48
8192                    3.71
16384                   4.98
32768                   7.48
65536                  10.84
131072                 17.72
262144                 32.22
524288                 93.59
1048576               209.51
2097152               585.60
4194304              1066.35
openmpi@3.1.6%intel@19.0.5.281 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.23
1                       0.30
2                       0.28
4                       0.28
8                       0.29
16                      0.30
32                      0.31
64                      0.35
128                     0.39
256                     0.44
512                     0.66
1024                    0.72
2048                    1.15
4096                    1.69
8192                    2.36
16384                   4.60
32768                   7.18
65536                  10.45
131072                 16.96
262144                 30.08
524288                 57.91
1048576               122.69
2097152               250.35
4194304               523.15
openmpi@3.1.6%intel@19.0.5.281 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       7.40
2                      17.02
4                      33.54
8                      65.04
16                    121.26
32                    218.49
64                    342.97
128                   470.59
256                   810.48
512                  1844.30
1024                 3156.29
2048                 5086.51
4096                 5620.43
8192                 7709.40
16384                8771.23
32768                9473.18
65536                9660.13
131072               9461.03
262144               9506.56
524288               9384.24
1048576              9356.19
2097152              8821.14
4194304              7553.89
openmpi@3.1.6%intel@19.0.5.281 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.24
1                       0.29
2                       0.29
4                       0.30
8                       0.29
16                      0.30
32                      0.30
64                      0.32
128                     0.36
256                     0.42
512                     0.63
1024                    0.69
2048                    0.89
4096                    1.63
8192                    2.53
16384                   4.66
32768                   7.13
65536                  10.34
131072                 16.82
262144                 30.10
524288                 57.04
1048576               121.50
2097152               251.02
4194304               535.91
openmpi@3.1.6%intel@19.0.5.281 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                       4.46        4457690.59
2                       8.92        4462287.39
4                      17.89        4471578.22
8                      33.96        4244811.53
16                     70.97        4435837.72
32                    142.23        4444697.52
64                    265.20        4143722.40
128                   472.96        3695015.68
256                   839.25        3278312.32
512                  1933.42        3776210.00
1024                 3620.90        3536030.80
2048                 5315.60        2595508.64
4096                 5239.15        1279089.04
8192                 7361.52         898623.23
16384                9168.47         559598.75
32768                9687.09         295626.40
65536               10071.60         153680.48
131072               9892.98          75477.46
262144               9784.49          37324.88
524288               9790.86          18674.58
1048576              9587.63           9143.48
2097152              8990.90           4287.19
4194304              8060.21           1921.70
openmpi@3.1.6%intel@19.0.5.281 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.33
2                       1.37
4                       1.37
8                       1.43
16                      1.49
32                      1.52
64                      1.62
128                     2.33
256                     2.78
512                     3.36
1024                    5.02
2048                    8.04
4096                   12.88
8192                   23.82
16384                  31.12
32768                  48.61
65536                 104.12
131072                206.36
262144                456.07
524288               1310.93
1048576              3051.16
openmpi@3.1.6%intel@19.0.5.281 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.80
2                       0.79
4                       0.78
8                       0.85
16                      0.81
32                      0.84
64                      0.91
128                     1.07
256                     1.26
512                     1.76
1024                    2.06
2048                    4.30
4096                    6.54
8192                   11.98
16384                  21.72
32768                  38.91
65536                  76.24
131072                145.01
262144                265.36
524288                252.47
1048576               506.53
openmpi@3.1.6%intel@19.0.5.281 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      11.28              5.81              4.90              0.00
2                      10.50              5.79              4.86              2.92
4                       8.97              4.90              4.11              0.88
8                       8.62              4.62              3.89              0.00
16                      8.72              4.68              3.94              0.00
32                      9.40              4.89              4.11              0.00
64                     10.08              6.01              5.11             20.31
128                     8.88              4.68              3.92              0.00
256                     9.87              5.47              4.63              4.76
512                    13.75              7.09              6.05              0.00
1024                   15.65              8.36              7.14              0.00
2048                   20.19             10.76              9.29              0.00
4096                   42.06             21.57             18.59              0.00
8192                   57.40             28.53             25.04              0.00
16384                 107.20             56.11             49.70              0.00
32768                 124.50             65.00             57.47              0.00
65536                 270.50            128.78            111.78              0.00
131072                623.84            324.43            289.86              0.00
262144               1503.03            794.06            708.89              0.00
524288               3753.61           1914.84           1698.68              0.00
1048576              8005.21           4338.19           3878.19              5.45
openmpi@3.1.6%intel@19.0.5.281 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.36              1.30              0.85              0.00
2                       3.04              1.28              0.82              0.00
4                       2.33              1.24              0.79              0.00
8                       2.23              1.24              0.78              0.00
16                      2.24              1.24              0.78              0.00
32                      2.24              1.23              0.79              0.00
64                      2.26              1.24              0.81              0.00
128                     2.75              1.25              0.81              0.00
256                     2.49              1.34              0.87              0.00
512                     7.14              3.42              2.75              0.00
1024                    7.96              3.91              3.19              0.00
2048                   10.87              5.01              4.10              0.00
4096                   19.65              7.78              6.63              0.00
8192                   27.95             11.85             10.19              0.00
16384                  43.84             19.98             17.51              0.00
32768                  60.30             27.21             23.72              0.00
65536                  96.45             41.68             36.90              0.00
131072                187.71             82.75             73.28              0.00
262144                371.79            184.84            164.71              0.00
524288                812.47            384.45            336.95              0.00
1048576              1685.25            822.11            734.92              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.91
2                       0.89
4                       0.95
8                       0.80
16                      0.85
32                      0.86
64                      0.91
128                     1.04
256                     1.16
512                     3.56
1024                    3.85
2048                    4.90
4096                    8.51
8192                   10.90
16384                  21.04
32768                  32.88
65536                  47.79
131072                 92.68
262144                185.44
524288                425.00
1048576               742.19
openmpi@3.1.6%intel@19.0.5.281 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       4.23
2                       4.14
4                       5.03
8                       4.39
16                      4.53
32                      4.73
64                      4.60
128                     5.06
256                     5.82
512                     6.48
1024                    8.51
2048                   11.74
4096                   24.14
8192                   24.18
16384                  31.85
32768                  50.17
65536                 106.38
131072                209.38
262144                464.25
524288               1127.34
1048576              3441.50
openmpi@3.1.6%intel@19.0.5.281 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.31
2                       0.27
4                       0.28
8                       0.29
16                      0.38
32                      0.39
64                      0.59
128                     0.86
256                     0.85
512                     1.49
1024                    1.95
2048                    2.83
4096                    9.59
8192                   12.58
16384                  17.91
32768                  24.69
65536                  37.74
131072                 96.99
262144                144.61
524288                249.87
1048576               538.62
openmpi@3.1.6%intel@19.0.5.281 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      11.14              5.68              4.72              0.00
2                       9.78              5.30              4.39              0.00
4                       9.75              5.22              4.35              0.00
8                       9.82              5.51              4.60              6.28
16                      8.91              4.74              3.99              0.00
32                      9.45              5.31              4.43              6.68
64                      8.92              4.76              3.93              0.00
128                     9.06              4.85              4.07              0.00
256                     9.68              5.16              4.31              0.00
512                    14.54              7.65              6.52              0.00
1024                   17.99              9.62              8.23              0.00
2048                   21.13             10.95              9.43              0.00
4096                   38.05             20.09             17.58              0.00
8192                   52.78             27.97             24.58              0.00
16384                  74.11             38.93             34.35              0.00
32768                 119.47             63.64             56.30              0.83
65536                 244.06            127.78            113.44              0.00
131072                562.85            277.58            243.90              0.00
262144               1497.48            743.03            660.16              0.00
524288               4000.84           1915.47           1704.20              0.00
1048576             11661.80           7221.68           6392.68             30.54
openmpi@3.1.6%intel@19.0.5.281 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       2.86              1.61              1.19              0.00
8                       2.80              1.58              1.14              0.00
16                      2.86              1.59              1.13              0.00
32                      4.89              1.59              1.15              0.00
64                      3.45              1.82              1.29              0.00
128                     7.13              1.68              1.27              0.00
256                     3.92              2.09              1.59              0.00
512                    17.25              7.44              6.33              0.00
1024                    7.50              3.39              2.74              0.00
2048                   15.14              5.74              3.15              0.00
4096                   46.53             13.61             11.65              0.00
8192                   29.77              9.01              7.43              0.00
16384                  76.51             25.56             21.35              0.00
32768                  61.73             22.76             20.00              0.00
65536                  96.31             34.38             30.37              0.00
131072                175.02             61.77             54.80              0.00
262144                332.21            113.22            100.53              0.00
524288                657.87            224.74            200.02              0.00
1048576              1382.50            463.93            414.92              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.82
2                       0.81
4                       0.86
8                       0.98
16                      0.88
32                      0.88
64                      0.93
128                     1.05
256                     1.23
512                     3.59
1024                    4.23
2048                    5.21
4096                    8.30
8192                   11.59
16384                  20.87
32768                  33.24
65536                  48.74
131072                 93.20
262144                190.11
524288                375.62
1048576               747.72
openmpi@3.1.6%intel@19.0.5.281 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.69
8                       1.71
16                      1.56
32                      1.66
64                      1.68
128                     1.87
256                     2.12
512                     3.44
1024                    4.43
2048                    5.55
4096                   11.25
8192                   15.93
16384                  22.82
32768                  52.26
65536                  68.64
131072                113.07
262144                182.51
524288                346.68
1048576               990.85
openmpi@3.1.6%intel@19.0.5.281 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.30
2                       0.29
4                       0.30
8                       0.30
16                      0.30
32                      0.31
64                      0.31
128                     0.33
256                     0.39
512                     1.53
1024                    2.00
2048                    2.85
4096                    9.25
8192                   13.17
16384                  21.82
32768                  32.08
65536                  47.25
131072                 81.51
262144                145.42
524288                282.21
1048576               606.11
openmpi@3.1.6%intel@19.0.5.281 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.35              5.06              4.25              0.00
2                       9.18              4.82              4.05              0.00
4                       9.09              4.91              4.10              0.00
8                       9.11              4.83              4.04              0.00
16                      9.30              4.91              4.05              0.00
32                      9.16              4.81              4.07              0.00
64                      9.51              5.16              4.28              0.00
128                     9.68              5.09              4.25              0.00
256                    10.01              5.42              4.54              0.00
512                    14.80              7.78              6.67              0.00
1024                   16.38              8.83              7.58              0.36
2048                   20.92             11.16              9.59              0.00
4096                   40.56             20.96             18.33              0.00
8192                   57.28             30.00             26.47              0.00
16384                  81.89             40.69             36.06              0.00
32768                 131.60             68.11             60.93              0.00
65536                 248.49            128.66            113.38              0.00
131072                536.88            272.80            242.80              0.00
262144               1655.67            833.99            745.47              0.00
524288               3866.34           1954.75           1737.45              0.00
1048576              8202.53           4260.08           3778.87              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       4.53              3.18              2.47             44.90
2                       4.25              2.91              2.33             42.49
4                       3.93              2.77              2.18             47.06
8                       2.97              1.98              1.55             35.92
16                      3.03              2.03              1.55             35.89
32                      3.38              2.10              1.57             18.83
64                      3.20              2.18              1.63             37.75
128                     3.47              2.25              1.77             31.06
256                     3.99              2.89              2.28             51.91
512                     4.27              2.83              2.26             36.36
1024                    4.62              3.10              2.49             38.76
2048                    5.92              4.16              3.39             48.06
4096                   14.96              7.41              6.39              0.00
8192                   20.78             10.49              9.14              0.00
16384                  32.98             15.63             13.71              0.00
32768                  53.34             24.04             21.20              0.00
65536                  94.38             40.42             35.77              0.00
131072                242.44            121.73            108.31              0.00
262144                549.11            268.32            239.37              0.00
524288               1143.78            570.35            510.03              0.00
1048576              2328.73           1163.73           1038.31              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       5.38
2                       5.38
4                       4.97
8                       4.80
16                      4.09
32                      3.98
64                      3.84
128                     3.99
256                     4.07
512                     4.69
1024                    5.60
2048                    7.71
4096                   21.48
8192                   30.06
16384                  50.37
32768                  73.62
65536                 133.62
131072                270.58
262144                732.57
524288               1982.74
1048576              3924.34
openmpi@3.1.6%intel@19.0.5.281 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.49              4.98              4.13              0.00
2                       9.07              4.86              4.02              0.00
4                       9.55              5.21              4.36              0.44
8                       8.74              4.64              3.85              0.00
16                      8.77              4.71              3.95              0.00
32                      8.74              4.66              3.86              0.00
64                      8.82              4.69              3.87              0.00
128                     9.94              5.27              4.46              0.00
256                    10.18              5.61              4.68              2.40
512                    14.59              7.91              6.74              0.90
1024                   16.32              8.67              7.36              0.00
2048                   20.69             11.44              9.92              6.78
4096                   38.17             20.26             17.79              0.00
8192                   54.19             28.04             24.68              0.00
16384                  76.08             40.78             36.02              2.00
32768                 118.03             61.85             54.95              0.00
65536                 306.21            117.90            103.20              0.00
131072                582.12            292.12            255.02              0.00
262144               1014.52            512.00            452.49              0.00
524288               2754.42           1456.00           1300.70              0.18
1048576              6091.31           3052.28           2710.81              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
             13.51              5.52              2.91              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.49              2.09              1.55              9.93
2                       3.56              2.18              1.67             17.26
4                       4.99              2.18              1.60              0.00
8                       3.21              2.09              1.55             27.46
16                      4.37              2.20              1.68              0.00
32                      4.71              3.69              1.69             39.53
64                      3.24              2.22              1.72             40.41
128                     3.55              2.45              1.88             41.59
256                     3.91              2.79              2.14             47.43
512                     4.31              2.85              2.21             33.80
1024                    5.28              3.16              2.54             16.50
2048                   29.82             16.88             13.63              5.07
4096                   31.59             10.31              8.07              0.00
8192                  109.95             32.52             24.06              0.00
16384                  34.36             15.00             12.95              0.00
32768                  55.28             23.88             20.87              0.00
65536                 135.99             47.10             36.45              0.00
131072                582.51            192.33            163.62              0.00
262144                851.39            348.07            284.08              0.00
524288               1759.03            750.69            628.20              0.00
1048576              2554.07           1236.51           1096.29              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.31
2                       3.60
4                       3.38
8                       3.87
16                      3.71
32                      3.60
64                      3.72
128                     4.15
256                     4.62
512                     7.36
1024                    8.12
2048                   11.86
4096                   22.46
8192                   32.33
16384                  51.68
32768                  78.15
65536                 206.76
131072                334.02
262144                692.22
524288               1789.29
1048576              3630.26
openmpi@3.1.6%intel@19.0.5.281 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      10.99              5.77              4.92              0.00
2                      12.92              6.95              4.87              0.00
4                      13.89              6.34              4.77              0.00
8                       8.89              4.73              3.91              0.00
16                      9.57              4.84              4.05              0.00
32                      9.00              4.82              4.03              0.00
64                      9.28              4.94              4.15              0.00
128                     9.40              5.11              4.23              0.00
256                     9.53              5.14              4.29              0.00
512                    14.24              7.48              6.41              0.00
1024                   16.84              8.88              7.66              0.00
2048                   19.78             10.47              9.08              0.00
4096                   38.28             20.45             17.92              0.51
8192                   55.94             28.89             25.47              0.00
16384                  74.27             39.67             35.06              1.31
32768                 127.11             63.65             56.54              0.00
65536                 245.19            121.05            106.68              0.00
131072                486.19            254.07            226.34              0.00
262144               1742.88            550.73            450.41              0.00
524288               2670.89           1340.30           1191.07              0.00
1048576              6252.47           3211.06           2863.43              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.66              2.34              1.71             22.65
2                       3.67              2.35              1.72             22.66
4                       3.57              2.12              1.60              9.00
8                       3.42              2.08              1.59             15.46
16                      3.73              2.09              1.58              0.00
32                      3.38              2.10              1.59             19.88
64                      3.57              2.09              1.62              8.77
128                     3.97              2.23              1.75              0.31
256                     3.94              2.44              1.96             23.25
512                     5.36              2.97              2.44              2.29
1024                    5.64              3.34              2.72             15.27
2048                    7.13              4.12              3.34             10.01
4096                   11.57              6.99              6.00             23.69
8192                   15.97              9.50              8.13             20.37
16384                  24.03             13.03             11.37              3.27
32768                  37.89             20.72             17.99              4.56
65536                  57.30             30.01             26.31              0.00
131072                117.63             76.86             68.20             40.23
262144                232.73            133.22            115.43             13.80
524288                410.74            271.45            241.68             42.37
1048576               833.48            543.71            484.08             40.14
openmpi@3.1.6%intel@19.0.5.281 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.70
8                       0.64
16                      0.65
32                      0.66
64                      0.73
128                     0.84
256                     1.00
512                     1.75
1024                    2.03
2048                    3.56
4096                    6.98
8192                   14.19
16384                  13.98
32768                  23.37
65536                  49.76
131072                102.01
262144                181.81
524288                320.11
1048576               622.66
openmpi@3.1.6%intel@19.0.5.281 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             1.15
openmpi@3.1.6%intel@19.0.5.281 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       7.39              4.08              3.27              0.00
8                       6.87              3.71              2.95              0.00
16                      6.73              3.82              3.07              5.43
32                      7.05              3.55              2.92              0.00
64                      8.66              5.05              4.14             12.82
128                     8.26              4.52              3.68              0.00
256                     8.27              4.49              3.68              0.00
512                    11.25              6.00              5.10              0.00
1024                   13.80              7.42              6.34              0.00
2048                   18.58              9.70              8.40              0.00
4096                   33.36             16.49             14.41              0.00
8192                   51.46             25.92             22.73              0.00
16384                  83.92             42.72             37.68              0.00
32768                 139.54             67.87             59.90              0.00
65536                 191.58             91.73             81.37              0.00
131072                322.17            132.32            115.48              0.00
262144                402.25            205.43            182.39              0.00
524288                748.19            401.68            358.14              3.25
1048576              1480.65            753.75            673.35              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.47              1.35              0.90              0.00
2                       2.44              1.34              0.88              0.00
4                       2.50              1.33              0.88              0.00
8                       2.44              1.34              0.87              0.00
16                      2.48              1.39              0.87              0.00
32                      2.28              1.26              0.77              0.00
64                      2.42              1.36              0.89              0.00
128                     2.36              1.29              0.83              0.00
256                     2.29              1.25              0.83              0.00
512                     7.04              3.45              2.76              0.00
1024                    7.87              3.78              3.06              0.00
2048                   10.15              4.57              3.86              0.00
4096                   18.82              7.49              6.36              0.00
8192                   27.78             11.45              9.90              0.00
16384                  43.73             19.98             17.49              0.00
32768                  61.06             26.97             23.29              0.00
65536                  93.74             40.28             35.61              0.00
131072                182.75             79.07             70.20              0.00
262144                366.98            178.24            158.51              0.00
524288                768.97            370.55            327.38              0.00
1048576              1731.39            825.52            730.04              0.00
openmpi@3.1.6%intel@19.0.5.281 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.93
8                       1.23
16                      1.20
32                      1.68
64                      1.71
128                     1.93
256                     1.94
512                     4.39
1024                    2.98
2048                    4.01
4096                    4.91
8192                    7.48
16384                  12.41
32768                  19.77
65536                  32.60
131072                154.42
262144                369.74
524288                255.89
1048576               557.28
openmpi@3.1.6%intel@19.0.5.281 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.04
2                       0.04
4                       0.04
8                       0.05
16                      0.06
32                      0.08
64                      0.10
128                     0.14
256                     0.25
512                     0.43
1024                    0.80
2048                    1.51
4096                    3.01
8192                    5.84
16384                  11.77
32768                  23.64
65536                  46.90
131072                 93.49
262144                191.22
524288                373.15
1048576               807.06
2097152              1504.05
4194304              3025.12
openmpi@3.1.6%intel@19.0.5.281 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.04
openmpi@3.1.6%intel@19.0.5.281 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      29.26
2                      53.35
4                     129.08
8                     232.75
16                    459.38
32                    977.86
64                   1675.45
128                  4053.98
256                  7742.11
512                 13307.77
1024                21749.20
2048                29635.46
4096                34553.78
8192                22092.82
16384               14376.98
32768               12055.41
65536               11633.95
131072              10665.34
262144               5564.94
524288               4749.93
1048576              4351.38
2097152              4595.23
4194304              4677.29
openmpi@3.1.6%intel@19.0.5.281 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      34.13
2                      89.89
4                     164.95
8                     360.66
16                    615.23
32                   1447.56
64                   2816.90
128                  4998.38
256                 10430.06
512                 19078.78
1024                25738.85
2048                35054.85
4096                44654.57
8192                35593.49
16384               30004.75
32768               23389.71
65536               20292.21
131072              13366.40
262144               9108.29
524288               8453.53
1048576              8537.94
2097152              8460.00
4194304              8488.45
openmpi@3.1.6%intel@19.0.5.281 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.04
2                       0.04
4                       0.04
8                       0.04
16                      0.04
32                      0.04
64                      0.04
128                     0.04
256                     0.04
512                     0.04
1024                    0.05
2048                    0.06
4096                    0.16
8192                    0.28
16384                   0.50
32768                   1.58
65536                   2.12
131072                  6.25
262144                 12.12
524288                 24.31
1048576                60.60
2097152               170.74
4194304               355.81
openmpi@3.1.6%intel@19.0.5.281 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.04
openmpi@3.1.6%intel@19.0.5.281 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       3.15
2                       3.12
4                       3.15
8                       3.11
16                      3.17
32                      3.36
64                      3.22
128                     3.41
256                     3.67
512                     3.99
1024                    4.81
2048                    6.90
4096                    9.56
8192                   14.33
16384                  25.05
32768                  43.77
65536                  78.03
131072                146.31
262144                279.49
524288                562.77
1048576              1132.34
2097152              2157.79
4194304              4506.81
openmpi@3.1.6%intel@19.0.5.281 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.04
2                       0.04
4                       0.04
8                       0.04
16                      0.04
32                      0.04
64                      0.04
128                     0.04
256                     0.04
512                     0.04
1024                    0.05
2048                    0.06
4096                    0.08
8192                    0.13
16384                   0.31
32768                   1.20
65536                   2.53
131072                  5.53
262144                 11.03
524288                 25.15
1048576                64.53
2097152               169.11
4194304               356.51
openmpi@3.1.6%intel@19.0.5.281 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      19.97
2                      34.55
4                      78.24
8                     147.89
16                    278.91
32                    613.85
64                   1070.59
128                  2347.28
256                  4350.14
512                  7256.91
1024                10824.26
2048                14134.66
4096                18253.63
8192                14228.70
16384               11410.04
32768                9538.47
65536                8391.24
131072               9378.04
262144               4781.64
524288               4477.02
1048576              4580.57
2097152              4587.38
4194304              4577.24
-- linux-debian9-cascadelake / intel@19.0.5.281 -----------------
hwloc@2.2.0
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
numactl@2.0.14
openmpi@4.0.5
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
openmpi@4.0.5%intel@19.0.5.281 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
openmpi@4.0.5%intel@19.0.5.281 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 18 ms, max: 19 ms, avg: 18 ms
openmpi@4.0.5%intel@19.0.5.281 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       9.38
2                      20.41
4                      33.91
8                      78.17
16                    104.23
32                    263.65
64                    399.20
128                   586.26
256                   994.84
512                  2078.18
1024                 3473.33
2048                 5567.63
4096                 5089.26
8192                 7552.06
16384                8777.03
32768               10053.49
65536               10101.57
131072              10620.82
262144              10922.64
524288              11028.38
1048576             10735.00
2097152             10979.95
4194304             10954.07
openmpi@4.0.5%intel@19.0.5.281 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.26
1                       0.29
2                       0.29
4                       0.29
8                       0.29
16                      0.30
32                      0.31
64                      0.33
128                     0.38
256                     0.45
512                     0.64
1024                    0.76
2048                    0.96
4096                    2.06
8192                    3.22
16384                   5.34
32768                   8.05
65536                  14.58
131072                 28.02
262144                 55.44
524288                110.14
1048576               229.04
2097152               481.64
4194304              1149.12
openmpi@4.0.5%intel@19.0.5.281 osu_latency_mt
# Number of Sender threads: 1
# Number of Receiver threads: 2
# OSU MPI Multi-threaded Latency Test v5.6.3
# Size          Latency (us)
0                       0.39
1                       0.44
2                       0.44
4                       0.44
8                       0.44
16                      0.45
32                      0.45
64                      0.48
128                     0.53
256                     0.58
512                     1.04
1024                    1.11
2048                    1.23
4096                    4.15
8192                    6.59
16384                   5.64
32768                   8.24
65536                  15.01
131072                 28.81
262144                109.26
524288                180.67
1048576               410.83
2097152               858.45
4194304              2196.37
openmpi@4.0.5%intel@19.0.5.281 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.24
1                       0.28
2                       0.27
4                       0.28
8                       0.27
16                      0.29
32                      0.29
64                      0.33
128                     0.36
256                     0.44
512                     0.62
1024                    0.74
2048                    0.92
4096                    2.08
8192                    2.94
16384                   5.17
32768                   7.96
65536                  14.53
131072                 28.09
262144                 55.46
524288                112.81
1048576               228.60
2097152               484.50
4194304              1081.60
openmpi@4.0.5%intel@19.0.5.281 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       8.24
2                      17.31
4                      32.83
8                      69.19
16                    135.11
32                    267.09
64                    417.26
128                   541.95
256                   816.69
512                  1889.68
1024                 3147.37
2048                 5132.74
4096                 4768.33
8192                 6917.90
16384                8563.48
32768                9144.86
65536                9964.01
131072               8710.03
262144              10486.81
524288              10641.49
1048576             10621.07
2097152             10617.73
4194304             10341.12
openmpi@4.0.5%intel@19.0.5.281 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.25
1                       0.28
2                       0.28
4                       0.29
8                       0.28
16                      0.31
32                      0.30
64                      0.33
128                     0.37
256                     0.44
512                     0.63
1024                    0.77
2048                    0.95
4096                    2.09
8192                    2.95
16384                   5.23
32768                   7.95
65536                  14.69
131072                 28.32
262144                 55.83
524288                111.65
1048576               238.71
2097152               493.62
4194304              1056.68
openmpi@4.0.5%intel@19.0.5.281 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                       7.21        7209943.41
2                      13.91        6956189.05
4                      26.90        6725748.16
8                      59.72        7464958.44
16                    108.13        6758190.87
32                    187.79        5868560.74
64                    370.63        5791095.29
128                   554.77        4334146.44
256                   867.60        3389051.46
512                  1961.03        3830128.99
1024                 3226.58        3150958.48
2048                 5232.29        2554830.05
4096                 4895.51        1195192.04
8192                 7298.68         890952.68
16384                9362.71         571454.49
32768                9411.56         287217.91
65536               10058.56         153481.44
131072              10268.70          78343.99
262144              10235.35          39044.76
524288              10485.63          19999.75
1048576             10591.09          10100.45
2097152             10467.21           4991.15
4194304             10367.73           2471.86
openmpi@4.0.5%intel@19.0.5.281 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.67
2                       1.64
4                       1.84
8                       1.71
16                      1.73
32                      1.85
64                      1.96
128                     2.76
256                     3.44
512                     4.84
1024                    6.96
2048                   11.12
4096                   14.96
8192                   28.01
16384                  39.36
32768                  63.00
65536                 110.68
131072                218.81
262144                481.53
524288               1127.45
1048576              3363.58
openmpi@4.0.5%intel@19.0.5.281 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.95
2                       0.92
4                       0.88
8                       0.93
16                      0.93
32                      0.95
64                      1.02
128                     1.14
256                     1.34
512                     1.72
1024                    2.21
2048                    4.12
4096                    6.32
8192                   12.15
16384                  21.48
32768                  40.42
65536                  80.37
131072                155.52
262144                295.00
524288                316.82
1048576               645.12
openmpi@4.0.5%intel@19.0.5.281 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      10.76              5.98              5.03              5.06
2                      10.48              5.74              4.78              0.82
4                      10.97              6.41              5.36             14.87
8                       9.01              4.70              3.97              0.00
16                      8.92              4.80              4.04              0.00
32                      9.11              4.67              3.86              0.00
64                      9.21              4.91              4.10              0.00
128                    13.13              8.77              7.55             42.31
256                    10.62              5.80              4.87              1.17
512                    14.76              7.86              6.69              0.00
1024                   17.81              9.28              8.00              0.00
2048                   20.97             11.30              9.77              1.01
4096                   49.16             25.89             22.83              0.00
8192                   62.72             32.99             29.16              0.00
16384                  76.93             40.24             35.49              0.00
32768                 143.73             70.89             63.08              0.00
65536                 283.72            147.52            131.62              0.00
131072                543.93            281.02            251.39              0.00
262144               1287.64            669.29            595.57              0.00
524288               3721.96           1942.38           1735.51              0.00
1048576              7419.11           3764.99           3355.22              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.50              1.33              0.87              0.00
2                       2.44              1.29              0.84              0.00
4                       2.18              1.19              0.76              0.00
8                       2.36              1.22              0.76              0.00
16                      2.32              1.26              0.83              0.00
32                      2.55              1.41              0.90              0.00
64                      2.36              1.27              0.84              0.00
128                     2.45              1.29              0.86              0.00
256                     2.33              1.25              0.85              0.00
512                     6.91              3.25              2.59              0.00
1024                   12.04              3.93              3.25              0.00
2048                  106.28             13.43             10.38              0.00
4096                   20.02              8.96              7.68              0.00
8192                   27.89             12.11             10.44              0.00
16384                  40.47             17.49             15.23              0.00
32768                  72.30             36.93             32.68              0.00
65536                 127.75             66.16             58.73              0.00
131072                235.60            125.52            112.09              1.79
262144                448.25            233.69            207.75              0.00
524288                917.40            483.76            432.98              0.00
1048576              2000.56           1026.19            913.72              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.83
2                       0.83
4                       0.83
8                       1.12
16                      0.90
32                      0.96
64                      1.08
128                     1.20
256                     1.43
512                     3.35
1024                    4.06
2048                    4.91
4096                    9.92
8192                   13.64
16384                  23.30
32768                  37.30
65536                  70.12
131072                146.57
262144                299.84
524288                601.19
1048576              1266.25
openmpi@4.0.5%intel@19.0.5.281 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       5.44
2                       5.96
4                       5.44
8                       5.42
16                      4.76
32                      4.92
64                      5.10
128                     5.79
256                     6.61
512                     8.30
1024                   17.15
2048                   19.21
4096                   33.77
8192                   99.26
16384                  83.92
32768                 125.75
65536                 344.13
131072                715.34
262144               1477.75
524288               3545.90
1048576              4810.87
openmpi@4.0.5%intel@19.0.5.281 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.41
2                       0.41
4                       0.43
8                       0.47
16                      0.46
32                      0.45
64                      0.46
128                     0.46
256                     0.49
512                     1.62
1024                    2.33
2048                    3.06
4096                   10.75
8192                   15.81
16384                  21.08
32768                  30.19
65536                  54.44
131072                114.07
262144                211.31
524288                695.33
1048576              1432.31
openmpi@4.0.5%intel@19.0.5.281 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.76              5.24              4.37              0.00
2                       9.79              5.07              4.24              0.00
4                       9.13              4.93              4.07              0.00
8                       9.60              4.90              4.06              0.00
16                     10.36              5.67              4.70              0.30
32                     10.47              5.49              4.51              0.00
64                     10.26              5.55              4.65              0.00
128                     9.90              5.31              4.44              0.00
256                    10.76              5.76              4.82              0.00
512                    29.14              9.84              8.43              0.00
1024                   18.74             10.24              8.83              3.76
2048                   21.51             11.62             10.07              1.71
4096                   49.95             26.24             23.09              0.00
8192                   65.40             34.59             30.49              0.00
16384                  78.65             40.52             35.68              0.00
32768                 132.67             71.14             63.18              2.60
65536                 249.10            128.65            114.63              0.00
131072                554.83            287.49            256.69              0.00
262144               1317.65            630.92            563.19              0.00
524288               3728.83           2044.27           1827.47              7.82
1048576              7398.15           3862.25           3447.22              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       2.94              1.59              1.12              0.00
8                       2.86              1.59              1.12              0.00
16                      2.96              1.74              1.27              3.71
32                      2.89              1.59              1.15              0.00
64                      2.94              1.65              1.22              0.00
128                     3.07              1.71              1.29              0.00
256                     3.27              1.86              1.41              0.00
512                     6.52              3.37              2.72              0.00
1024                    8.64              3.36              2.62              0.00
2048                    8.40              3.77              3.07              0.00
4096                   18.51              7.67              6.50              0.00
8192                   25.33              9.66              7.98              0.00
16384                  39.66             15.07             13.11              0.00
32768                  66.03             24.62             21.64              0.00
65536                 122.01             44.61             39.49              0.00
131072                230.49             83.95             74.45              0.00
262144                453.79            162.72            145.08              0.00
524288                999.80            364.86            324.95              0.00
1048576              1991.50            691.73            614.15              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.90
2                       0.83
4                       0.80
8                       0.79
16                      0.89
32                      0.88
64                      2.23
128                     1.11
256                     1.34
512                     3.53
1024                    7.41
2048                    5.06
4096                   10.44
8192                   13.61
16384                  28.18
32768                  37.06
65536                  67.91
131072                140.49
262144                293.48
524288                597.90
1048576              1358.82
openmpi@4.0.5%intel@19.0.5.281 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.55
8                       1.67
16                      1.65
32                      1.61
64                      1.70
128                     2.02
256                     5.18
512                    15.29
1024                    9.09
2048                    8.06
4096                   12.66
8192                   16.73
16384                  22.74
32768                  58.45
65536                  86.91
131072                117.32
262144                209.64
524288                433.21
1048576               937.64
openmpi@4.0.5%intel@19.0.5.281 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.32
2                       0.29
4                       0.31
8                       0.29
16                      0.29
32                      0.32
64                      0.32
128                     0.35
256                     0.38
512                     1.74
1024                    2.35
2048                    3.38
4096                    9.56
8192                   13.21
16384                  21.38
32768                  36.32
65536                  67.20
131072                133.45
262144                269.48
524288                556.05
1048576              1294.92
openmpi@4.0.5%intel@19.0.5.281 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.76              5.19              4.30              0.00
2                       9.15              4.89              4.04              0.00
4                       9.99              5.32              4.41              0.00
8                       9.97              5.28              4.46              0.00
16                     11.52              5.56              4.52              0.00
32                     15.39              9.44              7.86             24.29
64                      8.94              4.73              3.94              0.00
128                     9.35              4.92              4.06              0.00
256                    10.92              5.50              4.51              0.00
512                    19.62             12.28             10.66             31.14
1024                   20.35             10.28              8.85              0.00
2048                   27.03             12.72             10.69              0.00
4096                   51.53             27.11             23.88              0.00
8192                   68.76             33.36             29.38              0.00
16384                  76.66             40.17             35.57              0.00
32768                 145.82             75.15             66.66              0.00
65536                 238.08            124.96            111.21              0.00
131072                512.92            268.38            239.17              0.00
262144               1263.56            635.43            567.06              0.00
524288               3584.61           1705.94           1528.20              0.00
1048576              7452.71           3904.22           3480.22              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.86              2.70              2.15             46.33
2                       3.31              2.26              1.70             38.35
4                       3.24              2.17              1.62             33.85
8                       3.27              2.20              1.68             36.03
16                      3.18              2.16              1.69             39.11
32                      3.36              2.28              1.74             37.82
64                      3.44              2.32              1.81             38.51
128                     3.78              2.70              2.10             48.62
256                     4.15              2.97              2.32             48.99
512                     4.26              2.81              2.21             34.24
1024                    5.08              3.44              2.77             40.70
2048                    6.02              4.18              3.34             44.89
4096                   16.44              7.39              6.34              0.00
8192                   49.12             12.96             11.24              0.00
16384                  32.45             13.75             12.03              0.00
32768                  59.29             29.83             26.40              0.00
65536                 110.95             55.73             49.45              0.00
131072                235.28            122.07            108.57              0.00
262144                639.22            294.75            258.58              0.00
524288               1047.05            542.69            478.25              0.00
1048576              3414.15           1335.48           1125.13              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       4.54
2                       4.30
4                       4.29
8                      22.05
16                      5.65
32                     18.62
64                      7.22
128                    16.40
256                    10.68
512                     7.31
1024                    6.76
2048                    8.04
4096                   26.37
8192                  110.54
16384                 137.23
32768                  94.48
65536                 149.15
131072                535.96
262144               1272.43
524288               2730.19
1048576              4269.18
openmpi@4.0.5%intel@19.0.5.281 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.33              4.92              4.04              0.00
2                       9.49              5.20              4.28              0.00
4                       9.57              5.23              4.38              1.04
8                       9.26              4.98              4.14              0.00
16                      9.51              5.46              4.59             11.70
32                      9.38              5.16              3.80              0.00
64                      9.34              5.18              3.82              0.00
128                     9.25              5.12              4.24              2.68
256                    12.31              7.73              6.53             29.76
512                    16.60              8.13              6.89              0.00
1024                   22.89             14.27             12.41             30.54
2048                   22.24             11.63             10.09              0.00
4096                   49.84             26.18             23.05              0.00
8192                   65.26             35.05             30.81              1.96
16384                  76.14             40.41             35.65              0.00
32768                 132.60             71.75             63.44              4.08
65536                 227.54            118.45            105.12              0.00
131072                446.01            227.61            202.39              0.00
262144                955.07            496.95            442.25              0.00
524288               2426.46           1196.52           1054.79              0.00
1048576              6021.35           3256.94           2894.51              4.49
openmpi@4.0.5%intel@19.0.5.281 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
              9.98              6.54              5.51             37.57
openmpi@4.0.5%intel@19.0.5.281 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.47              2.28              1.75             32.35
2                       3.60              2.38              1.88             35.36
4                       3.36              2.30              1.78             40.11
8                       3.28              2.20              1.75             38.24
16                      3.39              2.33              1.80             41.09
32                      3.39              2.32              1.82             41.64
64                      3.61              2.50              1.90             41.80
128                     3.81              2.65              2.08             44.01
256                     4.00              2.83              2.30             49.03
512                     4.31              2.84              2.24             34.26
1024                    5.10              3.42              2.76             39.39
2048                    5.69              4.00              3.31             48.95
4096                   16.50              7.36              6.30              0.00
8192                   60.96             23.04              8.12              0.00
16384                 112.69             54.23             12.35              0.00
32768                 437.39            125.89            101.96              0.00
65536                 118.25             56.16             49.66              0.00
131072                249.00            123.70            110.22              0.00
262144                516.42            268.84            239.90              0.00
524288               1046.27            537.11            481.52              0.00
1048576              2129.80           1090.62            967.11              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.49
2                       3.50
4                       3.44
8                       3.60
16                      3.55
32                      3.94
64                      3.88
128                     4.20
256                     5.14
512                     7.45
1024                    8.32
2048                   10.14
4096                   26.73
8192                   39.80
16384                  54.14
32768                  84.62
65536                 143.30
131072                308.10
262144                692.16
524288               1903.50
1048576              4011.16
openmpi@4.0.5%intel@19.0.5.281 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.30              5.18              4.35              5.26
2                       8.87              4.84              3.99              0.00
4                       8.69              4.71              3.93              0.00
8                       8.56              4.55              3.78              0.00
16                     11.57              4.62              3.84              0.00
32                      8.81              4.62              3.86              0.00
64                     11.36              7.06              6.01             28.54
128                     9.41              5.07              4.25              0.00
256                    10.58              5.85              4.85              2.50
512                    14.87              7.92              6.74              0.00
1024                   18.41              9.68              8.31              0.00
2048                   21.40             11.49              9.93              0.25
4096                   50.21             26.98             23.78              2.33
8192                   65.07             33.71             29.76              0.00
16384                  75.06             39.55             35.04              0.00
32768                 135.83             69.02             61.27              0.00
65536                 244.71            123.06            109.86              0.00
131072                445.73            234.53            209.02              0.00
262144                904.67            474.99            423.98              0.00
524288               2657.71           1283.59           1138.07              0.00
1048576              6432.49           3153.59           2803.28              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.40              2.12              1.63             21.66
2                       3.31              2.10              1.56             21.98
4                       3.33              2.05              1.48             12.88
8                       3.43              2.09              1.48              9.23
16                      3.33              2.02              1.49             12.22
32                      3.32              2.03              1.49             13.13
64                      3.36              2.05              1.52             13.93
128                     3.54              2.13              1.65             14.89
256                     3.76              2.35              1.81             22.14
512                     5.17              2.90              2.30              1.11
1024                    6.05              3.44              2.81              7.33
2048                    6.79              4.09              3.40             20.62
4096                   12.91              7.33              6.24             10.48
8192                   17.62              9.78              8.39              6.58
16384                  25.24             14.08             12.29              9.19
32768                  43.13             24.62             21.57             14.19
65536                  71.58             41.58             36.82             18.54
131072                134.66             78.12             69.07             18.13
262144                278.65            169.02            150.69             27.25
524288                526.74            302.55            270.43             17.10
1048576              1067.23            607.11            541.12             14.97
openmpi@4.0.5%intel@19.0.5.281 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.60
8                       1.53
16                      0.63
32                      0.63
64                      0.66
128                     0.79
256                     0.85
512                     1.59
1024                    2.03
2048                    3.48
4096                    6.93
8192                   14.89
16384                  14.33
32768                  24.82
65536                  52.52
131072                133.54
262144                209.47
524288                349.35
1048576               666.12
openmpi@4.0.5%intel@19.0.5.281 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             1.21
openmpi@4.0.5%intel@19.0.5.281 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       8.17              4.68              3.95             11.69
8                       7.89              4.29              3.58              0.00
16                      8.26              4.55              3.72              0.40
32                      8.01              4.38              3.62              0.00
64                      8.78              4.87              4.00              2.32
128                     9.42              5.16              4.28              0.64
256                     9.61              5.65              4.69             15.56
512                    10.95              5.78              4.87              0.00
1024                   15.18              8.30              7.07              2.68
2048                   19.42              9.74              8.38              0.00
4096                   44.01             18.65             15.93              0.00
8192                   54.83             27.18             23.99              0.00
16384                  85.28             43.19             38.20              0.00
32768                 157.24             80.43             71.41              0.00
65536                 211.69            110.24             98.27              0.00
131072                294.08            168.12            149.64             15.82
262144                547.25            235.92            202.74              0.00
524288               1733.02            542.44            415.69              0.00
1048576              1763.75            964.91            863.55              7.49
openmpi@4.0.5%intel@19.0.5.281 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.43              1.32              0.86              0.00
2                       2.41              1.28              0.86              0.00
4                       2.30              1.24              0.82              0.00
8                       2.37              1.31              0.85              0.00
16                      2.46              1.36              0.90              0.00
32                      2.36              1.25              0.82              0.00
64                      2.54              1.34              0.87              0.00
128                     2.34              1.30              0.84              0.00
256                     2.27              1.25              0.83              0.00
512                     6.97              3.32              2.64              0.00
1024                    8.68              4.11              3.34              0.00
2048                   10.04              4.82              3.98              0.00
4096                   19.53              8.75              7.53              0.00
8192                   28.37             11.93             10.37              0.00
16384                  40.06             17.28             15.19              0.00
32768                  70.99             36.66             32.45              0.00
65536                 124.39             64.95             57.60              0.00
131072                236.79            124.54            109.97              0.00
262144                461.31            240.06            214.08              0.00
524288                960.79            489.14            432.54              0.00
1048576              4033.34           1676.04           1375.72              0.00
openmpi@4.0.5%intel@19.0.5.281 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.98
8                       1.07
16                      1.29
32                      1.96
64                      1.95
128                     6.90
256                     1.90
512                     2.06
1024                    3.25
2048                   15.46
4096                   11.59
8192                   10.60
16384                  14.04
32768                  39.59
65536                 140.36
131072                332.60
262144                479.89
524288                501.35
1048576              1018.66
openmpi@4.0.5%intel@19.0.5.281 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.05
2                       0.05
4                       0.05
8                       0.06
16                      0.06
32                      0.07
64                      0.09
128                     0.14
256                     0.24
512                     0.43
1024                    0.79
2048                    1.55
4096                    2.99
8192                    5.97
16384                  12.07
32768                  23.59
65536                  46.64
131072                 92.99
262144                187.90
524288                376.19
1048576               752.79
2097152              1511.89
4194304              3023.59
openmpi@4.0.5%intel@19.0.5.281 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.06
openmpi@4.0.5%intel@19.0.5.281 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      34.55
2                      65.80
4                     131.88
8                     276.72
16                    533.22
32                   1044.96
64                   1909.07
128                  3638.51
256                  7908.48
512                 14187.86
1024                21721.81
2048                29253.62
4096                34854.85
8192                14837.14
16384               11061.31
32768               10165.55
65536               10920.47
131072              10557.66
262144               6261.39
524288               4682.30
1048576              4507.16
2097152              4668.46
4194304              4527.16
openmpi@4.0.5%intel@19.0.5.281 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      36.40
2                      80.20
4                     173.29
8                     322.95
16                    713.75
32                   1445.86
64                   2755.30
128                  5810.44
256                 10091.47
512                 13350.45
1024                25592.55
2048                37728.77
4096                44371.40
8192                39208.48
16384               28517.78
32768               23581.03
65536               21740.01
131072              11668.51
262144               8862.07
524288               8648.30
1048576              8276.65
2097152              8447.26
4194304              8912.40
openmpi@4.0.5%intel@19.0.5.281 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.04
2                       0.04
4                       0.04
8                       0.04
16                      0.04
32                      0.04
64                      0.04
128                     0.04
256                     0.04
512                     0.05
1024                    0.05
2048                    0.06
4096                    0.16
8192                    0.29
16384                   0.43
32768                   1.58
65536                   3.25
131072                  6.13
262144                 12.29
524288                 24.53
1048576                62.71
2097152               167.27
4194304               348.68
openmpi@4.0.5%intel@19.0.5.281 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.05
openmpi@4.0.5%intel@19.0.5.281 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       3.12
2                       3.10
4                       3.15
8                       3.24
16                      3.18
32                      3.16
64                      3.26
128                     3.38
256                     3.57
512                     3.97
1024                    4.77
2048                    6.28
4096                   10.31
8192                   15.18
16384                  26.34
32768                  49.13
65536                  79.79
131072                147.82
262144                284.53
524288                571.24
1048576              1183.40
2097152              2128.43
4194304              4506.51
openmpi@4.0.5%intel@19.0.5.281 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.05
2                       0.05
4                       0.05
8                       0.05
16                      0.05
32                      0.05
64                      0.05
128                     0.05
256                     0.05
512                     0.06
1024                    0.06
2048                    0.08
4096                    0.10
8192                    0.16
16384                   0.58
32768                   1.64
65536                   3.28
131072                  7.53
262144                 14.10
524288                 24.67
1048576                69.45
2097152               167.40
4194304               355.67
openmpi@4.0.5%intel@19.0.5.281 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      30.73
2                      60.28
4                     135.00
8                     250.51
16                    507.54
32                   1042.27
64                   1784.66
128                  3372.25
256                  7859.01
512                 11540.95
1024                16721.27
2048                19905.84
4096                24056.88
8192                20009.44
16384               14936.97
32768               12207.42
65536               11517.28
131072               9791.22
262144               5285.74
524288               4566.58
1048576              4476.25
2097152              4568.04
4194304              4423.09
-- linux-debian9-cascadelake / gcc@10.2.0 -----------------------
hwloc@1.11.11
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
numactl@2.0.14
openmpi@1.10.7
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
openmpi@1.10.7%gcc@10.2.0 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
openmpi@1.10.7%gcc@10.2.0 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 12 ms, max: 13 ms, avg: 12 ms
openmpi@1.10.7%gcc@10.2.0 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       8.62
2                      17.35
4                      33.68
8                      63.47
16                    123.70
32                    215.95
64                    364.00
128                   538.03
256                   927.84
512                  1615.87
1024                 2380.09
2048                 4040.41
4096                 4883.75
8192                 7706.10
16384                9865.96
32768               10566.57
65536               11109.04
131072              11187.95
262144              11222.83
524288              11407.97
1048576             11466.07
2097152             10712.57
4194304             10515.91
openmpi@1.10.7%gcc@10.2.0 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.21
1                       0.23
2                       0.23
4                       0.24
8                       0.23
16                      0.27
32                      0.24
64                      0.26
128                     0.32
256                     0.39
512                     0.46
1024                    0.62
2048                    0.83
4096                    1.34
8192                    2.32
16384                   4.08
32768                   6.46
65536                   9.53
131072                 15.42
262144                 27.80
524288                 53.24
1048576               120.16
2097152               238.10
4194304               491.10
openmpi@1.10.7%gcc@10.2.0 osu_latency_mt
MPI_Init_thread must return MPI_THREAD_MULTIPLE!
-------------------------------------------------------
Primary job  terminated normally, but 1 process returned
a non-zero exit code.. Per user-direction, the job has been aborted.
-------------------------------------------------------
--------------------------------------------------------------------------
mpiexec detected that one or more processes exited with non-zero status, thus causing
the job to be terminated. The first process to do so was:

  Process name: [[11934,1],1]
  Exit code:    1
--------------------------------------------------------------------------
openmpi@1.10.7%gcc@10.2.0 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.20
1                       0.23
2                       0.22
4                       0.22
8                       0.22
16                      0.23
32                      0.23
64                      0.25
128                     0.30
256                     0.37
512                     0.47
1024                    0.64
2048                    0.82
4096                    1.34
8192                    2.20
16384                   3.94
32768                   6.44
65536                   9.37
131072                 15.39
262144                 27.80
524288                 55.71
1048576               114.55
2097152               236.89
4194304               491.18
openmpi@1.10.7%gcc@10.2.0 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       7.30
2                      18.22
4                      33.77
8                      69.50
16                    139.21
32                    282.38
64                    317.22
128                   478.82
256                   827.97
512                  1332.68
1024                 1755.09
2048                 4759.90
4096                 5148.91
8192                 6421.39
16384                8140.34
32768                9292.18
65536                9800.00
131072               9487.17
262144               9891.07
524288               9646.52
1048576             10392.17
2097152             10150.83
4194304              9752.91
openmpi@1.10.7%gcc@10.2.0 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.21
1                       0.23
2                       0.23
4                       0.23
8                       0.24
16                      0.24
32                      0.24
64                      0.25
128                     0.29
256                     0.36
512                     0.47
1024                    0.65
2048                    0.83
4096                    1.39
8192                    2.33
16384                   4.10
32768                   6.51
65536                   9.53
131072                 15.70
262144                 28.04
524288                 53.89
1048576               115.92
2097152               243.96
4194304               511.74
openmpi@1.10.7%gcc@10.2.0 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                      10.53       10525000.30
2                      21.92       10961343.28
4                      43.06       10764661.03
8                      86.24       10780218.02
16                    144.96        9060010.40
32                    326.21       10194214.92
64                    320.05        5000812.66
128                   543.21        4243834.89
256                   885.75        3459971.99
512                  1499.63        2928971.99
1024                 2538.11        2478620.92
2048                 4481.14        2188055.89
4096                 5563.61        1358303.77
8192                 6484.47         791561.17
16384               10206.59         622960.66
32768               10582.03         322937.86
65536               10821.38         165121.23
131072              10732.55          81882.85
262144              10645.39          40608.94
524288              10598.81          20215.63
1048576             10684.89          10189.91
2097152             10242.14           4883.83
4194304              9579.48           2283.93
openmpi@1.10.7%gcc@10.2.0 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.20
2                       1.19
4                       1.28
8                       1.25
16                      1.22
32                      1.29
64                      1.62
128                     1.78
256                     2.15
512                     2.74
1024                    4.04
2048                    6.73
4096                   12.17
8192                   21.42
16384                  27.94
32768                  55.32
65536                 125.06
131072                199.51
262144                436.18
524288               1127.69
1048576              3128.85
openmpi@1.10.7%gcc@10.2.0 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.76
2                       0.72
4                       0.74
8                       0.77
16                      0.79
32                      0.86
64                      0.97
128                     1.12
256                     1.18
512                     1.46
1024                    1.80
2048                    2.75
4096                    4.11
8192                    8.54
16384                  15.68
32768                  26.49
65536                  50.32
131072                 93.30
262144                173.16
524288                261.49
1048576               492.83
openmpi@1.10.7%gcc@10.2.0 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.06              4.46              3.34              0.00
2                       8.01              4.46              3.27              0.00
4                       7.86              4.43              3.51              2.25
8                       7.85              4.43              3.39              0.00
16                      8.00              4.44              3.36              0.00
32                      7.99              4.45              3.40              0.00
64                      8.09              4.43              3.41              0.00
128                     8.76              4.64              3.85              0.00
256                     9.04              4.77              4.06              0.00
512                    10.83              5.82              4.91              0.00
1024                   15.37              8.20              7.25              1.03
2048                   18.92             10.00              8.89              0.00
4096                   32.42             16.29             15.04              0.00
8192                   48.70             24.90             23.46              0.00
16384                  71.89             34.60             32.41              0.00
32768                 112.46             56.32             53.51              0.00
65536                 224.68            112.81            107.92              0.00
131072                509.72            259.09            248.60              0.00
262144               1488.16            764.70            735.83              1.68
524288               3635.77           1846.54           1768.10              0.00
1048576             11118.03           4438.32           3987.81              0.00
openmpi@1.10.7%gcc@10.2.0 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.17              1.29              0.69              0.00
2                       2.22              1.32              0.67              0.00
4                       2.18              1.30              0.68              0.00
8                       2.29              1.43              0.69              0.00
16                      2.16              1.29              0.70              0.00
32                      2.33              1.44              0.69              0.00
64                      2.34              1.43              0.70              0.00
128                     2.41              1.47              0.73              0.00
256                     2.40              1.42              0.75              0.00
512                     2.49              1.44              0.85              0.00
1024                    3.09              1.72              1.18              0.00
2048                    3.79              2.15              1.36              0.00
4096                   14.09              5.85              5.08              0.00
8192                   25.67             12.40             11.21              0.00
16384                  37.60             16.89             15.49              0.00
32768                  52.75             22.52             21.10              0.00
65536                  85.75             36.44             34.27              0.00
131072                193.59             82.58             78.93              0.00
262144                397.89            179.31            163.55              0.00
524288                946.63            407.04            387.00              0.00
1048576              2168.27            946.72            907.43              0.00
openmpi@1.10.7%gcc@10.2.0 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.60
2                       0.61
4                       0.59
8                       0.63
16                      0.66
32                      0.67
64                      0.70
128                     0.87
256                     0.95
512                     1.32
1024                    1.49
2048                    2.11
4096                    5.29
8192                   11.35
16384                  18.48
32768                  30.01
65536                  44.40
131072                 86.26
262144                172.74
524288                570.62
1048576               676.85
openmpi@1.10.7%gcc@10.2.0 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.54
2                       3.52
4                       3.36
8                       3.60
16                      3.41
32                      3.55
64                      4.16
128                     3.88
256                     4.45
512                     5.09
1024                    7.94
2048                   12.25
4096                   13.27
8192                   20.55
16384                  28.14
32768                  47.96
65536                  92.12
131072                197.80
262144                424.03
524288               1021.36
1048576              3002.77
openmpi@1.10.7%gcc@10.2.0 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.27
2                       0.27
4                       0.26
8                       0.25
16                      0.25
32                      0.25
64                      0.26
128                     0.30
256                     0.35
512                     0.46
1024                    0.71
2048                    0.99
4096                    7.56
8192                   10.23
16384                  15.62
32768                  21.99
65536                  32.33
131072                 74.31
262144                132.72
524288                268.00
1048576               567.87
openmpi@1.10.7%gcc@10.2.0 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.15              4.56              3.56              0.00
2                       7.73              4.32              3.31              0.00
4                       7.90              4.31              3.27              0.00
8                       7.97              4.61              3.70              9.27
16                      7.56              4.13              3.19              0.00
32                      7.92              4.43              3.33              0.00
64                      7.86              4.31              3.37              0.00
128                     8.42              4.74              4.06              9.20
256                     8.85              4.64              3.91              0.00
512                    10.81              5.89              4.98              1.31
1024                   17.83              7.85              7.09              0.00
2048                   18.62              9.85              8.71              0.00
4096                   31.85             16.31             14.97              0.00
8192                   49.66             25.07             23.27              0.00
16384                  75.89             37.60             35.64              0.00
32768                 125.18             60.42             57.63              0.00
65536                 236.85            119.65            114.60              0.00
131072                548.40            279.79            268.39              0.00
262144               1450.93            708.79            680.82              0.00
524288               3792.39           1934.13           1847.51              0.00
1048576             13274.68           6204.27           5706.93              0.00
openmpi@1.10.7%gcc@10.2.0 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       8.40              1.84              1.07              0.00
8                       4.13              1.84              1.13              0.00
16                      3.43              1.70              1.03              0.00
32                      3.10              1.70              1.07              0.00
64                      3.66              1.85              1.17              0.00
128                     4.91              2.46              1.39              0.00
256                     6.29              2.88              2.21              0.00
512                    12.36              3.65              2.94              0.00
1024                    7.02              3.60              2.56              0.00
2048                    5.60              3.07              2.40              0.00
4096                   12.83              5.15              4.21              0.00
8192                   21.45              8.55              7.44              0.00
16384                  31.67             11.87             10.96              0.00
32768                  51.03             18.74             17.43              0.00
65536                  80.54             28.73             27.02              0.00
131072                154.26             54.19             51.56              0.00
262144                289.42            100.00             95.63              0.00
524288                561.64            191.53            183.74              0.00
1048576              1170.28            386.27            371.89              0.00
openmpi@1.10.7%gcc@10.2.0 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.65
2                       0.61
4                       0.63
8                       0.64
16                      0.67
32                      0.70
64                      0.73
128                     0.98
256                     1.32
512                     1.64
1024                    1.98
2048                    2.90
4096                    5.49
8192                   10.79
16384                  18.80
32768                  30.73
65536                  45.42
131072                 81.69
262144                169.57
524288                338.67
1048576               663.43
openmpi@1.10.7%gcc@10.2.0 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.46
8                       2.65
16                      1.49
32                      1.56
64                      1.54
128                     1.80
256                     1.99
512                     2.67
1024                    3.65
2048                    5.40
4096                   10.17
8192                   16.58
16384                  19.08
32768                  38.90
65536                  62.35
131072                100.15
262144                169.04
524288                335.75
1048576               823.87
openmpi@1.10.7%gcc@10.2.0 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.24
2                       0.25
4                       0.25
8                       0.26
16                      0.24
32                      0.26
64                      0.28
128                     0.29
256                     0.32
512                     0.47
1024                    0.66
2048                    0.91
4096                    7.28
8192                   12.50
16384                  19.48
32768                  29.70
65536                  44.03
131072                 76.70
262144                167.63
524288                291.87
1048576               633.48
openmpi@1.10.7%gcc@10.2.0 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.81              6.00              4.90             22.30
2                       7.90              4.43              3.69              5.88
4                       7.76              4.08              3.18              0.00
8                       7.78              4.36              3.29              0.00
16                      7.50              4.01              3.21              0.00
32                      7.87              4.37              3.21              0.00
64                     10.53              4.41              3.39              0.00
128                     8.12              4.40              3.50              0.00
256                     8.67              4.41              4.02              0.00
512                    10.60              5.50              4.87              0.00
1024                   15.48              8.08              7.24              0.00
2048                   18.87              9.87              8.89              0.00
4096                   31.84             16.33             15.07              0.00
8192                   48.47             24.79             23.11              0.00
16384                  77.34             37.07             34.21              0.00
32768                 112.32             57.92             55.11              1.29
65536                 228.88            114.66            109.21              0.00
131072                516.86            252.88            242.01              0.00
262144               4942.67           2922.49           2808.73             28.07
524288               3841.66           1907.52           1825.46              0.00
1048576              8198.11           4251.87           4075.02              3.16
openmpi@1.10.7%gcc@10.2.0 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.02              2.14              1.47             40.12
2                       3.00              2.13              1.45             39.96
4                       3.00              2.13              1.43             39.12
8                       3.06              2.14              1.44             36.07
16                      3.06              2.15              1.53             40.34
32                      3.15              2.18              1.59             39.40
64                      3.36              2.38              1.70             41.77
128                     3.93              2.89              2.00             48.32
256                     4.25              2.96              2.18             41.22
512                     4.46              3.25              2.56             52.54
1024                    5.08              3.59              2.83             47.35
2048                    6.10              4.36              3.44             49.58
4096                   13.98              6.90              5.93              0.00
8192                   23.09             10.56              8.92              0.00
16384                  31.89             14.23             12.93              0.00
32768                  53.65             23.55             22.01              0.00
65536                  94.89             40.69             38.58              0.00
131072                246.79            119.61            114.12              0.00
262144                524.19            252.45            241.83              0.00
524288               1101.63            547.78            527.22              0.00
1048576              2421.56           1149.28           1105.54              0.00
openmpi@1.10.7%gcc@10.2.0 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.89
2                       1.98
4                       2.11
8                       1.93
16                      1.93
32                      2.16
64                      2.28
128                     2.44
256                     2.79
512                     3.51
1024                    5.46
2048                    9.51
4096                   21.53
8192                   36.24
16384                  48.33
32768                  88.50
65536                 132.10
131072                271.17
262144                655.83
524288               1754.00
1048576              3467.02
openmpi@1.10.7%gcc@10.2.0 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.02              4.43              3.51              0.00
2                       7.92              4.42              3.30              0.00
4                       7.76              4.31              3.24              0.00
8                       7.86              4.33              3.23              0.00
16                      7.98              4.44              3.33              0.00
32                      7.95              4.43              3.32              0.00
64                     10.38              5.66              4.51              0.00
128                     8.54              4.46              3.81              0.00
256                     8.83              4.59              4.03              0.00
512                    10.94              6.14              5.11              6.00
1024                   16.21              9.10              8.19             13.19
2048                   19.11             10.24              9.12              2.69
4096                   32.81             17.55             16.49              7.49
8192                   49.33             24.84             23.03              0.00
16384                  67.64             34.23             32.36              0.00
32768                 108.89             55.28             52.61              0.00
65536                 210.04            106.95            102.21              0.00
131072                430.04            219.66            210.89              0.24
262144                951.16            479.17            460.37              0.00
524288               2557.91           1281.48           1232.61              0.00
1048576              6454.66           3203.84           3064.69              0.00
openmpi@1.10.7%gcc@10.2.0 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
              7.58              3.99              2.95              0.00
openmpi@1.10.7%gcc@10.2.0 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.01              2.12              1.51             41.10
2                       3.10              2.13              1.51             36.06
4                       3.13              2.18              1.50             36.32
8                       3.07              2.14              1.53             38.81
16                      3.19              2.28              1.56             41.80
32                      3.23              2.29              1.63             41.94
64                      3.25              2.28              1.70             43.20
128                     3.28              2.29              1.75             42.98
256                     3.87              2.80              2.00             46.45
512                     4.60              3.35              2.55             51.24
1024                    4.81              3.24              2.60             39.65
2048                    5.86              4.04              3.30             44.99
4096                   14.92              7.45              6.50              0.00
8192                   23.64             11.00              9.80              0.00
16384                  33.83             15.01             13.75              0.00
32768                  54.43             23.04             21.53              0.00
65536                 116.66             41.65             38.68              0.00
131072                273.56            122.39            112.48              0.00
262144                655.41            292.45            258.77              0.00
524288               1661.55            684.17            606.91              0.00
1048576              4600.37           1664.01           1532.18              0.00
openmpi@1.10.7%gcc@10.2.0 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.16
2                       3.56
4                       6.26
8                      10.29
16                      7.52
32                      3.51
64                      7.49
128                    16.17
256                     6.75
512                     5.68
1024                    7.42
2048                    9.04
4096                   25.37
8192                   28.31
16384                 167.31
32768                  78.18
65536                 197.92
131072                378.64
262144                912.30
524288               1867.35
1048576              7289.94
openmpi@1.10.7%gcc@10.2.0 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       7.86              4.47              3.43              1.08
2                       7.75              4.31              3.32              0.00
4                       7.87              4.44              3.40              0.00
8                       8.62              4.43              3.53              0.00
16                      8.12              4.49              3.35              0.00
32                      7.97              4.43              3.70              4.42
64                      8.09              4.44              3.64              0.00
128                     8.20              4.47              3.70              0.00
256                     8.69              4.49              3.87              0.00
512                    10.55              5.56              4.95              0.00
1024                   14.85              7.73              7.06              0.00
2048                   18.61              9.89              8.77              0.59
4096                   35.41             16.55             14.79              0.00
8192                   60.05             27.54             25.52              0.00
16384                  79.30             38.69             36.64              0.00
32768                 125.99             62.12             59.28              0.00
65536                 232.05            118.04            113.04              0.00
131072                460.72            224.89            215.08              0.00
262144               1008.52            495.73            476.99              0.00
524288               2981.62           1331.77           1266.26              0.00
1048576              6140.39           3219.59           3097.35              5.70
openmpi@1.10.7%gcc@10.2.0 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.54              2.12              1.42              0.00
2                       3.87              2.15              1.47              0.00
4                       3.47              2.13              1.36              2.33
8                       3.46              2.13              1.40              4.23
16                      3.99              2.63              1.38              0.58
32                      3.57              2.26              1.48             11.71
64                      3.65              2.26              1.65             15.51
128                     3.71              2.27              1.67             14.10
256                     3.89              2.40              1.79             16.41
512                     4.26              2.81              2.10             30.73
1024                    5.05              3.10              2.46             20.31
2048                    5.98              3.75              2.87             22.27
4096                    9.85              6.21              5.14             29.19
8192                   14.21              8.28              7.42             20.02
16384                  21.48             11.96             11.15             14.55
32768                  34.63             18.08             16.72              1.07
65536                  80.26             44.58             42.27             15.58
131072                151.99             78.40             74.07              0.65
262144                280.96            148.29            141.98              6.56
524288                487.37            182.92            174.80              0.00
1048576               735.24            389.58            374.52              7.70
openmpi@1.10.7%gcc@10.2.0 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.55
8                       0.52
16                      0.57
32                      0.55
64                      0.57
128                     0.66
256                     0.76
512                     0.99
1024                    1.35
2048                    1.91
4096                    3.32
8192                    6.01
16384                  12.10
32768                  21.11
65536                  43.35
131072                 87.42
262144                169.84
524288                284.46
1048576               544.85
openmpi@1.10.7%gcc@10.2.0 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             1.06
openmpi@1.10.7%gcc@10.2.0 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       9.57              3.47              2.79              0.00
8                       6.46              3.51              2.77              0.00
16                      7.44              3.93              2.86              0.00
32                      6.61              3.78              2.93              3.41
64                      7.92              4.75              3.88             18.16
128                     7.90              4.05              3.38              0.00
256                     8.47              4.60              3.81              0.00
512                    10.03              5.37              4.52              0.00
1024                   14.24              6.91              5.92              0.00
2048                   16.13              8.40              7.48              0.00
4096                   28.58             13.42             12.22              0.00
8192                   46.86             23.54             21.91              0.00
16384                  76.97             36.81             34.79              0.00
32768                 119.17             58.06             55.26              0.00
65536                 164.46             79.71             75.20              0.00
131072                224.23            114.24            109.18              0.00
262144                362.90            194.19            186.47              9.53
524288                635.76            323.36            310.72              0.00
1048576              1525.24            732.42            701.14              0.00
openmpi@1.10.7%gcc@10.2.0 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.89              1.72              1.00              0.00
2                       2.76              1.52              1.02              0.00
4                       2.77              1.52              1.00              0.00
8                       2.62              1.44              0.97              0.00
16                      2.62              1.43              0.95              0.00
32                      2.65              1.46              0.92              0.00
64                      2.59              1.43              0.97              0.00
128                     2.79              1.57              1.10              0.00
256                     2.95              1.60              1.09              0.00
512                     3.23              1.72              1.34              0.00
1024                    5.12              2.86              2.05              0.00
2048                    5.86              3.09              2.56              0.00
4096                   23.80              9.87              8.67              0.00
8192                   37.20             17.63             16.13              0.00
16384                  51.74             23.45             21.96              0.00
32768                  81.86             35.14             32.93              0.00
65536                 162.24             66.00             62.82              0.00
131072                372.06            155.62            148.96              0.00
262144                748.65            341.26            327.00              0.00
524288               1116.40            646.20            614.35             23.46
1048576              1737.21            844.58            812.76              0.00
openmpi@1.10.7%gcc@10.2.0 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.82
8                       0.88
16                      1.19
32                      1.73
64                      1.79
128                     1.87
256                     1.58
512                     1.80
1024                    2.19
2048                    2.83
4096                    4.27
8192                    6.34
16384                  10.53
32768                  17.40
65536                  29.90
131072                135.72
262144                304.77
524288                212.78
1048576               498.00
openmpi@1.10.7%gcc@10.2.0 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.03
8                       0.04
16                      0.04
32                      0.06
64                      0.09
128                     0.13
256                     0.23
512                     0.39
1024                    0.73
2048                    1.40
4096                    2.75
8192                    5.46
16384                  10.90
32768                  21.73
65536                  43.10
131072                 86.76
262144                175.33
524288                345.79
1048576               689.91
2097152              1397.83
4194304              2792.04
openmpi@1.10.7%gcc@10.2.0 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.03
openmpi@1.10.7%gcc@10.2.0 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      46.35
2                      90.19
4                     150.20
8                     377.38
16                    753.14
32                   1478.48
64                   2501.82
128                  5144.53
256                  9324.45
512                 14613.76
1024                24809.77
2048                22938.63
4096                24855.62
8192                27888.89
16384               15915.32
32768               12391.10
65536               11789.70
131072              11417.36
262144               6113.86
524288               4660.28
1048576              4542.39
2097152              4564.62
4194304              4718.28
openmpi@1.10.7%gcc@10.2.0 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      52.10
2                      99.69
4                     228.26
8                     424.33
16                    844.38
32                   1751.69
64                   3494.45
128                  6978.51
256                 12665.97
512                 20618.20
1024                36698.70
2048                42498.10
4096                43202.59
8192                39435.47
16384               28548.51
32768               23833.68
65536               19828.53
131072              10806.46
262144               8649.39
524288               8605.78
1048576              8276.51
2097152              8251.78
4194304              8828.55
openmpi@1.10.7%gcc@10.2.0 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.05
2                       0.05
4                       0.06
8                       0.05
16                      0.05
32                      0.05
64                      0.05
128                     0.06
256                     0.06
512                     0.06
1024                    0.07
2048                    0.08
4096                    0.12
8192                    0.28
16384                   0.61
32768                   1.31
65536                   2.96
131072                  6.01
262144                 11.32
524288                 23.56
1048576                65.42
2097152               166.75
4194304               362.76
openmpi@1.10.7%gcc@10.2.0 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.03
openmpi@1.10.7%gcc@10.2.0 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       1.55
2                       1.56
4                       1.55
8                       1.55
16                      1.58
32                      1.56
64                      1.68
128                     1.79
256                     1.99
512                     2.33
1024                    2.86
2048                    3.92
4096                    6.63
8192                   13.38
16384                  21.03
32768                  34.96
65536                  62.53
131072                117.63
262144                223.17
524288                448.44
1048576               929.77
2097152              1928.17
4194304              4044.93
openmpi@1.10.7%gcc@10.2.0 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.03
8                       0.03
16                      0.03
32                      0.03
64                      0.03
128                     0.03
256                     0.03
512                     0.03
1024                    0.04
2048                    0.05
4096                    0.07
8192                    0.10
16384                   0.27
32768                   1.28
65536                   2.37
131072                  6.11
262144                  9.71
524288                 21.11
1048576                63.46
2097152               169.29
4194304               343.08
openmpi@1.10.7%gcc@10.2.0 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      38.95
2                      88.01
4                     180.88
8                     381.58
16                    784.73
32                   1549.88
64                   3135.55
128                  5606.54
256                 11224.15
512                 16490.53
1024                22749.79
2048                22039.02
4096                23014.85
8192                26090.11
16384               15911.68
32768               12264.16
65536               11736.24
131072              11325.51
262144               6679.27
524288               4892.67
1048576              4377.06
2097152              4532.93
4194304              4298.66
-- linux-debian9-cascadelake / gcc@10.2.0 -----------------------
hwloc@1.11.11
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
numactl@2.0.14
openmpi@2.1.6
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
openmpi@2.1.6%gcc@10.2.0 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
openmpi@2.1.6%gcc@10.2.0 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 8 ms, max: 10 ms, avg: 9 ms
openmpi@2.1.6%gcc@10.2.0 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                      11.46
2                      21.80
4                      37.37
8                      91.13
16                    137.72
32                    334.20
64                    456.99
128                   599.82
256                  1042.64
512                  1907.79
1024                 3568.33
2048                 5771.38
4096                 5726.59
8192                 8054.57
16384               10202.37
32768               10175.23
65536               10489.81
131072              10430.19
262144              10568.95
524288               9982.40
1048576             10348.05
2097152              9804.10
4194304              8916.60
openmpi@2.1.6%gcc@10.2.0 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.22
1                       0.25
2                       0.26
4                       0.26
8                       0.25
16                      0.27
32                      0.27
64                      0.29
128                     0.39
256                     0.41
512                     0.60
1024                    0.65
2048                    0.85
4096                    1.49
8192                    2.36
16384                   4.13
32768                   7.05
65536                   9.85
131072                 16.15
262144                 29.09
524288                 59.95
1048576               119.48
2097152               247.05
4194304               520.28
openmpi@2.1.6%gcc@10.2.0 osu_latency_mt
MPI_Init_thread must return MPI_THREAD_MULTIPLE!
-------------------------------------------------------
Primary job  terminated normally, but 1 process returned
a non-zero exit code.. Per user-direction, the job has been aborted.
-------------------------------------------------------
--------------------------------------------------------------------------
mpiexec detected that one or more processes exited with non-zero status, thus causing
the job to be terminated. The first process to do so was:

  Process name: [[9554,1],0]
  Exit code:    1
--------------------------------------------------------------------------
openmpi@2.1.6%gcc@10.2.0 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.21
1                       0.26
2                       0.26
4                       0.26
8                       0.26
16                      0.27
32                      0.27
64                      0.29
128                     0.38
256                     0.39
512                     0.57
1024                    0.65
2048                    0.87
4096                    1.53
8192                    2.37
16384                   4.11
32768                   6.59
65536                   9.88
131072                 16.00
262144                 28.83
524288                 55.41
1048576               117.02
2097152               250.13
4194304               517.14
openmpi@2.1.6%gcc@10.2.0 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       7.63
2                      15.72
4                      31.15
8                      62.75
16                    116.35
32                    256.29
64                    319.98
128                   458.15
256                   821.80
512                  1414.12
1024                 2513.89
2048                 4038.77
4096                 4162.06
8192                 6252.75
16384                7685.95
32768                8780.11
65536                8819.24
131072               8879.97
262144               9496.66
524288               9611.43
1048576              9716.53
2097152              9004.78
4194304              8136.99
openmpi@2.1.6%gcc@10.2.0 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.21
1                       0.26
2                       0.25
4                       0.26
8                       0.26
16                      0.26
32                      0.27
64                      0.30
128                     0.38
256                     0.40
512                     0.56
1024                    0.63
2048                    0.85
4096                    1.51
8192                    2.48
16384                   4.25
32768                   6.78
65536                  10.19
131072                 16.86
262144                 30.54
524288                 56.42
1048576               118.95
2097152               251.89
4194304               486.60
openmpi@2.1.6%gcc@10.2.0 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                      10.28       10279753.38
2                      19.02        9509404.07
4                      38.35        9587095.93
8                      79.09        9885650.69
16                    155.97        9747924.86
32                    316.87        9902246.88
64                    428.01        6687649.02
128                   566.09        4422607.91
256                   881.76        3444361.93
512                  1540.60        3008992.12
1024                 2766.08        2701250.50
2048                 4750.79        2319719.71
4096                 4831.11        1179471.09
8192                 6303.96         769526.19
16384                7729.57         471775.72
32768                8242.29         251534.83
65536               10046.41         153296.04
131072              10289.05          78499.21
262144              10336.48          39430.54
524288              10233.95          19519.71
1048576              9958.87           9497.52
2097152              9564.20           4560.57
4194304              8576.27           2044.74
openmpi@2.1.6%gcc@10.2.0 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.20
2                       1.20
4                       1.21
8                       1.27
16                      1.30
32                      2.87
64                      1.69
128                     2.45
256                     2.69
512                     3.37
1024                    4.83
2048                    7.70
4096                   11.76
8192                   21.33
16384                  26.57
32768                  64.26
65536                  95.32
131072                222.05
262144                483.78
524288               1441.20
1048576              3033.51
openmpi@2.1.6%gcc@10.2.0 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.81
2                       0.84
4                       0.83
8                       0.83
16                      0.89
32                      0.94
64                      0.96
128                     1.18
256                     1.18
512                     1.85
1024                    6.32
2048                   10.65
4096                    9.04
8192                   13.34
16384                  18.16
32768                  39.09
65536                  68.08
131072                127.77
262144                517.37
524288                442.83
1048576               633.55
openmpi@2.1.6%gcc@10.2.0 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      30.65              9.65              6.73              0.00
2                      19.96              4.25              3.44              0.00
4                      10.04              6.30              5.29             29.40
8                      13.94              4.42              3.57              0.00
16                     26.25              4.51              3.64              0.00
32                     30.74             13.87             12.65              0.00
64                     16.61             13.06             11.65             69.50
128                     8.12              4.44              3.48              0.00
256                    15.50              8.40              7.54              5.81
512                    58.20             26.34             22.67              0.00
1024                   34.11             13.80             11.95              0.00
2048                   56.01             14.21             10.09              0.00
4096                  137.14             55.92             47.85              0.00
8192                  158.04             56.78             44.53              0.00
16384                  78.28             39.20             37.02              0.00
32768                 265.88            135.30            127.87              0.00
65536                 387.79            161.51            143.85              0.00
131072                834.33            374.98            343.33              0.00
262144               1773.62            957.63            921.32             11.43
524288               3608.53           1809.47           1742.67              0.00
1048576              7593.84           3736.83           3593.44              0.00
openmpi@2.1.6%gcc@10.2.0 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.60              1.73              0.96              9.65
2                       2.40              1.49              0.69              0.00
4                       2.37              1.48              0.75              0.00
8                       2.43              1.51              0.69              0.00
16                      2.32              1.46              0.75              0.00
32                      2.37              1.47              0.74              0.00
64                      2.36              1.46              0.72              0.00
128                     2.38              1.46              0.74              0.00
256                     2.45              1.48              0.76              0.00
512                     6.07              3.17              2.43              0.00
1024                    7.85              3.90              3.16              0.00
2048                    9.56              4.59              3.80              0.00
4096                   16.11              6.97              6.12              0.00
8192                   27.23             12.32             11.19              0.00
16384                  38.09             18.57             17.05              0.00
32768                  52.31             22.98             21.47              0.00
65536                  87.80             36.74             34.91              0.00
131072                248.59            111.50             72.97              0.00
262144               3092.99            784.50            753.74              0.00
524288                747.85            363.76            349.88              0.00
1048576              1653.45            800.54            771.44              0.00
openmpi@2.1.6%gcc@10.2.0 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.72
2                       0.70
4                       0.69
8                       0.78
16                      0.78
32                      0.82
64                      0.84
128                     1.11
256                     1.16
512                     3.04
1024                    3.76
2048                    4.59
4096                    7.57
8192                   11.43
16384                  19.65
32768                  30.01
65536                  44.16
131072                 84.14
262144                168.03
524288                328.44
1048576               668.22
openmpi@2.1.6%gcc@10.2.0 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.35
2                       3.49
4                       3.38
8                       3.37
16                      3.45
32                      3.43
64                      3.58
128                     4.01
256                     4.78
512                     5.69
1024                    6.96
2048                    9.65
4096                   13.96
8192                   22.58
16384                  33.68
32768                  52.60
65536                 110.96
131072                244.78
262144                506.91
524288               1107.44
1048576              3152.99
openmpi@2.1.6%gcc@10.2.0 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.24
2                       0.24
4                       0.23
8                       0.23
16                      0.25
32                      0.25
64                      0.26
128                     0.28
256                     0.30
512                     1.22
1024                    1.66
2048                    2.90
4096                   19.78
8192                   10.69
16384                  15.66
32768                  21.87
65536                  33.22
131072                 74.20
262144                126.65
524288                244.11
1048576               524.79
openmpi@2.1.6%gcc@10.2.0 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.30              5.19              4.12              0.33
2                       9.91              4.83              3.90              0.00
4                       8.93              4.82              3.89              0.00
8                       8.75              4.77              3.80              0.00
16                      8.98              5.02              3.94              0.00
32                      9.10              4.96              3.84              0.00
64                      8.03              4.44              3.48              0.00
128                     8.24              4.45              3.73              0.00
256                     8.67              4.48              3.88              0.00
512                    13.71              6.90              6.19              0.00
1024                   16.29              8.26              7.31              0.00
2048                   20.00              9.91              8.97              0.00
4096                   37.42             19.18             17.86              0.00
8192                   50.53             26.12             24.46              0.25
16384                  70.43             36.65             34.67              2.58
32768                 114.21             56.80             54.03              0.00
65536                 259.26            134.68            128.95              3.39
131072                523.04            257.03            246.35              0.00
262144               1487.95            726.66            699.09              0.00
524288               3736.15           1932.99           1859.58              3.03
1048576              7601.53           3867.84           3722.08              0.00
openmpi@2.1.6%gcc@10.2.0 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       2.86              1.73              1.07              0.00
8                       2.86              1.71              1.06              0.00
16                      2.98              1.86              1.12              0.00
32                      3.04              1.85              1.16              0.00
64                      3.03              1.86              1.17              0.00
128                     3.15              1.84              1.24              0.00
256                     3.33              1.99              1.33              0.00
512                     6.15              3.06              2.12              0.00
1024                    7.79              3.39              2.57              0.00
2048                   11.90              4.98              4.10              0.00
4096                   12.74              5.54              4.55              0.00
8192                   18.69              7.46              6.48              0.00
16384                  32.87             12.34             11.33              0.00
32768                  52.22             18.96             17.78              0.00
65536                  82.46             29.06             27.35              0.00
131072                151.19             51.08             48.07              0.00
262144                288.39             99.15             94.59              0.00
524288                547.06            184.30            176.16              0.00
1048576              1162.46            389.19            373.18              0.00
openmpi@2.1.6%gcc@10.2.0 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.72
2                       0.96
4                       0.71
8                       0.74
16                      0.77
32                      0.79
64                      0.83
128                     0.94
256                     1.17
512                     3.47
1024                    3.78
2048                    4.59
4096                    7.44
8192                   11.06
16384                  18.68
32768                  31.37
65536                  46.01
131072                 86.41
262144                172.73
524288                354.59
1048576               666.45
openmpi@2.1.6%gcc@10.2.0 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.52
8                       1.53
16                      1.54
32                      1.53
64                      1.62
128                     1.88
256                     2.04
512                     3.17
1024                    3.99
2048                    5.50
4096                   12.07
8192                   15.59
16384                  22.13
32768                  50.17
65536                  66.35
131072                 98.82
262144                168.29
524288                335.62
1048576               860.49
openmpi@2.1.6%gcc@10.2.0 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.28
2                       0.71
4                       0.40
8                       0.49
16                      0.29
32                      0.28
64                      0.29
128                     0.33
256                     0.34
512                     1.48
1024                    1.75
2048                    2.42
4096                   30.19
8192                   24.91
16384                  30.76
32768                  71.36
65536                  61.64
131072                 78.42
262144                251.88
524288                472.20
1048576              1068.96
openmpi@2.1.6%gcc@10.2.0 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      10.75              5.79              4.86              0.00
2                      27.67              7.19              5.71              0.00
4                      28.00             17.59             13.44             22.61
8                      21.57             16.39             13.79             62.42
16                     12.25              5.09              4.39              0.00
32                     18.28              6.67              4.89              0.00
64                     27.19             13.95              9.57              0.00
128                    17.81             12.49              9.94             46.40
256                    54.85             14.58             13.29              0.00
512                    30.31             11.57              9.79              0.00
1024                  105.32             37.04             29.33              0.00
2048                   58.40             20.56             16.20              0.00
4096                  164.80             66.73             57.69              0.00
8192                  161.15             69.06             61.85              0.00
16384                  76.93             37.85             35.43              0.00
32768                 116.08             58.62             55.80              0.00
65536                 256.86            123.79            117.44              0.00
131072                756.30            277.26            265.43              0.00
262144               4304.68            899.66            719.03              0.00
524288               3810.34           1922.90           1850.17              0.00
1048576              7599.37           3851.72           3703.62              0.00
openmpi@2.1.6%gcc@10.2.0 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.48              2.46              1.85             45.15
2                       3.92              2.83              2.02             46.16
4                       3.97              2.92              2.00             47.48
8                       3.82              2.75              1.97             45.68
16                      3.91              2.83              2.01             45.90
32                      3.68              2.68              1.95             48.65
64                      3.27              2.28              1.70             41.48
128                     3.86              2.82              2.02             48.30
256                     4.28              3.01              2.15             40.97
512                     4.60              3.15              2.29             36.94
1024                    4.82              3.24              2.65             40.32
2048                    5.67              3.90              3.19             44.65
4096                   14.81              7.33              6.40              0.00
8192                   21.86             10.22              9.16              0.00
16384                  31.42             14.28             13.01              0.00
32768                  51.46             22.20             20.95              0.00
65536                  90.75             38.57             36.40              0.00
131072                247.03            119.78            114.68              0.00
262144                523.79            251.54            241.98              0.00
524288               1068.04            532.84            512.70              0.00
1048576              2162.91           1100.09           1058.30              0.00
openmpi@2.1.6%gcc@10.2.0 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       4.05
2                       3.85
4                       4.28
8                       3.93
16                      3.90
32                      3.94
64                      5.79
128                     4.13
256                     4.16
512                     4.72
1024                    5.65
2048                    7.28
4096                   18.59
8192                   28.14
16384                  46.16
32768                  67.61
65536                 119.72
131072                257.36
262144                638.59
524288               1726.17
1048576              3526.70
openmpi@2.1.6%gcc@10.2.0 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       7.50              4.16              3.25              0.00
2                      10.99              3.93              3.16              0.00
4                       6.92              3.64              3.11              0.00
8                       7.70              4.29              3.35              0.00
16                      9.01              5.48              3.74              5.59
32                      7.97              4.27              3.32              0.00
64                      7.79              4.36              3.23              0.00
128                     8.64              4.44              3.47              0.00
256                    11.12              7.01              5.66             27.26
512                    14.49              7.73              6.54              0.00
1024                   18.48              8.92              7.60              0.00
2048                   21.07             10.65              9.61              0.00
4096                   35.54             18.49             16.96              0.00
8192                   49.38             25.35             23.89              0.00
16384                  66.81             34.12             32.33              0.00
32768                 112.13             56.73             53.92              0.00
65536                 216.67            109.25            104.14              0.00
131072                444.63            222.20            213.28              0.00
262144                969.84            480.07            461.55              0.00
524288               2819.58           1409.99           1352.75              0.00
1048576              6288.33           3206.81           3085.62              0.13
openmpi@2.1.6%gcc@10.2.0 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
              6.50              3.54              3.03              2.43
openmpi@2.1.6%gcc@10.2.0 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.48              2.47              1.73             41.76
2                       3.48              2.46              1.62             37.67
4                       3.44              2.44              1.64             39.37
8                       3.44              2.47              1.69             42.71
16                      3.43              2.47              1.76             45.86
32                      3.35              2.38              1.71             43.12
64                      3.82              2.43              1.76             21.50
128                     3.91              2.72              1.89             37.03
256                     3.97              2.87              2.04             46.44
512                     4.53              3.12              2.30             38.68
1024                    4.63              3.14              2.58             42.39
2048                    5.81              4.01              3.29             45.20
4096                   15.52              7.14              6.14              0.00
8192                   24.80             11.88             10.75              0.00
16384                  31.11             13.93             12.61              0.00
32768                  53.56             22.42             20.91              0.00
65536                  91.46             38.54             36.46              0.00
131072                237.53            115.32            110.29              0.00
262144                507.14            246.44            236.78              0.00
524288               1077.66            545.32            524.99              0.00
1048576              2346.48           1150.63           1108.01              0.00
openmpi@2.1.6%gcc@10.2.0 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.01
2                       2.97
4                       2.90
8                       2.93
16                      3.09
32                      3.34
64                      3.36
128                     3.86
256                     4.13
512                     6.36
1024                    7.66
2048                    9.39
4096                   18.82
8192                   29.10
16384                  43.70
32768                  73.06
65536                 127.98
131072                261.26
262144                792.74
524288               1747.53
1048576              3749.26
openmpi@2.1.6%gcc@10.2.0 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.53              4.67              3.78              0.00
2                       7.98              4.57              3.73              8.57
4                       8.18              4.49              3.28              0.00
8                       8.95              4.88              3.89              0.00
16                      8.74              4.96              4.11              7.92
32                      8.00              4.44              3.34              0.00
64                      8.02              4.43              3.49              0.00
128                     8.15              4.43              3.60              0.00
256                     8.93              4.46              3.98              0.00
512                    13.99              7.74              6.72              7.01
1024                   16.85              7.99              7.24              0.00
2048                   21.93             10.89              9.89              0.00
4096                   50.11             29.96             27.87             27.71
8192                   54.18             26.88             25.29              0.00
16384                  68.61             34.44             32.53              0.00
32768                 109.05             55.91             53.14              0.00
65536                 305.08            136.72            129.72              0.00
131072                540.72            258.33            243.40              0.00
262144               1088.05            549.11            528.49              0.00
524288               6852.17           1893.20           1588.97              0.00
1048576              9338.73           5859.23           5630.38             38.20
openmpi@2.1.6%gcc@10.2.0 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.47              2.11              1.44              5.21
2                       3.56              2.19              1.46              6.00
4                       3.59              2.19              1.41              0.95
8                       3.60              2.18              1.47              3.23
16                      3.61              2.30              1.53             14.32
32                      3.61              2.30              1.52             13.68
64                      3.67              2.30              1.61             14.89
128                     3.79              2.30              1.73             14.23
256                     4.00              2.42              1.79             11.60
512                     5.48              3.16              2.30              0.00
1024                    5.65              3.42              2.66             16.23
2048                    6.25              3.65              3.05             14.69
4096                   10.74              6.30              5.30             16.08
8192                   14.26              8.06              7.25             14.57
16384                  21.35             11.33             10.39              3.55
32768                  32.05             17.46             16.24             10.15
65536                  50.98             26.01             24.65              0.00
131072                 97.16             60.14             57.30             35.40
262144                184.12            110.42            105.70             30.27
524288                359.54            235.01            225.77             44.84
1048576               732.77            473.08            455.11             42.94
openmpi@2.1.6%gcc@10.2.0 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.55
8                       0.56
16                      0.62
32                      0.56
64                      0.61
128                     0.75
256                     2.85
512                     1.53
1024                    1.70
2048                    2.96
4096                    5.94
8192                   11.90
16384                  12.35
32768                  20.83
65536                  44.50
131072                 94.72
262144                157.60
524288                319.43
1048576               574.11
openmpi@2.1.6%gcc@10.2.0 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             1.05
openmpi@2.1.6%gcc@10.2.0 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       6.32              3.63              2.75              2.07
8                       6.32              3.65              2.78              4.03
16                      6.31              3.70              2.81              6.83
32                      6.43              3.47              2.76              0.00
64                      7.64              3.94              3.12              0.00
128                     7.91              4.18              3.45              0.00
256                     8.35              4.46              3.64              0.00
512                    10.61              5.53              4.79              0.00
1024                   15.75              6.61              5.70              0.00
2048                   42.27             11.70              9.41              0.00
4096                   32.48             17.16             15.93              3.83
8192                   43.53             21.04             19.61              0.00
16384                  75.55             35.13             32.73              0.00
32768                 132.49             62.10             58.82              0.00
65536                 182.49             99.88             95.24             13.26
131072                235.03            115.61            110.80              0.00
262144                380.69            190.03            182.58              0.00
524288                650.02            332.13            319.12              0.38
1048576              1274.55            640.49            614.32              0.00
openmpi@2.1.6%gcc@10.2.0 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.32              1.46              0.68              0.00
2                       2.57              1.32              0.66              0.00
4                       2.20              1.33              0.67              0.00
8                       2.17              1.33              0.66              0.00
16                      2.17              1.32              0.68              0.00
32                      2.33              1.45              0.68              0.00
64                      2.35              1.46              0.72              0.00
128                     2.39              1.46              0.71              0.00
256                     2.42              1.46              0.75              0.00
512                     6.20              3.24              2.50              0.00
1024                    7.58              4.02              3.40              0.00
2048                    9.33              4.44              3.63              0.00
4096                   15.79              6.78              5.83              0.00
8192                   26.00             12.10             11.00              0.00
16384                  37.86             16.90             15.53              0.00
32768                  50.42             22.18             20.68              0.00
65536                  86.98             37.95             35.60              0.00
131072                195.93             92.45             88.51              0.00
262144                373.61            164.50            157.87              0.00
524288                790.38            370.57            356.53              0.00
1048576              1710.67            842.16            811.01              0.00
openmpi@2.1.6%gcc@10.2.0 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.80
8                       0.88
16                      1.08
32                      1.59
64                      1.52
128                     1.60
256                     1.86
512                     2.08
1024                    2.69
2048                    3.24
4096                    4.37
8192                    6.84
16384                  10.87
32768                  18.61
65536                  28.87
131072                135.27
262144                305.60
524288                220.70
1048576               486.83
openmpi@2.1.6%gcc@10.2.0 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.05
2                       0.03
4                       0.03
8                       0.04
16                      0.04
32                      0.06
64                      0.09
128                     0.13
256                     0.21
512                     0.38
1024                    1.01
2048                    1.39
4096                    2.75
8192                    5.47
16384                  10.87
32768                  21.83
65536                  43.22
131072                 85.71
262144                171.48
524288                348.17
1048576               746.51
2097152              1386.52
4194304              2785.81
openmpi@2.1.6%gcc@10.2.0 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.03
openmpi@2.1.6%gcc@10.2.0 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      46.75
2                      80.73
4                     181.87
8                     368.03
16                    612.61
32                   1530.32
64                   3073.14
128                  5582.09
256                 11004.25
512                 17054.06
1024                25564.45
2048                25224.88
4096                28248.82
8192                29383.20
16384               15725.93
32768               12038.50
65536               11143.25
131072               9610.11
262144               5178.92
524288               4684.03
1048576              4579.67
2097152              4541.13
4194304              4648.36
openmpi@2.1.6%gcc@10.2.0 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      46.46
2                      98.39
4                     206.92
8                     421.55
16                    756.45
32                   1524.96
64                   3343.78
128                  6528.17
256                 13450.90
512                 21293.27
1024                31489.83
2048                43959.63
4096                50256.61
8192                42087.96
16384               29302.05
32768               24489.98
65536               21788.43
131072              13381.50
262144               9432.10
524288               8617.91
1048576              8536.77
2097152              8782.18
4194304              8493.13
openmpi@2.1.6%gcc@10.2.0 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.03
8                       0.03
16                      0.03
32                      0.03
64                      0.03
128                     0.03
256                     0.03
512                     0.03
1024                    0.04
2048                    0.05
4096                    0.07
8192                    0.21
16384                   0.42
32768                   1.48
65536                   3.01
131072                  5.85
262144                 11.37
524288                 23.34
1048576                65.92
2097152               171.35
4194304               356.53
openmpi@2.1.6%gcc@10.2.0 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.05
openmpi@2.1.6%gcc@10.2.0 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       3.04
2                       2.92
4                       2.81
8                       3.05
16                      2.77
32                      2.78
64                      2.84
128                     3.01
256                     3.18
512                     3.54
1024                    4.15
2048                    5.27
4096                    8.00
8192                   11.80
16384                  20.48
32768                  35.71
65536                  63.81
131072                118.17
262144                222.33
524288                460.60
1048576               938.85
2097152              1873.17
4194304              3987.59
openmpi@2.1.6%gcc@10.2.0 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.03
8                       0.03
16                      0.03
32                      0.03
64                      0.03
128                     0.03
256                     0.03
512                     0.03
1024                    0.04
2048                    0.05
4096                    0.07
8192                    0.11
16384                   0.32
32768                   1.33
65536                   2.65
131072                  6.03
262144                 11.36
524288                 23.11
1048576                61.84
2097152               167.70
4194304               355.02
openmpi@2.1.6%gcc@10.2.0 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      32.75
2                      86.05
4                     169.91
8                     354.63
16                    708.43
32                   1400.66
64                   2747.15
128                  5083.02
256                 10221.73
512                 13630.96
1024                20845.25
2048                26307.37
4096                27608.96
8192                25141.52
16384               14986.51
32768               12450.49
65536               11713.93
131072              11124.89
262144               4874.58
524288               4249.05
1048576              4654.14
2097152              4581.97
4194304              4625.34
-- linux-debian9-cascadelake / gcc@10.2.0 -----------------------
hwloc@1.11.11
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
numactl@2.0.14
openmpi@3.1.6
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
openmpi@3.1.6%gcc@10.2.0 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
openmpi@3.1.6%gcc@10.2.0 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 7 ms, max: 8 ms, avg: 7 ms
openmpi@3.1.6%gcc@10.2.0 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                      10.71
2                      22.26
4                      43.02
8                      73.44
16                    149.41
32                    313.12
64                    469.75
128                   644.61
256                  1069.37
512                  2045.60
1024                 3298.10
2048                 6033.42
4096                 5810.37
8192                 7814.66
16384               10226.64
32768               11071.40
65536               10180.34
131072              10363.88
262144              10665.06
524288              10494.68
1048576             10270.73
2097152              9613.02
4194304              8574.05
openmpi@3.1.6%gcc@10.2.0 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.24
1                       0.29
2                       0.28
4                       0.28
8                       0.27
16                      0.29
32                      0.29
64                      0.31
128                     0.39
256                     0.42
512                     0.59
1024                    0.68
2048                    0.86
4096                    1.54
8192                    2.39
16384                   4.14
32768                   6.48
65536                   9.62
131072                 15.93
262144                 28.19
524288                 54.01
1048576               114.54
2097152               243.51
4194304               499.80
openmpi@3.1.6%gcc@10.2.0 osu_latency_mt
# Number of Sender threads: 1
# Number of Receiver threads: 2
# OSU MPI Multi-threaded Latency Test v5.6.3
# Size          Latency (us)
0                       0.34
1                       0.40
2                       0.40
4                       0.41
8                       0.40
16                      0.41
32                      0.40
64                      0.41
128                     0.49
256                     0.52
512                     0.86
1024                    0.90
2048                    1.03
4096                    5.05
8192                    3.35
16384                   4.47
32768                   6.81
65536                   9.87
131072                 16.57
262144                 54.03
524288                 87.24
1048576               235.66
2097152               447.99
4194304              1039.95
openmpi@3.1.6%gcc@10.2.0 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.22
1                       0.26
2                       0.26
4                       0.27
8                       0.26
16                      0.28
32                      0.27
64                      0.29
128                     0.37
256                     0.40
512                     0.53
1024                    0.66
2048                    0.85
4096                    1.49
8192                    2.31
16384                   4.02
32768                   6.44
65536                   9.49
131072                 15.55
262144                 28.20
524288                 54.42
1048576               117.06
2097152               239.44
4194304               507.83
openmpi@3.1.6%gcc@10.2.0 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       8.48
2                      14.31
4                      31.82
8                      82.19
16                    146.33
32                    324.54
64                    453.11
128                   571.73
256                   913.46
512                  1592.26
1024                 2732.62
2048                 4917.61
4096                 5655.95
8192                 7374.81
16384                9384.18
32768                9880.13
65536               10298.12
131072              10021.31
262144               9101.63
524288               9882.02
1048576              9271.19
2097152              8978.31
4194304              8215.02
openmpi@3.1.6%gcc@10.2.0 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.22
1                       0.26
2                       0.28
4                       0.27
8                       0.29
16                      0.28
32                      0.28
64                      0.30
128                     0.38
256                     0.41
512                     0.56
1024                    0.66
2048                    0.84
4096                    1.50
8192                    2.36
16384                   4.11
32768                   6.55
65536                   9.62
131072                 15.70
262144                 27.97
524288                 53.63
1048576               114.09
2097152               240.30
4194304               501.71
openmpi@3.1.6%gcc@10.2.0 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                       8.67        8669408.69
2                      21.51       10753645.32
4                      38.63        9656893.86
8                      83.53       10441018.72
16                    161.02       10063557.88
32                    316.71        9897085.15
64                    435.24        6800696.77
128                   552.41        4315681.22
256                   900.92        3519207.94
512                  1621.66        3167300.81
1024                 2894.41        2826567.99
2048                 4958.76        2421269.02
4096                 5623.32        1372879.71
8192                 7415.10         905163.09
16384                9143.50         558074.69
32768               10065.25         307167.08
65536               10307.43         157278.86
131072               9920.15          75684.76
262144               9920.67          37844.35
524288               9595.17          18301.34
1048576              9653.32           9206.12
2097152              8948.77           4267.10
4194304              7929.76           1890.60
openmpi@3.1.6%gcc@10.2.0 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.31
2                       1.47
4                       1.36
8                       1.40
16                      1.50
32                      1.57
64                      1.66
128                     2.13
256                     2.64
512                     3.18
1024                    4.97
2048                    7.63
4096                   11.96
8192                   19.11
16384                  28.41
32768                  48.65
65536                  99.83
131072                212.66
262144                446.89
524288               1072.84
1048576              3142.74
openmpi@3.1.6%gcc@10.2.0 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.77
2                       0.78
4                       1.30
8                       0.83
16                      0.88
32                      0.90
64                      0.98
128                     1.14
256                     1.22
512                     1.66
1024                    2.05
2048                    4.07
4096                    6.62
8192                   11.27
16384                  19.55
32768                  37.01
65536                  70.61
131072                141.57
262144                262.11
524288                248.10
1048576               521.57
openmpi@3.1.6%gcc@10.2.0 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.12              4.35              3.37              0.00
2                       7.87              4.43              3.29              0.00
4                       7.89              4.37              3.32              0.00
8                       7.92              4.43              3.31              0.00
16                      7.62              4.19              3.28              0.00
32                      7.90              4.43              3.30              0.00
64                      7.98              4.44              3.40              0.00
128                     8.09              4.44              3.67              0.46
256                     8.56              4.58              3.97              0.00
512                    13.03              6.77              6.09              0.00
1024                   14.73              7.73              6.55              0.00
2048                   28.41             14.41             13.20              0.00
4096                   34.86             18.02             16.77              0.00
8192                   50.01             24.38             22.80              0.00
16384                  68.51             35.13             32.97              0.00
32768                 110.34             56.26             53.47              0.00
65536                 218.04            111.70            106.85              0.47
131072                507.57            241.86            232.01              0.00
262144               1434.19            704.61            676.17              0.00
524288               5826.79           1794.99           1636.06              0.00
1048576              7247.20           3644.16           3504.11              0.00
openmpi@3.1.6%gcc@10.2.0 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.12              1.29              0.65              0.00
2                       2.16              1.30              0.63              0.00
4                       2.15              1.32              0.64              0.00
8                       2.16              1.33              0.65              0.00
16                      2.12              1.29              0.64              0.00
32                      2.19              1.30              0.65              0.00
64                      2.82              1.31              0.66              0.00
128                     2.43              1.46              0.69              0.00
256                     2.33              1.42              0.71              0.00
512                     8.90              3.23              2.20              0.00
1024                    7.28              3.41              2.65              0.00
2048                    9.40              4.44              3.28              0.00
4096                   15.37              6.50              5.45              0.00
8192                   24.70             11.71             10.49              0.00
16384                  34.73             15.45             14.25              0.00
32768                  56.18             23.73             22.22              0.00
65536                 105.58             43.57             39.42              0.00
131072                197.49             85.87             81.26              0.00
262144                334.13            161.06            153.53              0.00
524288                702.53            327.25            308.92              0.00
1048576              1543.25            743.05            714.88              0.00
openmpi@3.1.6%gcc@10.2.0 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.75
2                       0.76
4                       0.76
8                       1.50
16                      0.82
32                      0.86
64                      0.87
128                     1.04
256                     1.15
512                     2.99
1024                    3.76
2048                    4.59
4096                    7.24
8192                   10.88
16384                  18.50
32768                  30.54
65536                  45.77
131072                 81.83
262144                171.46
524288                335.36
1048576               711.35
openmpi@3.1.6%gcc@10.2.0 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.60
2                       3.75
4                       3.58
8                       3.56
16                      3.76
32                      3.91
64                      3.67
128                     4.20
256                     4.98
512                     6.05
1024                    7.72
2048                   10.52
4096                   15.31
8192                   23.09
16384                  31.29
32768                  58.85
65536                  95.74
131072                194.71
262144                434.84
524288               1162.47
1048576              2980.85
openmpi@3.1.6%gcc@10.2.0 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.27
2                       0.26
4                       0.27
8                       0.27
16                      0.27
32                      0.30
64                      0.31
128                     0.33
256                     0.35
512                     1.51
1024                    1.91
2048                    2.57
4096                    8.57
8192                   13.30
16384                  16.77
32768                  29.83
65536                  34.64
131072                 77.36
262144                131.21
524288                248.62
1048576               519.49
openmpi@3.1.6%gcc@10.2.0 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.15              4.98              4.18              0.48
2                       8.85              5.13              4.13              9.70
4                       8.06              4.48              3.52              0.00
8                       7.96              4.43              3.37              0.00
16                      7.98              4.44              3.45              0.00
32                      8.22              4.45              3.49              0.00
64                      8.05              4.45              3.63              0.83
128                     8.12              4.44              3.44              0.00
256                     8.48              4.44              3.84              0.00
512                    13.91              7.05              6.27              0.00
1024                   14.76              7.73              6.75              0.00
2048                   18.25              9.35              8.40              0.00
4096                   34.58             17.54             15.85              0.00
8192                   49.86             23.89             22.32              0.00
16384                  81.14             37.82             35.21              0.00
32768                 126.24             63.61             60.57              0.00
65536                 255.45            126.89            121.73              0.00
131072                619.41            291.76            276.65              0.00
262144               1498.35            758.80            729.33              0.00
524288               3440.50           1799.47           1732.27              5.27
1048576              8212.76           4007.56           3834.15              0.00
openmpi@3.1.6%gcc@10.2.0 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       3.55              2.16              1.46              4.54
8                       9.73              2.15              1.39              0.00
16                      9.46              2.16              1.43              0.00
32                     11.99              7.14              6.10             20.57
64                      7.14              1.97              1.35              0.00
128                     7.16              5.68              4.87             69.61
256                     4.03              2.32              1.77              3.37
512                     6.31              3.39              2.46              0.00
1024                    8.98              5.16              2.89              0.00
2048                   21.47              8.42              7.44              0.00
4096                   41.12             15.85             12.55              0.00
8192                   58.09             22.06             18.94              0.00
16384                  98.22             35.94             28.29              0.00
32768                 170.54             40.25             32.80              0.00
65536                  87.19             31.00             29.11              0.00
131072                631.98            225.79            163.57              0.00
262144                734.04            172.08            134.14              0.00
524288                898.08            346.39            310.10              0.00
1048576              1260.22            426.84            410.56              0.00
openmpi@3.1.6%gcc@10.2.0 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.81
2                       0.81
4                       0.87
8                       0.84
16                      0.91
32                      0.88
64                      0.89
128                     1.15
256                     1.19
512                     3.23
1024                    3.87
2048                    4.60
4096                    7.37
8192                   11.06
16384                  18.89
32768                  30.76
65536                  45.62
131072                 84.68
262144                176.30
524288                343.70
1048576               848.51
openmpi@3.1.6%gcc@10.2.0 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.28
8                       1.34
16                      1.42
32                      6.82
64                     41.53
128                    14.47
256                    31.93
512                     9.04
1024                   15.59
2048                    8.52
4096                   28.71
8192                   26.18
16384                  20.05
32768                  42.29
65536                  65.43
131072                 98.89
262144                167.21
524288                326.14
1048576               796.10
openmpi@3.1.6%gcc@10.2.0 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.33
2                       0.30
4                       0.29
8                       0.28
16                      0.29
32                      0.31
64                      0.32
128                     0.35
256                     0.38
512                     1.40
1024                    1.83
2048                    2.67
4096                    8.40
8192                   12.61
16384                  19.34
32768                  29.48
65536                  53.33
131072                 78.97
262144                141.19
524288                276.30
1048576               584.22
openmpi@3.1.6%gcc@10.2.0 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      10.15              5.60              4.62              1.72
2                      10.26              5.32              4.48              0.00
4                      11.14              6.29              5.23              7.17
8                       9.61              5.37              4.62              8.36
16                      8.93              5.03              4.33              9.94
32                      8.63              4.77              3.98              2.75
64                      8.37              4.43              3.51              0.00
128                     8.32              4.41              3.78              0.00
256                    10.18              5.38              4.71              0.00
512                    13.91              7.07              6.27              0.00
1024                   16.54              8.35              7.45              0.00
2048                   21.79             11.55             10.59              3.31
4096                   38.49             18.08             16.39              0.00
8192                   49.18             25.25             23.70              0.00
16384                  69.52             34.50             32.60              0.00
32768                 110.54             55.65             52.82              0.00
65536                 222.07            108.58            103.83              0.00
131072                662.63            262.01            251.46              0.00
262144               1609.37            848.34            816.75              6.82
524288               3728.41           2000.01           1925.84             10.25
1048576              7590.04           3966.85           3808.00              4.85
openmpi@3.1.6%gcc@10.2.0 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.02              2.13              1.34             33.71
2                       2.99              2.14              1.38             38.40
4                       2.98              2.13              1.37             37.60
8                       2.98              2.14              1.38             38.98
16                      3.05              2.12              1.42             33.87
32                      3.02              2.13              1.47             39.43
64                      3.07              2.15              1.57             41.00
128                     3.22              2.27              1.73             44.94
256                     3.82              2.79              1.91             46.07
512                     4.30              2.95              2.09             35.55
1024                    4.58              3.13              2.40             39.73
2048                    5.76              3.99              3.04             41.88
4096                   13.54              6.77              5.94              0.00
8192                   20.39              9.56              8.57              0.00
16384                  30.10             13.74             12.59              0.00
32768                  53.09             22.67             20.95              0.00
65536                  89.13             37.26             35.00              0.00
131072                224.41            108.70            104.11              0.00
262144                493.60            238.95            228.90              0.00
524288               1024.09            509.18            481.57              0.00
1048576              2096.12           1034.27            993.28              0.00
openmpi@3.1.6%gcc@10.2.0 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       4.09
2                       3.98
4                       3.99
8                       3.71
16                      3.35
32                      3.41
64                      3.39
128                     3.86
256                     3.70
512                     4.62
1024                    5.44
2048                    7.34
4096                   19.39
8192                   29.66
16384                  45.53
32768                  69.95
65536                 129.17
131072                258.70
262144                619.97
524288               1697.91
1048576              3889.55
openmpi@3.1.6%gcc@10.2.0 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.98              4.77              3.79              0.00
2                       8.21              4.58              3.74              3.19
4                       8.34              4.42              3.31              0.00
8                       7.74              4.30              3.25              0.00
16                      7.63              4.17              3.19              0.00
32                      7.86              4.30              3.27              0.00
64                      8.36              4.60              3.62              0.00
128                     8.46              4.61              3.88              0.85
256                     8.48              4.53              3.72              0.00
512                    12.83              6.65              5.77              0.00
1024                   26.69              9.55              7.48              0.00
2048                   17.71              9.18              8.29              0.00
4096                   33.42             17.37             15.86              0.00
8192                   82.63             47.99             45.48             23.85
16384                  72.75             34.80             32.51              0.00
32768                 110.13             54.92             52.27              0.00
65536                 238.06            109.06            100.51              0.00
131072                447.17            238.44            228.79              8.77
262144               1002.91            529.16            508.46              6.83
524288               2454.07           1199.99           1154.24              0.00
1048576              5574.25           2763.56           2661.05              0.00
openmpi@3.1.6%gcc@10.2.0 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
              7.27              4.32              3.32             11.39
openmpi@3.1.6%gcc@10.2.0 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.54              2.45              1.85             41.33
2                       3.48              2.47              1.78             43.10
4                       3.77              2.83              2.16             56.38
8                       2.97              2.13              1.43             40.61
16                      2.99              2.11              1.48             40.74
32                      3.00              2.12              1.49             40.61
64                      3.04              2.13              1.64             44.59
128                     3.96              2.69              1.91             33.54
256                     3.53              2.53              1.89             47.18
512                     4.16              2.81              2.00             32.57
1024                    4.50              3.07              2.29             37.90
2048                    5.35              3.65              2.89             41.27
4096                   14.55              6.92              6.01              0.00
8192                   23.51             12.31             11.17              0.00
16384                  30.92             13.48             12.30              0.00
32768                  50.33             21.34             20.19              0.00
65536                  86.66             36.54             34.56              0.00
131072                231.38            112.59            107.68              0.00
262144                503.85            244.01            222.28              0.00
524288               1035.76            525.33            505.28              0.00
1048576              2691.18           1153.55           1045.43              0.00
openmpi@3.1.6%gcc@10.2.0 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.37
2                       2.94
4                       3.20
8                       5.11
16                     11.33
32                      3.27
64                      7.99
128                     4.00
256                    12.23
512                    13.27
1024                    8.09
2048                    8.98
4096                   43.23
8192                   64.32
16384                 147.00
32768                  72.95
65536                 135.25
131072                512.00
262144               2083.12
524288               5241.90
1048576              3994.67
openmpi@3.1.6%gcc@10.2.0 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.72              5.64              4.87             16.18
2                       9.34              5.28              4.43              8.38
4                       9.28              5.20              4.29              4.97
8                       9.43              5.29              4.33              4.53
16                      9.94              5.23              4.38              0.00
32                      8.44              4.65              3.69              0.00
64                      8.57              4.76              4.14              8.12
128                     8.44              4.73              3.90              4.73
256                     8.72              4.50              3.77              0.00
512                    15.39              7.40              6.54              0.00
1024                   16.22              8.43              7.45              0.00
2048                   18.30              9.62              8.52              0.00
4096                   33.22             16.85             15.66              0.00
8192                   48.25             24.98             23.52              1.03
16384                  64.97             33.13             31.24              0.00
32768                 119.10             53.97             51.47              0.00
65536                 259.99            111.55            103.27              0.00
131072                470.93            237.30            224.49              0.00
262144                935.04            454.72            437.22              0.00
524288               2415.32           1178.93           1131.47              0.00
1048576              5713.87           2876.62           2767.26              0.00
openmpi@3.1.6%gcc@10.2.0 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.47              2.23              1.45             14.64
2                       3.46              2.21              1.43             12.51
4                       3.43              2.21              1.38             11.50
8                       3.47              2.25              1.43             14.75
16                      3.48              2.21              1.40              8.53
32                      3.54              2.23              1.45              9.59
64                      3.56              2.21              1.49              9.07
128                     3.80              2.21              1.71              7.19
256                     3.71              2.21              1.73             13.01
512                     5.28              3.18              2.22              5.94
1024                    5.59              3.33              2.52             10.64
2048                    6.23              3.64              2.97             12.65
4096                   10.28              6.38              5.60             30.33
8192                   14.01              7.78              7.10             12.25
16384                  20.64             11.56             10.53             13.77
32768                  34.26             17.71             16.29              0.00
65536                  53.62             26.80             25.19              0.00
131072                 99.17             60.28             57.42             32.28
262144                182.75            110.56            105.82             31.78
524288                364.79            230.21            220.99             39.10
1048576               744.72            483.42            464.19             43.71
openmpi@3.1.6%gcc@10.2.0 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.55
8                       0.55
16                      0.62
32                      0.61
64                      0.64
128                     0.78
256                     0.82
512                     1.44
1024                    1.80
2048                    2.96
4096                    5.76
8192                   11.76
16384                  13.34
32768                  21.35
65536                  43.65
131072                 98.48
262144                165.65
524288                311.25
1048576               556.71
openmpi@3.1.6%gcc@10.2.0 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             1.10
openmpi@3.1.6%gcc@10.2.0 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       6.61              3.48              2.71              0.00
8                       6.10              3.39              2.63              0.00
16                      6.97              3.81              3.10              0.00
32                      7.60              3.86              3.16              0.00
64                      7.54              4.01              3.42              0.00
128                     8.37              4.59              3.69              0.00
256                     8.78              4.88              3.97              1.70
512                    11.68              5.99              5.18              0.00
1024                   12.66              6.96              6.12              6.85
2048                   14.93              7.72              7.05              0.00
4096                   27.75             13.56             12.42              0.00
8192                   42.13             20.29             19.08              0.00
16384                  72.35             33.86             32.03              0.00
32768                 127.22             65.69             62.15              0.99
65536                 157.31             72.85             67.14              0.00
131072                208.78            104.30             99.67              0.00
262144                340.61            169.02            162.00              0.00
524288                640.11            326.05            313.15              0.00
1048576              1318.72            655.88            631.11              0.00
openmpi@3.1.6%gcc@10.2.0 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.60              1.63              0.74              0.00
2                       2.26              1.35              0.70              0.00
4                       2.24              1.34              0.70              0.00
8                       2.39              1.48              0.73              0.00
16                      2.22              1.33              0.69              0.00
32                      2.25              1.33              0.69              0.00
64                      2.23              1.32              0.70              0.00
128                     2.38              1.46              0.73              0.00
256                     2.42              1.47              0.78              0.00
512                     6.70              2.96              2.32              0.00
1024                    9.73              5.70              4.76             15.37
2048                    9.32              4.07              3.36              0.00
4096                   15.72              6.60              5.60              0.00
8192                   25.37             11.70             10.54              0.00
16384                  36.84             16.41             15.09              0.00
32768                  49.44             21.59             20.03              0.00
65536                  81.02             33.10             31.12              0.00
131072                160.11             66.30             63.27              0.00
262144                359.29            166.62            156.44              0.00
524288                677.45            322.22            309.52              0.00
1048576              1455.97            697.43            670.34              0.00
openmpi@3.1.6%gcc@10.2.0 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.89
8                       0.94
16                      1.15
32                      1.65
64                      1.68
128                     2.00
256                     2.02
512                     2.08
1024                    2.75
2048                    3.80
4096                    5.00
8192                    7.59
16384                  10.87
32768                  17.79
65536                  28.71
131072                147.23
262144                336.29
524288                247.52
1048576               497.85
openmpi@3.1.6%gcc@10.2.0 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.04
8                       0.04
16                      0.04
32                      0.07
64                      0.09
128                     0.13
256                     0.21
512                     0.40
1024                    0.72
2048                    1.43
4096                    2.74
8192                    5.39
16384                  13.35
32768                  21.43
65536                  43.03
131072                 85.67
262144                171.10
524288                347.49
1048576               693.47
2097152              1378.35
4194304              2822.11
openmpi@3.1.6%gcc@10.2.0 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.03
openmpi@3.1.6%gcc@10.2.0 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      45.81
2                      90.58
4                     173.53
8                     347.07
16                    737.96
32                   1399.36
64                   3012.27
128                  5492.97
256                  7865.99
512                 17275.23
1024                26859.68
2048                23381.37
4096                26835.12
8192                28267.82
16384               15025.35
32768               11920.58
65536               11296.91
131072               9919.57
262144               5230.26
524288               4494.62
1048576              4556.52
2097152              4551.25
4194304              4429.65
openmpi@3.1.6%gcc@10.2.0 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      53.04
2                     115.38
4                     207.42
8                     445.67
16                    856.08
32                   1667.49
64                   3581.84
128                  7027.20
256                 13069.98
512                 21083.92
1024                32407.79
2048                40915.76
4096                51353.36
8192                40620.69
16384               30331.74
32768               24694.95
65536               21952.93
131072              12457.99
262144               8612.87
524288               8453.22
1048576              8613.34
2097152              8746.99
4194304              8890.20
openmpi@3.1.6%gcc@10.2.0 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.03
8                       0.03
16                      0.03
32                      0.03
64                      0.03
128                     0.03
256                     0.03
512                     0.03
1024                    0.04
2048                    0.05
4096                    0.07
8192                    0.21
16384                   0.44
32768                   1.50
65536                   3.04
131072                  6.17
262144                  9.64
524288                 22.16
1048576                61.07
2097152               168.86
4194304               367.77
openmpi@3.1.6%gcc@10.2.0 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.03
openmpi@3.1.6%gcc@10.2.0 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       2.77
2                       2.80
4                       2.78
8                       2.82
16                      2.80
32                      2.79
64                      2.86
128                     3.00
256                     3.19
512                     3.48
1024                    4.10
2048                    5.15
4096                    8.27
8192                   11.63
16384                  20.35
32768                  35.59
65536                  63.22
131072                117.09
262144                220.38
524288                450.34
1048576               913.66
2097152              1874.84
4194304              3952.80
openmpi@3.1.6%gcc@10.2.0 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.03
8                       0.03
16                      0.03
32                      0.03
64                      0.03
128                     0.03
256                     0.03
512                     0.03
1024                    0.04
2048                    0.05
4096                    0.08
8192                    0.09
16384                   0.26
32768                   1.08
65536                   2.28
131072                  6.30
262144                 10.24
524288                 22.45
1048576                62.13
2097152               171.28
4194304               346.94
openmpi@3.1.6%gcc@10.2.0 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      43.98
2                      90.24
4                     177.13
8                     359.72
16                    730.13
32                   1507.43
64                   2995.90
128                  5341.99
256                 10860.12
512                 15061.32
1024                21256.32
2048                25676.08
4096                28501.63
8192                20509.37
16384               15540.18
32768               12336.74
65536               11117.25
131072              10491.17
262144               5841.03
524288               4569.30
1048576              4333.03
2097152              4495.22
4194304              4567.21
-- linux-debian9-cascadelake / gcc@10.2.0 -----------------------
hwloc@2.2.0
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
numactl@2.0.14
openmpi@4.0.5
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
openmpi@4.0.5%gcc@10.2.0 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
openmpi@4.0.5%gcc@10.2.0 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 17 ms, max: 18 ms, avg: 17 ms
openmpi@4.0.5%gcc@10.2.0 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       9.89
2                      20.41
4                      41.31
8                      84.96
16                    118.93
32                    322.12
64                    360.51
128                   472.54
256                   845.30
512                  1575.65
1024                 3259.49
2048                 5762.85
4096                 5522.38
8192                 7734.41
16384               10140.16
32768               10569.12
65536               10508.05
131072              10898.85
262144              11212.97
524288              11456.90
1048576             11467.16
2097152             11621.04
4194304             12800.15
openmpi@4.0.5%gcc@10.2.0 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.23
1                       0.27
2                       0.26
4                       0.26
8                       0.27
16                      0.28
32                      0.28
64                      0.29
128                     0.36
256                     0.40
512                     0.57
1024                    0.68
2048                    0.83
4096                    1.85
8192                    2.97
16384                   4.58
32768                   7.26
65536                  13.23
131072                 25.64
262144                 50.80
524288                101.71
1048576               218.91
2097152               447.10
4194304               961.68
openmpi@4.0.5%gcc@10.2.0 osu_latency_mt
# Number of Sender threads: 1
# Number of Receiver threads: 2
# OSU MPI Multi-threaded Latency Test v5.6.3
# Size          Latency (us)
0                       0.37
1                       0.40
2                       0.39
4                       0.40
8                       0.39
16                      0.42
32                      0.42
64                      0.44
128                     0.52
256                     0.54
512                     0.87
1024                    0.93
2048                    3.46
4096                    3.22
8192                    3.92
16384                   4.88
32768                   7.53
65536                  13.60
131072                 42.32
262144                104.60
524288                226.28
1048576               460.92
2097152               884.42
4194304              2257.64
openmpi@4.0.5%gcc@10.2.0 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.22
1                       0.26
2                       0.26
4                       0.26
8                       0.26
16                      0.28
32                      0.28
64                      0.29
128                     0.37
256                     0.41
512                     0.59
1024                    0.67
2048                    0.82
4096                    1.84
8192                    2.87
16384                   6.08
32768                   7.41
65536                  13.61
131072                 26.57
262144                 52.64
524288                105.97
1048576               222.40
2097152               465.10
4194304              1012.47
openmpi@4.0.5%gcc@10.2.0 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                      10.28
2                      19.34
4                      42.26
8                      83.46
16                    164.13
32                    324.85
64                    485.20
128                   555.57
256                   780.44
512                  1966.57
1024                 3317.96
2048                 5698.26
4096                 5435.04
8192                 7341.09
16384                9374.84
32768                9604.81
65536               10343.82
131072              10547.65
262144              10633.56
524288              10821.02
1048576             11198.21
2097152             11255.25
4194304             11245.19
openmpi@4.0.5%gcc@10.2.0 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.34
1                       0.26
2                       0.27
4                       0.27
8                       0.26
16                      0.28
32                      0.27
64                      0.29
128                     0.35
256                     0.39
512                     0.56
1024                    0.62
2048                    0.82
4096                    1.83
8192                    2.84
16384                   4.51
32768                   7.05
65536                  13.04
131072                 25.40
262144                 49.67
524288                101.44
1048576               213.60
2097152               449.50
4194304              1015.41
openmpi@4.0.5%gcc@10.2.0 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                      10.37       10365194.97
2                      20.89       10445449.46
4                      42.01       10502615.81
8                      82.53       10316124.75
16                    134.42        8401133.10
32                    326.40       10199918.40
64                    482.15        7533639.47
128                   541.72        4232202.43
256                   844.77        3299868.88
512                  1934.74        3778796.35
1024                 3358.12        3279409.26
2048                 5631.86        2749933.51
4096                 5249.47        1281609.19
8192                 7565.36         923506.13
16384                9630.88         587822.14
32768                9627.43         293805.86
65536               10377.71         158351.34
131072              10713.18          81735.07
262144              10763.38          41059.05
524288              11098.16          21168.05
1048576             11137.85          10621.89
2097152             11165.99           5324.36
4194304             11589.32           2763.11
openmpi@4.0.5%gcc@10.2.0 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       1.22
2                       1.24
4                       1.33
8                       1.37
16                      1.41
32                      1.50
64                      1.65
128                     2.28
256                     2.74
512                     3.21
1024                    5.18
2048                    8.39
4096                   15.13
8192                   23.96
16384                  37.69
32768                  60.45
65536                 105.05
131072                207.32
262144                454.50
524288               1079.18
1048576              3381.93
openmpi@4.0.5%gcc@10.2.0 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                      10.88
2                       0.77
4                       0.81
8                       0.83
16                      0.92
32                      0.89
64                      0.98
128                     1.19
256                     1.20
512                     1.68
1024                    2.01
2048                    6.14
4096                   13.43
8192                   19.31
16384                  19.47
32768                  55.10
65536                 108.51
131072                156.39
262144                276.45
524288                487.15
1048576               906.07
openmpi@4.0.5%gcc@10.2.0 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.30              4.50              3.42              0.00
2                       8.24              4.49              3.67              0.00
4                      25.49             18.46             13.60             48.33
8                      23.05             14.98             10.66             24.30
16                      8.97              5.07              4.23              7.95
32                     10.61              4.91              3.88              0.00
64                     27.07             18.55             15.58             45.26
128                    23.25             14.27             11.68             23.16
256                     8.55              4.46              3.90              0.00
512                    43.50             10.83              9.86              0.00
1024                   38.27             19.17             17.50              0.00
2048                   71.23             24.41             18.78              0.00
4096                   67.93             23.86             20.61              0.00
8192                  105.64             51.58             46.25              0.00
16384                  96.12             38.05             35.83              0.00
32768                 226.13            106.48             95.77              0.00
65536                 380.82            170.28            151.67              0.00
131072                456.47            231.07            220.91              0.00
262144               1153.73            586.89            564.01              0.00
524288               3277.99           1581.95           1522.76              0.00
1048576              9185.23           3890.75           3611.96              0.00
openmpi@4.0.5%gcc@10.2.0 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.23              1.33              0.66              0.00
2                       2.28              1.36              0.65              0.00
4                       2.18              1.33              0.66              0.00
8                       2.19              1.32              0.64              0.00
16                      2.21              1.33              0.66              0.00
32                      2.42              1.45              0.69              0.00
64                      2.51              1.49              0.75              0.00
128                     2.49              1.49              0.78              0.00
256                     2.49              1.49              0.77              0.00
512                     5.71              2.81              2.12              0.00
1024                    7.37              3.54              2.71              0.00
2048                    9.00              4.24              3.31              0.00
4096                   16.90              7.42              6.61              0.00
8192                   24.49             10.17              9.27              0.00
16384                  33.33             13.94             12.70              0.00
32768                  61.92             31.80             29.79              0.00
65536                 135.08             60.33             57.12              0.00
131072                240.65            115.20            109.98              0.00
262144                400.93            200.72            192.61              0.00
524288                821.35            402.81            387.20              0.00
1048576              1868.55            879.32            845.82              0.00
openmpi@4.0.5%gcc@10.2.0 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.70
2                       0.87
4                       0.70
8                       0.69
16                      0.85
32                      0.87
64                      0.93
128                     1.18
256                     1.23
512                     3.27
1024                    3.73
2048                    4.71
4096                    8.76
8192                   13.62
16384                  20.87
32768                  34.03
65536                  61.70
131072                128.97
262144                272.85
524288                583.17
1048576              1186.23
openmpi@4.0.5%gcc@10.2.0 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.76
2                       3.21
4                       3.24
8                       3.25
16                      3.36
32                      3.48
64                      3.62
128                     4.52
256                     4.49
512                     5.10
1024                    7.20
2048                   10.59
4096                   16.67
8192                   23.66
16384                  32.38
32768                  60.61
65536                 108.58
131072                213.62
262144                453.97
524288               1062.41
1048576              3206.85
openmpi@4.0.5%gcc@10.2.0 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.26
2                       0.27
4                       0.26
8                       0.26
16                      0.27
32                      0.28
64                      0.30
128                     0.32
256                     0.35
512                     1.42
1024                    1.88
2048                    2.86
4096                    8.35
8192                   11.79
16384                  15.98
32768                  22.12
65536                  41.15
131072                 89.97
262144                156.22
524288                306.21
1048576               654.95
openmpi@4.0.5%gcc@10.2.0 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.24              4.59              3.68              0.95
2                       8.17              4.46              3.45              0.00
4                       8.24              4.52              3.49              0.00
8                       8.44              4.66              3.72              0.00
16                     30.31              4.96              3.95              0.00
32                      8.78              4.66              3.70              0.00
64                      8.97              4.68              3.73              0.00
128                     8.40              4.45              3.69              0.00
256                     8.74              4.48              4.03              0.00
512                    13.39              6.70              6.00              0.00
1024                   16.20              8.17              7.27              0.00
2048                   19.35              9.97              8.83              0.00
4096                   42.78             21.57             20.01              0.00
8192                   53.73             27.47             25.86              0.00
16384                  74.41             37.45             35.50              0.00
32768                 141.15             69.91             66.37              0.00
65536                 220.19            107.57            102.85              0.00
131072                516.92            228.66            219.46              0.00
262144               1192.13            575.24            553.27              0.00
524288               3419.14           1659.57           1590.75              0.00
1048576              7370.70           3757.83           3610.54              0.00
openmpi@4.0.5%gcc@10.2.0 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       3.09              1.84              1.04              0.00
8                       2.84              1.70              1.00              0.00
16                      2.84              1.71              1.03              0.00
32                      2.89              1.71              1.04              0.00
64                      3.12              1.82              1.14              0.00
128                     3.13              1.84              1.23              0.00
256                     3.34              1.98              1.30              0.00
512                     6.08              3.05              2.02              0.00
1024                    6.26              3.09              2.42              0.00
2048                    7.41              3.38              2.73              0.00
4096                   14.47              5.95              5.26              0.00
8192                   21.27              8.53              7.53              0.00
16384                  33.06             12.51             11.32              0.00
32768                  55.10             20.12             18.76              0.00
65536                  99.88             36.25             34.29              0.00
131072                190.84             68.70             65.49              0.00
262144                439.96            152.08            141.73              0.00
524288                828.87            304.98            292.90              0.00
1048576              1624.38            576.41            554.37              0.00
openmpi@4.0.5%gcc@10.2.0 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.72
2                       0.75
4                       0.72
8                       0.82
16                      0.87
32                      0.95
64                      1.02
128                     1.13
256                     1.26
512                     3.23
1024                    3.67
2048                    4.51
4096                    8.79
8192                   13.14
16384                  20.30
32768                  32.95
65536                  60.65
131072                129.12
262144                267.51
524288                558.60
1048576              1145.98
openmpi@4.0.5%gcc@10.2.0 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.44
8                       1.33
16                      1.40
32                      1.40
64                      1.47
128                     2.03
256                     1.96
512                     3.08
1024                    3.67
2048                    4.78
4096                    9.95
8192                   17.82
16384                  24.85
32768                  55.51
65536                 195.47
131072                212.41
262144                530.38
524288                497.26
1048576              1622.75
openmpi@4.0.5%gcc@10.2.0 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.25
2                       0.26
4                       0.27
8                       0.26
16                      0.29
32                      0.29
64                      0.32
128                     0.34
256                     0.36
512                     2.89
1024                    1.94
2048                    2.51
4096                   14.23
8192                   33.35
16384                  18.84
32768                  34.41
65536                  62.91
131072                120.43
262144                536.44
524288                744.09
1048576              1875.46
openmpi@4.0.5%gcc@10.2.0 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.42              5.07              4.16              0.00
2                      14.57              5.48              4.53              0.00
4                       9.32              4.43              3.39              0.00
8                       9.01              5.13              3.82              0.00
16                     11.14              5.49              4.52              0.00
32                      9.92              5.55              4.41              0.96
64                     13.61              6.03              5.03              0.00
128                     9.65              4.42              3.77              0.00
256                   161.06            146.03            138.85             89.17
512                    14.67              7.50              6.53              0.00
1024                   20.05             10.87              9.44              2.79
2048                   23.36             11.83             10.64              0.00
4096                   45.09             22.59             21.02              0.00
8192                   50.71             25.86             24.31              0.00
16384                  69.34             35.11             33.06              0.00
32768                 119.00             61.18             58.16              0.59
65536                 222.23            108.96            104.37              0.00
131072                462.69            229.00            219.45              0.00
262144               1182.68            574.61            550.97              0.00
524288               3394.05           1681.42           1614.47              0.00
1048576              7347.68           3784.38           3637.75              2.05
openmpi@4.0.5%gcc@10.2.0 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.18              2.20              1.40             29.89
2                       3.09              2.17              1.49             38.01
4                       3.12              2.19              1.45             35.92
8                       3.08              2.16              1.46             36.58
16                      3.10              2.18              1.61             42.69
32                      3.18              2.22              1.58             39.40
64                      3.44              2.43              1.75             42.18
128                     4.02              2.92              2.06             46.57
256                     4.51              3.26              2.51             50.38
512                     5.70              3.98              2.93             41.42
1024                    5.74              4.05              3.15             46.14
2048                    6.33              4.48              3.76             50.86
4096                   13.13              6.06              5.24              0.00
8192                   20.06              8.74              7.63              0.00
16384                  28.86             12.29             11.27              0.00
32768                  55.80             27.48             25.83              0.00
65536                  99.19             49.40             46.91              0.00
131072                614.78            198.16            190.01              0.00
262144                469.50            236.78            227.11              0.00
524288               1042.14            539.52            511.67              1.77
1048576              1996.32            990.83            954.38              0.00
openmpi@4.0.5%gcc@10.2.0 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.72
2                       3.42
4                       3.34
8                       3.53
16                      3.53
32                      3.51
64                      3.44
128                     3.91
256                     3.85
512                     4.81
1024                    6.01
2048                    6.96
4096                   26.77
8192                   34.19
16384                  48.61
32768                  80.26
65536                 131.80
131072                249.33
262144                574.35
524288               1885.06
1048576              3904.07
openmpi@4.0.5%gcc@10.2.0 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.62              4.79              4.15              7.65
2                       8.47              4.73              3.87              3.45
4                       7.74              4.30              3.23              0.00
8                       7.80              4.43              3.47              2.83
16                      7.91              4.44              3.26              0.00
32                      8.49              4.99              4.09             14.44
64                      8.05              4.43              3.38              0.00
128                     8.18              4.46              3.65              0.00
256                     8.88              4.74              4.09              0.00
512                    12.73              6.65              5.74              0.00
1024                   15.78              8.28              7.37              0.00
2048                   18.54              9.92              8.89              3.02
4096                   48.96             22.78             21.10              0.00
8192                   53.55             28.65             26.80              7.07
16384                  66.01             32.96             31.07              0.00
32768                 117.23             60.99             58.08              3.17
65536                 213.07            109.03            104.35              0.30
131072                428.04            231.48            222.19             11.54
262144                825.62            409.05            392.77              0.00
524288               2317.95           1121.12           1078.53              0.00
1048576              5630.99           2959.13           2845.89              6.11
openmpi@4.0.5%gcc@10.2.0 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
              7.21              3.76              3.03              0.00
openmpi@4.0.5%gcc@10.2.0 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.41              2.43              1.49             34.28
2                       3.31              2.31              1.56             35.77
4                       3.29              2.30              1.52             34.40
8                       3.27              2.29              1.55             36.79
16                      3.30              2.30              1.59             37.67
32                      4.06              3.05              1.61             37.14
64                      3.31              2.29              1.63             37.31
128                     3.63              2.58              1.90             44.92
256                     4.21              3.13              1.97             44.84
512                     4.17              2.74              2.03             29.51
1024                    4.65              3.15              2.28             34.15
2048                    5.60              3.85              2.98             41.11
4096                   14.61              6.55              5.76              0.00
8192                   20.31              8.84              7.78              0.00
16384                  29.24             12.76             11.58              0.00
32768                  55.95             27.74             26.05              0.00
65536                 102.89             50.38             47.91              0.00
131072                219.79            110.21            105.43              0.00
262144                472.65            241.59            231.85              0.34
524288                948.40            470.37            448.87              0.00
1048576              1873.14            943.41            907.49              0.00
openmpi@4.0.5%gcc@10.2.0 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.20
2                       2.87
4                       2.92
8                       2.99
16                      3.18
32                      3.12
64                      3.36
128                     3.98
256                     4.42
512                     7.60
1024                   12.15
2048                    8.59
4096                   27.04
8192                   42.99
16384                  51.07
32768                  87.07
65536                 145.29
131072                261.75
262144                648.33
524288               1802.77
1048576              3712.81
openmpi@4.0.5%gcc@10.2.0 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       7.95              4.47              3.42              0.00
2                       9.72              4.44              3.31              0.00
4                       7.99              4.45              3.33              0.00
8                       8.48              4.84              3.70              1.81
16                      8.19              4.47              3.37              0.00
32                      8.31              4.44              3.42              0.00
64                      8.25              4.58              3.84              4.56
128                     8.37              4.55              3.64              0.00
256                     8.61              4.60              4.04              0.72
512                    12.92              6.90              6.12              1.62
1024                   15.69              8.11              7.17              0.00
2048                   19.17              9.86              8.68              0.00
4096                   42.95             22.44             20.84              1.60
8192                   59.71             26.03             23.53              0.00
16384                  70.19             37.00             34.80              4.63
32768                 129.68             67.75             64.29              3.67
65536                 246.75            135.33            129.61             14.04
131072                426.09            216.07            206.75              0.00
262144               2569.53            505.61            385.29              0.00
524288               5755.63           2266.28           2028.62              0.00
1048576              7544.05           3784.44           3576.31              0.00
openmpi@4.0.5%gcc@10.2.0 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.54              2.20              1.40              4.51
2                       3.34              2.14              1.36             12.25
4                       3.46              2.16              1.37              4.72
8                       3.38              2.15              1.42             13.39
16                      3.39              2.14              1.44             13.50
32                      3.43              2.15              1.47             12.63
64                      3.57              2.20              1.56             12.12
128                     3.99              2.50              1.74             15.07
256                     4.54              2.86              2.29             26.80
512                     5.77              3.20              2.44              0.00
1024                    5.59              3.29              2.67             14.17
2048                    6.33              3.73              2.94             11.72
4096                   11.04              6.36              5.37             12.76
8192                   15.66              8.34              7.37              0.72
16384                  22.62             12.17             10.97              4.69
32768                  38.44             22.14             20.74             21.42
65536                  64.75             36.79             34.68             19.36
131072                119.87             68.82             65.56             22.14
262144                325.43            177.37            127.86              0.00
524288                454.86            260.44            250.31             22.33
1048576               992.71            554.17            533.54             17.81
openmpi@4.0.5%gcc@10.2.0 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.65
8                       0.63
16                      0.66
32                      0.72
64                      0.70
128                     0.89
256                     0.91
512                     1.57
1024                    1.96
2048                    3.55
4096                    6.73
8192                   13.47
16384                  12.60
32768                  22.60
65536                  48.43
131072                112.42
262144                171.72
524288                318.26
1048576               711.84
openmpi@4.0.5%gcc@10.2.0 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             1.13
openmpi@4.0.5%gcc@10.2.0 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       7.33              3.70              2.85              0.00
8                       7.87              3.92              2.94              0.00
16                      7.94              3.91              3.14              0.00
32                      8.04              4.03              3.20              0.00
64                      8.29              4.03              3.25              0.00
128                     8.45              4.91              4.05             12.57
256                     8.94              4.88              3.52              0.00
512                    11.17              6.15              4.91              0.00
1024                   15.70              7.00              5.69              0.00
2048                   17.20              8.88              7.75              0.00
4096                   33.54             16.28             14.86              0.00
8192                   48.31             23.10             21.58              0.00
16384                  77.78             38.94             36.31              0.00
32768                 131.49             63.41             60.15              0.00
65536                 200.65             78.73             75.13              0.00
131072                264.26            132.59            126.86              0.00
262144                406.62            191.79            183.94              0.00
524288                819.28            431.90            414.77              6.60
1048576              1500.57            715.71            684.27              0.00
openmpi@4.0.5%gcc@10.2.0 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.36              1.47              0.74              0.00
2                       2.33              1.46              0.68              0.00
4                       2.17              1.33              0.66              0.00
8                       2.32              1.44              0.66              0.00
16                      2.17              1.32              0.67              0.00
32                      2.16              1.32              0.66              0.00
64                      2.19              1.31              0.70              0.00
128                     2.33              1.45              0.69              0.00
256                     2.42              1.48              0.75              0.00
512                     6.00              3.24              2.41              0.00
1024                    7.42              3.54              2.78              0.00
2048                    9.03              4.07              3.37              0.00
4096                   17.11              7.28              6.40              0.00
8192                   23.25              9.74              8.81              0.00
16384                  33.54             14.18             13.12              0.00
32768                 117.31             30.61             28.54              0.00
65536                 110.75             55.95             53.17              0.00
131072                206.94            102.17             97.51              0.00
262144                399.76            199.75            191.90              0.00
524288                817.04            393.96            378.83              0.00
1048576              1852.96            863.81            823.29              0.00
openmpi@4.0.5%gcc@10.2.0 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.90
8                       0.90
16                      1.14
32                      1.62
64                      1.63
128                     1.66
256                     1.82
512                     2.03
1024                    2.74
2048                    3.46
4096                    4.37
8192                    6.77
16384                  11.18
32768                  17.90
65536                  29.37
131072                143.40
262144                311.43
524288                238.13
1048576               485.78
openmpi@4.0.5%gcc@10.2.0 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.04
2                       0.04
4                       0.04
8                       0.04
16                      0.04
32                      0.06
64                      0.09
128                     0.13
256                     0.21
512                     0.38
1024                    0.73
2048                    1.40
4096                    2.76
8192                    5.47
16384                  10.88
32768                  21.78
65536                  43.19
131072                 85.75
262144                171.81
524288                344.80
1048576               705.78
2097152              1382.28
4194304              2898.16
openmpi@4.0.5%gcc@10.2.0 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.03
openmpi@4.0.5%gcc@10.2.0 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      38.06
2                      83.71
4                     166.62
8                     347.79
16                    590.09
32                   1436.99
64                   2685.48
128                  5189.77
256                  8934.36
512                 17054.05
1024                26622.58
2048                25854.96
4096                28298.44
8192                29196.62
16384               15138.39
32768               12197.15
65536               11307.57
131072               9081.13
262144               5538.31
524288               4620.61
1048576              4389.38
2097152              4537.80
4194304              4620.11
openmpi@4.0.5%gcc@10.2.0 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      40.22
2                      93.56
4                     196.51
8                     387.98
16                    794.01
32                   1548.98
64                   3051.44
128                  4762.35
256                  9543.23
512                 16965.54
1024                28947.00
2048                37793.66
4096                42299.34
8192                37253.95
16384               24669.79
32768               21559.68
65536               19357.82
131072              12349.99
262144               8401.48
524288               8055.50
1048576              8819.54
2097152              8568.92
4194304              8722.11
openmpi@4.0.5%gcc@10.2.0 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.03
8                       0.03
16                      0.03
32                      0.03
64                      0.03
128                     0.03
256                     0.03
512                     0.03
1024                    0.04
2048                    0.05
4096                    0.07
8192                    0.22
16384                   0.42
32768                   1.48
65536                   2.99
131072                  5.88
262144                 11.86
524288                 23.80
1048576                66.13
2097152               170.82
4194304               354.49
openmpi@4.0.5%gcc@10.2.0 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.03
openmpi@4.0.5%gcc@10.2.0 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       3.43
2                       3.41
4                       3.34
8                       2.88
16                      2.83
32                      2.89
64                      2.87
128                     2.97
256                     3.19
512                     3.59
1024                    4.24
2048                    5.57
4096                    8.76
8192                   13.11
16384                  21.57
32768                  36.95
65536                  64.06
131072                121.12
262144                228.07
524288                461.47
1048576               930.96
2097152              1864.70
4194304              4036.32
openmpi@4.0.5%gcc@10.2.0 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.03
2                       0.03
4                       0.03
8                       0.03
16                      0.03
32                      0.04
64                      0.03
128                     0.03
256                     0.03
512                     0.03
1024                    0.04
2048                    0.05
4096                    0.07
8192                    0.10
16384                   0.35
32768                   1.23
65536                   2.43
131072                  4.09
262144                 11.28
524288                 21.28
1048576                63.26
2097152               168.99
4194304               344.35
openmpi@4.0.5%gcc@10.2.0 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      44.78
2                      75.72
4                     179.78
8                     343.52
16                    657.44
32                   1539.76
64                   3093.73
128                  5080.63
256                 11024.46
512                 15065.95
1024                21198.15
2048                26584.51
4096                24428.03
8192                20434.38
16384               12665.05
32768               10903.49
65536               10134.39
131072               7697.89
262144               4732.12
524288               4208.56
1048576              4339.57
2097152              4590.90
4194304              4664.82
-- linux-debian9-cascadelake / gcc@10.2.0 -----------------------
hwloc@2.2.0
libiconv@1.16
libpciaccess@0.16
libxml2@2.9.10
mpich@3.3.2
osu-micro-benchmarks@5.6.3
xz@5.2.5
zlib@1.2.11
mpich@3.3.2%gcc@10.2.0 osu_hello
# OSU MPI Hello World Test v5.6.3
This is a test with 2 processes
mpich@3.3.2%gcc@10.2.0 osu_init
# OSU MPI Init Test v5.6.3
nprocs: 2, min: 13 ms, max: 13 ms, avg: 13 ms
mpich@3.3.2%gcc@10.2.0 osu_bibw
# OSU MPI Bi-Directional Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       4.49
2                       8.90
4                      16.60
8                      24.44
16                     51.20
32                    101.86
64                    184.96
128                   367.82
256                   729.47
512                  1344.61
1024                 2305.73
2048                 4078.16
4096                 7323.97
8192                10087.03
16384               11819.53
32768               11794.57
65536                8770.44
131072              10813.23
262144              12659.09
524288              12620.10
1048576             10952.85
2097152              9800.37
4194304              9503.74
mpich@3.3.2%gcc@10.2.0 osu_latency
# OSU MPI Latency Test v5.6.3
# Size          Latency (us)
0                       0.28
1                       0.28
2                       0.31
4                       0.30
8                       0.30
16                      0.35
32                      0.35
64                      0.37
128                     0.39
256                     0.46
512                     0.49
1024                    0.61
2048                    0.84
4096                    1.21
8192                    2.10
16384                   3.78
32768                   5.94
65536                   7.78
131072                 13.82
262144                 21.09
524288                 42.15
1048576                95.25
2097152               210.11
4194304               453.47
mpich@3.3.2%gcc@10.2.0 osu_latency_mt
# Number of Sender threads: 1
# Number of Receiver threads: 2
# OSU MPI Multi-threaded Latency Test v5.6.3
# Size          Latency (us)
0                       2.70
1                       2.90
2                       2.80
4                       2.70
8                       2.98
16                      3.04
32                      2.42
64                      2.31
128                     2.07
256                     1.98
512                     2.36
1024                    3.26
2048                    4.05
4096                    4.84
8192                    6.26
16384                   7.54
32768                   9.54
65536                   9.98
131072                 13.44
262144                 24.09
524288                 45.24
1048576               103.14
2097152               223.08
4194304               461.02
mpich@3.3.2%gcc@10.2.0 osu_multi_lat
# OSU MPI Multi Latency Test v5.6.3
# Size          Latency (us)
0                       0.25
1                       0.28
2                       0.32
4                       0.29
8                       0.30
16                      0.31
32                      0.32
64                      0.34
128                     0.36
256                     0.40
512                     0.45
1024                    0.59
2048                    0.82
4096                    1.20
8192                    2.05
16384                   3.75
32768                   6.07
65536                   7.69
131072                 12.26
262144                 20.87
524288                 42.67
1048576               101.50
2097152               215.64
4194304               447.52
mpich@3.3.2%gcc@10.2.0 osu_bw
# OSU MPI Bandwidth Test v5.6.3
# Size      Bandwidth (MB/s)
1                       4.18
2                       7.82
4                      16.27
8                      32.82
16                     71.54
32                    139.06
64                    269.07
128                   544.18
256                   915.65
512                  1801.53
1024                 2857.66
2048                 4417.84
4096                 6795.50
8192                 8578.21
16384               10321.63
32768               10772.92
65536                7741.17
131072               9056.12
262144              10136.30
524288              10994.34
1048576             10755.14
2097152              9759.75
4194304              9511.89
mpich@3.3.2%gcc@10.2.0 osu_latency_mp
# OSU MPI Multi-process Latency Test v5.6.3
# Number of forked processes in sender: 2
# Number of forked processes in receiver: 2
# Size          Latency (us)
0                       0.26
1                       0.29
2                       0.32
4                       0.32
8                       0.30
16                      0.32
32                      0.33
64                      0.37
128                     0.38
256                     0.45
512                     0.46
1024                    0.59
2048                    0.83
4096                    1.19
8192                    2.11
16384                   3.76
32768                   6.02
65536                   7.76
131072                 12.19
262144                 21.91
524288                 42.63
1048576                96.19
2097152               211.39
4194304               449.45
mpich@3.3.2%gcc@10.2.0 osu_mbw_mr
# OSU MPI Multiple Bandwidth / Message Rate Test v5.6.3
# [ pairs: 1 ] [ window size: 64 ]
# Size                  MB/s        Messages/s
1                       4.49        4485886.63
2                       8.87        4436216.43
4                      17.41        4352772.11
8                      35.54        4442089.29
16                     69.52        4345021.95
32                    142.38        4449452.28
64                    232.44        3631923.37
128                   547.30        4275811.66
256                   999.27        3903380.19
512                  1755.51        3428732.35
1024                 3150.46        3076624.14
2048                 4603.55        2247826.63
4096                 6324.48        1544063.60
8192                 7803.77         952608.17
16384                9880.14         603036.02
32768               10430.69         318319.27
65536                7493.02         114334.40
131072               8603.82          65641.93
262144               9912.07          37811.54
524288              10608.73          20234.56
1048576              9969.63           9507.78
2097152              9630.93           4592.39
4194304              9571.84           2282.11
mpich@3.3.2%gcc@10.2.0 osu_allgather

# OSU MPI Allgather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       2.10
2                       1.93
4                       1.93
8                       1.95
16                      1.93
32                      1.98
64                      2.22
128                     2.34
256                     3.85
512                     3.10
1024                    3.75
2048                    5.41
4096                    8.08
8192                   18.11
16384                  27.05
32768                  51.94
65536                 128.91
131072                251.03
262144                505.62
524288               1191.15
1048576              3284.28
mpich@3.3.2%gcc@10.2.0 osu_bcast

# OSU MPI Broadcast Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.63
2                       0.50
4                       0.45
8                       0.44
16                      0.46
32                      0.56
64                      0.57
128                     0.65
256                     0.74
512                     0.99
1024                    1.13
2048                    1.51
4096                    2.40
8192                    4.04
16384                  11.16
32768                  15.25
65536                  25.74
131072                 44.46
262144                 88.25
524288                182.65
1048576               345.93
mpich@3.3.2%gcc@10.2.0 osu_ialltoall

# OSU MPI Non-blocking All-to-All Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                      11.86              5.30              4.35              0.00
2                      13.12              5.36              4.57              0.00
4                       9.76              5.20              4.31              0.00
8                      11.48              5.71              4.77              0.00
16                     11.46              5.84              4.92              0.00
32                     12.72              6.43              5.38              0.00
64                     12.86              6.83              5.87              0.00
128                    13.08              6.71              5.54              0.00
256                    14.53              7.76              6.67              0.00
512                    10.83              5.74              5.04              0.00
1024                   12.46              6.69              5.70              0.00
2048                   14.76              7.75              6.80              0.00
4096                   19.77             10.31              9.34              0.00
8192                   27.85             14.50             13.36              0.03
16384                  47.76             24.46             22.89              0.00
32768                  93.24             47.29             44.77              0.00
65536                 279.60            143.58            137.31              0.94
131072                514.41            255.85            245.12              0.00
262144               1543.09            800.32            768.22              3.31
524288               6544.62           2290.38           2104.51              0.00
1048576             14153.85           6504.75           6124.84              0.00
mpich@3.3.2%gcc@10.2.0 osu_igatherv

# OSU MPI Non-blocking Gatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.22              1.32              0.70              0.00
2                       2.16              1.30              0.67              0.00
4                       2.15              1.30              0.68              0.00
8                       2.18              1.31              0.67              0.00
16                      2.19              1.30              0.67              0.00
32                      2.23              1.35              0.67              0.00
64                      2.21              1.30              0.67              0.00
128                     2.26              1.32              0.73              0.00
256                     2.49              1.48              0.83              0.00
512                     2.66              1.58              0.95              0.00
1024                    2.71              1.54              1.04              0.00
2048                    3.26              1.78              1.33              0.00
4096                    4.50              2.59              1.76              0.00
8192                    6.01              3.43              2.63              1.82
16384                   8.71              4.99              4.21             11.62
32768                  14.77              8.27              7.30             10.93
65536                  85.81             32.40             30.45              0.00
131072                154.24             56.93             54.04              0.00
262144                320.71            113.30            108.19              0.00
524288                987.62            295.25            282.88              0.00
1048576              1518.50            576.84            553.84              0.00
mpich@3.3.2%gcc@10.2.0 osu_scatter

# OSU MPI Scatter Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.62
2                       0.64
4                       0.60
8                       0.51
16                      0.53
32                      0.61
64                      0.70
128                     0.91
256                     1.04
512                     1.29
1024                    1.87
2048                    3.16
4096                    5.12
8192                    7.75
16384                  13.87
32768                  26.43
65536                  48.55
131072                 95.42
262144                195.97
524288                406.03
1048576               895.37
mpich@3.3.2%gcc@10.2.0 osu_allgatherv

# OSU MPI Allgatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       2.24
2                       2.27
4                       2.14
8                       2.18
16                      2.04
32                      2.08
64                      2.24
128                     2.52
256                     2.54
512                     3.26
1024                    3.80
2048                    5.27
4096                    8.13
8192                   14.61
16384                  44.02
32768                  64.99
65536                 125.98
131072                239.96
262144                529.89
524288               1254.22
1048576              3427.11
mpich@3.3.2%gcc@10.2.0 osu_gather

# OSU MPI Gather Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.78
2                       0.94
4                       0.86
8                       0.81
16                      0.90
32                      0.87
64                      1.01
128                     1.00
256                     1.01
512                     1.10
1024                    1.85
2048                    2.19
4096                    3.65
8192                    4.84
16384                   7.76
32768                  13.41
65536                  24.27
131072                 44.66
262144                 87.32
524288                181.90
1048576               413.42
mpich@3.3.2%gcc@10.2.0 osu_ialltoallv

# OSU MPI Non-blocking All-to-Allv Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       9.62              4.46              3.61              0.00
2                       8.31              4.53              3.62              0.00
4                       8.44              4.60              3.73              0.00
8                       8.42              4.46              3.56              0.00
16                      8.44              4.53              3.61              0.00
32                      8.68              4.68              3.81              0.00
64                      8.61              4.64              3.88              0.00
128                     9.08              4.88              4.14              0.00
256                    11.00              5.52              4.38              0.00
512                    10.61              5.61              4.78              0.00
1024                   12.97              7.00              6.16              2.99
2048                   15.01              7.89              6.83              0.00
4096                   19.65             10.29              9.30              0.00
8192                   27.82             14.60             13.34              0.94
16384                  49.62             25.88             24.29              2.24
32768                  92.01             46.99             44.47              0.00
65536                 245.40            112.99            106.84              0.00
131072                413.54            206.82            197.99              0.00
262144               1244.46            586.62            562.27              0.00
524288               3307.64           1604.42           1538.53              0.00
1048576              6879.18           3513.09           3377.55              0.34
mpich@3.3.2%gcc@10.2.0 osu_ireduce

# OSU MPI Non-blocking Reduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       3.70              2.21              1.55              3.68
8                       3.60              2.16              1.55              7.59
16                      3.56              2.32              1.61             23.16
32                      3.45              2.03              1.39              0.00
64                      3.28              2.00              1.40              8.18
128                     3.28              1.98              1.42              8.66
256                     3.73              2.01              1.45              0.00
512                     3.85              2.23              1.57              0.00
1024                    3.86              2.27              1.86             14.84
2048                    4.86              2.98              2.16             12.98
4096                   12.66              6.19              5.23              0.00
8192                   15.42              7.54              6.42              0.00
16384                  24.17             11.47             10.32              0.00
32768                  65.37             24.19             17.88              0.00
65536                 105.37             44.80             38.48              0.00
131072                317.46            147.65            141.41              0.00
262144                674.73            330.52            317.21              0.00
524288               1383.13            686.76            659.48              0.00
1048576              2939.86           1460.83           1403.84              0.00
mpich@3.3.2%gcc@10.2.0 osu_scatterv

# OSU MPI Scatterv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.76
2                       0.83
4                       0.79
8                       0.77
16                      0.78
32                      0.83
64                      0.89
128                     1.03
256                     1.43
512                     1.71
1024                    2.45
2048                    2.38
4096                    3.42
8192                    6.09
16384                   9.19
32768                  16.26
65536                  33.40
131072                 72.61
262144                148.60
524288                301.68
1048576               610.50
mpich@3.3.2%gcc@10.2.0 osu_allreduce

# OSU MPI Allreduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       2.69
8                       2.52
16                      2.77
32                      3.07
64                      3.10
128                     3.51
256                     3.51
512                     3.91
1024                    4.82
2048                    5.94
4096                   10.01
8192                   13.16
16384                  23.33
32768                  35.17
65536                  60.99
131072                192.26
262144                400.61
524288                964.30
1048576              2236.22
mpich@3.3.2%gcc@10.2.0 osu_gatherv

# OSU MPI Gatherv Latency Test v5.6.3
# Size       Avg Latency(us)
1                       0.33
2                       0.31
4                       0.30
8                       0.55
16                      0.36
32                      0.36
64                      0.34
128                     0.36
256                     0.37
512                     0.44
1024                    0.56
2048                    0.78
4096                    1.24
8192                    2.03
16384                   3.65
32768                   6.30
65536                  34.87
131072                 55.14
262144                104.25
524288                230.24
1048576               532.37
mpich@3.3.2%gcc@10.2.0 osu_ialltoallw

# OSU MPI Non-blocking All-to-Allw Personalized Exchange Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       8.78              4.69              3.99              0.00
2                       8.21              4.46              3.71              0.00
4                       8.13              4.44              3.53              0.00
8                       8.11              4.46              3.69              1.15
16                      8.17              4.45              3.47              0.00
32                      8.27              4.45              3.51              0.00
64                      8.42              4.45              3.72              0.00
128                     8.97              4.63              4.02              0.00
256                    10.43              5.56              4.52              0.00
512                    10.65              5.57              4.77              0.00
1024                   12.44              6.61              5.62              0.00
2048                   14.61              7.72              6.77              0.00
4096                   19.49             10.26              9.27              0.49
8192                   28.86             14.56             13.20              0.00
16384                  52.84             27.45             25.65              1.01
32768                  98.40             50.96             48.11              1.41
65536                 238.88            120.07            114.12              0.00
131072                529.91            238.25            228.36              0.00
262144               1294.57            672.54            645.06              3.57
524288               3235.24           1657.43           1586.57              0.55
1048576             12858.31           6992.70           6514.55              9.96
mpich@3.3.2%gcc@10.2.0 osu_iscatter

# OSU MPI Non-blocking Scatter Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       3.27              1.73              1.10              0.00
2                       3.24              1.85              1.14              0.00
4                       3.22              1.67              1.05              0.00
8                       3.40              1.72              1.08              0.00
16                      3.46              1.79              1.12              0.00
32                      3.45              1.80              1.13              0.00
64                      3.59              1.96              1.21              0.00
128                     3.87              2.28              1.37              0.00
256                     3.93              2.27              1.51              0.00
512                     4.19              2.30              1.76              0.00
1024                    5.73              3.38              2.38              0.89
2048                    7.38              4.26              3.52             11.42
4096                   10.65              6.48              5.52             24.47
8192                   15.76              9.32              8.27             22.03
16384                  30.90             16.00             14.75              0.00
32768                  57.36             29.42             27.64              0.00
65536                 105.65             54.03             51.05              0.00
131072                206.99            102.52             97.78              0.00
262144                432.66            215.39            206.32              0.00
524288                906.60            433.50            412.88              0.00
1048576              2148.85           1014.97            975.13              0.00
mpich@3.3.2%gcc@10.2.0 osu_alltoall

# OSU MPI All-to-All Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.60
2                       3.55
4                       3.51
8                       3.61
16                      3.59
32                      3.91
64                      4.22
128                     4.51
256                     4.83
512                     4.82
1024                    5.33
2048                    6.59
4096                    9.26
8192                   13.92
16384                  23.08
32768                  43.13
65536                 134.81
131072                243.82
262144                690.86
524288               1829.36
1048576              3572.97
mpich@3.3.2%gcc@10.2.0 osu_iallgather

# OSU MPI Non-blocking Allgather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       7.30              4.27              3.54             14.46
2                       6.09              3.18              2.49              0.00
4                       5.77              2.97              2.29              0.00
8                       5.86              3.01              2.34              0.00
16                      5.88              3.11              2.40              0.00
32                      6.01              3.13              2.39              0.00
64                      6.17              3.26              2.59              0.00
128                     6.36              3.36              2.63              0.00
256                     7.06              3.58              2.88              0.00
512                     8.16              4.23              3.38              0.00
1024                    8.87              4.66              3.95              0.00
2048                   11.92              6.34              5.38              0.00
4096                   16.38              8.58              7.55              0.00
8192                   25.75             13.38             12.11              0.00
16384                  54.03             27.90             26.05              0.00
32768                 106.03             53.30             50.60              0.00
65536                 266.42            134.70            128.64              0.00
131072                654.05            314.21            289.63              0.00
262144                997.22            505.84            485.46              0.00
524288               2395.54           1199.42           1151.49              0.00
1048576              6936.01           3562.05           3423.95              1.46
mpich@3.3.2%gcc@10.2.0 osu_ibarrier

# OSU MPI Non-blocking Barrier Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

       Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
              4.48              2.33              1.72              0.00
mpich@3.3.2%gcc@10.2.0 osu_iscatterv

# OSU MPI Non-blocking Scatterv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.63              1.79              1.05             20.01
2                       2.32              1.48              0.90              6.13
4                       2.32              1.50              0.89              8.39
8                       2.30              1.46              0.87              3.66
16                      2.38              1.52              0.89              4.31
32                      2.38              1.53              0.94              9.22
64                      2.61              1.63              0.99              1.68
128                     2.77              1.80              1.14             14.15
256                     3.08              2.06              1.28             20.45
512                     3.29              2.18              1.50             26.38
1024                    3.83              2.63              1.79             32.61
2048                    4.51              3.16              2.35             42.68
4096                    5.81              4.14              3.32             49.89
8192                    8.61              6.36              5.41             58.33
16384                  13.54             10.27              9.14             64.26
32768                  23.28             17.74             16.34             66.07
65536                  91.06             38.22             36.01              0.00
131072                184.70             77.67             73.30              0.00
262144                376.54            154.71            147.89              0.00
524288                740.44            300.20            288.01              0.00
1048576              1552.16            621.65            597.37              0.00
mpich@3.3.2%gcc@10.2.0 osu_alltoallv

# OSU MPI All-to-Allv Personalized Exchange Latency Test v5.6.3
# Size       Avg Latency(us)
1                       3.47
2                       3.19
4                       3.31
8                       3.28
16                      3.17
32                      3.28
64                      3.86
128                     3.89
256                     3.98
512                     9.07
1024                    5.42
2048                    7.28
4096                    9.22
8192                   16.20
16384                  24.02
32768                  45.70
65536                 105.23
131072                216.67
262144                631.46
524288               1595.45
1048576              3317.13
mpich@3.3.2%gcc@10.2.0 osu_iallgatherv

# OSU MPI Non-blocking Allgatherv Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       7.22              3.50              2.62              0.00
2                       6.77              3.37              2.60              0.00
4                       5.69              3.24              2.42              0.00
8                       5.73              3.24              2.41              0.00
16                      5.71              3.25              2.45              0.00
32                      6.37              3.44              2.67              0.00
64                      7.49              3.74              2.58              0.00
128                     6.19              3.37              2.68              0.00
256                     6.67              3.53              2.92              0.00
512                     8.36              4.39              3.53              0.00
1024                   10.23              5.38              4.53              0.00
2048                   12.61              6.65              5.76              0.00
4096                   18.05              9.27              8.36              0.00
8192                   30.04             15.57             14.39              0.00
16384                  73.21             36.37             34.34              0.00
32768                 138.55             69.74             66.34              0.00
65536                 262.40            135.37            129.50              1.90
131072                504.78            256.32            245.44              0.00
262144                983.77            498.75            478.32              0.00
524288               2414.12           1170.60           1120.90              0.00
1048576             10485.22           6416.96           6169.70             34.06
mpich@3.3.2%gcc@10.2.0 osu_ibcast

# OSU MPI Non-Blocking Broadcast Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.69              1.51              0.93              0.00
2                       2.65              1.35              0.90              0.00
4                       2.66              1.33              0.88              0.00
8                       2.69              1.42              0.89              0.00
16                      2.76              1.42              0.96              0.00
32                      2.87              1.67              1.03              0.00
64                      2.97              1.71              1.04              0.00
128                     3.08              1.78              1.06              0.00
256                     3.58              2.22              1.34              0.00
512                     3.63              2.18              1.33              0.00
1024                    3.99              2.36              1.53              0.00
2048                    4.44              2.57              2.03              7.90
4096                    6.35              3.63              2.84              4.22
8192                    8.08              5.29              4.44             37.15
16384                  21.44             13.02             11.89             29.16
32768                  28.99             16.66             15.34             19.59
65536                  54.84             33.68             31.70             33.26
131072                123.12             65.84             62.24              7.98
262144                236.39            120.00            113.60              0.00
524288                487.29            241.24            231.36              0.00
1048576               943.45            394.75            368.10              0.00
mpich@3.3.2%gcc@10.2.0 osu_reduce

# OSU MPI Reduce Latency Test v5.6.3
# Size       Avg Latency(us)
4                       0.87
8                       0.87
16                      0.89
32                      0.91
64                      5.43
128                     1.20
256                     4.18
512                     4.26
1024                    4.34
2048                    1.83
4096                    6.82
8192                    6.43
16384                  21.64
32768                  42.90
65536                  27.31
131072                335.66
262144                531.78
524288               1180.43
1048576              2281.46
mpich@3.3.2%gcc@10.2.0 osu_barrier

# OSU MPI Barrier Latency Test v5.6.3
# Avg Latency(us)
             2.30
mpich@3.3.2%gcc@10.2.0 osu_iallreduce

# OSU MPI Non-blocking Allreduce Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
4                       7.55              4.29              3.47              6.08
8                      17.09              3.45              2.88              0.00
16                      7.96              3.43              2.94              0.00
32                      9.64              5.63              3.31              0.00
64                     13.04              5.07              3.38              0.00
128                    32.84             18.09             12.92              0.00
256                    10.48              5.19              3.70              0.00
512                     9.89              5.52              4.53              3.45
1024                   21.47              7.14              5.14              0.00
2048                   16.41              8.12              7.30              0.00
4096                   28.99             10.90              9.79              0.00
8192                   54.51             19.84             16.84              0.00
16384                  63.65             31.91             29.38              0.00
32768                  99.32             47.94             44.09              0.00
65536                 164.39             87.11             82.77              6.63
131072                443.97            227.88            218.44              1.08
262144                901.29            475.06            456.01              6.53
524288               2143.51           1030.55            990.23              0.00
1048576              4784.04           2284.08           2182.68              0.00
mpich@3.3.2%gcc@10.2.0 osu_igather

# OSU MPI Non-blocking Gather Latency Test v5.6.3
# Overall = Coll. Init + Compute + MPI_Test + MPI_Wait

# Size           Overall(us)       Compute(us)    Pure Comm.(us)        Overlap(%)
1                       2.96              1.88              1.20              9.82
2                       2.90              1.82              1.18              8.37
4                       2.91              1.81              1.16              5.87
8                       2.94              1.83              1.22              9.29
16                      3.12              1.91              1.20              0.00
32                      3.18              1.97              1.31              7.09
64                      3.28              2.07              1.34              9.71
128                     3.25              2.02              1.36              9.79
256                     3.50              2.11              1.45              3.73
512                     3.35              2.09              1.48             15.26
1024                    4.02              2.43              1.79             11.37
2048                    4.77              2.86              2.21             13.64
4096                    6.25              3.78              3.11             20.52
8192                    9.71              5.74              4.73             16.16
16384                  14.78              8.51              7.60             17.45
32768                  32.45             15.15             13.90              0.00
65536                  76.38             26.25             24.61              0.00
131072                141.06             48.39             45.84              0.00
262144                278.40             93.23             88.96              0.00
524288                579.10            194.50            186.11              0.00
1048576              1287.54            420.27            395.93              0.00
mpich@3.3.2%gcc@10.2.0 osu_reduce_scatter

# OSU MPI Reduce_scatter Latency Test v5.6.3
# Size       Avg Latency(us)
4                       1.14
8                       1.21
16                      2.33
32                      2.67
64                      2.18
128                     2.39
256                     2.38
512                     2.40
1024                    2.73
2048                    3.24
4096                    3.94
8192                    7.65
16384                   8.99
32768                  15.48
65536                  32.05
131072                130.75
262144                308.14
524288                185.08
1048576               370.71
mpich@3.3.2%gcc@10.2.0 osu_acc_latency
# OSU MPI_Accumulate latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.09
2                       0.08
4                       0.08
8                       0.09
16                      0.09
32                      0.10
64                      0.12
128                     0.16
256                     0.23
512                     0.37
1024                    0.65
2048                    1.19
4096                    2.27
8192                    4.45
16384                   8.84
32768                  17.69
65536                  35.46
131072                 71.56
262144                143.75
524288                298.43
1048576               591.35
2097152              1172.46
4194304              2393.00
mpich@3.3.2%gcc@10.2.0 osu_fop_latency
# OSU MPI_Fetch_and_op latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.08
mpich@3.3.2%gcc@10.2.0 osu_get_bw
# OSU MPI_Get Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      38.13
2                      79.42
4                     123.28
8                     259.99
16                    450.68
32                    933.69
64                   2025.93
128                  4004.63
256                  7999.94
512                 14467.26
1024                22586.52
2048                31814.57
4096                36049.56
8192                24828.08
16384               14883.41
32768                9228.45
65536                8972.86
131072              10539.92
262144               5770.03
524288               4713.69
1048576              4522.97
2097152              4409.72
4194304              4697.17
mpich@3.3.2%gcc@10.2.0 osu_put_bibw
# OSU MPI_Put Bi-directional Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_post/start/complete/wait
# Size      Bandwidth (MB/s)
1                      43.05
2                      93.53
4                     168.96
8                     323.17
16                    564.76
32                   1244.02
64                   2639.00
128                  4690.75
256                  9624.58
512                 18155.74
1024                29878.03
2048                46062.49
4096                53258.01
8192                39686.40
16384               30446.84
32768               24001.89
65536               22145.25
131072              13003.20
262144               8911.61
524288               8335.37
1048576              8694.08
2097152              8772.80
4194304              8862.47
mpich@3.3.2%gcc@10.2.0 osu_put_latency
# OSU MPI_Put Latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.06
2                       0.06
4                       0.06
8                       0.07
16                      0.06
32                      0.06
64                      0.07
128                     0.06
256                     0.07
512                     0.06
1024                    0.07
2048                    0.08
4096                    0.11
8192                    0.14
16384                   0.29
32768                   1.35
65536                   2.36
131072                  5.16
262144                  9.94
524288                 17.40
1048576                66.09
2097152               176.45
4194304               385.61
mpich@3.3.2%gcc@10.2.0 osu_cas_latency
# OSU MPI_Compare_and_swap latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
8                       0.10
mpich@3.3.2%gcc@10.2.0 osu_get_acc_latency
# OSU MPI_Get_accumulate latency Test v5.6.3
# Window creation: MPI_Win_create
# Synchronization: MPI_Win_lock/unlock
# Size          Latency (us)
1                       1.50
2                       1.53
4                       1.53
8                       1.47
16                      1.55
32                      1.55
64                      1.61
128                     1.83
256                     1.94
512                     2.33
1024                    2.82
2048                    3.71
4096                    5.69
8192                    9.84
16384                  17.65
32768                  30.99
65536                  62.35
131072                142.65
262144                245.20
524288                459.43
1048576               872.21
2097152              1870.86
4194304              3706.58
mpich@3.3.2%gcc@10.2.0 osu_get_latency
# OSU MPI_Get latency Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size          Latency (us)
1                       0.06
2                       0.06
4                       0.07
8                       0.05
16                      0.07
32                      0.06
64                      0.08
128                     0.08
256                     0.08
512                     0.08
1024                    0.08
2048                    0.09
4096                    0.10
8192                    0.15
16384                   0.48
32768                   1.02
65536                   2.19
131072                  5.25
262144                  8.94
524288                 18.20
1048576                64.99
2097152               173.01
4194304               363.54
mpich@3.3.2%gcc@10.2.0 osu_put_bw
# OSU MPI_Put Bandwidth Test v5.6.3
# Window creation: MPI_Win_allocate
# Synchronization: MPI_Win_flush
# Size      Bandwidth (MB/s)
1                      38.13
2                      66.94
4                     144.90
8                     254.14
16                    356.13
32                   1014.16
64                   2131.50
128                  3771.65
256                  7099.12
512                 12574.47
1024                23881.66
2048                31704.49
4096                37551.63
8192                25983.97
16384               15426.33
32768               11752.41
65536               11390.95
131072              10790.10
262144               5701.38
524288               4483.51
1048576              4334.80
2097152              4369.55
4194304              4356.56
```
