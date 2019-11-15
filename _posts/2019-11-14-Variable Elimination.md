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
            #Your code here
        for var in orderedListOfHiddenVariables:
            #Your code here
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
        #Your code here
        new_node = Node("f" + str(newList), newList)
        new_node.setCpt(new_cpt)
        return new_node
    def sumout(self, variable):
        """function that sums out a variable given a factor"""
        #Your code here
        new_node = Node("f" + str(new_var_list), new_var_list)
        new_node.setCpt(new_cpt)
        return new_node
    def restrict(self, variable, value):
        """function that restricts a variable to some value
        in a given factor"""
        #Your code here
        new_node = Node("f" + str(new_var_list), new_var_list)
        new_node.setCpt(new_cpt)
        return new_node
# create nodes for Bayes Net
B = Node("B", ["B"])
E = Node("E", ["E"])
A = Node("A", ["A", "B","E"])
J = Node("J", ["J", "A"])
M = Node("M", ["M", "A"])

# Generate cpt for each node
B.setCpt({'0': 0.999, '1': 0.001})
E.setCpt({'0': 0.998, '1': 0.002})
A.setCpt({'111': 0.95, '011': 0.05, '110':0.94,'010':0.06,
'101':0.29,'001':0.71,'100':0.001,'000':0.999})
J.setCpt({'11': 0.9, '01': 0.1, '10': 0.05, '00': 0.95})
M.setCpt({'11': 0.7, '01': 0.3, '10': 0.01, '00': 0.99})

print "P(A) **********************"
VariableElimination.inference([B,E,A,J,M], ['A'], ['B', 'E', 'J','M'], {})

print "P(B | J~M) **********************"
VariableElimination.inference([B,E,A,J,M], ['B'], ['E','A'], {'J':1,'M':0})
```

## Task

You should implement 4 functions: `inference`, `multiply`, `sumout` and `restrict`.

## Codes

```python
class VariableElimination:
    @staticmethod
    def inference(factorList, queryVariables,
                  orderedListOfHiddenVariables, evidenceList):
        for ev, value in evidenceList.items():
            # Your code here
            for i, factor in enumerate(factorList):
                if ev in factor.varList:
                    new_node = factor.restrict(ev, value)
                    factorList.pop(i)
                    factorList.insert(i, new_node)

        for var in orderedListOfHiddenVariables:
            var_factors = [
                factor for factor in factorList if var in factor.varList]

            if len(var_factors) > 0:
                var_res = var_factors[0]
                temp = var_res
                for factor in var_factors[1:]:
                    var_res = var_res.multiply(factor)
                    factorList.remove(factor)

            var_res = var_res.sumout(var)
            factorList.remove(temp)
            if len(var_res.varList) > 0:
                factorList.append(var_res)

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
        same_variables = [var for var in self.varList if var in factor.varList]
        if len(same_variables) > 0:
            variable = same_variables[0]
            i = self.varList.index(variable)
            j = factor.varList.index(variable)

            for x1, y1 in self.cpt.items():
                for x2, y2 in factor.cpt.items():
                    if x1[i] != x2[j]:
                        continue
                    new_cpt[x1[:i] + x2[:j] + x1[i:] + x2[j + 1:]] = y1 * y2
            newList = self.varList[:i] + factor.varList[:j] + \
                self.varList[i:] + factor.varList[j + 1:]
        else:
            for x1, y1 in self.cpt.items():
                for x2, y2 in factor.cpt.items():
                    new_cpt[x1 + x2] = y1 * y2
            newList = self.varList + factor.varList
        new_node = Node("f" + str(newList), newList)
        new_node.setCpt(new_cpt)
        return new_node

    def sumout(self, variable):
        """function that sums out a variable given a factor"""
        # Your code here
        i = self.varList.index(variable)
        new_var_list = self.varList[:i] + self.varList[i + 1:]

        new_cpt = {}
        for x in self.cpt:
            now_key = x[:i] + x[i + 1:]
            if now_key not in new_cpt:
                new_cpt[now_key] = self.cpt[x[:i] + '0' + x[i + 1:]] + \
                    self.cpt[x[:i] + '1' + x[i + 1:]]

        new_node = Node("f" + str(new_var_list), new_var_list)
        new_node.setCpt(new_cpt)
        return new_node

    def restrict(self, variable, value):
        """function that restricts a variable to some value
        in a given factor"""
        # Your code here
        i = self.varList.index(variable)
        new_cpt = dict([(x[:i] + x[i + 1:], y)
                        for x, y in self.cpt.items() if int(x[i]) == value])
        new_var_list = self.varList[:i] + self.varList[i + 1:]

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
