---
redirect_from: /_posts/2018-10-23-%E5%87%BD%E6%95%B0%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E5%AE%9E%E9%AA%8C%E4%B8%89-%E4%BD%BF%E7%94%A8Newton-Raphson%E6%96%B9%E5%BC%8F%E8%AE%A1%E7%AE%97%E5%B9%B3%E6%96%B9%E6%A0%B9/
title: 函数程序设计实验三：使用Newton-Raphson方式计算平方根
tags: 函数程序设计实验
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
