---
layout: page
title: 标签
permalink: /tags/
jekyll-theme-WuK:
  default:
    sidebar:
      open: true
  tags:
    pie_chart: # 显示一个标签的饼状统计图，需要引入 mermaid
      enable: false
    count: true # 统计每个标签下文章的数量
    toc: # 在正文里显示一个标签的目录
      enable: false
---

文章标签分类较多，可在侧边栏的目录中快速定位~

{% if page.jekyll-theme-WuK.tags.pie_chart.enable %}

```mermaid
pie
{{ page.jekyll-theme-WuK.tags.pie_chart.title }}
{% for tag in site.tags reversed %}
"{{ tag[0] }}" : {{ tag[1].size }}
{% endfor %}
```

{% endif %}
{% if page.jekyll-theme-WuK.tags.toc.enable %}
- TOC
{:toc}
{% endif %}
{% for tag in site.tags reversed %}
## <span class="fa-layers fa-fw"><i class="fas fa-tag"></i>{% if page.jekyll-theme-WuK.tags.count %}<span class="fa-layers-counter">{{ tag[1].size }}</span>{% endif %}</span> {{ tag[0] }}

{% for post in tag[1] %}
- *{{ post.date | date_to_string }}* [{{ post.title }}]({{ post.url | relative_url }}){% endfor %}
{% endfor %}
