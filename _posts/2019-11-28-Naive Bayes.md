---
title: Naive Bayes
tags:
  - 人工智能
---

## Naive Bayes

Naive Bayes is a simple technique for constructing classifiers: models that assign class labels to problem instances, represented as vectors of feature values, where the class labels are drawn from some finite set. It is not a single algorithm for training such classifiers, but a family of algorithms based on a common principle: all naive Bayes classifiers assume that **the value of a particular feature is independent of the value of any other feature**, given the class variable.

For example, a fruit may be considered to be an apple if it is red, round, and about 10 cm in diameter. A naive Bayes classifier considers each of these features to contribute independently to the probability that this fruit is an apple, regardless of any possible correlations between the color, roundness, and diameter features.

Naive Bayes methods are a set of supervised learning algorithms based on applying Bayes' theorem with the "naive" assumption of conditional independence between every pair of features given the value of the class variable. Bayes' theorem states the following relationship, given class variable $y$ and dependent feature vector $x_1$ through $x_n$:

$P(y\ \mid \ x_1,...,x_n)=\frac{P(y)P(x_1,...,x_n\ \mid\ y)}{P(x_1,...,x_n)}$

Using the naive conditional independence assumption that

$P(x_i\ \mid\ y,x_1,...,x_{i-1},x_{x+1},...,x_n)=P(x_i\ \mid\ y)$,

for all $i$, this relationship is simplified to

$P(y\ \mid x_1,...,x_n)=\frac{P(y)\prod_{i=1}^n P(x_i\ \mid\ y)}{P(x_1,...,x_n)}$

Since $P(x_1,...,x_n)$ is constant given the input, we can use the following classification rule:

$P(y\ \mid x_1,...,x_n)\propto P(y)\prod_{i=1}^n P(x_i\ \mid\ y)$

$\hat{y}=\arg\max\limits_y P(y)\prod^n_{i=1}P(x_i\ \mid\ y),$
and we can use Maximum A Posteriori (MAP) estimation to estimate $P(y)$ and $P(x_i\ \mid\ y)$, the former is then the relative frequency of class $y$ in the training set.

The different naive Bayes classifiers differ mainly by the assumptions they make regarding the distribution of $P(x_i\ \mid\ y)$.

- When attribute values are discrete, $P(x_i\ \mid\ y)$ can be easily computed according to the training set.
- When attribute values are continuous, an assumption is made that the values associated with each class are distributed according to Gaussian i.e., Normal Distribution. For example, suppose the training data contains a continuous attribute $x$. We first segment the data by the class, and then compute the mean and variance of $x$ in each class. Let $\mu_k$ be the mean of the values in $x$ associated with class $y_k$, and let $\sigma_k^2$ be the variance of the values in $x$ associated with class $y_k$. Suppose we have collected some observation value $x_i$. Then, the probability distribution of $x_i$ given a class $y_k$, $P(x_i\ \mid y_k)$ can be computed by plugging $x_i$ into the equation for a Normal distribution parameterized by $\mu_k$ and $\sigma_k^2$. That is,$P(x=x_i\ mid\ y=y_k)=\frac{1}{\sqrt{2\pi\sigma_k^2}}e^{-\frac{(x_i-\mu_k)^2}{2\sigma_k^2}}$

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

Given the training dataset [adult.data](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data) and the testing dataset [adult.test](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.test), please accomplish the prediction task to determine whether a person makes over 50K a year in [adult.test](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.test) by using Naive Bayes algorithm (C++ or Python), and compute the accuracy.

Note: keep an eye on the discrete and continuous attributes.

## Codes and Results

### Codes`NB.cpp`

按照`csv`格式读入，然后进行数据清洗。我写的朴素贝叶斯分类器接受一个`vector<vector<int>>`用于训练，其中每一行是一个训练数据的离散值，第 0 列代表要预测的标签。这里我直接将连续的数据清洗掉了。

代码总量仅**114**行，而核心的分类器代码仅**25**行！

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
struct NaiveBayes
{
	map<int, map<int, map<int, int>>> cnt;
	NaiveBayes(const vector<vector<int>> &data)
	{
		for (const auto &v : data)
			for (int i = 1; i < v.size(); ++i)
				++cnt[v[0]][i][v[i]];
	}
	int ask(const vector<int> &v)
	{
		double ymax = -1e30;
		int ans = -1;
		for (const auto &p : cnt)
		{
			double y = 0;
			for (int i = 1; i < v.size(); ++i)
				if (p.second.at(i).count(v[i]))
					y += log(p.second.at(i).at(v[i]));
			if (ymax < y)
				ymax = y, ans = p.first;
		}
		return ans;
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
	NaiveBayes nb(data);
	double success = 0;
	for (const auto &it : test)
		if (nb.ask(it) == it[0])
			success += 1;
	cout << success / test.size();
}
```

运行下述指令编译。

```bash
g++ NB.cpp -o NB -O3 -std=c++11
```

计时运行并得到预测准确率。

```bash
$ time ./NB
0.763774
real    0m0.203s
user    0m0.156s
sys     0m0.047s
```

### Codes`NB.py`

自己手动实现完 C++版本的分类器之后，再来和 sklearn 库里面实现的朴素贝叶斯分类器进行一个比较~由于是直接调包实现的数据读入、清洗还有分类器算法，这里代码非常的少了…

```python
from sklearn.naive_bayes import BernoulliNB
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
clf = BernoulliNB()
clf.fit(X_train, y_train)
print(clf.score(X_train, y_train, sample_weight=None))
```

```bash
$ python NB.py
0.8060870366389239
```
