+++
title = "Miscellaneous borked pacman upgrades and solutions"
+++

If I had a penny for every time `pacman` failed midway and bricked my system, I'd have 2 - which isn't much but still annoying considering it's been barely 4 months.

The first time, Hyprland had a crash midway through a `pacman -Syu`, leading to corrupted shared libraries to the point where `pacman` itself stopped working.

```
Pacman: error while loading shared libraries: /use/lib/libgpg-error.so.0: file too short.
```

And now just today, my GPU decided to crash itself and hung `mkinitcpio` in the middle of building the boot image - meaning I couldn't even get to the console.

## Solutions

Boot into an arch install USB and fix it from there.

- Use `iwctl` to get internet (`station <interface> connect <ssid>`)
- Decrypt your partition `cryptsetup luksOpen /dev/nvme0n1pX encrypted_partition` (find it from `lsblk`)

Assuming you're using btrfs, you probably only want the root directory.

- `mount -t btrfs -o subvol=@ /dev/mapper/encrypted_partition /mnt`

### Corrupted libraries

Pacman has a handy `--root <mount point>` option that lets you fix mounted systems. So for example, you could do `pacman --root /mnt -Syu` to upgrade all packages of the installed system. However, that didn't fix my problem since the packages were considered up to date despite being corrupted, and pacman has no way of knowing what was or was not corrupted.

You can, however, check the installed files against what is expected - with some degree of false positives.

```
sudo pacman --root /mnt -Qkk 2>&1 | grep -Fv '0 altered files'
```

It will give you a list of files with issues such as size, checksum, modification time mismatches. For my specific issue of corrupted libraries, grepping for "no mtree" and "error while" found the corrupted packages. Running `pacman --root /mnt --overwrite -S <packages>` fixed that issue.

### Missing boot image

Fixing the borked kernel and boot image is much easier.

- Once you have the root partition mounted, also mount the boot partition. In my case `mount /dev/nvme0n1p1 /mnt/boot`.
- Then `arch-chroot /mnt` and `pacman -S linux` regenerated the missing `initramfs-linux.img`.
