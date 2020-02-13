---
title: Backpropgation
tags:
  - 人工智能
---

## Reference Materials

- Stanford: **CS231n: Convolutional Neural Networks for Visual Recognition** by Fei-Fei Li,etc.
  - Course website: <http://cs231n.stanford.edu/2017/syllabus.html>
  - Video website: <https://www.bilibili.com/video/av17204303/?p=9&tdsourcetag=s_pctim_aiomsg>
- **Machine Learning** by Hung-yi Lee
  - Course website: <http://speech.ee.ntu.edu.tw/~tlkagk/index.html>
  - Video website: <https://www.bilibili.com/video/av9770302/from=search>

A Simple neural network code template

```python
# -*- coding: utf-8 -*
import random
import math

# Shorthand:
# "pd_" as a variable prefix means "partial derivative"
# "d_" as a variable prefix means "derivative"
# "_wrt_" is shorthand for "with respect to"
# "w_ho" and "w_ih" are the index of weights from hidden to output layer neurons and input to hidden layer neurons respectively


class NeuralNetwork:
    LEARNING_RATE = 0.5

    def __init__(self, num_inputs, num_hidden, num_outputs, hidden_layer_weights=None, hidden_layer_bias=None, output_layer_weights=None, output_layer_bias=None):
        # Your Code Here

    def init_weights_from_inputs_to_hidden_layer_neurons(self, hidden_layer_weights):
        # Your Code Here

    def init_weights_from_hidden_layer_neurons_to_output_layer_neurons(self, output_layer_weights):
        # Your Code Here

    def inspect(self):
        print('------')
        print('* Inputs: {}'.format(self.num_inputs))
        print('------')
        print('Hidden Layer')
        self.hidden_layer.inspect()
        print('------')
        print('* Output Layer')
        self.output_layer.inspect()
        print('------')

    def feed_forward(self, inputs):
        # Your Code Here

        # Uses online learning, ie updating the weights after each training case
    def train(self, training_inputs, training_outputs):
        self.feed_forward(training_inputs)

        # 1. Output neuron deltas
        # Your Code Here
        # ∂E/∂zⱼ

        # 2. Hidden neuron deltas
        # We need to calculate the derivative of the error with respect to the output of each hidden layer neuron
        # dE/dyⱼ = Σ ∂E/∂zⱼ * ∂z/∂yⱼ = Σ ∂E/∂zⱼ * wᵢⱼ
        # ∂E/∂zⱼ = dE/dyⱼ * ∂zⱼ/∂
        # Your Code Here

        # 3. Update output neuron weights
        # ∂Eⱼ/∂wᵢⱼ = ∂E/∂zⱼ * ∂zⱼ/∂wᵢⱼ
        # Δw = α * ∂Eⱼ/∂wᵢ
        # Your Code Here

        # 4. Update hidden neuron weights
        # ∂Eⱼ/∂wᵢ = ∂E/∂zⱼ * ∂zⱼ/∂wᵢ
        # Δw = α * ∂Eⱼ/∂wᵢ
        # Your Code Here

    def calculate_total_error(self, training_sets):
        # Your Code Here
        return total_error


class NeuronLayer:
    def __init__(self, num_neurons, bias):

        # Every neuron in a layer shares the same bias
        self.bias = bias if bias else random.random()

        self.neurons = []
        for i in range(num_neurons):
            self.neurons.append(Neuron(self.bias))

    def inspect(self):
        print('Neurons:', len(self.neurons))
        for n in range(len(self.neurons)):
            print(' Neuron', n)
            for w in range(len(self.neurons[n].weights)):
                print('  Weight:', self.neurons[n].weights[w])
            print('  Bias:', self.bias)

    def feed_forward(self, inputs):
        outputs = []
        for neuron in self.neurons:
            outputs.append(neuron.calculate_output(inputs))
        return outputs

    def get_outputs(self):
        outputs = []
        for neuron in self.neurons:
            outputs.append(neuron.output)
        return outputs


class Neuron:
    def __init__(self, bias):
        self.bias = bias
        self.weights = []

    def calculate_output(self, inputs):
        # Your Code Here

    def calculate_total_net_input(self):
        # Your Code Here

        # Apply the logistic function to squash the output of the neuron
        # The result is sometimes referred to as 'net' [2] or 'net' [1]
    def squash(self, total_net_input):
        # Your Code Here

        # Determine how much the neuron's total input has to change to move closer to the expected output
        #
        # Now that we have the partial derivative of the error with respect to the output (∂E/∂yⱼ) and
        # the derivative of the output with respect to the total net input (dyⱼ/dzⱼ) we can calculate
        # the partial derivative of the error with respect to the total net input.
        # This value is also known as the delta (δ) [1]
        # δ = ∂E/∂zⱼ = ∂E/∂yⱼ * dyⱼ/dzⱼ
        #
    def calculate_pd_error_wrt_total_net_input(self, target_output):
        # Your Code Here

        # The error for each neuron is calculated by the Mean Square Error method:
    def calculate_error(self, target_output):
        # Your Code Here

        # The partial derivate of the error with respect to actual output then is calculated by:
        # = 2 * 0.5 * (target output - actual output) ^ (2 - 1) * -1
        # = -(target output - actual output)
        #
        # The Wikipedia article on backpropagation [1] simplifies to the following, but most other learning material does not [2]
        # = actual output - target output
        #
        # Alternative, you can use (target - output), but then need to add it during backpropagation [3]
        #
        # Note that the actual output of the output neuron is often written as yⱼ and target output as tⱼ so:
        # = ∂E/∂yⱼ = -(tⱼ - yⱼ)
    def calculate_pd_error_wrt_output(self, target_output):
        # Your Code Here

        # The total net input into the neuron is squashed using logistic function to calculate the neuron's output:
        # yⱼ = φ = 1 / (1 + e^(-zⱼ))
        # Note that where ⱼ represents the output of the neurons in whatever layer we're looking at and ᵢ represents the layer below it
        #
        # The derivative (not partial derivative since there is only one variable) of the output then is:
        # dyⱼ/dzⱼ = yⱼ * (1 - yⱼ)
    def calculate_pd_total_net_input_wrt_input(self):
        # Your Code Here

        # The total net input is the weighted sum of all the inputs to the neuron and their respective weights:
        # = zⱼ = netⱼ = x₁w₁ + x₂w₂ ...
        #
        # The partial derivative of the total net input with respective to a given weight (with everything else held constant) then is:
        # = ∂zⱼ/∂wᵢ = some constant + 1 * xᵢw₁^(1-0) + some constant ... = xᵢ
    def calculate_pd_total_net_input_wrt_weight(self, index):
        # Your Code Here

        # An example:


nn = NeuralNetwork(2, 2, 2, hidden_layer_weights=[0.15, 0.2, 0.25, 0.3], hidden_layer_bias=0.35, output_layer_weights=[
                   0.4, 0.45, 0.5, 0.55], output_layer_bias=0.6)
for i in range(10000):
    nn.train([0.05, 0.1], [0.01, 0.99])
    print(i, round(nn.calculate_total_error([[[0.05, 0.1], [0.01, 0.99]]]), 9))
```

## Horse Colic Data Set

The description of the horse colic data set (<http://archive.ics.uci.edu/ml/datasets/Horse+Colic>) is as follows:

We aim at trying to predict if a horse with colic will live or die.

Note that we should deal with missing values in the data! Here are some options:

- Use the feature’s mean value from all the available data.
- Fill in the unknown with a special value like -1.
- Ignore the instance.
- Use a mean value from similar items.
- Use another machine learning algorithm to predict the value.

## Tasks

Given the training set `horse-colic.data` and the testing set `horse-colic.test`, implement the BP algorithm and establish a neural network to predict if horses with colic will live or die. In addition, you should calculate the accuracy rate.

## Codes and Results

### `preprocess.py`预处理

感 谢 坤 哥 的 祝 福

```python
# coding=utf-8
import numpy as np
import pandas as pd
np.set_printoptions(threshold=np.inf)

# 新建一个长度为len_vec的向量，除了第idx位为1外，其余位置的元素都是0


def onehot(idx, len_vec):
    vec = [0] * len_vec
    vec[idx] = 1
    return vec


# 初步处理训练集，把所有问号换成nan，其余不变
with open('horse-colic.data', 'r') as fr:
    train_set = []
    for line in fr.readlines():
        data = []
        splitted = line.strip().split(' ')
        for idx, x in enumerate(splitted):
            if x == '?':
                data.append(np.nan)
            else:
                data.append(x)
        train_set.append(data)
train_set = np.array(train_set)

# 初步处理测试集，把所有问号换成nan，其余不变
with open('horse-colic.test', 'r') as fr:
    test_set = []
    for line in fr.readlines():
        data = []
        splitted = line.strip().split(' ')
        for idx, x in enumerate(splitted):
            if x == '?':
                data.append(np.nan)
            else:
                data.append(x)
        test_set.append(data)
test_set = np.array(test_set)

# DataFrame中的列名
columns = ['surgery', 'age', 'hospital number', 'rectal temperature', 'pulse', 'respiratory rate', 'temperature of extremities', 'peripheral pulse', 'mucous membranes', 'capillary refill time', 'pain', 'peristalsis', 'abdominal distension', 'nasogastric tube',
           'nasogastric reflux', 'nasogastric reflux PH', 'rectal examination', 'abdomen', 'packed cell volume', 'total protein', 'abdominocentesis appearance', 'abdomcentesis total protein', 'outcome', 'surgical lesion', 'lesion type1', 'lesion type2', 'lesion type3', 'cp_data']

# 生成训练集的DataFrame
df_train = pd.DataFrame(train_set, columns=columns)
# 生成测试集的DataFrame
df_test = pd.DataFrame(test_set, columns=columns)
# 将训练集与测试集纵向合并，方便两者一起进行预处理
df_train = pd.concat([df_train, df_test])

# 删掉第3列，即'hospital number'这一列
df_train.drop('hospital number', axis=1, inplace=True)
# 将第1列中的2都换成0
df_train.ix[df_train['surgery'] == '2', 'surgery'] = '0'
# 将第2列中的9都换成0
df_train.ix[df_train['age'] == '9', 'age'] = '0'

# 下面的for循环用于拆分原数据集第25、26、27这三列，比如将03111拆分成03、1、1、1
# 拆分的主要思想是先将这三列删掉，然后依次插入12列新数据
for i in range(1, 4, 1):
    name = 'lesion type' + str(i)
    idx = df_train.columns.tolist().index(name)
    series = df_train[name]
    new_cols = np.array([[x[:2], x[2], x[3], x[4]] for x in list(series)])
    df_train.drop(name, axis=1, inplace=True)
    df_train.insert(idx, 'site' + str(i), new_cols[:, 0])
    df_train.insert(idx + 1, 'type' + str(i), new_cols[:, 1])
    df_train.insert(idx + 2, 'subtype' + str(i), new_cols[:, 2])
    df_train.insert(idx + 3, 'special code' + str(i), new_cols[:, 3])
columns = df_train.columns.tolist()

# 将训练集和测试集拆分
df_train, df_test = df_train.iloc[:300, :], df_train.iloc[300:, :]
train_set = df_train.values.astype('float')
test_set = df_test.values.astype('float')

print(train_set.shape, test_set.shape)

# 计算训练集每一列的均值
average = np.nanmean(train_set, axis=0)
# 将训练集中为nan的值替换为相应的均值
for i in range(train_set.shape[0]):
    for j in range(train_set.shape[1]):
        if np.isnan(train_set[i][j]):
            train_set[i][j] = average[j]

# 将测试集中为nan的值替换为相应的均值
for i in range(test_set.shape[0]):
    for j in range(test_set.shape[1]):
        if np.isnan(test_set[i][j]):
            test_set[i][j] = average[j]

# 保存训练集和测试集
df_train = pd.DataFrame(train_set, columns=columns)
df_test = pd.DataFrame(test_set, columns=columns)
df_train.to_csv('horse-colic-data.csv', index=0)
df_test.to_csv('horse-colic-test.csv', index=0)
```

### `BP.py`

```python
# -*- coding: utf-8 -*
import random
import math
import pandas

# Shorthand:
# "pd_" as a variable prefix means "partial derivative"
# "d_" as a variable prefix means "derivative"
# "_wrt_" is shorthand for "with respect to"
# "w_ho" and "w_ih" are the index of weights from hidden to output layer neurons and input to hidden layer neurons respectively


class NeuralNetwork:
    LEARNING_RATE = 0.5

    def __init__(self, num_inputs, num_hidden, num_outputs, hidden_layer_weights=None, hidden_layer_bias=None, output_layer_weights=None, output_layer_bias=None):
        # Your Code Here
        self.num_inputs = num_inputs
        self.hidden_layer = NeuronLayer(num_hidden, hidden_layer_bias)
        self.output_layer = NeuronLayer(num_outputs, output_layer_bias)
        self.init_weights_from_inputs_to_hidden_layer_neurons(
            hidden_layer_weights)
        self.init_weights_from_hidden_layer_neurons_to_output_layer_neurons(
            output_layer_weights)

    def init_weights_from_inputs_to_hidden_layer_neurons(self, hidden_layer_weights):
        # Your Code Here
        if hidden_layer_weights:
            cnt = 0
            for h in range(len(self.hidden_layer.neurons)):
                for _i in range(self.num_inputs):
                    self.hidden_layer.neurons[h].weights.append(
                        hidden_layer_weights[cnt])
                    cnt += 1
        else:
            for h in range(len(self.hidden_layer.neurons)):
                for _i in range(self.num_inputs):
                    self.hidden_layer.neurons[h].weights.append(
                        random.random())

    def init_weights_from_hidden_layer_neurons_to_output_layer_neurons(self, output_layer_weights):
        # Your Code Here
        if output_layer_weights:
            cnt = 0
            for o in range(len(self.output_layer.neurons)):
                for _h in range(len(self.hidden_layer.neurons)):
                    self.output_layer.neurons[o].weights.append(
                        output_layer_weights[cnt])
                    cnt += 1
        else:
            for o in range(len(self.output_layer.neurons)):
                for _h in range(len(self.hidden_layer.neurons)):
                    self.output_layer.neurons[o].weights.append(
                        random.random())

    def inspect(self):
        print('------')
        print('* Inputs: {}'.format(self.num_inputs))
        print('------')
        print('Hidden Layer')
        self.hidden_layer.inspect()
        print('------')
        print('* Output Layer')
        self.output_layer.inspect()
        print('------')

    def feed_forward(self, inputs):
        # Your Code Here
        return self.output_layer.feed_forward(self.hidden_layer.feed_forward(inputs))

    # Uses online learning, ie updating the weights after each training case
    def train(self, training_inputs, training_outputs):
        self.feed_forward(training_inputs)

        # 1. Output neuron deltas
        # Your Code Here
        pd_errors_wrt_output_neuron_total_net_input = []
        for o in range(len(self.output_layer.neurons)):
            # ∂E/∂zⱼ
            pd_errors_wrt_output_neuron_total_net_input.append(
                self.output_layer.neurons[o].calculate_pd_error_wrt_total_net_input(training_outputs[o]))

        # 2. Hidden neuron deltas
        # We need to calculate the derivative of the error with respect to the output of each hidden layer neuron
        pd_errors_wrt_hidden_neuron_total_net_input = []
        for h in range(len(self.hidden_layer.neurons)):

            # dE/dyⱼ = Σ ∂E/∂zⱼ * ∂z/∂yⱼ = Σ ∂E/∂zⱼ * wᵢⱼ
            d_error_wrt_hidden_neuron_output = 0
            for o in range(len(self.output_layer.neurons)):
                d_error_wrt_hidden_neuron_output += pd_errors_wrt_output_neuron_total_net_input[
                    o] * self.output_layer.neurons[o].weights[h]

        # ∂E/∂zⱼ = dE/dyⱼ * ∂zⱼ/∂
        # Your Code Here
            pd_errors_wrt_hidden_neuron_total_net_input.append(
                d_error_wrt_hidden_neuron_output * self.hidden_layer.neurons[h].calculate_pd_total_net_input_wrt_input())

        # 3. Update output neuron weights
        for o in range(len(self.output_layer.neurons)):
            for w_ho in range(len(self.output_layer.neurons[o].weights)):
                # ∂Eⱼ/∂wᵢⱼ = ∂E/∂zⱼ * ∂zⱼ/∂wᵢⱼ
                pd_error_wrt_weight = pd_errors_wrt_output_neuron_total_net_input[o] * self.output_layer.neurons[
                    o].calculate_pd_total_net_input_wrt_weight(w_ho)

                # Δw = α * ∂Eⱼ/∂wᵢ
                # Your Code Here
                self.output_layer.neurons[o].weights[w_ho] -= self.LEARNING_RATE * \
                    pd_error_wrt_weight

        # 4. Update hidden neuron weights
        for h in range(len(self.hidden_layer.neurons)):
            for w_ih in range(len(self.hidden_layer.neurons[h].weights)):
                # ∂Eⱼ/∂wᵢ = ∂E/∂zⱼ * ∂zⱼ/∂wᵢ
                pd_error_wrt_weight = pd_errors_wrt_hidden_neuron_total_net_input[h] * self.hidden_layer.neurons[
                    h].calculate_pd_total_net_input_wrt_weight(w_ih)

                # Δw = α * ∂Eⱼ/∂wᵢ
                # Your Code Here
                self.hidden_layer.neurons[h].weights[w_ih] -= self.LEARNING_RATE * \
                    pd_error_wrt_weight

    def calculate_total_error(self, training_sets):
        # Your Code Here
        total_error = 0
        for t in range(len(training_sets)):
            training_inputs, training_outputs = training_sets[t]
            self.feed_forward(training_inputs)
            for o in range(len(training_outputs)):
                total_error += self.output_layer.neurons[o].calculate_error(
                    training_outputs[o])
        return total_error


class NeuronLayer:
    def __init__(self, num_neurons, bias):

        # Every neuron in a layer shares the same bias
        self.bias = bias if bias else random.random()

        self.neurons = []
        for _i in range(num_neurons):
            self.neurons.append(Neuron(self.bias))

    def inspect(self):
        print('Neurons:', len(self.neurons))
        for n in range(len(self.neurons)):
            print(' Neuron', n)
            for w in range(len(self.neurons[n].weights)):
                print('  Weight:', self.neurons[n].weights[w])
            print('  Bias:', self.bias)

    def feed_forward(self, inputs):
        outputs = []
        for neuron in self.neurons:
            outputs.append(neuron.calculate_output(inputs))
        return outputs

    def get_outputs(self):
        outputs = []
        for neuron in self.neurons:
            outputs.append(neuron.output)
        return outputs


class Neuron:
    def __init__(self, bias):
        self.bias = bias
        self.weights = []

    def calculate_output(self, inputs):
        # Your Code Here
        self.inputs = inputs
        self.output = self.squash(self.calculate_total_net_input())
        return self.output

    def calculate_total_net_input(self):
        # Your Code Here
        total = 0
        for i in range(len(self.inputs)):
            total += self.inputs[i] * self.weights[i]
        return total + self.bias

        # Apply the logistic function to squash the output of the neuron
        # The result is sometimes referred to as 'net' [2] or 'net' [1]
    def squash(self, total_net_input):
        # Your Code Here
        # return 1 / (1 + math.exp(-total_net_input))
        return math.tanh(total_net_input)

        # Determine how much the neuron's total input has to change to move closer to the expected output
        #
        # Now that we have the partial derivative of the error with respect to the output (∂E/∂yⱼ) and
        # the derivative of the output with respect to the total net input (dyⱼ/dzⱼ) we can calculate
        # the partial derivative of the error with respect to the total net input.
        # This value is also known as the delta (δ) [1]
        # δ = ∂E/∂zⱼ = ∂E/∂yⱼ * dyⱼ/dzⱼ
        #
    def calculate_pd_error_wrt_total_net_input(self, target_output):
        # Your Code Here
        return self.calculate_pd_error_wrt_output(target_output) * self.calculate_pd_total_net_input_wrt_input()

        # The error for each neuron is calculated by the Mean Square Error method:
    def calculate_error(self, target_output):
        # Your Code Here
        return 0.5 * (target_output - self.output) ** 2

        # The partial derivate of the error with respect to actual output then is calculated by:
        # = 2 * 0.5 * (target output - actual output) ^ (2 - 1) * -1
        # = -(target output - actual output)
        #
        # The Wikipedia article on backpropagation [1] simplifies to the following, but most other learning material does not [2]
        # = actual output - target output
        #
        # Alternative, you can use (target - output), but then need to add it during backpropagation [3]
        #
        # Note that the actual output of the output neuron is often written as yⱼ and target output as tⱼ so:
        # = ∂E/∂yⱼ = -(tⱼ - yⱼ)
    def calculate_pd_error_wrt_output(self, target_output):
        # Your Code Here
        return -(target_output - self.output)

        # The total net input into the neuron is squashed using logistic function to calculate the neuron's output:
        # yⱼ = φ = 1 / (1 + e^(-zⱼ))
        # Note that where ⱼ represents the output of the neurons in whatever layer we're looking at and ᵢ represents the layer below it
        #
        # The derivative (not partial derivative since there is only one variable) of the output then is:
        # dyⱼ/dzⱼ = yⱼ * (1 - yⱼ)
    def calculate_pd_total_net_input_wrt_input(self):
        # Your Code Here
        return self.output * (1 - self.output)

        # The total net input is the weighted sum of all the inputs to the neuron and their respective weights:
        # = zⱼ = netⱼ = x₁w₁ + x₂w₂ ...
        #
        # The partial derivative of the total net input with respective to a given weight (with everything else held constant) then is:
        # = ∂zⱼ/∂wᵢ = some constant + 1 * xᵢw₁^(1-0) + some constant ... = xᵢ
    def calculate_pd_total_net_input_wrt_weight(self, index):
        # Your Code Here
        return self.inputs[index]


def getDataSets(filename):
    df = pandas.read_csv(filename)
    target = df['outcome']
    df = df.drop('outcome', axis=1)
    x = df.values.tolist()
    y = list(target)
    for j in range(len(x[0])):
        mi = x[0][j]
        ma = x[0][j]
        for i in range(len(x)):
            if mi > x[i][j]:
                mi = x[i][j]
            if ma < x[i][j]:
                ma = x[i][j]
        if ma != mi:
            for i in range(len(x)):
                x[i][j] = (x[i][j]-mi)/(ma-mi)
    for i in range(len(x)):
        x[i] = [x[i], [y[i]]]
    return x


if __name__ == '__main__':
    '''
    # An example:
    nn = NeuralNetwork(2, 2, 2, hidden_layer_weights=[0.15, 0.2, 0.25, 0.3], hidden_layer_bias=0.35, output_layer_weights=[
        0.4, 0.45, 0.5, 0.55], output_layer_bias=0.6)
    for i in range(10000):
        nn.train([0.05, 0.1], [0.01, 0.99])
        print(i, round(nn.calculate_total_error(
            [[[0.05, 0.1], [0.01, 0.99]]]), 9))
    '''

    training_sets = getDataSets("horse-colic-data.csv")
    testing_sets = getDataSets("horse-colic-test.csv")

    nn = NeuralNetwork(len(training_sets[0][0]), 10, len(training_sets[0][1]))
    for i in range(10000):
        training_inputs, training_outputs = random.choice(training_sets)
        nn.train(training_inputs, training_outputs)
        print(i, nn.calculate_total_error(testing_sets))

    total_error = 0
    acc = 0
    for t in range(len(testing_sets)):
        testing_inputs, testing_outputs = testing_sets[t]
        nn.feed_forward(testing_inputs)
        outputs = nn.output_layer.get_outputs()
        cnt = 0
        for o in range(len(testing_outputs)):
            total_error += nn.output_layer.neurons[o].calculate_error(
                testing_outputs[o])
            if abs(testing_outputs[o]-outputs[o]) < 1:
                cnt = cnt+1
        if cnt == len(testing_outputs):
            acc = acc+1
    print(total_error)
    print(acc/len(testing_sets))
```
