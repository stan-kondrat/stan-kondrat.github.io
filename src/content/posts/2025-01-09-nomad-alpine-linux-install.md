---
title: HashiCorp Nomad on Alpine Linux musl __vdprintf_chk Error
categories: Tech-Tips
tags: Linux Nomad DevOps
excerpt: "While trying to install HashiCorp Nomad on Alpine Linux, I encountered the following Error relocating /usr/local/bin/nomad: __vdprintf_chk: symbol not found."
---

While trying to install HashiCorp Nomad on Alpine Linux, I encountered the following **Error relocating /usr/local/bin/nomad: \_\_vdprintf_chk: symbol not found**.

Initially, I tried adding `gcompat` using:

```sh
# Didn't help, see solution below
apk add gcompat
```

Unfortunately, this didn't resolve the issue.

## Investigating Nomad Versions

After some research, I discovered that the last working version of Nomad for Alpine (without additional adjustments) is `nomad_1.4.14`. Starting with version `1.5.0`, HashiCorp began providing separate musl builds for enterprise users. The latest enterprise musl version `nomad_1.9.4+ent.musl_linux_amd64`, works fine on Alpine.

For those who need to use the standard Linux binaries of Nomad, the solution involves installing `glibc` and patching the ELF binary.

## Step-by-Step Solution

Here's the process to get Nomad running on Alpine Linux:

1. **Install glibc**

   ```sh
   wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
   wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r1/glibc-2.35-r1.apk
   apk add glibc-2.35-r1.apk
   ```

2. **Download Nomad**

   ```sh
   curl -o /tmp/nomad.zip https://releases.hashicorp.com/nomad/1.9.4/nomad_1.9.4_linux_amd64.zip
   unzip /tmp/nomad.zip -d /tmp/
   mv /tmp/nomad /usr/local/bin/nomad
   ```

3. **Patch the ELF binary**

   ```sh
   apk add patchelf
   patchelf --set-interpreter /lib/ld-linux-x86-64.so.2 /usr/local/bin/nomad
   ```

4. **Verify Installation**
   Run the following commands to ensure everything is working:

   ```sh
   uname -a
   # Output should look like:
   # Linux host 6.12.3-0-lts #1-Alpine SMP PREEMPT_DYNAMIC 2024-12-06 22:35:17 x86_64 GNU/Linux

   /usr/local/bin/nomad --version
   # Output should confirm Nomad version:
   # Nomad v1.9.4
   ```

## Conclusion

By adding `glibc` and patching the binary, I was able to successfully run the latest standard version of HashiCorp Nomad on Alpine Linux. If you're dealing with similar errors, this solution should work for you as well.
