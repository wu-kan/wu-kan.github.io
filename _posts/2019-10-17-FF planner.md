---
title: FF planner
categoreis:
- 人工智能
- 实验
---
[pddl在线IDE](http://editor.planning.domains/)

## 8-puzzle

### `domain.pddl`

```pddl
(define(domain puzzle)
    (:predicates
        (at ?x ?y)
        (near ?x ?y)
        (empty ?x )
    )
    (:action slide
        :parameters (?x ?y ?z)
        :precondition
            (and
                (empty ?z)
                (at ?x ?y)
                (near ?y ?z)
            )
        :effect
            (and
                (not　　
                    (at ?x ?y)
                )
                (not
                    (empty ?z)
                )
                (empty ?y)
                (at ?x ?z)
            )
    )
)
```

### `problem.pddl`

```pddl
(define(problem prob)
    (:domain puzzle)
    (:objects N1 N2 N3 N4 N5 N6 N7 N8 L1 L2 L3 L4 L5 L6 L7 L8 L9)
    (:init
        (at N1 L1)(near L1 L2)(near L1 L4)
        (at N2 L2)(near L2 L1)(near L2 L3)(near L2 L5)
        (at N3 L3)(near L3 L2)(near L3 L6)
        (at N7 L4)(near L4 L1)(near L4 L5)(near L4 L7)
        (at N8 L5)(near L5 L4)(near L5 L2)(near L5 L6)(near L5 L8)
        (empty L6)(near L6 L3)(near L6 L5)(near L6 L9)
        (at N6 L7)(near L7 L4)(near L7 L8)
        (at N4 L8)(near L8 L7)(near L8 L5)(near L8 L9)
        (at N5 L9)(near L9 L6)(near L9 L8)
    )
    (:goal
        (and
            (at N1 L1)
            (at N2 L2)
            (at N3 L3)
            (at N4 L4)
            (at N5 L5)
            (at N6 L6)
            (at N7 L7)
            (at N8 L8)
        )
    )
)
```

## Blocks World

现有积木若干，积木可以放在桌子上，也可以放在另一块积木上面。有两种操作：

- `move(x, y)`：把积木x放到积木y上面。前提是积木x和积木y上面没有其他积木。
- `moveToTable(x)`：把积木x放到桌子上，前提是积木x上面无其他积木，且积木x不在桌子上。

### `domain.pddl`

```pddl
(define(domain blocks)
    (:requirements
        :strips
        :typing
        :equality
        :universal-preconditions
        :conditional-effects
    )
    (:types physob)
    (:predicates
  	    (ontable ?x - physob)
        (clear ?x - physob)
	      (on ?x ?y - physob)
    )
    (:action move
        :parameters (?x ?y - physob)
        :precondition
            (and
                (clear ?x)
                (clear ?y)
                (not
                    (= ?x ?y)
                )
            )
        :effect
            (and
                (on ?x ?y)
                (clear ?x)
                (not
                    (clear ?y)
                )
                (forall(?z - physob)
                    (when(on ?x ?z)
                        (and
                            (not (on ?x ?z))
                            (clear ?z)
                        )
                    )
                )
                (when(ontable ?x)
                    (not
                        (ontable ?x)
                    )
                )
            )
    )
    (:action moveToTable
    :parameters(?x - physob)
    :precondition(and (clear ?x)(not (ontable ?x)))
    :effect
        (and
            (ontable ?x)
            (forall (?z - physob)
                (when (on ?x ?z)
                    (and
                        (not
                            (on ?x ?z)
                        )
                        (clear ?z)
                    )
                )
            )
        )
    )
)
```

### `problem.pddl`

```pddl
(define(problem prob)
    (:domain blocks)
    (:objects A B C D E F - physob)
    (:init
        (clear A)
        (on A B)
        (on B C)
        (ontable C)
        (ontable D)
        (ontable F)
        (on E D)
        (clear E)
        (clear F)
    )
    (:goal
        (and
            (clear F)
            (on F A)
            (on A C)
            (ontable C)
            (clear E)
            (on E B)
            (on B D)
            (ontable D)
        )
    )
)
```
