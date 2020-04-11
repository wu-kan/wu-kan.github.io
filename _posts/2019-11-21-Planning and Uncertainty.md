---
title: Planning and Uncertainty
tags:
  - 人工智能
---

## $2\times 2$ Rubik's Cube

Please solve the $2\times 2$ Rubik's Cube by using FF planner. Here are 4 cases for you to verify the correctness of your programs. You should hand in 5 files, including a domain file (`cube_domain.pddl`) and 4 data files (`cube1.pddl`, `cube2.pddl`, `cube3.pddl`,`cube4.pddl`).

For more information about $2\times 2$ Rubik's Cube, such as actions R, U and F, please refer to <https://rubiks-cube-solver.com/2x2/>.

做的时候遇到一些问题，网页版的[PDDL Editor](http://editor.planning.domains)仅能跑出第一组数据，其他几组数据会超时。多次修改无效的情况下，我选择在 linux 系统下本地安装规划器完成这一项。依次运行下述指令，安装规划器。注意`make`的时候，如果提示缺少库文件，需要自己手动装。

```bash
wget http://fai.cs.uni-saarland.de/hoffmann/ff/FF-v2.3.tgz
tar zxvf FF-v2.3.tgz
cd FF-v2.3
make
```

将生成目录`/FF-v2.3`下的二进制文件`ff`拷贝到当前目录下，终端下依次执行如下四条指令运行规划并将结果写到对应文本文件内。

```bash
./ff -o cube_domain.pddl -f cube1.pddl > cube1.txt
./ff -o cube_domain.pddl -f cube2.pddl > cube2.txt
./ff -o cube_domain.pddl -f cube3.pddl > cube3.txt
./ff -o cube_domain.pddl -f cube4.pddl > cube4.txt
```

以下是源代码和运行结果。其中，`cube1 ?x ?y ?z`指某一块方块在 x 轴、y 轴、z 轴三个方向上可视面的颜色，其它同。

### `cube_domain.pddl`

```pddl
(define
    (domain cube)
    (:predicates
        (cube1 ?x ?y ?z)
        (cube2 ?x ?y ?z)
        (cube3 ?x ?y ?z)
        (cube4 ?x ?y ?z)
        (cube5 ?x ?y ?z)
        (cube6 ?x ?y ?z)
        (cube7 ?x ?y ?z)
        (cube8 ?x ?y ?z)
    )
    (:action U:effect
        (and
            (forall
                (?x ?y ?z)
                (when
                    (cube5 ?x ?y ?z)
                    (and
                        (not
                            (cube5 ?x ?y ?z)
                        )
                        (cube7 ?y ?x ?z)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube7 ?x ?y ?z)
                    (and
                        (not
                            (cube7 ?x ?y ?z)
                        )
                        (cube8 ?y ?x ?z)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube8 ?x ?y ?z)
                    (and
                        (not
                            (cube8 ?x ?y ?z)
                        )
                        (cube6 ?y ?x ?z)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube6 ?x ?y ?z)
                    (and
                        (not
                            (cube6 ?x ?y ?z)
                        )
                        (cube5 ?y ?x ?z)
                    )
                )
            )
        )
    )
    (:action Urev:effect
        (and
            (forall
                (?x ?y ?z)
                (when
                    (cube5 ?x ?y ?z)
                    (and
                        (not
                            (cube5 ?x ?y ?z)
                        )
                        (cube6 ?y ?x ?z)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube6 ?x ?y ?z)
                    (and
                        (not
                            (cube6 ?x ?y ?z)
                        )
                        (cube8 ?y ?x ?z)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube8 ?x ?y ?z)
                    (and
                        (not
                            (cube8 ?x ?y ?z)
                        )
                        (cube7 ?y ?x ?z)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube7 ?x ?y ?z)
                    (and
                        (not
                            (cube7 ?x ?y ?z)
                        )
                        (cube5 ?y ?x ?z)
                    )
                )
            )
        )
    )
    (:action R:effect
        (and
            (forall
                (?x ?y ?z)
                (when
                    (cube2 ?x ?y ?z)
                    (and
                        (not
                            (cube2 ?x ?y ?z)
                        )
                        (cube6 ?x ?z ?y)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube6 ?x ?y ?z)
                    (and
                        (not
                            (cube6 ?x ?y ?z)
                        )
                        (cube8 ?x ?z ?y)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube8 ?x ?y ?z)
                    (and
                        (not
                            (cube8 ?x ?y ?z)
                        )
                        (cube4 ?x ?z ?y)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube4 ?x ?y ?z)
                    (and
                        (not
                            (cube4 ?x ?y ?z)
                        )
                        (cube2 ?x ?z ?y)
                    )
                )
            )
        )
    )
    (:action Rrev:effect
        (and
            (forall
                (?x ?y ?z)
                (when
                    (cube2 ?x ?y ?z)
                    (and
                        (not
                            (cube2 ?x ?y ?z)
                        )
                        (cube4 ?x ?z ?y)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube4 ?x ?y ?z)
                    (and
                        (not
                            (cube4 ?x ?y ?z)
                        )
                        (cube8 ?x ?z ?y)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube8 ?x ?y ?z)
                    (and
                        (not
                            (cube8 ?x ?y ?z)
                        )
                        (cube6 ?x ?z ?y)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube6 ?x ?y ?z)
                    (and
                        (not
                            (cube6 ?x ?y ?z)
                        )
                        (cube2 ?x ?z ?y)
                    )
                )
            )
        )
    )
    (:action F:effect
        (and
            (forall
                (?x ?y ?z)
                (when
                    (cube1 ?x ?y ?z)
                    (and
                        (not
                            (cube1 ?x ?y ?z)
                        )
                        (cube5 ?z ?y ?x)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube5 ?x ?y ?z)
                    (and
                        (not
                            (cube5 ?x ?y ?z)
                        )
                        (cube6 ?z ?y ?x)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube6 ?x ?y ?z)
                    (and
                        (not
                            (cube6 ?x ?y ?z)
                        )
                        (cube2 ?z ?y ?x)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube2 ?x ?y ?z)
                    (and
                        (not
                            (cube2 ?x ?y ?z)
                        )
                        (cube1 ?z ?y ?x)
                    )
                )
            )
        )
    )
    (:action Frev:effect
        (and
            (forall
                (?x ?y ?z)
                (when
                    (cube1 ?x ?y ?z)
                    (and
                        (not
                            (cube1 ?x ?y ?z)
                        )
                        (cube2 ?z ?y ?x)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube2 ?x ?y ?z)
                    (and
                        (not
                            (cube2 ?x ?y ?z)
                        )
                        (cube6 ?z ?y ?x)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube6 ?x ?y ?z)
                    (and
                        (not
                            (cube6 ?x ?y ?z)
                        )
                        (cube5 ?z ?y ?x)
                    )
                )
            )
            (forall
                (?x ?y ?z)
                (when
                    (cube5 ?x ?y ?z)
                    (and
                        (not
                            (cube5 ?x ?y ?z)
                        )
                        (cube1 ?z ?y ?x)
                    )
                )
            )
        )
    )
)
```

### `cube1.pddl`

```pddl
(define
    (problem cube1)
    (:domain cube)
    (:objects Y W B G O R)
    (:init
        (cube1 B O Y)
        (cube2 G R W)
        (cube3 R Y B)
        (cube4 O B W)
        (cube5 O Y G)
        (cube6 B R W)
        (cube7 O W G)
        (cube8 Y R G)
    )
    (:goal
        (and
            (cube1 R W B)
            (cube2 O W B)
            (cube3 R Y B)
            (cube4 O Y B)
            (cube5 R W G)
            (cube6 O W G)
            (cube7 R Y G)
            (cube8 O Y G)
        )
    )
)
```

### `cube1.txt`

```bash

ff: parsing domain file
domain 'CUBE' defined
 ... done.
ff: parsing problem file
problem 'CUBE1' defined
 ... done.



Cueing down from goal distance:   10 into depth [1]
                                   8            [1][2][3]
                                   7            [1]
                                   6            [1]
                                   5            [1][2]
                                   4            [1][2][3][4][5][6][7]
                                   1            [1]
                                   0

ff: found legal plan as follows

step    0: R
        1: UREV
        2: RREV
        3: UREV
        4: FREV
        5: R
        6: F
        7: R
        8: FREV
        9: UREV
       10: F
       11: U
       12: RREV
       13: UREV
       14: FREV
       15: U


time spent:    0.02 seconds instantiating 6 easy, 0 hard action templates
               0.00 seconds reachability analysis, yielding 1512 facts and 6 actions
               0.00 seconds creating final representation with 1512 relevant facts
               0.10 seconds building connectivity graph
               0.04 seconds searching, evaluating 194 states, to a max depth of 7
               0.16 seconds total time


```

### `cube2.pddl`

```pddl
(define
    (problem cube2)
    (:domain cube)
    (:objects Y W B G O R)
    (:init
        (cube1 B R W)
        (cube2 O B Y)
        (cube3 W G R)
        (cube4 R Y G)
        (cube5 G O Y)
        (cube6 B W O)
        (cube7 R B Y)
        (cube8 O G W)
    )
    (:goal
        (and
            (cube1 W B R)
            (cube2 Y B R)
            (cube3 W G R)
            (cube4 Y G R)
            (cube5 W B O)
            (cube6 Y B O)
            (cube7 W G O)
            (cube8 Y G O)
        )
    )
)
```

### `cube2.txt`

```bash

ff: parsing domain file
domain 'CUBE' defined
 ... done.
ff: parsing problem file
problem 'CUBE2' defined
 ... done.



Cueing down from goal distance:   13 into depth [1][2]
                                  12            [1]
                                  11            [1][2]
                                  10            [1]
                                   8            [1][2]
                                   6            [1][2][3][4][5]
                                   5            [1][2][3][4][5][6]
                                   4            [1][2][3][4][5]
                                   3            [1][2][3][4][5][6][7][8][9]
                                   2            [1][2][3]

Enforced Hill-climbing failed !
switching to Best-first Search now.

advancing to distance :   13
                          12
                          10
                           8
                           6
                           5
                           4
                           3
                           2
                           1
                           0

ff: found legal plan as follows

step    0: RREV
        1: FREV
        2: U
        3: FREV
        4: U
        5: FREV
        6: R
        7: FREV
        8: U
        9: RREV
       10: FREV
       11: R
       12: UREV
       13: F
       14: U
       15: RREV
       16: UREV
       17: FREV
       18: U
       19: F
       20: UREV
       21: RREV
       22: F
       23: R
       24: FREV
       25: R
       26: F
       27: R
       28: FREV
       29: RREV
       30: UREV
       31: R
       32: U
       33: RREV
       34: U
       35: F
       36: UREV
       37: FREV
       38: UREV
       39: RREV
       40: F
       41: R
       42: U
       43: R
       44: UREV
       45: RREV


time spent:    0.02 seconds instantiating 6 easy, 0 hard action templates
               0.00 seconds reachability analysis, yielding 1512 facts and 6 actions
               0.01 seconds creating final representation with 1512 relevant facts
               0.09 seconds building connectivity graph
               0.67 seconds searching, evaluating 8733 states, to a max depth of 9
               0.79 seconds total time

```

### `cube3.pddl`

```pddl
(define
    (problem cube3)
    (:domain cube)
    (:objects Y W B G O R)
    (:init
        (cube1 R Y G)
        (cube2 O G W)
        (cube3 Y O B)
        (cube4 W B R)
        (cube5 O W B)
        (cube6 Y O G)
        (cube7 W R G)
        (cube8 R Y B)
    )
    (:goal
        (and
            (cube1 Y R B)
            (cube2 W R B)
            (cube3 Y O B)
            (cube4 W O B)
            (cube5 Y R G)
            (cube6 W R G)
            (cube7 Y O G)
            (cube8 W O G)
        )
    )
)
```

### `cube3.txt`

```bash

ff: parsing domain file
domain 'CUBE' defined
 ... done.
ff: parsing problem file
problem 'CUBE3' defined
 ... done.



Cueing down from goal distance:   10 into depth [1]
                                   9            [1][2]
                                   8            [1]
                                   7            [1][2][3][4]
                                   5            [1][2][3][4]
                                   4            [1][2][3][4][5][6][7][8][9]
                                   3            [1]
                                   2            [1][2]

Enforced Hill-climbing failed !
switching to Best-first Search now.

advancing to distance :   10
                           9
                           8
                           7
                           6
                           5
                           4
                           1
                           0

ff: found legal plan as follows

step    0: UREV
        1: R
        2: UREV
        3: RREV
        4: UREV
        5: FREV
        6: R
        7: FREV
        8: RREV
        9: U
       10: R
       11: F
       12: R
       13: FREV
       14: RREV
       15: U
       16: FREV
       17: UREV
       18: F
       19: UREV
       20: RREV
       21: F
       22: R
       23: FREV
       24: R
       25: F
       26: R
       27: FREV
       28: RREV
       29: UREV
       30: R
       31: U
       32: RREV
       33: U
       34: F
       35: UREV
       36: FREV
       37: UREV
       38: RREV
       39: F
       40: R
       41: U
       42: R
       43: UREV
       44: RREV


time spent:    0.00 seconds instantiating 6 easy, 0 hard action templates
               0.00 seconds reachability analysis, yielding 1512 facts and 6 actions
               0.02 seconds creating final representation with 1512 relevant facts
               0.08 seconds building connectivity graph
               0.13 seconds searching, evaluating 1710 states, to a max depth of 9
               0.23 seconds total time


```

### `cube4.pddl`

```pddl
(define
    (problem cube4)
    (:domain cube)
    (:objects Y W B G O R)
    (:init
        (cube1 B O Y)
        (cube2 W O G)
        (cube3 B O W)
        (cube4 R G W)
        (cube5 G Y R)
        (cube6 Y O G)
        (cube7 B Y R)
        (cube8 R B W)
    )
    (:goal
        (and
            (cube1 B R W)
            (cube2 G R W)
            (cube3 B O W)
            (cube4 G O W)
            (cube5 B R Y)
            (cube6 G R Y)
            (cube7 B O Y)
            (cube8 G O Y)
        )
    )
)
```

### `cube4.txt`

```bash

ff: parsing domain file
domain 'CUBE' defined
 ... done.
ff: parsing problem file
problem 'CUBE4' defined
 ... done.



Cueing down from goal distance:   14 into depth [1]
                                  12            [1][2]
                                  11            [1]
                                   9            [1]
                                   7            [1][2][3]
                                   6            [1][2]
                                   5            [1][2][3][4]
                                   4            [1][2][3][4][5][6][7]
                                   2            [1][2][3]

Enforced Hill-climbing failed !
switching to Best-first Search now.

advancing to distance :   14
                          12
                          11
                           9
                           7
                           6
                           5
                           2
                           1
                           0

ff: found legal plan as follows

step    0: FREV
        1: R
        2: FREV
        3: R
        4: FREV
        5: RREV
        6: UREV
        7: F
        8: R
        9: U
       10: R
       11: F
       12: RREV
       13: FREV
       14: R
       15: F
       16: RREV
       17: FREV
       18: R
       19: F
       20: U
       21: FREV
       22: UREV
       23: F
       24: R
       25: F
       26: RREV
       27: FREV
       28: R
       29: FREV
       30: UREV
       31: RREV
       32: U
       33: FREV
       34: UREV
       35: R
       36: U
       37: F
       38: U
       39: FREV
       40: UREV


time spent:    0.00 seconds instantiating 6 easy, 0 hard action templates
               0.01 seconds reachability analysis, yielding 1512 facts and 6 actions
               0.00 seconds creating final representation with 1512 relevant facts
               0.08 seconds building connectivity graph
               0.15 seconds searching, evaluating 2462 states, to a max depth of 7
               0.24 seconds total time


```

## Diagnosing by Bayesian Networks

终端运行下述指令，将结果写到文本文件中。

```bash
python Diagnosing.py > Diagnosing.txt
```

### Variables and their domais

```python
# (1)PatientAge:['0-30','31-65','65+']
# (2)CTScanResult:['Ischemic Stroke','Hemmorraghic Stroke']
# (3)MRIScanResult: ['Ischemic Stroke','Hemmorraghic Stroke']
# (4)StrokeType: ['Ischemic Stroke','Hemmorraghic Stroke', 'Stroke Mimic']
# (5)Anticoagulants: ['Used','Not used']
# (6)Mortality:['True', 'False']
# (7)Disability: ['Negligible', 'Moderate', 'Severe']
```

### CPTS

```python
# (1)
[PatientAge]

['0-30', 0.10],
['31-65', 0.30],
['65+', 0.60]

# (2)
[CTScanResult]

['Ischemic Stroke',0.7],
[ 'Hemmorraghic Stroke',0.3]

# (3)
[MRIScanResult]

['Ischemic Stroke',0.7],
[ 'Hemmorraghic Stroke',0.3]

# (4)
[Anticoagulants]

[Used',0.5],
['Not used',0.5]

# (5)
[CTScanResult, MRIScanResult,StrokeType])

['Ischemic Stroke','Ischemic Stroke','Ischemic Stroke',0.8],
['Ischemic Stroke','Hemmorraghic Stroke','Ischemic Stroke',0.5],
[ 'Hemmorraghic Stroke','Ischemic Stroke','Ischemic Stroke',0.5],
[ 'Hemmorraghic Stroke','Hemmorraghic Stroke','Ischemic Stroke',0],

['Ischemic Stroke','Ischemic Stroke','Hemmorraghic Stroke',0],
['Ischemic Stroke','Hemmorraghic Stroke','Hemmorraghic Stroke',0.4],
[ 'Hemmorraghic Stroke','Ischemic Stroke','Hemmorraghic Stroke',0.4],
[ 'Hemmorraghic Stroke','Hemmorraghic Stroke','Hemmorraghic Stroke',0.9],

['Ischemic Stroke','Ischemic Stroke','Stroke Mimic',0.2],
['Ischemic Stroke','Hemmorraghic Stroke','Stroke Mimic',0.1],
[ 'Hemmorraghic Stroke','Ischemic Stroke','Stroke Mimic',0.1],
[ 'Hemmorraghic Stroke','Hemmorraghic Stroke','Stroke Mimic',0.1],

# (6)
[StrokeType, Anticoagulants, Mortality]

['Ischemic Stroke', 'Used', 'False',0.28],
['Hemmorraghic Stroke', 'Used', 'False',0.99],
['Stroke Mimic', 'Used', 'False',0.1],
['Ischemic Stroke','Not used', 'False',0.56],
['Hemmorraghic Stroke', 'Not used', 'False',0.58],
['Stroke Mimic', 'Not used', 'False',0.05],

['Ischemic Stroke',  'Used' ,'True',0.72],
['Hemmorraghic Stroke', 'Used', 'True',0.01],
['Stroke Mimic', 'Used', 'True',0.9],
['Ischemic Stroke',  'Not used' ,'True',0.44],
['Hemmorraghic Stroke', 'Not used', 'True',0.42 ],
['Stroke Mimic', 'Not used', 'True',0.95]

# (7)
[StrokeType, PatientAge, Disability]

['Ischemic Stroke',   '0-30','Negligible', 0.80],
['Hemmorraghic Stroke', '0-30','Negligible', 0.70],
['Stroke Mimic',        '0-30', 'Negligible',0.9],
['Ischemic Stroke',     '31-65','Negligible', 0.60],
['Hemmorraghic Stroke', '31-65','Negligible', 0.50],
['Stroke Mimic',        '31-65', 'Negligible',0.4],
['Ischemic Stroke',     '65+'  , 'Negligible',0.30],
['Hemmorraghic Stroke', '65+'  , 'Negligible',0.20],
['Stroke Mimic',        '65+'  , 'Negligible',0.1],

['Ischemic Stroke',     '0-30' ,'Moderate',0.1],
['Hemmorraghic Stroke', '0-30' ,'Moderate',0.2],
['Stroke Mimic',        '0-30' ,'Moderate',0.05],
['Ischemic Stroke',     '31-65','Moderate',0.3],
['Hemmorraghic Stroke', '31-65','Moderate',0.4],
['Stroke Mimic',        '31-65','Moderate',0.3],
['Ischemic Stroke',     '65+'  ,'Moderate',0.4],
['Hemmorraghic Stroke', '65+'  ,'Moderate',0.2],
['Stroke Mimic',        '65+'  ,'Moderate',0.1],

['Ischemic Stroke',     '0-30' ,'Severe',0.1],
['Hemmorraghic Stroke', '0-30' ,'Severe',0.1],
['Stroke Mimic',        '0-30' ,'Severe',0.05],
['Ischemic Stroke',     '31-65','Severe',0.1],
['Hemmorraghic Stroke', '31-65','Severe',0.1],
['Stroke Mimic',        '31-65','Severe',0.3],
['Ischemic Stroke',     '65+'  ,'Severe',0.3],
['Hemmorraghic Stroke', '65+'  ,'Severe',0.6],
['Stroke Mimic',        '65+'  ,'Severe',0.8]
```

### Calculation

Please implement the VE algorithm (C++ or Python) to calculate the following probability value:

1. p1 = P(Mortality='True' $\land$ CTScanResult='Ischemic Stroke' $\mid$ PatientAge='31-65' )
2. p2 = P(Disability='Moderate' $\land$ CTScanResult='Hemmorraghic Stroke' $\mid$ PatientAge='65+' $\land$ MRIScanResult='Hemmorraghic Stroke')
3. p3 = P(StrokeType='Hemmorraghic Stroke' $\mid$ PatientAge='65+' $\land$ CTScanResult='Hemmorraghic Stroke' $\land$ MRIScanResult='Ischemic Stroke')
4. p4 = P(Anticoagulants='Used' $\mid$ PatientAge='31-65')
5. p5 = P(Disability='Negligible')

### Code`Diagnosing.py`

为了简化代码实现，下面变量取值的`0`、`1`、`2`代表该变量取值在对应 domain 中的下标。在[之前做过的实验](https://wu-kan.cn/_posts/2019-11-14-Variable-Elimination/)上改改就成功了。

```python
class VariableElimination:
    @staticmethod
    def inference(factorList, queryVariables,
                  orderedListOfHiddenVariables, evidenceList):
        for ev in evidenceList:
             # Your code here
            for factor in factorList:
                if ev in factor.varList:
                    if len(factor.varList) > 1:
                        factorList.append(
                            factor.restrict(ev, evidenceList[ev]))
                    factorList.remove(factor)

        for var in orderedListOfHiddenVariables:
            # Your code here
            new_var_list = []
            for e in factorList:
                if var in e.varList:
                    new_var_list.append(e)
            first = True
            for e in new_var_list:
                for i in factorList:
                    if i.name == e.name:
                        factorList.remove(i)
                if first:
                    new_var = e
                    first = False
                else:
                    new_var = new_var.multiply(e)

            factorList.append(new_var.sumout(var))
        print("RESULT:")
        res = factorList[0]
        for factor in factorList[1:]:
            res = res.multiply(factor)
        total = sum(res.cpt.values())
        res.cpt = {k: v/total for k, v in res.cpt.items()}
        res.printInf()

    @staticmethod
    def printFactors(factorList):
        for factor in factorList:
            factor.printInf()


class Util:
    @staticmethod
    def to_binary(num, len):
        return format(num, '0' + str(len) + 'b')


class Node:
    def __init__(self, name, var_list):
        self.name = name
        self.varList = var_list
        self.cpt = {}

    def setCpt(self, cpt):
        self.cpt = cpt

    def printInf(self):
        print("Name = " + self.name)
        print(" vars " + str(self.varList))
        for key in self.cpt:
            print("   key: " + key + " val : " + str(self.cpt[key]))
        print()

    def multiply(self, factor):
        """function that multiplies with another factor"""
        # Your code here
        new_cpt = {}
        new_var_list = list(self.varList)
        idx1 = []
        idx2 = []
        for var in factor.varList:
            if var in new_var_list:
                idx1.append(self.varList.index(var))
                idx2.append(factor.varList.index(var))
            else:
                new_var_list.append(var)
        for k1, v1 in self.cpt.items():
            for k2, v2 in factor.cpt.items():
                flag = True
                for i in range(len(idx1)):
                    if k1[idx1[i]] != k2[idx2[i]]:
                        flag = False
                        break
                if flag:
                    new_key = k1
                    for i in range(len(k2)):
                        if i not in idx2:
                            new_key += k2[i]
                    new_cpt[new_key] = v1 * v2

        new_node = Node("f" + str(new_var_list), new_var_list)
        new_node.setCpt(new_cpt)
        return new_node

    def sumout(self, variable):
        """function that sums out a variable given a factor"""
        # Your code here
        new_cpt = {}
        new_var_list = list(self.varList)
        new_var_list.remove(variable)
        idx = self.varList.index(variable)
        for k, v in self.cpt.items():
            tmp = k[:idx] + k[idx+1:]
            if tmp not in new_cpt.keys():
                new_cpt[tmp] = v
            else:
                new_cpt[tmp] += v

        new_node = Node("f" + str(new_var_list), new_var_list)
        new_node.setCpt(new_cpt)
        return new_node

    def restrict(self, variable, value):
        """function that restricts a variable to some value
        in a given factor"""
        # Your code here
        new_cpt = {}
        new_var_list = list(self.varList)
        new_var_list.remove(variable)
        idx = self.varList.index(variable)
        value = str(value)
        for k, v in self.cpt.items():
            if k[idx] == value:
                new_cpt[k[:idx] + k[idx+1:]] = v

        new_node = Node("f" + str(new_var_list), new_var_list)
        new_node.setCpt(new_cpt)
        return new_node


PatientAge = Node("PatientAge", ["PatientAge"])
MRIScanResult = Node("MRIScanResult", ["MRIScanResult"])
CTScanResult = Node("CTScanResult", ["CTScanResult"])
Anticoagulants = Node("Anticoagulants", ["Anticoagulants"])
StrokeType = Node("StrokeType", ["StrokeType",
                                 "CTScanResult", "MRIScanResult"])
Disability = Node("Disability", ["Disability", "StrokeType", "PatientAge"])
Mortality = Node("Mortality", ["Mortality", "StrokeType", "Anticoagulants"])
PatientAge.setCpt({'0': 0.10, '1': 0.30, '2': 0.60})
CTScanResult.setCpt({'0': 0.7, '1': 0.3})
MRIScanResult.setCpt({'0': 0.7, '1': 0.3})
Anticoagulants.setCpt({'0': 0.5, '1': 0.5})
StrokeType.setCpt({'000': 0.8, '001': 0.5,
                   '010': 0.5, '011': 0.0,
                   '100': 0.0, '101': 0.4,
                   '110': 0.4, '111': 0.9,
                   '200': 0.2, '201': 0.1,
                   '210': 0.1, '211': 0.1})
Mortality.setCpt({'000': 0.56, '001': 0.28,
                  '010': 0.58, '011': 0.99,
                  '020': 0.05, '021': 0.10,
                  '100': 0.44, '101': 0.72,
                  '110': 0.42, '111': 0.01,
                  '120': 0.95, '121': 0.90})
Disability.setCpt({'000': 0.80, '010': 0.70, '020': 0.90,
                   '001': 0.60, '011': 0.50, '021': 0.40,
                   '002': 0.30, '012': 0.20, '022': 0.10,
                   '100': 0.10, '110': 0.20, '120': 0.05,
                   '101': 0.30, '111': 0.40, '121': 0.30,
                   '102': 0.40, '112': 0.20, '122': 0.10,
                   '200': 0.10, '210': 0.10, '220': 0.05,
                   '201': 0.10, '211': 0.10, '221': 0.30,
                   '202': 0.30, '212': 0.60, '222': 0.80})


print("P1 **********************")
VariableElimination.inference(
    [PatientAge, MRIScanResult, CTScanResult, Anticoagulants, StrokeType,
        Disability, Mortality], ['Mortality', 'CTScanResult'],
    ['MRIScanResult', 'Anticoagulants', 'StrokeType', 'Disability'],
    {'PatientAge': 1}
)

print("P2 **********************")
VariableElimination.inference(
    [PatientAge, MRIScanResult, CTScanResult, Anticoagulants, StrokeType,
        Disability, Mortality], ['Disability', 'CTScanResult'],
    ['Anticoagulants', 'StrokeType', 'Mortality'],
    {'PatientAge': 2, 'MRIScanResult': 1}
)

print("P3 **********************")
VariableElimination.inference(
    [PatientAge, MRIScanResult, CTScanResult, Anticoagulants,
        StrokeType, Disability, Mortality], ['StrokeType'],
    ['Disability', 'Anticoagulants', 'Mortality'],
    {'PatientAge': 2, 'CTScanResult': 1, 'MRIScanResult': 0}
)

print("P4 **********************")
VariableElimination.inference(
    [PatientAge, MRIScanResult, CTScanResult, Anticoagulants,
        StrokeType, Disability, Mortality], ['Anticoagulants'],
    ['MRIScanResult', 'CTScanResult', 'StrokeType', 'Disability', 'Mortality'],
    {'PatientAge': 1}
)

print("P5 **********************")
VariableElimination.inference(
    [PatientAge, MRIScanResult, CTScanResult, Anticoagulants,
        StrokeType, Disability, Mortality], ['Disability'],
    ['PatientAge', 'MRIScanResult', 'CTScanResult',
        'Anticoagulants', 'StrokeType', 'Mortality'],
    {}
)
```

### Result`Diagnosing.txt`

```bash
P1 **********************
RESULT:
Name = f['CTScanResult', 'Mortality']
 vars ['CTScanResult', 'Mortality']
   key: 00 val : 0.283605
   key: 01 val : 0.41639499999999996
   key: 10 val : 0.17587499999999998
   key: 11 val : 0.12412500000000001

P2 **********************
RESULT:
Name = f['CTScanResult', 'Disability']
 vars ['CTScanResult', 'Disability']
   key: 00 val : 0.16800000000000004
   key: 01 val : 0.20300000000000004
   key: 02 val : 0.329
   key: 10 val : 0.057
   key: 11 val : 0.057
   key: 12 val : 0.18600000000000005

P3 **********************
RESULT:
Name = f['StrokeType']
 vars ['StrokeType']
   key: 0 val : 0.5000000000000001
   key: 1 val : 0.4
   key: 2 val : 0.10000000000000002

P4 **********************
RESULT:
Name = f['Anticoagulants']
 vars ['Anticoagulants']
   key: 0 val : 0.5000000000000001
   key: 1 val : 0.49999999999999994

P5 **********************
RESULT:
Name = f['Disability']
 vars ['Disability']
   key: 0 val : 0.38977
   key: 1 val : 0.292515
   key: 2 val : 0.317715


```
