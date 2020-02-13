---
title: Expectation Maximization
tags:
  - 人工智能
---

## Expectation Maximization

### The Gaussian Distribution

The Gaussian, also known as the normal distribution, is a widely used model for the distribution of continuous variables. In the case of a single variable $x$, the Gaussian distribution can be written in the form

$\mathcal N(x\mid \mu,\sigma^2)=\frac{1}{(2\pi\sigma^2)^{1/2}}\exp\{-\frac{1}{2\sigma^2}(x-\mu)^2\}$

where $\mu$ is the mean and $\sigma^2$ is the variance.

For a $D$-dimensional vector $\mathbf x$, the multivariate Gaussian distribution takes the form

$\mathcal N(\mathbf x\mid \boldsymbol\mu,\boldsymbol\Sigma)=\frac{1}{(2\pi)^{D/2}}\frac{1}{\mid \boldsymbol\Sigma\mid ^{1/2}}\exp\{-\frac{1}{2}(\mathbf x-\boldsymbol\mu)^{\mathrm T}\boldsymbol\Sigma^{-1}(\mathbf x-\boldsymbol\mu\}$

where $\boldsymbol\mu$ is a $D$-dimensional mean vector, $\boldsymbol\Sigma$ is a $D\times D$ covariance matrix, and $\mid \boldsymbol\Sigma\mid $ denotes the determinant of $\mid \boldsymbol\Sigma\mid $.

### Mixtures of Gaussians

#### Introduction

While the Gaussian distribution has some important analytical properties, it suffers from significant limitations when it comes to modelling real data sets. Consider the example shown in Figure. This is known as the ‘Old Faithful’ data set, and comprises 272 measurements of the eruption of the Old Faithful geyser at Yel-lowstone National Park in the USA. Each measurement comprises the duration of the eruption in minutes (horizontal axis) and the time in minutes to the next eruption (vertical axis). We see that the data set forms two dominant clumps, and that a simple Gaussian distribution is unable to capture this structure, whereas a linear superposition of two Gaussians gives a better characterization of the data set.

\begin{figure}[ht]
\centering
\includegraphics[width=17cm]{fig1.png}
\caption{Example of a Gaussian mixture distribution}
\label{fig:fig1}
\end{figure}

Such superpositions, formed by taking linear combinations of more basic distributions such as Gaussians, can be formulated as probabilistic models known as **mixture distributions**. In Figure we see that a linear combination of Gaussians can give rise to very complex densities. By using a sufficient number of Gaussians, and by adjusting their means and covariances as well as the coefficients in the linear combination, almost any continuous density can be approximated to arbitrary accuracy.

We therefore consider a superposition of $K$ Gaussian densities of the form

$p(\mathbf x)=\sum_{k=1}^K\pi_k\mathcal N(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)$

which is called a mixture of Gaussians. Each Gaussian density $\mathcal N(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)$ is called a component of the mixture and has its own mean $\boldsymbol\mu_k$ and covariance $\boldsymbol\Sigma_k$.

The parameters $\pi_k$ in $p(\mathbf x)=\sum_{k=1}^K\pi_k\mathcal N(\mathbf x|\boldsymbol\mu_k,\boldsymbol\Sigma_k)$ are called **mixing coefficients**. If we integrate both sides of $p(\mathbf x)=\sum_{k=1}^K\pi_k\mathcal N(\mathbf x|\boldsymbol\mu_k,\boldsymbol\Sigma_k)$ with respect to $\mathbf x$, and note that both $p(\mathbf x)$ and the individual Gaussian
components are normalized, we obtain

$\sum_{k=1}^{K}\pi_k=1$

Also, the requirement that $p(\mathbf x)\geq 0$, together with $\mathcal N(\mathbf x\mid \mu_k,\Sigma_k)\geq 0$, implies $\pi_k\geq 0$ for all $k$. Combining this with condition (\ref{equ:sum}) we obtain

$0\leq\pi_k\leq 1$

We therefore see that the mixing coefficients satisfy the requirements to be probabilities.

From the sum and product rules, the marginal density is given by

$p(\mathbf x)=\sum_{k=1}^K p(k)p(\mathbf x\mid k)$

which is equivalent to $p(\mathbf x)=\sum_{k=1}^K\pi_k\mathcal N(\mathbf x|\boldsymbol\mu_k,\boldsymbol\Sigma_k)$ in which we can view $\pi_k=p(k)$ as the prior probability of picking the $k^{th}$ component, and the density $\mathcal N(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)= p(\mathbf x\mid k)$ as the probability of $\mathbf x$ conditioned on $k$. From Bayes' theorem these are given by

$\gamma_k(\mathbf x)=p(k\mid \mathbf x)=\frac{p(k)p(\mathbf x\mid k)}{\sum_lp(l)p(\mathbf x\mid l)}=\frac{\pi_k\mathcal N(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)}{\boldsymbol{\sum}_l\pi_k\mathcal N(\mathbf x\mid \boldsymbol\mu_l,\boldsymbol\Sigma_l)}$

The form of the Gaussian mixture distribution is governed by the parameters $\pi$, $\boldsymbol\mu$ and $\boldsymbol\Sigma$, where we have used the notation $\boldsymbol\pi=\{\pi_1,...,\pi_K\}$, $\boldsymbol\mu=\{\boldsymbol\mu_1,...,\boldsymbol\mu_k\}$ and $\boldsymbol\Sigma=\{\boldsymbol\Sigma_1,...,\boldsymbol\Sigma_K\}$. One way to set the values of there parameters is to use maximum likelihood. From $p(\mathbf x)=\sum_{k=1}^K\pi_k\mathcal N(\mathbf x|\boldsymbol\mu_k,\boldsymbol\Sigma_k)$ the log of the likelihood function is given by

$\ln p(\mathbf X\mid \boldsymbol\pi,\boldsymbol\mu,\boldsymbol\Sigma)=\sum_{n=1}^N\ln\{\sum_{k=1}^K\pi_k\mathcal N(\mathbf x_n\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k\}$

where $X = \{\mathbf x_1,...,\mathbf x_N\}$. One approach to maximizing the likelihood function is to use iterative numerical optimization techniques. Alternatively we can employ a powerful framework called expectation maximization (EM).

#### About Latent Variables

We now turn to a formulation of Gaussian mixtures in terms of discrete **latent** variables. This will provide us with a deeper insight into this important distribution, and will also serve to motivate the expectation-maximization (EM) algorithm.

Recall from $p(\mathbf x)=\sum_{k=1}^K\pi_k\mathcal N(\mathbf x|\boldsymbol\mu_k,\boldsymbol\Sigma_k)$ that the Gaussian mixture distribution can be written as a linear superposition of Gaussians in the form

$p(\mathbf x)=\sum_{k=1}^K\pi_k\mathcal N(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)$

Let us introduce a $K$-dimensional binary random variable $\mathbf z$ having a 1-of-$K$ representation in which a particular element $z_k$ is equal to 1 and all other elements are equal to 0. The values of $z_k$ therefore satisfy $z_k\in\{0,1\}$ and $\Sigma_k z_k=1$, and we see that there are $K$ possible states for the vector $\mathbf z$ according to which element is nonzero. We shall define the joint distribution $p(\mathbf x, \mathbf z)$ in terms of a marginal distribution $p(\mathbf z)$ and a conditional distribution $p(\mathbf x\mid \mathbf z)$. The marginal distribution over $\mathbf z$ is specified in terms of the mixing coefficients $\pi_k$, such that

$p(z_k=1)=\pi_k$

where the parameters $\{\pi_k\}$ must satisfy

$0\leq\pi_k\leq 1$

together with

$\sum_{k=1}^K\pi_k=1$

in order to be valid probabilities. Because $\mathbf z$ uses a 1-of-$K$ representation, we can also write this distribution in the form

$p(\mathbf z)=\prod_{k=1}^K\pi_k^{z_k}$

Similarly, the conditional distribution of $\mathbf x$ given a particular value for $\mathbf z$ is a Gaussian

$p(\mathbf x\mid z_k=1)=\mathcal(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)$

which can also be written in the form

$p(\mathbf x\mid \mathbf z)=\prod^K_{k=1}p\mathcal(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)^{z_k}.$

The joint distribution is given by $p(\mathbf z)p(\mathbf x\mid \mathbf z)$, and the marginal distribution of $\mathbf x$ is then obtained by summing the joint distribution over all possible states of $\mathbf z$ to give

$p(\mathbf x)=\sum_{\mathbf z}p(\mathbf z)p(\mathbf x\mid \mathbf z)=\sum_{k=1}^K\pi_k\mathcal N(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)$

where we have made use of (\ref{equ:form1}) and (\ref{equ:form2}). Thus the marginal distribution of $\mathbf x$ is a Gaussian mixture of the form (\ref{equ:form3}). If we have several observations $\mathbf{x_1,...,x_N}$, then, because we have represented the marginal distribution in the form $p(\mathbf x)=\sum_{\mathbf z}p(\mathbf x,\mathbf z)$, it follows that for every observed data point $\mathbf x_n$ there is a corresponding latent variable $\mathbf z_n$.

We have therefore found an equivalent formulation of the Gaussian mixture involving an explicit latent variable. It might seem that we have not gained much by doing so. However, we are now able to work with the joint distribution $p(\mathbf x, \mathbf z)$ instead of the marginal distribution $p(\mathbf x)$, and this will lead to significant simplifications, most notably through the introduction of the expectation-maximization (EM) algorithm.

Another quantity that will play an important role is the conditional probability of $\mathbf z$ given $\mathbf x$. We shall use $\gamma(z_k)$to denote $p(z_k=1\mid \mathbf x)$, whose value can be found using Bayes’ theorem

$\gamma(z_k)=p(z_k=1\mid \mathbf x)=\frac{p(z_k=1)p(\mathbf x\mid z_k=1)}{\sum_{j=1}^Kp(z_j=1)p(\mathbf x\mid z_j=1)}=\frac{\pi_k\mathcal N(\mathbf x\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)}{\sum_{j=1}^K\pi_j\mathcal N(\mathbf x\mid \boldsymbol\mu_j,\boldsymbol\Sigma_j)}$

We shall view $\pi_k$ as the prior probability of $z_k=1$, and the quantity $\gamma(z_k)$ as the corresponding posterior probability once we have observed $\mathbf x$. As we shall see later, $\gamma(z_k)$ can also be viewed as the responsibility that component $k$ takes for ‘explaining’ the observation $\mathbf x$.

### EM for Gaussian Mixtures

Initially, we shall motivate the EM algorithm by giving a relatively informal treatment in the context of the Gaussian mixture model.

Let us begin by writing down the conditions that must be satisfied at a maximum of the likelihood function. Setting the derivatives of $\ln p(\mathbf X\mid \boldsymbol\pi,\boldsymbol\mu,\boldsymbol\Sigma)$ with respect to the means $\boldsymbol\mu_k$ of the Gaussian components to zero, we obtain

$0=-\sum_{n=1}^n\frac{\pi_k\mathcal N(\mathbf x_n\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)}{\underbrace{\sum_j\pi_j\mathcal N(\mathbf x_n\mid \boldsymbol\mu_j,\boldsymbol\Sigma_j)}_{\gamma(z_{nk})}}\sum_k(\mathbf x_n-\boldsymbol\mu_k)$

Multiplying by $\boldsymbol\Sigma_k^{-1}$ (which we assume to be nonsingular) and rearranging we obtain

$\boldsymbol\mu_k=\frac{1}{N_k}\sum_{n=1}^N\gamma(z_{nk})\mathbf x_n$

where we have defined

\$ N*k=\sum*{n=1}^N\gamma(z\_{nk}).
\end{equation}

We can interpret $N_k$ as the effective number of points assigned to cluster $k$. Note carefully the form of this solution. We see that the mean $\boldsymbol\mu_k$ for the $k^{th}$ Gaussian component is obtained by taking a weighted mean of all of the points in the data set, in which the weighting factor for data point $\mathbf x_n$ is given by the posterior probability $\gamma(z_{nk})$ that component $k$ was responsible for generating $\mathbf x_n$.

If we set the derivative of $\ln(\mathbf X\mid \boldsymbol\pi,\boldsymbol\mu,\boldsymbol\Sigma)$ with respect to $\boldsymbol\Sigma_k$ to zero, and follow a similar line of reasoning, making use of the result for the maximum likelihood for the covariance matrix of a single Gaussian, we obtain

$\boldsymbol\Sigma_k=\frac{1}{N_k}\sum^N_{n=1}\gamma(z_{nk})(\mathbf x_n-\boldsymbol\mu_k)(\mathbf x_n-\boldsymbol\mu_k)^{\mathrm T}$

which has the same form as the corresponding result for a single Gaussian fitted to the data set, but again with each data point weighted by the corresponding posterior
probability and with the denominator given by the effective number of points associated with the corresponding component.

Finally, we maximize $\ln p(\mathbf X\mid \boldsymbol\pi,\boldsymbol\mu,\boldsymbol\Sigma)$ with respect to the mixing coefficients $\pi_k$. Here we must take account of the constraint $\sum_{k=1}^K\pi_k=1$. This can be achieved using a Lagrange multiplier and maximizing the following quantity

$\ln p(\mathbf X\mid \boldsymbol\pi,\boldsymbol\mu,\boldsymbol\Sigma)+\lambda(\sum_{k=1}^K\pi_k-1)$

which gives

$0=\sum_{n=1}^N\frac{\mathcal N(\mathbf x_n\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)}{\sum_j\pi_j\mathcal N(\mathbf x_n\mid \boldsymbol\mu_j,\boldsymbol\Sigma_j)}$

where again we see the appearance of the responsibilities. If we now multiply both sides by $\pi_k$ and sum over $k$ making use of the constraint $\sum_{k=1}^K\pi_k=1$, we find $\lambda=-N$. Using this to eliminate $\lambda$ and rearranging we obtain

$\pi_k=\frac{N_k}{N}$

so that the mixing coefficient for the $k^{th}$ component is given by the average responsibility which that component takes for explaining the data points.

### EM Algorithm

Given a Gaussian mixture model, the goal is to maximize the likelihood function with respect to the parameters (comprising the means and covariances of the components and the mixing coefficients).

- Initialize the means $\boldsymbol\mu_k$, covariances $\boldsymbol\Sigma_k$ and mixing coefficients $\pi_k$, and evaluate the initial value of the log likelihood.
- **E step** Evaluate the responsibilities using the current parameter values$	\gamma(z_{nk})=\frac{\pi_k\mathcal N(\mathbf x_n\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k)}{\sum_{j=1}^K\pi_j\mathcal N(\mathbf x_n\mid \boldsymbol\mu_j,\boldsymbol\Sigma_j)}$
- **M step**. Re-estimate the parameters using the current responsibilities
  $\boldsymbol\mu_k^{new}=\frac{1}{N_k}\sum_{n=1}^N\gamma(z_{nk})\mathbf x_n$
  $\boldsymbol\Sigma_k^{new}=\frac{1}{N_k}\sum_{n=1}^N\gamma(z_{nk})(\mathbf x_n-\boldsymbol\mu_k^{new})(\mathbf x_n-\boldsymbol\mu_k^{new})^{\mathrm T}$
  $\pi_k^{new}=\frac{N_k}{N}$
  where $N_k=\sum_{n=1}^N\gamma(z_{nk})$
- Evaluate the log likelihood $ \ln p(\mathbf X\mid \boldsymbol\mu,\boldsymbol\Sigma,\boldsymbol\pi)=\sum_{n=1}^N\ln \{\sum_{k=1}^K\pi_k\mathcal N(\mathbf x_n\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k\}$ and check for convergence of either the parameters or the log likelihood. If the convergence criterion is not satisfied return to step 2.

## Chinese Football Dataset

The following Chinese Football Dataset has recored the performance of 16 AFC football teams between 2005 and 2018.

```bash
Country	2006WorldCup 2010WorldCup 2014WorldCup 2018WorldCup 2007AsianCup 2011AsianCup 2015AsianCup
China	50	50	50	40	9	9	5
Japan	28	9	29	15	4	1	5
South_Korea	17	15	27	19	3	3	2
Iran	25	40	28	18	5	5	5
Saudi_Arabia	28	40	50	26	2	9	9
Iraq	50	50	40	40	1	5	4
Qatar	50	40	40	40	9	5	9
United_Arab_Emirates	50	40	50	40	9	9	3
Uzbekistan	40	40	40	40	5	4	9
Thailand	50	50	50	40	9	17	17
Vietnam	50	50	50	50	5	17	17
Oman	50	50	40	50	9	17	9
Bahrain	40	40	50	50	9	9	9
North_Korea	40	32	50	50	17	9	9
Indonesia	50	50	50	50	9	17	17
Australia	16	21	30	30	9	2	1
```

The scoring rules are below:

- For the FIFA World Cup, teams score the same with their rankings if they enter the World Cup; teams score 50 for failing to entering the Asia Top Ten; teams score 40 for entering the Asia Top Ten but not entering the World Cup.
- For the AFC Asian Cup, teams score the same with their rankings if they finally enter the top four; teams score 5 for entering the top eight but not the top four, and 9 for entering the top sixteen but not top eight; teams score 17 for not passing the group stages.

We aim at classifying the above 16 teams into 3 classes according to their performance: the first-class, the second-class and the third-class. **In our opinion, teams of Australia, Iran, South Korea and Japan belong to the first-class, while the Chinese football team belongs to the third-class**.

## Tasks

- Assume that score vectors of teams in the same class are normally distributed, we can thus adopt the Gaussian mixture model. Please classify the teams into 3 classes by using EM algorithm. If necessary, you can refer to page 430-439 in the book **Pattern Recognition and Machine Learning.pdf** and the website <https://blog.csdn.net/jinping_shi/article/details/59613054> which is a Chinese translation.
- You should show the values of these parameters: $\boldsymbol\gamma$, $\boldsymbol\mu$ and $\boldsymbol\Sigma$. If necessary, you can plot the clustering results. **Note that $\boldsymbol\gamma$ is essential for classifying.**

## Codes and Results

这里我自己实现了高斯混合模型（GMM）及其 EM 算法的实现`GaussianMixedModel`，并和`sklearn.mixture.GMM`包的结果作对比。

```python
from scipy.stats import multivariate_normal
from sklearn.mixture import GMM
import numpy


def GaussianMixedModel(data, all_coef, maxIter=50, eps=1e-9):
    def calGaussian(x, mean_, cov_):
        if mean_.shape[0] == 1:
            now_mean = mean_[0, :]
        else:
            now_mean = mean_
        return multivariate_normal.pdf(
            x, mean=now_mean, cov=cov_, allow_singular=True)

    def calGamma(x, all_coef):
        gammas = numpy.array([coef[2]*calGaussian(x, coef[0], coef[1])
                              for coef in all_coef])
        return gammas/sum(gammas)

    # x[0]: mean, x[1]: cov, x[2]: pi for each x in all_coef
    N, M = data.shape
    K = len(all_coef)
    iter_all_coef = numpy.array(all_coef)
    max_mean_dis, max_cov_dis, max_pi_dis = 0, 0, 0
    for _it in range(maxIter):
        # E step
        all_gammas = numpy.array([calGamma(
            data[i].reshape((1, M)), iter_all_coef) for i in range(N)])

        new_nk = numpy.array([sum(all_gammas[:, k]) for k in range(K)])

        # M step
        new_mean = []
        new_cov = []
        new_pi = [new_nk[k] / N for k in range(K)]
        for k in range(K):

            now_mean = numpy.zeros((1, M))
            for i in range(N):
                now_mean += all_gammas[i, k] * data[i].reshape((1, M))
            new_mean.append(now_mean / new_nk[k])

            now_cov = numpy.zeros((M, M))
            for i in range(N):
                normal_data = data[i].reshape((1, M)) - new_mean[k]
                now_cov += all_gammas[i, k] * \
                    numpy.dot(normal_data.T, normal_data)
            new_cov.append(now_cov / new_nk[k])

        max_mean_dis = numpy.max(
            [numpy.linalg.norm(new_mean[k] - all_coef[k][0], 2) for k in range(K)])

        max_cov_dis = numpy.max(
            [numpy.linalg.norm(new_cov[k] - all_coef[k][1], 2) for k in range(K)])

        max_pi_dis = numpy.max(
            [numpy.linalg.norm([new_pi[k] - all_coef[k][2]], 2) for k in range(K)])

        iter_all_coef = numpy.array([[new_mean[k], new_cov[k], new_pi[k]]
                                     for k in range(K)])

        if max_mean_dis < eps and max_cov_dis < eps and max_pi_dis < eps:
            break
    print(max_mean_dis, max_cov_dis, max_pi_dis)
    all_gammas = numpy.array([calGamma(
        data[i].reshape((1, M)), iter_all_coef) for i in range(N)])
    return all_gammas


if __name__ == '__main__':
    name = []
    data = []
    firstFlag = 1
    for line in """
Country	2006WorldCup 2010WorldCup 2014WorldCup 2018WorldCup 2007AsianCup 2011AsianCup 2015AsianCup
China	50	50	50	40	9	9	5
Japan	28	9	29	15	4	1	5
South_Korea	17	15	27	19	3	3	2
Iran	25	40	28	18	5	5	5
Saudi_Arabia	28	40	50	26	2	9	9
Iraq	50	50	40	40	1	5	4
Qatar	50	40	40	40	9	5	9
United_Arab_Emirates	50	40	50	40	9	9	3
Uzbekistan	40	40	40	40	5	4	9
Thailand	50	50	50	40	9	17	17
Vietnam	50	50	50	50	5	17	17
Oman	50	50	40	50	9	17	9
Bahrain	40	40	50	50	9	9	9
North_Korea	40	32	50	50	17	9	9
Indonesia	50	50	50	50	9	17	17
Australia	16	21	30	30	9	2	1
""".strip().split('\n'):
        if firstFlag:
            firstFlag = 0
        else:
            now_line = line.strip().split()
            name.append(now_line[0])
            data.append(list(map(lambda x: int(x), now_line[1:])))

    data = numpy.array(data)
    N, M = data.shape

    gamma = GMM(n_components=3).fit(data).predict_proba(data)

    classfy = [[], [], []]
    for i in range(N):
        classfy[numpy.argmax(gamma[i])].append(name[i])
    print(classfy)

    gamma = GaussianMixedModel(data,
                               [[data[1], numpy.eye(M), 1 / 3],
                                [data[14], numpy.eye(M), 1 / 3],
                                [data[0], numpy.eye(M), 1 / 3]])
    classfy = [[], [], []]
    for i in range(N):
        classfy[numpy.argmax(gamma[i])].append(name[i])
    print(classfy)
```

运行结果如下。

```python
$ python EM.py
[['Japan', 'South_Korea', 'Australia'], ['China', 'Iraq', 'Thailand', 'Vietnam', 'Oman', 'North_Korea', 'Indonesia'], ['Iran', 'Saudi_Arabia', 'Qatar', 'United_Arab_Emirates', 'Uzbekistan', 'Bahrain']]
18.728587773778564 217.40957292332368 0.041666666666666685
[['Japan', 'South_Korea', 'Iran', 'Saudi_Arabia', 'Australia'], ['United_Arab_Emirates', 'Thailand', 'Vietnam', 'Oman', 'Indonesia'], ['China', 'Iraq', 'Qatar', 'Uzbekistan', 'Bahrain', 'North_Korea']]
```

可以看到`sklearn.mixture.GMM`包的聚类结果（前一个`List`）和我自己实现的`GaussianMixedModel`的聚类结果（后一个`List`）大致接近，和中国队在一起的基本上都是一些三流队伍，哎…
