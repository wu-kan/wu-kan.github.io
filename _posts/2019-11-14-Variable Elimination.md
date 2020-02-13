---
title: Variable Elimination
categoreis:
  - 人工智能
---

Here is a VE template for you to solve the burglary example:

```python
class VariableElimination:
    @staticmethod
    def inference(factorList, queryVariables,
                  orderedListOfHiddenVariables, evidenceList):
        for ev in evidenceList:
            # Your code here
        for var in orderedListOfHiddenVariables:
            # Your code here
        print "RESULT:"
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
        print "Name = " + self.name
        print " vars " + str(self.varList)
        for key in self.cpt:
            print "   key: " + key + " val : " + str(self.cpt[key])
        print ""

    def multiply(self, factor):
        """function that multiplies with another factor"""
        # Your code here
        new_node = Node("f" + str(newList), newList)
        new_node.setCpt(new_cpt)
        return new_node

    def sumout(self, variable):
        """function that sums out a variable given a factor"""
        # Your code here
        new_node = Node("f" + str(new_var_list), new_var_list)
        new_node.setCpt(new_cpt)
        return new_node

    def restrict(self, variable, value):
        """function that restricts a variable to some value
        in a given factor"""
        # Your code here
        new_node = Node("f" + str(new_var_list), new_var_list)
        new_node.setCpt(new_cpt)
        return new_node


# create nodes for Bayes Net
B = Node("B", ["B"])
E = Node("E", ["E"])
A = Node("A", ["A", "B", "E"])
J = Node("J", ["J", "A"])
M = Node("M", ["M", "A"])

# Generate cpt for each node
B.setCpt({'0': 0.999, '1': 0.001})
E.setCpt({'0': 0.998, '1': 0.002})
A.setCpt({'111': 0.95, '011': 0.05, '110': 0.94, '010': 0.06,
          '101': 0.29, '001': 0.71, '100': 0.001, '000': 0.999})
J.setCpt({'11': 0.9, '01': 0.1, '10': 0.05, '00': 0.95})
M.setCpt({'11': 0.7, '01': 0.3, '10': 0.01, '00': 0.99})

print("P(A) **********************")
VariableElimination.inference([B, E, A, J, M], ['A'], ['B', 'E', 'J', 'M'], {})

print("P(B | J~M) **********************")
VariableElimination.inference([B, E, A, J, M], ['B'], [
                              'E', 'A'], {'J': 1, 'M': 0})
```

## Task

You should implement 4 functions: `inference`, `multiply`, `sumout` and `restrict`.

## Codes

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


# create nodes for Bayes Net
B = Node("B", ["B"])
E = Node("E", ["E"])
A = Node("A", ["A", "B", "E"])
J = Node("J", ["J", "A"])
M = Node("M", ["M", "A"])

# Generate cpt for each node
B.setCpt({'0': 0.999, '1': 0.001})
E.setCpt({'0': 0.998, '1': 0.002})
A.setCpt({'111': 0.95, '011': 0.05, '110': 0.94, '010': 0.06,
          '101': 0.29, '001': 0.71, '100': 0.001, '000': 0.999})
J.setCpt({'11': 0.9, '01': 0.1, '10': 0.05, '00': 0.95})
M.setCpt({'11': 0.7, '01': 0.3, '10': 0.01, '00': 0.99})

print("P(A) **********************")
VariableElimination.inference([B, E, A, J, M], ['A'], ['B', 'E', 'J', 'M'], {})

print("P(B | J~M) **********************")
VariableElimination.inference([B, E, A, J, M], ['B'], [
                              'E', 'A'], {'J': 1, 'M': 0})
```

## Results

```bash
P(A) **********************
RESULT:
Name = f['A']
 vars ['A']
   key: 1 val : 0.0025164420000000002
   key: 0 val : 0.997483558

P(B | J~M) **********************
RESULT:
Name = f['B']
 vars ['B']
   key: 0 val : 0.9948701418665987
   key: 1 val : 0.0051298581334013015
```
