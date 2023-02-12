---
title: "DStress: Automatic Synthesis of DRAM Reliability Stress Viruses using Genetic Algorithms"
tags: 论文阅读
---

> 这个系列的博客用于记录我阅读论文并做一些 review 练习的过程。
>
> - Follow-up 前沿论文，能够比较深入的理解论文的优缺点，以及如果要接着做的话，怎么形成自己的 idea；
> - 学习别人论文的结构和 story-telling，怎么把故事讲好，以及好的词句和表达；
> - 锻炼一下英语写作，尤其是 professional writing。

本篇论文来自于 [MICRO-53(2020)](https://www.microarch.org/micro53/)，链接见<https://www.microarch.org/micro53/papers/738300a298.pdf>。

## Review

### Overall merit (mark one with a "x")

> Please provide your recommendation.

- [ ] Reject: This paper should not be in the program.
- [ ] Weak reject: I'd rather this paper not be in the program.
- [ ] Weak accept: I'd prefer for this paper to be in the program.
- [x] Accept: This paper should be in the program.
- [ ] Strong accept: This paper really ought to be in the program.

理由：从结果上来看这篇文章确实被接受了（甚至获得了最佳论文提名），但是忽略这一点，从论文的思路上看也比较严密：找到了一个存在的问题（“DRAM 可靠性测试充满挑战”）；基于经典精巧的遗传算法设计了一个综合框架，可以用于搜索最坏情况下 DRAM 错误行为的数据和内存访问模式，且无需考虑内部的 DRAM 设计；通过长达七个月的实验，得到了一些很有趣的第一次被发现的现象，例如“1100”数据模式增加了单比特错误的概率；最后给出了本项工作可能的应用场景。没有给 Strong accept 的理由有两点，第一是自己并没有对 memory 领域进行很深的研究，没有办法从更高的视角看待这篇文章（当然我想这篇论文在实际 Review 的时候一定会有很多 Strong accept），且这项工作对我的吸引力不那么大，受众面主要是硬件供应商（用于对硬件进行测试）、数据中心（用于预测硬件维护周期）、安全厂商（用于模拟 Rowhammer 攻击）；其次，根据我对遗传算法的了解，这类算法是有一定局限性的：容易收敛于局部最优解（因此很难构造得到全面的测试用例）甚至未必能收敛（“Finally, our GA search engine did not find particular access patterns that increase the probability of UEs, since the search did not converge to specific patterns. ”）；效率通常低于其他传统搜索算法（“This search took about one week and 80 generations were produced.”）；搜索效果依赖于参数设置（论文中先通过模拟搜索得到一个预估参数，但模拟搜索的参数调整仍然是需要经验的）。而论文中并未给出使用遗传算法的原因或优势，以及和其他搜索策略（如模拟退火、蚁群算法等）的效果比较。总的来说，我觉得这项工作的整体方向做的是没有问题的，但就我能完全看懂的技术细节（搜索算法）这部分而言仍然值得商榷。

### Reviewer's expertise (mark one with a "x")

> Please select the option that most closely expresses your qualification as a Reviewer for this paper.

- [ ] Little familiarity: I can give my two cents.
- [x] Some familiarity: I can provide an educated review.
- [ ] Knowledgeable: I can review this paper with confidence.
- [ ] Expert: I'd expect to be assigned a paper like this one.

理由：自己只有有限的数电知识，了解 DRAM 的工作原理；文章中使用到的“遗传算法”自己也有[做过简单的实验](https://wu-kan.cn/2020/06/03/%E4%BD%BF%E7%94%A8%E6%A8%A1%E6%8B%9F%E9%80%80%E7%81%AB%E5%92%8C%E9%81%97%E4%BC%A0%E7%AE%97%E6%B3%95%E6%B1%82%E8%A7%A3-TSP-%E9%97%AE%E9%A2%98/)；但是自己并没有对 memory 领域做过调研。

### For the next several queries

> Please rate the paper on a scale of 1-4, where the quality increases as the number increases. A rating of 1 is the lowest (worst) and a rating of 4 is the highest (best). Mark each category with "1", "2", "3", or "4".

- [4] Originality (Does the paper make an original contribution?)
- [3] Technical merit (Is the paper technically sound?)
- [4] Clarity (Was the paper clear and easy to understand with proper English?)
- [4] Overall rating (What is your general impression of the paper?)
- [3] Confidence (Your technical confidence in the review.)

理由：同“Overall merit”。

### Paper summary

> Please provide a short summary of the paper that captures the key contributions in your review.

In this paper, a software-hardware framework for automatic synthesizing DRAM reliability stress viruses that does not require any knowledge of DRAM internals, called DStress, was presented. A novel programming tool was developed and integrated into DStress, to specify the type of data and memory access patterns that should be examined by the search engine.

The results of 7-month experimental study and demonstrate the 64-bit, 24-KByte and 254-KByte data patterns, as well as access patterns, discovered by DStress were presented. These patterns detect by at least 45% more errors than the microbenchmarks used in previous studies, and the discovered data and memory access patterns induce the worst-case DRAM error behavior with a probability greater than 0.95.

Finally, several use cases of DStress were provided, which explain how the framework can be used for investigating workload-aware DRAM error behavior, including possible scenarios for "rowhammer" attacks, and revealing DRAM operating guardbands.

### Key strengths and weaknesses

> Please provide up to three strengths and three weaknesses, in the form of short (+) and (-) bullets, respectively.

- [+] DStress was the first software-hardware framework for automatic synthesizing DRAM reliability stress viruses that does not require any knowledge of DRAM internals.
- [+] Patterns discovered by DStress in the 7-month experimental study were by at least 45% more errors than the microbenchmarks used in previous studies.
- [+] Several use cases showed that DStress can be used for investigating workload-aware DRAM error behavior, which could be useful to solve the major obstacle for scaling down the density of cells in future DRAM technologies.
- [-] It took a long time (up to weeks) to find the patterns, which could be an obstacle in DRAM hardware design.
- [-] The search did not converge to specific patterns in some cases.

### Comments to authors (these comments will be sent to the paper authors)

> Please provide detailed comments that support your scores, as well as Constructive feedback to make the paper stronger. This should constitute the meat of your review, however do not expect authors to address this section In their rebuttal.

While the overall direction was good enough, there were small flaws in the technical work. Sufficient reasons about using the GA search engine were not given, which might lead to the two weaknesses above. Would other search engine be better, e.g. SA (Simulated Annealing) and ACA (Ant Colony Algorithm)? Data should be given to show that the GA search engine here is enough, otherwise it seems to take too much time to find the patterns, even not converge to specific patterns sometimes.

### Miscellaneous comments (hidden from authors)

> Please enter any comments that you may want to disclose.

No comments.

## Review of Review

> 附上导师的评价：
>
> ![review-11252021-14.png](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/12/03/sIHjfpVk5nlvt4W.png)
> 对于论文的 Summary，一般来说四行左右即可，且不要出现具体的数字。一些倒装句子头重脚轻。
>
> ![review-11252021-15.png](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/12/03/YuJCzpRfMBE7Phl.png)
> 同上，不要出现数字。
>
> ![review-11252021-16.png](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/12/03/5Xhv6jslTS8ufVR.png)
> 一些表达不够严谨。最后一句话表意有问题。

第一次写 review，不太了解一些约定俗成的规则，总觉得句子越长越好…忽略了这样其实也是很不合表达习惯的。另外很多意思自己都很难表达出来，需要借助 Google Translate，writing 还有待提高。
