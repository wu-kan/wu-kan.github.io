---
title: Lab8 Navie Bayes应用实践
tags:
  - 机器学习
---

## 实验目的

利用 python 实现 kMeans 算法

## 实验简介

利用 python 的文本处理能力将文档切分成词，通过集合元素的唯一性生成词汇列 表（不包括重复词汇），进而构建词向量（词集向量或词袋向量），从词向量计算概率，然后 构建分类器对邮件文档进行垃圾邮件分类。代码文件：bayes.py

## 实验环境

### 硬件

所用机器型号为 VAIO Z Flip 2016

- Intel(R) Core(TM) i7-6567U CPU @3.30GHZ 3.31GHz
- 8.00GB RAM

### 软件

- Windows 10, 64-bit (Build 17763) 10.0.17763
- Visual Studio Code 1.39.2
  - Python 2019.10.41019：九月底发布的 VSCode Python 插件支持在编辑器窗口内原生运行 juyter nootbook 了，非常赞！
  - Remote - WSL 0.39.9：配合 WSL，在 Windows 上获得 Linux 接近原生环境的体验。
- Windows Subsystem for Linux [Ubuntu 18.04.2 LTS]：WSL 是以软件的形式运行在 Windows 下的 Linux 子系统，是近些年微软推出来的新工具，可以在 Windows 系统上原生运行 Linux。
  - Python 3.7.4 64-bit ('anaconda3':virtualenv)：安装在 WSL 中。

## 实验过程

- 利用 sklearn 中 BernoulliNB 分类该邮件数据集
- bayes.py 中的语句“from numpy import \* ”用语句“import numpy as np”代替，修改其中对应的代码，使其能够正常执行。
- 将词集向量用 TF-IDF 词向量替代，测试分析结果

```python
# 利用 sklearn中 BernoulliNB分类该邮件数据集
# bayes.py中的语句“from numpy import * ”用语句“import numpy as np”代替，修改其中对应的代码，使其能够正常执行。
# 将词集向量用 TF-IDF词向量替代，测试分析结果
# coding=utf-8
'''
项目名称：
作者
日期
'''

# 导入必要库
from sklearn import feature_extraction  # 导入sklearn库, 以获取文本的tf-idf值
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
import numpy as np
from sklearn.naive_bayes import BernoulliNB

# 创建实验样本


def loadDataSet():
    postingList = [['my', 'dog', 'has', 'flea', 'problems', 'help', 'please'],
                   ['maybe', 'not', 'take', 'him', 'to', 'dog', 'park', 'stupid'],
                   ['my', 'dalmation', 'is', 'so', 'cute', 'I', 'love', 'him'],
                   ['stop', 'posting', 'stupid', 'worthless', 'garbage'],
                   ['mr', 'licks', 'ate', 'my', 'steak',
                       'how', 'to', 'stop', 'him'],
                   ['quit', 'buying', 'worthless', 'dog', 'food', 'stupid']]
    # 1 代表侮辱性文字, 0 代表正常言论
    classVec = [0, 1, 0, 1, 0, 1]
    # postingList为词条切分后的文档集合，classVec为类别标签集合
    return postingList, classVec


def createVocabList(dataSet):
    vocabSet = set([])
    for docment in dataSet:
        # 两个集合的并集
        vocabSet = vocabSet | set(docment)
    # 转换成列表
    return list(vocabSet)


def setOfWords2Vec(vocabList, inputSet):
    # 创建一个与词汇表等长的向量，并将其元素都设置为0
    returnVec = [0]*len(vocabList)
    for word in inputSet:
        if word in vocabList:
            # 查找单词的索引
            returnVec[vocabList.index(word)] = 1
        else:
            print("the word: %s is not in my vocabulary" % word)
    return returnVec


def train(trainMat, trainCategory):
    # trainMat:训练样本的词向量矩阵，每一行为一个邮件的词向量
    # trainGategory:对应的类别标签，值为0，1表示正常，垃圾
    numTrain = len(trainMat)
    numWords = len(trainMat[0])
    pAbusive = sum(trainCategory)/float(numTrain)
    p0Num = np.ones(numWords)
    p1Num = np.ones(numWords)
    p0Denom = 2.0
    p1Denom = 2.0
    for i in range(numTrain):
        if trainCategory[i] == 1:

            p1Num += trainMat[i]

            p1Denom += sum(trainMat[i])
        else:

            p0Num += trainMat[i]

            p0Denom += sum(trainMat[i])
    # 类1中每个单词的概率
    p1Vec = p1Num/p1Denom
    p0Vec = p0Num/p0Denom
    # 类0中每个单词的概率
    return p0Vec, p1Vec, pAbusive


def classfy(vec2classfy, p0Vec, p1Vec, pClass1):
    p1 = sum(vec2classfy*p1Vec)+np.log(pClass1)
    p0 = sum(vec2classfy*p0Vec)+np.log(1-pClass1)
    if p1 > p0:
        return 1
    else:
        return 0

# 对邮件的文本划分成词汇，长度小于2的默认为不是词汇，过滤掉即可。返回一串小写的拆分后的邮件信息。


def textParse(bigString):
    import re
    listOfTokens = re.split(r'\W+', bigString)
    return [tok.lower() for tok in listOfTokens if len(tok) > 2]


def bagOfWords2Vec(vocabList, inputSet):
    # vocablist为词汇表，inputSet为输入的邮件
    returnVec = [0]*len(vocabList)
    for word in inputSet:
        if word in vocabList:
            # 查找单词的索引
            returnVec[vocabList.index(word)] = 1
        else:
            print("the word is not in my vocabulary")
    return returnVec

# 将词集向量用 TF-IDF词向量替代，测试分析结果

def TfidfVec(get_texts):
    mat = CountVectorizer()
    tf = TfidfTransformer()
    tfidf = tf.fit_transform(mat.fit_transform(get_texts))
    word = mat.get_feature_names()  # 单词的名称
    weight = tfidf.toarray()  # 权重矩阵, 在此示范中矩阵为(1, n)
    return weight


def spamTest():
    fullTest = []
    docList = []
    classList = []
    # it only 25 doc in every class
    for i in range(1, 26):
        wordList = textParse(open('email/spam/%d.txt' %
                                  i, encoding="ISO-8859-1").read())
        docList.append(wordList)
        fullTest.extend(wordList)
        classList.append(1)
        wordList = textParse(open('email/ham/%d.txt' %
                                  i, encoding="ISO-8859-1").read())
        docList.append(wordList)
        fullTest.extend(wordList)
        classList.append(0)
    # create vocabulary
    vocabList = createVocabList(docList)
    trainSet = list(range(50))
    testSet = []
    # choose 10 sample to test ,it index of trainMat
    for i in range(10):
        randIndex = int(np.random.uniform(0, len(trainSet)))  # num in 0-49
        testSet.append(trainSet[randIndex])
        del(trainSet[randIndex])
    trainMat = []
    trainClass = []
    for docIndex in trainSet:
        trainMat.append(bagOfWords2Vec(vocabList, docList[docIndex]))
        trainClass.append(classList[docIndex])
    # p0, p1, pSpam = train(np.array(trainMat), np.array(trainClass))
    # 保留下两行而将上一行注释掉，即可利用 sklearn中 BernoulliNB分类该邮件数据集
    clf = BernoulliNB()
    clf.fit(np.array(trainMat), np.array(trainClass))
    errCount = 0
    for docIndex in testSet:
        wordVec = bagOfWords2Vec(vocabList, docList[docIndex])
        # if classfy(np.array(wordVec), p0, p1, pSpam) != classList[docIndex]:
        # 保留下两行而将上一行注释掉，即可利用 sklearn中 BernoulliNB分类该邮件数据集
        if clf.predict(np.array([wordVec])) != classList[docIndex]:
            errCount += 1
            print(("classfication error"), docList[docIndex])

    print(("the error rate is "), float(errCount)/len(testSet))

if __name__ == '__main__':
    spamTest()
```

运行结果如下，可以看到效果还是很不错的。

```bash
the error rate is  0.0
```

- 编程实现 PPT 中的例 1

```python
# 编程实现 PPT中的例 1
import numpy as np
from sklearn.naive_bayes import GaussianNB

if __name__ == '__main__':
    X = np.array([[0,2,0,0],[0,2,0,1],[1,2,0,0],[2,1,0,0],[2,0,1,0],
                    [2,0,1,1],[1,0,1,1],[0,1,0,0],[0,0,1,0],[2,1,1,0],
                    [0,1,1,1],[1,1,0,1],[1,2,1,0],[2,1,0,1]])
    y = np.array([0,0,1,1,1,0,1,0,1,1,1,1,1,0])
    clf=GaussianNB()
    clf.fit(X, y)
    print(clf.predict([[0,1,1,0]]))
```

运行结果如下。

```bash
[1]
```

- 利用朴素贝叶斯算法实现对 lab6 的两个数据集分类。

```python
# 利用朴素贝叶斯算法实现对 lab6的两个数据集分类。
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn import preprocessing
from sklearn.naive_bayes import BernoulliNB

def file2matrix(filename):
    fr = open(filename)
    # 得到文件行数
    arrayOfLines = fr.readlines()
    numberOfLines = len(arrayOfLines)
    # 创建返回的Numpy矩阵
    returnMat = np.zeros((numberOfLines, 3))
    classLabelVector = []
    # 解析文件数据到列表
    index = 0
    for line in arrayOfLines:
        line = line.strip()  # 注释1
        listFromLine = line.split('\t')  # 注释2
        returnMat[index, :] = listFromLine[0:3]
        classLabelVector.append(int(listFromLine[-1]))
        index += 1
    return returnMat, classLabelVector

if __name__ == '__main__':
    X, y = file2matrix('datingTestSet2.txt')
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    clf = BernoulliNB()
    clf.fit(X_train, y_train)
    print(clf.score(X_test, y_test, sample_weight=None))
```

运行结果如下。

```bash
0.325
```

```python
# 利用朴素贝叶斯算法实现对 lab6的两个数据集分类。
# 利用sklearn实现使用朴素贝叶斯分类器识别手写体应用。
import numpy as np
from sklearn.naive_bayes import BernoulliNB
import time
from os import listdir


def img2vector(filename):
    '''
    filename:文件名字
    将这个文件的所有数据按照顺序写成一个一维向量并返回
    '''
    returnVect = []
    fr = open(filename)
    for i in range(32):
        lineStr = fr.readline()
        for j in range(32):
            returnVect.append(int(lineStr[j]))
    return returnVect

# 从文件名中解析分类数字


def classnumCut(fileName):
    '''
    filename:文件名
    返回这个文件数据代表的实际数字
    '''
    fileStr = fileName.split('.')[0]
    classNumStr = int(fileStr.split('_')[0])
    return classNumStr

# 构建训练集数据向量及对应分类标签向量


def trainingDataSet():
    '''
    从trainingDigits文件夹下面读取所有数据文件，返回：
    trainingMat：所有训练数据，每一行代表一个数据文件中的内容
    hwLabels：每一项表示traningMat中对应项的数据到底代表数字几
    '''
    hwLabels = []
    # 获取目录traningDigits内容(即数据集文件名)，并储存在一个list中
    trainingFileList = listdir('trainingDigits')
    m = len(trainingFileList)  # 当前目录文件数
    # 初始化m维向量的训练集，每个向量1024维
    trainingMat = np.zeros((m, 1024))
    for i in range(m):
        fileNameStr = trainingFileList[i]
        # 从文件名中解析分类数字，作为分类标签
        hwLabels.append(classnumCut(fileNameStr))
        # 将图片矩阵转换为向量并储存在新的矩阵中
        trainingMat[i, :] = img2vector('trainingDigits/%s' % fileNameStr)
    return hwLabels, trainingMat


def handwritingTest():
    # 构建训练集
    hwLabels, trainingMat = trainingDataSet()

    # 从testDigits里面拿到测试集
    testFileList = listdir('testDigits')

    # 错误数
    errorCount = 0.0

    # 测试集总样本数
    mTest = len(testFileList)

    # 获取程序运行到此处的时间（开始测试）
    t1 = time.time()

    clf = BernoulliNB()
    clf.fit(trainingMat, hwLabels)

    for i in range(mTest):

        # 得到当前文件名
        fileNameStr = testFileList[i]

        # 从文件名中解析分类数字
        classNumStr = classnumCut(fileNameStr)

        # 将图片矩阵转换为向量
        vectorUnderTest = img2vector('testDigits/%s' % fileNameStr)

        # 调用knn算法进行测试
        classifierResult = clf.predict([vectorUnderTest])
        print("the classifier came back with: %d, the real answer is: %d" %
              (classifierResult, classNumStr))

        # 预测结果不一致，则错误数+1
        if (classifierResult != classNumStr):
            errorCount += 1.0

    print("\nthe total number of tests is: %d" % mTest)
    print("the total number of errors is: %d" % errorCount)
    print("the total error rate is: %f" % (errorCount/float(mTest)))

    # 获取程序运行到此处的时间（结束测试）
    t2 = time.time()

    # 测试耗时
    print("Cost time: %.2fmin, %.4fs." % ((t2-t1)//60, (t2-t1) % 60))


if __name__ == "__main__":
    handwritingTest()
```

运行时间如下。

```bash
the total number of tests is: 946
the total number of errors is: 65
the total error rate is: 0.068710
Cost time: 0.00min, 21.8384s.
```

## 实验总结

通过本次实验，我大致熟悉了 sklearn 使用朴素贝叶斯做分类的算法，得益于之前概率论的学习，还是很容易理解并使用的。
