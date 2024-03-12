---
title: "运行 mlperf-inference v3.0 的 dlrm 多卡测试"
---

尝试跑了一下 mlperf，发现文档写的有亿点点烂，并在上面花费了几天跑通多卡，以下记录一下最佳实践。

clone 源码。

```shell
mkdir -p $HOME/mlcommons
cd $HOME/mlcommons
git clone --recurse-submodules --depth=1 https://github.com/mlcommons/training.git
git clone --recurse-submodules -b v3.0 --depth=1 https://github.com/mlcommons/inference.git
```

下载预训练模型。

```shell
mkdir -p $HOME/mlcommons/model
cd $HOME/mlcommons/model
wget https://dlrm.s3-us-west-1.amazonaws.com/models/tb00_40M.pt # 这个贼大，有 90G
# wget https://dlrm.s3-us-west-1.amazonaws.com/models/tb0875_10M.pt
cp tb00_40M.pt dlrm_terabyte.pytorch
# cp tb0875_10M.pt dlrm_kaggle.pytorch
```

只支持 py3.7。

```shell
spack load gcc@7.5.0 cuda cmake
spack load py-pip ^ python@3.7.16
cd $HOME/mlcommons/inference/loadgen
python3 -m pip install --prefix $HOME/mlcommons/software-python-3.7 .
python3 -m pip install --prefix $HOME/mlcommons/software-python-3.7 torch torchvision scikit-learn numpy pydot torchviz protobuf tqdm onnxruntime onnx opencv-python
```

生成数据。由于是测试推理，这里直接生成即可。

```shell
spack load gcc@7.5.0 cuda cmake
spack load py-mlperf-logging ^ python@3.7.16
spack load py-pip ^ python@3.7.16

export PYTHONPATH=$HOME/mlcommons/software-python-3.7/lib/python3.7/site-packages:$PYTHONPATH
rm -rf $HOME/mlcommons/fake_criteo
cd $HOME/mlcommons/inference/recommendation/dlrm/pytorch/tools
./make_fake_criteo.sh terabyte
mv ./fake_criteo $HOME/mlcommons
```

然后就可以开跑啦～

```shell
spack load gcc@7.5.0 cuda cmake
spack load py-mlperf-logging ^ python@3.7.16
spack load py-pip ^ python@3.7.16

export DATA_DIR=$HOME/mlcommons/fake_criteo
export MODEL_DIR=$HOME/mlcommons/model
export DLRM_DIR=$HOME/mlcommons/training/recommendation/dlrm
export CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7,8 # 根据机器上的显卡自行修改！
export PYTHONPATH=$HOME/mlcommons/software-python-3.7/lib/python3.7/site-packages:$PYTHONPATH

# python3 -c 'import sys; print(sys.path); import mlperf_loadgen;'

cd $HOME/mlcommons/inference/recommendation/dlrm/pytorch

./run_local.sh pytorch dlrm terabyte gpu --scenario Offline --max-ind-range=40000000 --samples-to-aggregate-quantile-file=./tools/dist_quantile.txt --max-batchsize=2048 --samples-per-query-offline=204800 --accuracy --mlperf-bin-loader
```
