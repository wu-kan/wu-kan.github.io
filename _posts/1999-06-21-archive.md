---
layout: page
title: 归档
permalink: /archive/
jekyll-theme-WuK:
  default:
    sidebar:
      open: true
  archive:
    group_by: "%b %Y" # 见<https://liquid.bootcss.com/filters/date/>
    posts_count:
      enable: true # 博文数量统计
      append: 篇博文。长路漫漫！ # 提示语
    pie_chart: # 显示一个标签的饼状统计图，需要引入 mermaid
      enable: false
    year_count: true
    toc: # 在正文里显示一个归档的目录
      enable: false
---

{% if page.jekyll-theme-WuK.archive.posts_count.enable %}
{{ site.posts.size }}{{ page.jekyll-theme-WuK.archive.posts_count.append }}
{% endif %}

{% assign count = 1 %}
{% for post in site.posts reversed %}
{% assign year = post.date | date: page.jekyll-theme-WuK.archive.group_by %}
{% assign nyear = post.next.date | date: page.jekyll-theme-WuK.archive.group_by %}
{% if year != nyear %}
{% assign counts = counts | append: count | append: ', ' %}
{% assign count = 1 %}
{% else %}
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% assign counts = counts | split: ', ' | reverse %}
{% if page.jekyll-theme-WuK.archive.pie_chart.enable %}

```mermaid
pie
{{ page.jekyll-theme-WuK.archive.pie_chart.title }}
{% assign i = 0 %}
{% for post in site.posts %}
{% assign year = post.date | date: page.jekyll-theme-WuK.archive.group_by %}
{% assign nyear = post.next.date | date: page.jekyll-theme-WuK.archive.group_by %}
{% if year != nyear %}
"{{ year }}" : {{ counts[i] }}
{% assign i = i | plus: 1 %}
{% endif %}
{% endfor %}
```

{% endif %}
{% if page.jekyll-theme-WuK.archive.toc.enable %}
- TOC
{:toc}
{% endif %}
{% assign i = 0 %}
{% for post in site.posts %}{% assign year = post.date | date: page.jekyll-theme-WuK.archive.group_by %}{% assign nyear = post.next.date | date: page.jekyll-theme-WuK.archive.group_by %}{% if year != nyear %}

## <span class="fa-layers fa-fw"><i class="fas fa-folder-open"></i>{% if page.jekyll-theme-WuK.archive.year_count %}<span class="fa-layers-counter">{{ counts[i] }}</span>{% endif %}</span> {{ year }}{% assign i = i | plus: 1 %}

{% endif %}
- *{{ post.date | date_to_string }}* [{{ post.title }}]({{ post.url | relative_url }}){% endfor %}
