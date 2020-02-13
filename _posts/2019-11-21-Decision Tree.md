---
title: Decision Tree
tags:
  - 人工智能
---

## Decision Tree

### ID3

ID3 (Iterative Dichotomiser 3) was developed in 1986 by Ross Quinlan. The algorithm creates a multiway tree, finding for each node (i.e. in a greedy manner) the categorical feature that will yield the largest information gain for categorical targets. Trees are grown to their maximum size and then a pruning step is usually applied to improve the ability of the tree to generalise to unseen data.

#### Algorithm

- Begins with the original set $S$ as the root node.
- Calculate the entropy of every attribute $a$ of the data set $S$.
- Partition the set $S$ into subsets using the attribute for which the resulting entropy after splitting is minimized; or, equivalently, information gain is maximum.
- Make a decision tree node containing that attribute.
- Recur on subsets using remaining attributes.

#### Stop Cases

- every element in the subset belongs to the same class; in which case the node is turned into a leaf node and labelled with the class of the examples.
- there are no more attributes to be selected, but the examples still do not belong to the same class. In this case, the node is made a leaf node and labelled with the most common class of the examples in the subset.
- there are no examples in the subset, which happens when no example in the parent set was found to match a specific value of the selected attribute.

#### ID3 shortcomings

- ID3 does not guarantee an optimal solution.
- ID3 can overfit the training data.
- ID3 is harder to use on continuous data.

#### Entropy

Entropy $H(S)$ is a measure of the amount of uncertainty in the set $S$.

$H(S)=\sum_{x\in X}-p(x)\log_2p(x)$

where

- $S$ is the current dataset for which entropy is being calculated
- $X$ is the set of classes in $S$
- $p(x)$ is the proportion of the number of elements in class $x$ to the number of elements in set $S$.

#### Information gain

Information gain $IG(A)$ is the measure of the difference in entropy from before to after the set $S$ is split on an attribute $A$. In other words, how much uncertainty in $S$ was reduced after splitting set $S$ on attribute $A$.

$IG(S,A)=H(S)-\sum_{t\in T}p(t)H(t)=H(S)-H(S\ |\ A)$

where

- $H(S)$ is the entropy of set $S$
- $T$ is the subsets created from splitting set $S$ by attribute $A$ such that $S=\cup_{t\in T}t$
- $p(t)$ is the proportion of the number of elements in $t$ to the number of elements in set $S$
- $H(t)$ is the entropy of subset $t$.

### C4.5 and CART

C4.5 is the successor to ID3 and removed the restriction that features must be categorical by dynamically defining a discrete attribute (based on numerical variables) that partitions the continuous attribute value into a discrete set of intervals. C4.5 converts the trained trees (i.e. the output of the ID3 algorithm) into sets of if-then rules. These accuracy of each rule is then evaluated to determine the order in which they should be applied. Pruning is done by removing a rule’s precondition if the accuracy of the rule improves without it.

C5.0 is Quinlan’s latest version release under a proprietary license. It uses less memory and builds smaller rulesets than C4.5 while being more accurate.

CART (Classification and Regression Trees) is very similar to C4.5, but it differs in that it supports numerical target variables (regression) and does not compute rule sets. CART constructs binary trees using the feature and threshold that yield the largest information gain at each node.

### 一些反例

1. [内容丰富，但有不少错误](https://github.com/scutan90/DeepLearning-500-questions/blob/master/ch02_%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E5%9F%BA%E7%A1%80/%E7%AC%AC%E4%BA%8C%E7%AB%A0_%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E5%9F%BA%E7%A1%80.md)
2. [维基百科](https://en.wikipedia.org/wiki/Decision_tree_learning)
3. [完全抄袭《机器学习实战》](https://blog.csdn.net/moxigandashu/article/details/71305273?locationNum=9&fps=1)
4. [部分抄袭《机器学习实战》](https://blog.csdn.net/wzmsltw/article/details/51057311)

## Datasets

The [UCI dataset](http://archive.ics.uci.edu/ml/index.php) is the most widely used dataset for machine learning. If you are interested in other datasets in other areas, you can refer to <https://www.zhihu.com/question/63383992/answer/222718972>.

Today's experiment is conducted with the **Adult Data Set** which can be found in <http://archive.ics.uci.edu/ml/datasets/Adult>.

| Data Set Characteristics:  | Multivariate         | Number of Instances:  | 48842 | Area:               | Social     |
| -------------------------- | -------------------- | --------------------- | ----- | ------------------- | ---------- |
| Attribute Characteristics: | Categorical, Integer | Number of Attributes: | 14    | Date Donated:       | 1996-05-01 |
| Associated Tasks:          | Classification       | Missing Values?       | Yes   | Number of Web Hits: | 1655259    |

You can also find 3 related files in the current folder, [adult.name](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.names) is the description of **Adult Data Set**, [adult.data](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data) is the training set, and [adult.test](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.test) is the testing set. There are 14 attributes in this dataset:

```markdown
income: >50K, <=50K.

1. age: continuous.
2. workclass: Private, Self-emp-not-inc, Self-emp-inc, Federal-gov, Local-gov,
   State-gov, Without-pay, Never-worked.
3. fnlwgt: continuous.
4. education: Bachelors, Some-college, 11th, HS-grad, Prof-school, Assoc-acdm,
   Assoc-voc, 9th, 7th-8th, 12th, Masters, 5. 1st-4th, 10th, Doctorate, 5th-6th,
   Preschool.
5. education-num: continuous.
6. marital-status: Married-civ-spouse, Divorced, Never-married, Separated,
   Widowed, Married-spouse-absent, Married-AF-spouse.
7. occupation: Tech-support, Craft-repair, Other-service, Sales,
   Exec-managerial, Prof-specialty, Handlers-cleaners, Machine-op-inspct,
   Adm-clerical,Farming-fishing,Transport-moving,Priv-house-serv,Protective-serv,
   Armed-Forces.
8. relationship: Wife,Own-child,Husband,Not-in-family,Other-relative,Unmarried.
9. race: White, Asian-Pac-Islander, Amer-Indian-Eskimo, Other, Black.
10. sex: Female, Male.
11. capital-gain: continuous.
12. capital-loss: continuous.
13. hours-per-week: continuous.
14. native-country: United-States, Cambodia,England,Puerto-Rico,Canada,Germany,
    Outlying-US(Guam-USVI-etc),India,Japan,Greece, South,China,Cuba,Iran,Honduras,
    Philippines, Italy, Poland, Jamaica, Vietnam, Mexico, Portugal, Ireland, France,
    Dominican-Republic,Laos,Ecuador,Taiwan, Haiti, Columbia,Hungary,Guatemala,
    Nicaragua,Scotland,Thailand,Yugoslavia,El-Salvador, Trinadad&Tobago,Peru,Hong,
    Holand-Netherlands.
```

Prediction task is to determine whether a person makes over 50K a year.

## Tasks

Given the training dataset [adult.data](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data) and the testing dataset [adult.test](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.test), please accomplish the prediction task to determine whether a person makes over 50K a year in [adult.test](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.test) by using ID3 (or C4.5, CART) algorithm (C++ or Python), and compute the accuracy.

- You can process the continuous data with \textbf{bi-partition} method.
- You can use prepruning or postpruning to avoid the overfitting problem.
- You can assign probability weights to solve the missing attributes (data) problem.

## Codes and Results

### Codes`ID3.cpp`

按照`csv`格式读入，然后进行数据清洗。我写的 ID3 决策树框架接受一个`vector<vector<int>>`用于训练，其中每一行是一个训练数据的离散值，第 0 列代表要预测的标签。由于 ID3 算法仅支持离散值的预测，这里我直接将连续的数据清洗掉了，这也许是预测成功率不那么高的原因吧（就是菜，别找借口了）。

代码总量仅**145**行，而核心的决策树代码仅**55**行！

```cpp
#include <bits/stdc++.h>
using namespace std;
vector<vector<string>> read_csv(string s)
{
	vector<vector<string>> r;
	for (ifstream fin(s); getline(fin, s);)
	{
		r.push_back({});
		for (istringstream sin(s); getline(sin, s, ',');)
			r.back().push_back(s);
	}
	return r;
}
void clean_data_test(
	vector<vector<string>> _data,
	vector<vector<string>> _test,
	vector<vector<int>> &data,
	vector<vector<int>> &test)
{
	int cols = 0;
	for (auto &it : _data)
	{
		cols = max(cols, (int)it.size());
		for (auto &jt : it)
		{
			string s;
			for (auto c : jt)
				if (isgraph(c) && c != '.')
					s += c;
			jt = s;
		}
	}
	for (auto &it : _test)
	{
		cols = max(cols, (int)it.size());
		for (auto &jt : it)
		{
			string s;
			for (auto c : jt)
				if (isgraph(c) && c != '.')
					s += c;
			jt = s;
		}
	}
	vector<int> valid_col{14, 1, 3, 5, 6, 7, 8, 9, 13}; //保留离散列
	map<int, map<string, int>> mp;
	for (int i : valid_col)
	{
		for (const auto &it : _data)
			if (it.size() == cols)
				if (!mp[i].count(it[i]))
					mp[i].emplace(it[i], mp[i].size());
		for (const auto &it : _test)
			if (it.size() == cols)
				if (!mp[i].count(it[i]))
					mp[i].emplace(it[i], mp[i].size());
	}
	data.clear();
	for (const auto &it : _data)
		if (it.size() == cols)
		{
			data.push_back({});
			for (auto id : valid_col)
				data.back().push_back(mp[id][it[id]]);
		}
	test.clear();
	for (const auto &it : _test)
		if (it.size() == cols)
		{
			test.push_back({});
			for (auto id : valid_col)
				test.back().push_back(mp[id][it[id]]);
		}
}
struct IterativeDichotomiser3
{
	int val, dim;						 //这个点的值，这个点的特征维度
	map<int, IterativeDichotomiser3> ch; //划分维度对应取值的子节点
	IterativeDichotomiser3(const vector<vector<int>> &data)
	{
		pair<double, int> p{-1e9, -1};
		map<int, int> mp;
		for (const auto &it : data)
			++mp[it[0]]; //用于统计这一维的频数
		double orgin_entropy = 0;
		for (auto it : mp)
		{
			p = max(p, {it.second, it.first});
			double pr = (double)it.second / data.size();
			orgin_entropy -= pr * log2(pr);
		}
		val = p.second;
		if (mp.size() < 2) //剪枝，只有一类
			return;
		p = {-1e9, -1};
		for (int i = 1; i < data[0].size(); ++i) //i==0是类别标签
			if (data[0][i] >= 0)				 //选择未删除的维度
			{
				double gain = orgin_entropy; //要计算第i维的信息增益
				map<int, map<int, int>> mp;
				for (const auto &it : data)
					++mp[it[i]][it[0]];
				for (const auto &it : mp)
				{
					double subset = 0, entropy = 0;
					for (auto jt : it.second) //计算划分出的子集大小
						subset += jt.second;
					for (auto jt : it.second) //计算子集信息熵
						entropy -= (jt.second / subset) * log2(jt.second / subset);
					gain -= entropy * subset / data.size();
				}
				p = max(p, {gain, i}); //选择信息增益最大的特征作为结点的特征
			}
		dim = p.second;
		if (dim < 0) //未找到可用于划分的维度，同样结束
			return;
		map<int, vector<vector<int>>> mmp;
		for (const auto &it : data)
		{
			mmp[it[dim]].push_back(it);
			mmp[it[dim]].back().at(dim) = -1; //删除这一维的信息
		}
		for (const auto &it : mmp)
			ch.emplace(it);
	}
	int ask(const vector<int> &test) const
	{
		return ch.count(test[dim]) ? ch.at(test[dim]).ask(test) : val;
	}
};
int main()
{
	vector<vector<int>> data, test;
	clean_data_test(
		read_csv("adult.data"),
		read_csv("adult.test"),
		data,
		test);
	IterativeDichotomiser3 id3(data);
	double success = 0;
	for (const auto &it : test)
		if (id3.ask(it) == it[0])
			success += 1;
	cout << success / test.size();
}
```

运行下述指令编译。

```bash
g++ ID3.cpp -o ID3 -O3 -std=c++11
```

计时运行并得到预测准确率。

```bash
$ time ./ID3
0.814385
real    0m0.266s
user    0m0.219s
sys     0m0.000s
```

### Codes`DT.py`

自己手动实现完 C++版本的决策树之后，再来和 sklearn 库里面实现的决策树进行一个比较~由于是直接调包实现的数据读入、清洗还有决策树算法，这里代码非常的少了…

```python
from sklearn.tree import DecisionTreeClassifier
import pandas
import numpy


def get_data_set(filename):
    data = pandas.read_csv(filename, names=(
        "age, workclass, fnlwgt, education, education-num, marital-status, occupation, relationship, race, sex, capital-gain, capital-loss, hours-per-week, native-country, income").split(', '))
    target = data['income']
    data = data.drop('income', axis=1)
    numeric_features = [c for c in data if data[c].dtype.kind in (
        'i', 'f')]  # 提取数值类型为整数或浮点数的变量
    numeric_data = data[numeric_features]
    data = data.drop(numeric_features, 1)
    # pandas.factorize即可将分类变量转换为数值表示
    data = data.apply(lambda x: pandas.factorize(x)[0])
    # apply运算将转换函数应用到每一个变量维度
    features = pandas.concat([numeric_data, data], axis=1)
    # 收入水平 ">50K" 记为1，“<=50K” 记为0
    return features.values.astype(numpy.float32), (target.values == ' >50K').astype(numpy.int32)


#X_train, y_train = get_data_set('https://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data')
#X_test, y_test = get_data_set('https://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.test')
X_train, y_train = get_data_set('adult.data')
X_test, y_test = get_data_set('adult.test')
clf = DecisionTreeClassifier(max_depth=48)
clf.fit(X_train, y_train)
print(clf.score(X_train, y_train, sample_weight=None))
```

运行下述指令得到预测准确率。

```bash
$ python DT.py
0.9999692884125181
```

是我太菜了，告辞…
