---
title: A simple web server benchmark comparison
categories: Projects
tags: Go Bun PHP Node.js Rust c libuv make bash python
---


I spent a day having some fun comparing the performance of different web servers on my local machine. For this little project, I tested servers written langs: c (libuv), Go, Bun, PHP, Node.js, and Rust (hyper), just to see how they stack up. I used simple benchmarking tools and made sure to keep it easy with make to handle all the tasks.

Why did I do this? Well, sometimes it's just fun to see how different languages and frameworks perform, and it's a great way to learn! Plus, it's always interesting to find out which server can handle the load the best.

- [Github project](https://github.com/stan-kondrat/simple-web-server-benchmark-comparison/)
- [Results page](https://stan-kondrat.github.io/simple-web-server-benchmark-comparison/)

![A simple web server benchmark comparison - Preview](https://raw.githubusercontent.com/stan-kondrat/simple-web-server-benchmark-comparison/refs/heads/main/docs/simple-bench-preview.png)

Feel free to run your own benchmarks!
