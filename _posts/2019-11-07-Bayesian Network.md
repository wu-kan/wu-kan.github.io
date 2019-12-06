---
title: Bayesian Network
categoreis:
- 人工智能
---
使用`python`库`pomegranate`的构建贝叶斯网络求条件概率的两个例子。

## 环境配置

```bash
pip install pomegranate
```

## Burglary

### 源代码

```python
import pomegranate

B = pomegranate.DiscreteDistribution({'B': 0.001, '~B': 0.999})
E = pomegranate.DiscreteDistribution({'E': 0.002, '~E': 0.998})
A = pomegranate.ConditionalProbabilityTable(
    [['B', 'E', 'A', 0.95],
     ['B', 'E', '~A', 0.05],
     ['B', '~E', 'A', 0.94],
     ['B', '~E', '~A', 0.06],
     ['~B', 'E', 'A', 0.29],
     ['~B', 'E', '~A', 0.71],
     ['~B', '~E', 'A', 0.001],
     ['~B', '~E', '~A', 0.999]], [B, E])
J = pomegranate.ConditionalProbabilityTable(
    [['A', 'J', 0.9],
     ['A', '~J', 0.1],
     ['~A', 'J', 0.05],
     ['~A', '~J', 0.95]], [A])
M = pomegranate.ConditionalProbabilityTable(
    [['A', 'M', 0.7],
     ['A', '~M', 0.3],
     ['~A', 'M', 0.01],
     ['~A', '~M', 0.99]], [A])

SB = pomegranate.Node(B, name='B')
SE = pomegranate.Node(E, name='E')
SA = pomegranate.Node(A, name='A')
SJ = pomegranate.Node(J, name='J')
SM = pomegranate.Node(M, name='M')

model = pomegranate.BayesianNetwork("Burglary")
model.add_states(SB, SE, SA, SJ, SM)
model.add_edge(SB, SA)
model.add_edge(SE, SA)
model.add_edge(SA, SJ)
model.add_edge(SA, SM)
model.bake()

print("P(A) =")
print(model.predict_proba({})[2].parameters[0]['A'])

print("P(J&&~M) =")
print(model.predict_proba({})[3].parameters[0]['J'] *
      model.predict_proba({'J': 'J'})[4].parameters[0]['~M'])

print("P(A|J&&~M) =")
print(model.predict_proba({'J': 'J', 'M': '~M'})[2].parameters[0]['A'])

print("P(B|A) =")
print(model.predict_proba({'A': 'A'})[0].parameters[0]['B'])

print("P(B|J&&~M) =")
print(model.predict_proba({'J': 'J', 'M': '~M'})[0].parameters[0]['B'])

print("P(J&&~M|~B) =")
print(model.predict_proba({'B': '~B'})[3].parameters[0]['J'] *
      model.predict_proba({'B': '~B', 'J': 'J'})[4].parameters[0]['~M'])
```

### 运行结果

```bash
P(A) =
0.002516442000000935
P(J&&~M) =
0.05005487546100034
P(A|J&&~M) =
0.01357388933131146
P(B|A) =
0.3735512282818995
P(B|J&&~M) =
0.005129858133403528
P(J&&~M|~B) =
0.04984794900000031
```

## Diagnosing

### 源代码

```python
import pomegranate

PatientAge = pomegranate.DiscreteDistribution(
    {'0-30': 0.10, '31-65': 0.30, '65+': 0.60})
CTScanResult = pomegranate.DiscreteDistribution(
    {'Ischemic Stroke': 0.7, 'Hemmorraghic Stroke': 0.3})
MRIScanResult = pomegranate.DiscreteDistribution(
    {'Ischemic Stroke': 0.7, 'Hemmorraghic Stroke': 0.3})
Anticoagulants = pomegranate.DiscreteDistribution(
    {'Used': 0.5, 'Not used': 0.5})
StrokeType = pomegranate.ConditionalProbabilityTable([
    ['Ischemic Stroke', 'Ischemic Stroke', 'Ischemic Stroke', 0.8],
    ['Ischemic Stroke', 'Hemmorraghic Stroke', 'Ischemic Stroke', 0.5],
    ['Hemmorraghic Stroke', 'Ischemic Stroke', 'Ischemic Stroke', 0.5],
    ['Hemmorraghic Stroke', 'Hemmorraghic Stroke', 'Ischemic Stroke', 0],
    ['Ischemic Stroke', 'Ischemic Stroke', 'Hemmorraghic Stroke', 0],
    ['Ischemic Stroke', 'Hemmorraghic Stroke', 'Hemmorraghic Stroke', 0.4],
    ['Hemmorraghic Stroke', 'Ischemic Stroke', 'Hemmorraghic Stroke', 0.4],
    ['Hemmorraghic Stroke', 'Hemmorraghic Stroke', 'Hemmorraghic Stroke', 0.9],
    ['Ischemic Stroke', 'Ischemic Stroke', 'Stroke Mimic', 0.2],
    ['Ischemic Stroke', 'Hemmorraghic Stroke', 'Stroke Mimic', 0.1],
    ['Hemmorraghic Stroke', 'Ischemic Stroke', 'Stroke Mimic', 0.1],
    ['Hemmorraghic Stroke', 'Hemmorraghic Stroke', 'Stroke Mimic', 0.1]], [CTScanResult, MRIScanResult])
Mortality = pomegranate.ConditionalProbabilityTable([
    ['Ischemic Stroke', 'Used', 'False', 0.28],
    ['Hemmorraghic Stroke', 'Used', 'False', 0.99],
    ['Stroke Mimic', 'Used', 'False', 0.1],
    ['Ischemic Stroke', 'Not used', 'False', 0.56],
    ['Hemmorraghic Stroke', 'Not used', 'False', 0.58],
    ['Stroke Mimic', 'Not used', 'False', 0.05],
    ['Ischemic Stroke',  'Used', 'True', 0.72],
    ['Hemmorraghic Stroke', 'Used', 'True', 0.01],
    ['Stroke Mimic', 'Used', 'True', 0.9],
    ['Ischemic Stroke',  'Not used', 'True', 0.44],
    ['Hemmorraghic Stroke', 'Not used', 'True', 0.42],
    ['Stroke Mimic', 'Not used', 'True', 0.95]],
    [StrokeType, Anticoagulants])
Disability = pomegranate.ConditionalProbabilityTable([
    ['Ischemic Stroke',   '0-30', 'Negligible', 0.80],
    ['Hemmorraghic Stroke', '0-30', 'Negligible', 0.70],
    ['Stroke Mimic', '0-30', 'Negligible', 0.9],
    ['Ischemic Stroke', '31-65', 'Negligible', 0.60],
    ['Hemmorraghic Stroke', '31-65', 'Negligible', 0.50],
    ['Stroke Mimic', '31-65', 'Negligible', 0.4],
    ['Ischemic Stroke', '65+', 'Negligible', 0.30],
    ['Hemmorraghic Stroke', '65+', 'Negligible', 0.20],
    ['Stroke Mimic', '65+', 'Negligible', 0.1],
    ['Ischemic Stroke', '0-30', 'Moderate', 0.1],
    ['Hemmorraghic Stroke', '0-30', 'Moderate', 0.2],
    ['Stroke Mimic', '0-30', 'Moderate', 0.05],
    ['Ischemic Stroke', '31-65', 'Moderate', 0.3],
    ['Hemmorraghic Stroke', '31-65', 'Moderate', 0.4],
    ['Stroke Mimic', '31-65', 'Moderate', 0.3],
    ['Ischemic Stroke',  '65+', 'Moderate', 0.4],
    ['Hemmorraghic Stroke', '65+', 'Moderate', 0.2],
    ['Stroke Mimic', '65+', 'Moderate', 0.1],
    ['Ischemic Stroke', '0-30', 'Severe', 0.1],
    ['Hemmorraghic Stroke', '0-30', 'Severe', 0.1],
    ['Stroke Mimic', '0-30', 'Severe', 0.05],
    ['Ischemic Stroke', '31-65', 'Severe', 0.1],
    ['Hemmorraghic Stroke', '31-65', 'Severe', 0.1],
    ['Stroke Mimic', '31-65', 'Severe', 0.3],
    ['Ischemic Stroke', '65+', 'Severe', 0.3],
    ['Hemmorraghic Stroke', '65+', 'Severe', 0.6],
    ['Stroke Mimic', '65+', 'Severe', 0.8]],
    [StrokeType, PatientAge])

S1 = pomegranate.Node(PatientAge, name='PatientAge')
S2 = pomegranate.Node(CTScanResult, name='CTScanResult')
S3 = pomegranate.Node(MRIScanResult, name='MRIScanResult')
S4 = pomegranate.Node(StrokeType, name='StrokeType')
S5 = pomegranate.Node(Anticoagulants, name='Anticoagulants')
S6 = pomegranate.Node(Mortality, name='Mortality')
S7 = pomegranate.Node(Disability, name='Disability')

model = pomegranate.BayesianNetwork("Diagnosing")
model.add_states(S1, S2, S3, S4, S5, S6, S7)
model.add_edge(S2, S4)
model.add_edge(S3, S4)
model.add_edge(S4, S6)
model.add_edge(S5, S6)
model.add_edge(S1, S7)
model.add_edge(S4, S7)
model.bake()

print("p1 =",
      model.predict_proba({'PatientAge': '31-65',
                           'CTScanResult': 'Ischemic Stroke'})[5].parameters[0]['True'])

print("p2 =",
      model.predict_proba({'PatientAge': '65+',
                           'MRIScanResult': 'Hemmorraghic Stroke'})[6].parameters[0]['Moderate'])

print("p3 =",
      model.predict_proba({'PatientAge': '65+',
                           'CTScanResult': 'Hemmorraghic Stroke',
                           'MRIScanResult': 'Ischemic Stroke'})[3].parameters[0]['Stroke Mimic'])

print("p4 =",
      model.predict_proba({'PatientAge': '0-30'})[4].parameters[0]['Not used'])
```

### 运行结果

```bash
p1 = 0.5948499999999999
p2 = 0.2600000000000001
p3 = 0.10000000000000045
p4 = 0.5
```
