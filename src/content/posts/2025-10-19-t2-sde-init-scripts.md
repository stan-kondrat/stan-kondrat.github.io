---
title: T2 SDE RC Script Writing Guide
categories: Tech-Tips
tags: Linux
excerpt: T2 SDE uses SysV-style init with manual symlink management
---

[T2 SDE linux](https://t2linux.com) uses a SysV-style init system with specific formatting conventions and manual symlink management.

> Disclaimer: 
> This guide is based on analyzing one T2 SDE system with an LLM. I couldn't find official documentation for T2 SDE init scripts, so this represents observations from that specific installation. Check existing scripts like `/etc/init.d/sshd` on your system first to verify the patterns described here actually match your installation.

## Script Structure

### 1. Header Format
```bash
#!/bin/sh
#
# Desc: Brief description of the service
# Runlevel: <priority> <runlevels>
#
```

**Example:**
```bash
#!/bin/sh
#
# Desc: SSH reverse tunnel daemon
# Runlevel: 30 rcX rc3 rc5
#
```

**Note:** The `# Runlevel:` comment is documentation only - T2 SDE does NOT auto-detect it. You must manually create symlinks.

### 2. Standard Functions (Optional but Recommended)

T2 SDE provides standard functions for consistent output:

```bash
title() {
    local x w="$(stty size 2>/dev/null </dev/tty | cut -d" " -f2)"
    [ -z "$w" ] && w="$(stty size </dev/console | cut -d" " -f2)"
    printf "%0$((w/2-1))s" | sed "s/ /. /g"
    echo -e "\e[768G\e[4D vv \r\e[36m$* \e[0m"
    error=0
}

status() {
    if [ $error -eq 0 ]; then
        echo -e "\e[1A\e[768G\e[5D|\e[32m OK \e[0m|"
    else
        echo -e "\e[1A\e[768G\e[5D\a|\e[1;31mFAIL\e[0m|"
    fi
}
```

### 3. Case Statement Structure

```bash
case "$1" in
    start)
        title "Starting service name"
        start_function || error=$?
        status
        ;;
    stop)
        title "Stopping service name"
        stop_function || error=$?
        status
        ;;
    restart)
        title "Restarting service name"
        restart_function || error=$?
        status
        ;;
    status)
        status_function
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac

exit 0
```

## Installation and Registration

### 1. Place Script in init.d
```bash
# Copy script to init.d (which is actually /sbin/init.d/)
cp your-script /etc/init.d/your-service
chmod +x /etc/init.d/your-service
```

### 2. Create Symlinks Manually

T2 SDE requires manual symlink creation in runlevel directories:

```bash
# For runlevel 3 (multi-user with networking)
ln -sf ../init.d/your-service /etc/rc.d/rc3.d/S30your-service  # Start
ln -sf ../init.d/your-service /etc/rc.d/rc3.d/K70your-service  # Kill

# For runlevel 5 (graphical/X11)
ln -sf ../init.d/your-service /etc/rc.d/rc5.d/S30your-service
ln -sf ../init.d/your-service /etc/rc.d/rc5.d/K70your-service

# For runlevel X (T2 custom runlevel)
ln -sf ../init.d/your-service /etc/rc.d/rcX.d/X30your-service
```

### 3. Naming Convention

**Start scripts:** `S<priority><name>`
- Example: `S30ssh-tunnel` starts at priority 30

**Kill scripts:** `K<priority><name>`
- Example: `K70ssh-tunnel` kills at priority 70

**X runlevel:** `X<priority><name>`
- Example: `X30ssh-tunnel`

### 4. Priority Guidelines

Common priority numbers (lower = earlier):
- `01-10`: System fundamentals (system, kbd)
- `11-20`: Logging and core services (sysklogd, network)
- `20-30`: Network-dependent services (dbus, cron, sshd)
- `30-50`: User services
- `75-90`: Desktop services (alsa)
- `95-99`: Final services (seatd)

**Kill priorities** are typically reversed: `100 - start_priority`
- Start at S30 → Kill at K70
- Start at S15 → Kill at K85

## How T2 SDE Runs Scripts

From `/etc/inittab`:
```
l3:3:wait:/etc/rc.d/rc
```

The `/etc/rc.d/rc` script:
1. Runs `K*` scripts from previous runlevel with `stop` argument
2. Runs `S*` scripts from current runlevel with `start` argument
3. Scripts are executed in numeric order
4. Logs to `/var/log/init.msg`

## Common Runlevels

- `0`: Halt
- `1`: Single user
- `2`: Multi-user (no networking)
- `3`: Multi-user with networking (most common)
- `4`: Custom
- `5`: Multi-user with X11/graphical
- `6`: Reboot
- `S`: Boot/initialization
- `X`: T2 SDE custom runlevel

## Debugging

### Check what scripts run at boot:
```bash
ls -la /etc/rc.d/rc3.d/
```

### View boot log:
```bash
cat /var/log/init.msg | grep your-service
```

### Test script manually:
```bash
/etc/rc.d/rc3.d/S30your-service start
/etc/init.d/your-service status
```

### Check current runlevel:
```bash
runlevel
# Output: N 3 (previous=N, current=3)
```

## Complete Example

See the ssh-tunnel script for a complete working example with:
- Proper T2 SDE header format
- `title()` and `status()` functions
- Error handling with `error` variable
- Network wait logic
- Infinite retry with exponential backoff
- PID file management
- Proper case statement structure

## Key Differences from Other Init Systems

1. **No automatic detection** - Must manually create symlinks
2. **No `update-rc.d` or `chkconfig`** - Manual symlink management only
3. **Symlinks in `/etc/rc.d/rcX.d/`** - Not `/etc/rcX.d/`
4. **Init scripts in `/sbin/init.d/`** - Accessed via `/etc/init.d/` symlink
5. **Uses `title()` and `status()`** - For consistent formatted output
6. **Logs to `/var/log/init.msg`** - Via btee utility

## Removal

To disable a service:
```bash
# Remove symlinks
rm /etc/rc.d/rc3.d/*your-service
rm /etc/rc.d/rc5.d/*your-service
rm /etc/rc.d/rcX.d/*your-service

# Optionally remove script
rm /etc/init.d/your-service
```
