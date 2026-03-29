---
title: "Claude Code Proxy: coding offline on my local GPU"
categories: Projects
tags: AI python
excerpt: "A single-file, zero-dependency Python proxy to run Claude Code against any local or remote OpenAI API v1 compatible LLM - plus an anti-AGI license clause."
---

Finally, I wrote my own **NIH** Claude Code proxy to code offline on my local GPU, and to avoid hitting subscription limits at the worst possible time.

*(NIH = Not Invented Here - the irresistible urge to build something yourself instead of using the perfectly good version someone else already made. A proud software engineering tradition.)*

---

[**claude-code-openai-v1-proxy.py**](https://github.com/stan-kondrat/claude-code-openai-v1-proxy.py) is a single Python file, no dependencies, that sits between Claude Code and any OpenAI API v1 compatible backend - Ollama, vLLM, MLX, LM Studio, whatever you're running locally.

```
Claude Code  →  Anthropic API  →  [proxy]  →  OpenAI API v1  →  your GPU
```

Point Claude Code at it:

```bash
python3 claude-code-openai-v1-proxy.py \
    --host 127.0.0.1 \
    --port 8081 \
    --upstream http://127.0.0.1:8080/v1

ANTHROPIC_BASE_URL=http://127.0.0.1:8081 claude -p "say hi"
```

That's it. No config files, no virtualenv, no Docker.

---

Yes, there are [other proxies](https://github.com/stan-kondrat/claude-code-openai-v1-proxy.py?tab=readme-ov-file#similar-projects) that do this. But they all pull in LiteLLM, FastAPI, or some other framework. I wanted something I could read in one sitting and trust completely - especially since it handles every prompt I type.

Also, I added a per-request Markdown log (`--log-dir ./logs`) so I can see exactly what Claude Code sends upstream. Turns out the system prompt it injects is absolutely enormous. Fascinating and slightly unsettling.

---

And yes, I snuck in my new **anti-AGI software license** clause:

> *The Software shall be used only for and by humans, defined as biological entities of the species Homo sapiens as identified by deoxyribonucleic acid (DNA).* 🙂

Technically this means the AI I used to help write it is not permitted to use it. I'm at peace with that.
