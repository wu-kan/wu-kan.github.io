---
title: 函数程序设计实验三：使用Newton-Raphson方式计算平方根
categories: 函数程序设计实验
abbrlink: 21074
date: 2018-10-23 01:55:08
---
```haskell
module Newton_Raphson where
squareroot2 :: Float -> Integer -> Float
squareroot2 x0 n=squareroot 2 x0 n

squareroot :: Float -> Float -> Integer -> Float
squareroot r x0 0=x0
squareroot r x0 n=(x+r/x)/2 where x=squareroot r x0 (n-1)

sqrtSeq :: Float -> Float -> [Float]
sqrtSeq r x0=x0:sqrtSeq r (squareroot r x0 1)

squareroot' :: Float -> Float -> Float -> Float
squareroot' r x0 eps=f (sqrtSeq r x0) eps where f (y:ys) eps=if abs((head ys)-y)<eps then y else f ys eps
```